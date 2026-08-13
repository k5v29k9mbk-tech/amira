import type { MetadataRoute } from "next";
import { locales, siteUrl } from "@/i18n/routing";

// Five pages per locale. There are no per-course routes: the academy quotes
// per course rather than publishing six separate syllabuses, so the courses
// page carries all six.
//
// The base URL comes from the same place every other absolute link on the site
// comes from. It used to read the environment variable again, with its own
// fallback, which is one deploy away from a sitemap that disagrees with the
// canonical tags it is supposed to support.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/courses", "/faq", "/contact"];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      // The homepage first, then the catalogue: those are the two pages the
      // site is trying to be found for.
      priority: path === "" ? 1 : path === "/courses" ? 0.9 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
          "x-default": `${siteUrl}/en${path}`,
        },
      },
    })),
  );
}
