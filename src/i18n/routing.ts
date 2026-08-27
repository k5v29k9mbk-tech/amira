import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});

export const isRtl = (locale: string) => locale === "ar";

/**
 * The origin every canonical, alternate, sitemap entry and schema id is built
 * from.
 *
 * `NEXT_PUBLIC_SITE_URL` is still the setting that decides it and is what a
 * custom domain goes in. The Vercel fallback under it exists because of an
 * ordering problem that would otherwise ship wrong canonicals: a project's
 * production URL does not exist until the first deploy has happened, so on that
 * first build the variable cannot yet be set, and every canonical, every
 * hreflang and the whole sitemap would be written against `localhost:3000` and
 * served to a crawler that way.
 *
 * `VERCEL_PROJECT_PRODUCTION_URL` is injected by the platform at build time and
 * is the project's stable production host without the scheme. Reading it means
 * the very first deploy is already correct, and setting the explicit variable
 * later, or pointing a domain at it, overrides it without touching this file.
 *
 * It is not a `NEXT_PUBLIC_` name and does not need to be: every consumer of
 * `siteUrl` is a server file (`robots.ts`, `sitemap.ts`, `lib/seo.tsx`, the
 * locale layout's metadata), so the value is never required in a browser bundle
 * where a non-public variable would arrive undefined.
 */
/**
 * BLANK IS NOT SET, and that distinction is what keeps a deploy from failing on
 * its first build. `??` only falls through on null and undefined, so a variable
 * that exists and holds an empty string wins, and `siteUrl` becomes "". Every
 * canonical is then built by `new URL("", "")`, which throws, and the build dies
 * during prerender with `TypeError: Invalid URL` on whichever page happens to be
 * exported first. Reproduced here before it could happen there: the failure names
 * `/en/about` and says nothing about an environment variable.
 *
 * A variable created in a dashboard and left blank is the ordinary case, not an
 * edge one, so an empty or whitespace-only value is treated as absent.
 *
 * A trailing slash is trimmed for the same reason: pasted from a browser's
 * address bar a URL usually carries one, and `${siteUrl}/${locale}` would then
 * emit a double slash into every canonical, alternate and sitemap entry.
 */
const clean = (v: string | undefined) => {
  const trimmed = v?.trim().replace(/\/+$/, "");
  return trimmed ? trimmed : undefined;
};

const vercelHost = clean(process.env.VERCEL_PROJECT_PRODUCTION_URL);

export const siteUrl =
  clean(process.env.NEXT_PUBLIC_SITE_URL) ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

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
