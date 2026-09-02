import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { authConfig } from "./config";
import { verifyPassword } from "./password";
import { audit } from "./audit";
import { checkLockout, clearAttempts, prune, recordFailure } from "./rate-limit";

/**
 * The one message a failed sign-in ever produces.
 *
 * IT IS DELIBERATELY UNTRUE ABOUT WHICH HALF WAS WRONG. "No account with that
 * address" turns the login form into a tool for discovering who has an account,
 * which for a two-person admin means confirming an individual's email. Same
 * words for an unknown address, a known address with the wrong password, and a
 * correctly typed password on an account that does not exist.
 *
 * The lockout message is the one exception and it has to be: telling somebody
 * to come back in twelve minutes is the only way the form is usable when the
 * limit has tripped. It leaks that attempts were made, which the person making
 * them already knows, and nothing about whether the account is real -- the
 * limit counts attempts against an email whether or not it resolves.
 */
export const INVALID_CREDENTIALS = "credenziali non valide";

class SignInError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    /* Auth.js puts `code` in the redirect URL; the login page reads it back and
       prints it. Without this every failure would surface as "CredentialsSignin". */
    this.code = message;
  }
}

/**
 * The client's address, as far as it can be trusted.
 *
 * `x-forwarded-for` is a list appended to by each proxy, so the FIRST entry is
 * the client and the rest are hops. On Vercel the platform overwrites the
 * header, so the value cannot be forged; on a self-hosted origin with no proxy
 * in front of it, it can be, and the IP half of the rate limit degrades to
 * advisory. The email half does not depend on it.
 */
function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return headers.get("x-real-ip")?.trim() || null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Returning null and throwing are NOT the same thing here. Auth.js turns
       * a null into a generic failure; a `CredentialsSignin` carries a code the
       * page can render. The lockout needs its own wording, so it throws.
       */
      async authorize(raw, request) {
        const email = String(raw?.email ?? "").trim().toLowerCase();
        const password = String(raw?.password ?? "");
        if (!email || !password) throw new SignInError(INVALID_CREDENTIALS);

        const ip = clientIp(request.headers);

        const lockout = await checkLockout(email, ip);
        if (lockout.locked) {
          throw new SignInError(
            `Troppi tentativi. Riprova fra ${lockout.minutes} ${
              lockout.minutes === 1 ? "minuto" : "minuti"
            }.`,
          );
        }

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

        /**
         * A password is verified even when no account matched.
         *
         * Argon2id at these parameters takes tens of milliseconds, and skipping
         * it for an unknown address makes that request measurably faster than
         * one for a real account. That difference is readable over the network
         * and turns the form back into the account-enumeration oracle the
         * shared error message above exists to close. So the work is done
         * either way and the result is discarded.
         */
        const hash = user?.passwordHash ?? DUMMY_HASH;
        const ok = await verifyPassword(hash, password);

        if (!user || !ok) {
          await recordFailure(email, ip);
          await audit({
            userId: user?.id ?? null,
            action: "login_failed",
            entity: `user:${email}`,
            after: { reason: user ? "wrong_password" : "no_such_user", ip },
          });
          throw new SignInError(INVALID_CREDENTIALS);
        }

        await Promise.all([
          clearAttempts(email),
          prune(),
          db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id)),
          audit({ userId: user.id, action: "login", entity: `user:${user.id}`, after: { ip } }),
        ]);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
});

/**
 * A real argon2id hash of a value nobody can supply, used only to spend the
 * same time on an unknown address as on a known one.
 *
 * It is a constant rather than generated at import, because hashing at module
 * load would add its cost to a cold start, and the value does not need to be
 * secret -- it needs to be expensive to verify against, which every argon2id
 * hash at these parameters is.
 */
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$JmN1xWtFRZwDySg5qM5ZoA$AJoblfL6py9zw8nBUB6Km4xXv2kmkNnyPNoQZ3jIj+s";
