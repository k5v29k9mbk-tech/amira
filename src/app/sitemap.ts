import type { MetadataRoute } from "next";
import { locales, siteUrl, xDefaultLocale } from "@/i18n/routing";
import { programs } from "@/lib/programs";
import { masterclass } from "@/lib/masterclass";

/**
 * Five pages, six programmes and one dated masterclass per locale: forty eight
 * URLs in all.
 *
 * The per-course routes are new. This file used to record that there were none,
 * on the reasoning that the academy quotes per course rather than publishing six
 * syllabuses, so one catalogue page carried all six. That was true about the
 * pricing and wrong about the search: "corso lip blush" has nowhere to land on a
 * site whose only page about lip blush is a catalogue whose title, description
 * and canonical are all about the catalogue. Each discipline now has its own
 * page with its own title and description in four languages, and each of them
 * belongs here.
 *
 * PRIORITY. The homepage first, then the catalogue, then the six programmes
 * above the remaining pages: the programmes are what the site is trying to be
 * found for after the brand itself, and they are the pages an enquiry starts on.
 *
 * The base URL comes from the same place every other absolute link on the site
 * comes from. It used to read the environment variable again, with its own
 * fallback, which is one deploy away from a sitemap that disagrees with the
 * canonical tags it is supposed to support.
 *
 * A hidden tier in `lib/pathway.ts` has no route and therefore nothing here.
 * When one is published it will need a page before it needs a line in this file.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/courses",
    ...programs.map((program) => `/courses/${program.slug}`),
    /* The dated Roma masterclass. It is not one of the six and does not live
       under /courses, so it cannot arrive here through `programs`; it is listed
       explicitly and comes back out of this array the day the edition is over
       and the route is deleted. */
    `/${masterclass.slug}`,
    "/faq",
    "/contact",
    "/privacy",
  ];

  const priorityFor = (path: string) => {
    if (path === "") return 1;
    // The notice is owed to a reader, not offered to a crawler.
    if (path === "/privacy") return 0.3;
    if (path === "/courses") return 0.9;
    if (path.startsWith("/courses/")) return 0.8;
    /* Level with a programme page while the dates stand: it is a campaign page
       with a deadline, and after those two days it should be gone rather than
       demoted. */
    if (path === `/${masterclass.slug}`) return 0.8;
    return 0.7;
  };

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      priority: priorityFor(path),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
          // The same fallback the pages' own hreflang block declares, read from
          // the one place that decides it. A sitemap naming a different
          // x-default from the `<link>` tags is two answers to one question,
          // and the crawler is entitled to believe either.
          "x-default": `${siteUrl}/${xDefaultLocale}${path}`,
        },
      },
    })),
  );
}
