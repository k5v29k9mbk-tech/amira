import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
import { auth } from "./index";
import { LOGIN_PATH, PASSWORD_PATH } from "./config";

/**
 * Who is signed in, verified against the database rather than taken from the
 * token.
 *
 * TWO CHECKS, NOT ONE, AND THE SECOND IS THE ONE THAT MATTERS. The JWT proves
 * the cookie was issued by this site and has not expired. It cannot prove the
 * account still exists, still has the role it had, or has not been made to
 * change its password since -- a token is a snapshot of the moment it was
 * signed, and it stays valid for thirty days. So the row is read on every
 * protected render.
 *
 * That is one indexed primary-key lookup per admin page. `cache` collapses the
 * layout's call and the page's call into one per request.
 */
export const currentUser = cache(async (): Promise<User | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
});

/**
 * The gate every admin page and every server action calls first.
 *
 * The proxy already turns anonymous traffic away. This runs anyway, on the
 * server, on every protected render and every write, because a server action is
 * an HTTP endpoint that can be called directly by anyone who knows its id, and
 * the proxy never sees that call.
 */
export async function requireAdmin(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect(LOGIN_PATH);
  if (user.mustChangePassword) redirect(PASSWORD_PATH);
  return user;
}

/**
 * The same gate, minus the password-change redirect.
 *
 * Used only by the change-password page itself, which obviously has to be
 * reachable while the flag is set. Separating the two is what stops that page
 * redirecting to itself forever.
 */
export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

/** Owner-only actions. Editors get a plain refusal rather than a broken page. */
export async function requireOwner(): Promise<User> {
  const user = await requireAdmin();
  if (user.role !== "owner") {
    throw new Error("Questa operazione è riservata al titolare dell'account.");
  }
  return user;
}
