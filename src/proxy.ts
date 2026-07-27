import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const res = intl(req);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  // Server Components cannot write cookies, so the refreshed session token has to
  // be set here. Without this a student is silently signed out when it expires.
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) =>
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });
  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
