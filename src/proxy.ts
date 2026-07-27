import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // ponytail: locale routing only. Auth is enforced per-page server-side, not here.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
