import "server-only";
import { unstable_cache } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { content } from "@/lib/db/schema";
import type { Locale } from "@/i18n/routing";
import type { PageId } from "./pages";
import { SCHEMAS, type ContentFor } from "./schemas";

/** The cache tag one page's content is filed under. Publish invalidates it. */
export const contentTag = (page: PageId) => `content:${page}`;

/**
 * One page's published copy, in one language.
 *
 * READS `published`, NEVER `draft`. That single fact is what makes the editor
 * safe to leave half-finished: an unpublished Arabic rewrite sits in `draft`
 * for as long as Amira likes and the live site never sees it. Preview reaches
 * the draft by a different route (Next's draft mode), not by this function
 * taking a flag -- a boolean here would be one typo away from publishing
 * everybody's work in progress.
 *
 * TAGGED PER PAGE rather than one tag for everything. Publishing the FAQ should
 * not rebuild the homepage: these pages are statically rendered and there are
 * twenty-eight of them, so a single shared tag would turn every small edit into
 * a full-site regeneration.
 *
 * IT THROWS WHEN THE ROW IS ABSENT, and that is deliberate. The obvious
 * alternative -- fall back to `messages/*.json` -- would mean a database
 * outage silently serves stale copy that nobody can see is stale, and an edit
 * that appears not to save. Failing loudly during a build or an ISR
 * regeneration keeps the last good page on the CDN and puts the problem in the
 * logs where it can be fixed.
 */
async function read<P extends PageId>(page: P, locale: Locale): Promise<ContentFor<P>> {
  const [row] = await db
    .select({ published: content.published })
    .from(content)
    .where(and(eq(content.page, page), eq(content.locale, locale)))
    .limit(1);

  if (!row) {
    throw new Error(
      `No content row for "${page}" in "${locale}". Run \`npm run seed:content\` to import the site's copy.`,
    );
  }
  if (row.published === null) {
    throw new Error(`"${page}" has never been published in "${locale}".`);
  }

  /* Validated on the way out as well as on the way in. The editor checks what
     it writes, but a row can also be changed by a migration, a restore or a
     person with a database client, and rendering half a page is worse than
     saying which page is malformed. */
  const parsed = SCHEMAS[page].safeParse(row.published);
  if (!parsed.success) {
    throw new Error(
      `Content for "${page}" in "${locale}" does not match its schema: ` +
        parsed.error.issues.slice(0, 5).map((i) => i.path.join(".")).join(", "),
    );
  }
  return parsed.data as ContentFor<P>;
}

/**
 * The cached reader every public page calls.
 *
 * `unstable_cache` rather than `use cache`: the newer directive needs the
 * `cacheComponents` flag turned on in `next.config.ts`, and that file carries
 * an unrelated uncommitted change this work must not disturb.
 */
export function getContent<P extends PageId>(page: P, locale: string): Promise<ContentFor<P>> {
  /* Route params arrive as `string`; next-intl has already refused anything
     that is not one of the four before a page renders, so this narrows rather
     than checks. */
  const resolved = locale as Locale;
  return unstable_cache(
    () => read(page, resolved),
    ["content", page, resolved],
    { tags: [contentTag(page)] },
  )();
}

/**
 * Fill `{name}` placeholders in a stored string.
 *
 * Exactly one string on the site has one today -- `programs.meta.description`,
 * which carries `{course}` -- so this is deliberately the smallest thing that
 * can replace next-intl's interpolation for that case, and not a template
 * engine. An unknown placeholder is left as it is rather than replaced with
 * "undefined", so a copy edit that introduces `{price}` renders visibly wrong
 * instead of invisibly wrong.
 */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\s*([a-zA-Z0-9_]+)\s*\}/g, (whole, key: string) =>
    Object.hasOwn(values, key) ? values[key] : whole,
  );
}
