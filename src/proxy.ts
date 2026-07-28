import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Locale negotiation only. The Supabase session refresh that used to live here
// went with the student accounts: the site has no signed-in surface now.
export default createMiddleware(routing);

export const config = {
  // `icon` and `apple-icon` are extensionless metadata routes, so the trailing
  // dot rule misses them and next-intl would redirect them into /en/icon — a
  // 404, and no favicon anywhere on the site.
  matcher: "/((?!api|_next|_vercel|icon|apple-icon|.*\\..*).*)",
};
