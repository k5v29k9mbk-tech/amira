import "server-only";
import { getLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "./get";
import type { PageId } from "./pages";
import { merge, scope, type Text } from "./path";

/**
 * One page's published copy, as the accessor components use.
 *
 * `getLocale()` still comes from next-intl, and that is on purpose. next-intl
 * keeps its two routing jobs -- negotiating the language from the URL and
 * building localised links -- because those are routing, not copy. What it no
 * longer does is supply a single word of the site's text.
 *
 * `pages` may be a list, for the route files that print strings from several
 * groups at once. Naming them explicitly rather than loading all seven keeps
 * the cache tags honest: a page depends on exactly the groups it reads, so
 * publishing the FAQ does not regenerate the contact page.
 */
export async function pageText(
  pages: PageId | readonly PageId[],
  namespace?: string,
  locale?: string,
): Promise<Text> {
  const list = Array.isArray(pages) ? pages : [pages as PageId];
  /* Route params arrive as `string`; the routing layer has already refused
     anything that is not one of the four, so this narrows rather than checks. */
  const resolved = (locale ?? (await getLocale())) as Locale;
  const trees = await Promise.all(list.map((page) => getContent(page, resolved)));
  return scope(list.length === 1 ? trees[0] : merge(trees), namespace);
}
