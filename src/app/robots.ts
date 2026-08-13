import type { MetadataRoute } from "next";
import { siteUrl } from "@/i18n/routing";

/**
 * Everything is public. The four disallow rules that used to sit here covered
 * /dashboard, /learn, /certificate and /login, which were routes of the removed
 * online-course build and have not existed for some time: rules against paths
 * that cannot be reached are a map of a site that is not this one, and the next
 * person to read them would reasonably conclude there is a members' area
 * somewhere. The API is the only thing left worth keeping out of an index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
