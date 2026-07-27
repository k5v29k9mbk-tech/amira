import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});

export const isRtl = (locale: string) => locale === "ar";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** hreflang map for one path, so Google serves the right language per region. */
export const altLanguages = (path = "") => ({
  canonical: `${siteUrl}/en${path}`,
  languages: Object.fromEntries(
    locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
  ) as Record<string, string>,
});
