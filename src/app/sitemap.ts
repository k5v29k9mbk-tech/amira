import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Five pages per locale. There are no per-course routes: the academy quotes
// per course rather than publishing six separate syllabuses, so the courses
// page carries all six.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/about", "/courses", "/faq", "/contact"];

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${base}/${l}${path}`]),
        ),
      },
    })),
  );
}
