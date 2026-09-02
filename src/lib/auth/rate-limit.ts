import "server-only";
import { and, count, eq, gt, lt, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { loginAttempts } from "@/lib/db/schema";

/** Five failures, then fifteen minutes. Both limits use the same numbers. */
export const MAX_ATTEMPTS = 5;
export const WINDOW_MINUTES = 15;

const windowStart = () => new Date(Date.now() - WINDOW_MINUTES * 60_000);

/**
 * The two keys one sign-in attempt counts against.
 *
 * BOTH, NOT EITHER, because they stop different attacks. The email key stops
 * one account being ground through a password list from a botnet, where every
 * request has a different address and an IP limit never trips. The IP key stops
 * one host spraying one password across many addresses, where the email limit
 * never trips because no single account is tried twice.
 *
 * The email is lowercased so `Amira@…` and `amira@…` share a bucket -- the
 * users table is citext, so they are one account and must be one limit.
 */
const keysFor = (email: string, ip: string | null) => [
  `email:${email.trim().toLowerCase()}`,
  ...(ip ? [`ip:${ip}`] : []),
];

export type Lockout = { locked: true; minutes: number } | { locked: false };

/**
 * Is this attempt allowed, and if not, for how long.
 *
 * Counts both keys in one query. `minutes` is rounded up from the age of the
 * oldest attempt still inside the window, so the message can say something
 * true rather than always claiming a full fifteen.
 */
export async function checkLockout(email: string, ip: string | null): Promise<Lockout> {
  const keys = keysFor(email, ip);
  const since = windowStart();

  const rows = await db
    .select({ key: loginAttempts.key, at: loginAttempts.createdAt })
    .from(loginAttempts)
    .where(
      and(
        or(...keys.map((k) => eq(loginAttempts.key, k))),
        gt(loginAttempts.createdAt, since),
      ),
    );

  for (const key of keys) {
    const mine = rows.filter((r) => r.key === key);
    if (mine.length < MAX_ATTEMPTS) continue;

    /* The lock lifts when the oldest attempt in the window ages out, because
       that is the moment the count drops below the limit again. */
    const oldest = mine.reduce((a, b) => (a.at < b.at ? a : b)).at;
    const liftsAt = oldest.getTime() + WINDOW_MINUTES * 60_000;
    const minutes = Math.max(1, Math.ceil((liftsAt - Date.now()) / 60_000));
    return { locked: true, minutes };
  }

  return { locked: false };
}

/** Record one failure against both keys. */
export async function recordFailure(email: string, ip: string | null) {
  await db.insert(loginAttempts).values(keysFor(email, ip).map((key) => ({ key })));
}

/**
 * Clear the email's attempts after a correct password.
 *
 * The IP's rows are deliberately left alone. Clearing them would let an
 * attacker spraying one password across many accounts reset their own budget
 * every time they happened to guess one correctly, which is exactly the case
 * the IP limit exists for.
 */
export async function clearAttempts(email: string) {
  await db.delete(loginAttempts).where(eq(loginAttempts.key, `email:${email.trim().toLowerCase()}`));
}

/**
 * Drop rows that have aged out of the window.
 *
 * Called opportunistically on sign-in rather than on a schedule, because this
 * project has no cron and a table that only ever grows is a slow leak of
 * personal data: every row holds an email address somebody typed.
 */
export async function prune() {
  await db.delete(loginAttempts).where(lt(loginAttempts.createdAt, windowStart()));
}

/** Only used by the tests, to assert the count independently of the lockout maths. */
export async function attemptCount(key: string) {
  const [row] = await db
    .select({ n: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gt(loginAttempts.createdAt, windowStart())));
  return row?.n ?? 0;
}
