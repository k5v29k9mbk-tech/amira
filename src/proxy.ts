import createMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { ADMIN_HOME, LOGIN_PATH, PASSWORD_PATH, authConfig } from "@/lib/auth/config";

/**
 * THIS FILE IS THE MIDDLEWARE. Next.js 16 deprecated the `middleware.ts`
 * convention and renamed it to `proxy.ts`; it is the same hook, running before
 * every matched request, and it is where the brief's "protection must live in
 * middleware, not only in page components" is satisfied.
 *
 * Two jobs that never overlap: locale negotiation for the public site, and a
 * locked door for /admin and /api/admin.
 *
 * WHY /admin IS NOT LOCALISED. Every public URL carries a language prefix
 * because the site is published in four. The admin is one person's private
 * workspace, so it lives at a bare /admin; routing it through next-intl would
 * rewrite it to /en/admin and put a language in a URL with no reader to
 * negotiate for.
 *
 * WHAT THIS CAN AND CANNOT DO. It verifies a signed JWT, which needs the secret
 * and nothing else -- no database, which is just as well because the edge
 * runtime has no driver. So it can prove the cookie was issued by this site and
 * has not expired, and it cannot know that the account was deleted a minute
 * ago. That is why every server action and every admin page ALSO calls
 * `requireAdmin()`. The door and the guard are different mechanisms; the brief
 * asks for the door, and the guard was never optional.
 */
const intl = createMiddleware(routing);

/* Only the edge-safe half of the configuration. Importing `lib/auth` here
   would pull in argon2 and the Postgres driver, neither of which exists in
   this runtime, and the build would fail. */
const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminApi && !isAdminPage) return intl(request as NextRequest);

  const user = request.auth?.user;

  /**
   * The API answers with a status code and never a redirect.
   *
   * A 302 to an HTML login page is the worst possible reply to `fetch()`: the
   * browser follows it, the caller parses the login page as JSON and reports a
   * syntax error, and the actual problem -- the session expired -- appears
   * nowhere. A 401 is the thing the client can act on.
   */
  if (isAdminApi) {
    if (!user) {
      return NextResponse.json({ error: "Sessione scaduta. Accedi di nuovo." }, { status: 401 });
    }
    if (user.mustChangePassword) {
      return NextResponse.json(
        { error: "Devi prima scegliere una nuova password." },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (!user) {
    if (pathname === LOGIN_PATH) return NextResponse.next();

    /**
     * `callbackUrl` carries a PATH, never a full URL, and that is a security
     * decision rather than a tidiness one. An absolute value here is an open
     * redirect: a link to /admin/login?callbackUrl=https://evil.example would
     * bounce a freshly signed-in admin off this site entirely. The login page
     * refuses anything that does not start with a single slash.
     */
    const to = request.nextUrl.clone();
    to.pathname = LOGIN_PATH;
    to.search = "";
    const target = pathname + request.nextUrl.search;
    if (target !== ADMIN_HOME) to.searchParams.set("callbackUrl", target);
    return NextResponse.redirect(to);
  }

  /* Signed in and looking at the login page: send them where they were going. */
  if (pathname === LOGIN_PATH) {
    const to = request.nextUrl.clone();
    to.pathname = ADMIN_HOME;
    to.search = "";
    return NextResponse.redirect(to);
  }

  /**
   * The forced password change, enforced here so it cannot be walked around by
   * typing a URL. Everything under /admin is closed except the change-password
   * page itself until the flag clears.
   */
  if (user.mustChangePassword && pathname !== PASSWORD_PATH) {
    const to = request.nextUrl.clone();
    to.pathname = PASSWORD_PATH;
    to.search = "";
    return NextResponse.redirect(to);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * The public site. `admin` is matched rather than excluded, because the
     * gate above needs to see it. `icon` and `apple-icon` are extensionless
     * metadata routes, so the trailing-dot rule misses them and next-intl would
     * redirect them into /en/icon: a 404, and no favicon anywhere on the site.
     */
    "/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)",
    /**
     * The admin API, which the pattern above excludes along with the rest of
     * /api. Auth.js's own endpoints under /api/auth are deliberately NOT
     * matched: signing in cannot require being signed in.
     */
    "/api/admin/:path*",
  ],
};
