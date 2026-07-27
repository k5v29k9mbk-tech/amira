import type { MetadataRoute } from "next";
import { courses } from "@/lib/courses";
import { locales } from "@/i18n/routing";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/courses", ...courses.map((c) => `/courses/${c.slug}`)];

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
