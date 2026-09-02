import type { NextAuthConfig } from "next-auth";

/** How long a session lives without any activity. */
export const SESSION_MAX_AGE_DAYS = 30;

/** Where an unauthenticated visitor is sent, and where a signed-in one lands. */
export const LOGIN_PATH = "/admin/login";
export const PASSWORD_PATH = "/admin/password";
export const ADMIN_HOME = "/admin";

/**
 * The half of the Auth.js configuration that is safe to run on the edge.
 *
 * WHY THE SPLIT EXISTS AT ALL. `proxy.ts` runs in the edge runtime, which has
 * no native modules and no TCP sockets, so it can import neither
 * `@node-rs/argon2` nor the Postgres driver. The Credentials provider needs
 * both. Importing the full configuration into the proxy would pull the whole
 * chain in and the build fails.
 *
 * So this file holds everything the proxy needs to make its decision -- the
 * session strategy, the cookie, the callbacks that read the token -- and the
 * provider is added in `index.ts`, which only ever runs in Node. The token is
 * a signed JWT, so verifying it needs the secret and nothing else: the proxy
 * can say who someone is without asking the database.
 */
export const authConfig = {
  /* Behind Vercel's proxy the forwarded host is the real one. Without this,
     Auth.js refuses to trust it and every callback URL is built wrong. */
  trustHost: true,

  pages: {
    signIn: LOGIN_PATH,
    error: LOGIN_PATH,
  },

  session: {
    /**
     * JWT rather than a database session, and it is not only about speed.
     * A database session would mean a query from the proxy on every single
     * request to /admin, from the edge, where there is no driver to make it
     * with. The token carries the three facts the proxy needs.
     */
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
    /**
     * Rolling: the token is re-issued at most once a day, and each re-issue
     * pushes the 30-day expiry out again. So a day of editing keeps the
     * session alive indefinitely and a month away ends it, which is what the
     * brief asks for. Re-issuing on every request instead would rewrite the
     * cookie on every page load for no added security.
     */
    updateAge: 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      /* The `__Secure-` prefix is a browser-enforced promise: a cookie carrying
         it is rejected outright unless it is Secure and came over HTTPS. In
         development there is no HTTPS, so the plain name is used instead. */
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  callbacks: {
    /**
     * Copy the facts the rest of the application needs out of the user record
     * and into the token, once, at sign-in.
     *
     * `mustChangePassword` is carried here so the proxy can enforce the forced
     * password change without a query. `trigger === "update"` is how the
     * change-password page clears it: it calls `update()` and the new token no
     * longer carries the flag, so the redirect stops immediately rather than at
     * the next sign-in.
     */
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role;
        session.user.mustChangePassword = token.mustChangePassword;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
