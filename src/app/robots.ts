import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing behind the paywall or a login belongs in an index.
      disallow: ["/api/", "/*/dashboard", "/*/learn/", "/*/certificate/", "/*/login"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
