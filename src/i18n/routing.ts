import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});

export const isRtl = (locale: string) => locale === "ar";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * hreflang map for one path, so Google serves the right language per region.
 *
 * `locale` is not optional in practice and the default is a fallback rather
 * than a choice. The canonical used to be hardcoded to `/en${path}` for every
 * language, which is the same as telling a search engine that the Italian,
 * French and Arabic pages are duplicates of the English one and that the
 * English one is the copy to index. Three quarters of the site was asking to be
 * dropped from search, on a page set whose whole point is that it is published
 * in four languages. Each page now points at itself.
 *
 * `x-default` is what a crawler serves to a language none of the four match.
 * English is the widest net of the four and the routing default, so it takes
 * it.
 */
export const altLanguages = (path = "", locale: string = routing.defaultLocale) => ({
  canonical: `${siteUrl}/${locale}${path}`,
  languages: {
    ...(Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) as Record<
      string,
      string
    >),
    "x-default": `${siteUrl}/${routing.defaultLocale}${path}`,
  },
});
