/**
 * Reading a dotted path out of a content object.
 *
 * WHY THE CALL SITES STILL LOOK LIKE `t("hero.titleA")`.
 *
 * The obvious way to read content from a plain object is a property access,
 * `c.hero.titleA`, and for most of this site that would work. It does not work
 * for about two hundred and fifty call sites which build the key at runtime:
 *
 *     t(`facts.${k}.value`)                 Hero
 *     t(`courses.${course.slug}`)           CourseSelector
 *     t(`curriculum.${program.slug}.d${d}.m${m}`)   Curriculum
 *
 * Those iterate a list defined in `lib/courses.ts` or `lib/media.ts` and look
 * each item's copy up by slug. Turning them into property access would mean
 * hand-writing a lookup map in a dozen components, and every one of those maps
 * is a place a course can be silently dropped from a page. So the accessor
 * keeps the shape the components already use, and what changes is where it
 * reads from: `messages/<locale>.json` before, the `content` table now.
 *
 * NOTHING HERE IS ISOMORPHIC BY ACCIDENT. This file has no `server-only` and
 * no imports, because client components read content through the same
 * accessor.
 */

/** What a component holds. Same call shape as next-intl's `t`. */
export type Text = (key: string, values?: Record<string, string>) => string;

const walk = (tree: unknown, parts: string[]): unknown =>
  parts.reduce<unknown>(
    (node, part) => (node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined),
    tree,
  );

/**
 * Fill `{name}` placeholders.
 *
 * Exactly one string on the site has one -- `programs.meta.description`, which
 * carries `{course}` -- so this is the smallest thing that replaces next-intl's
 * interpolation for that case, not a template engine. An unknown placeholder is
 * left as written rather than replaced with "undefined", so a copy edit that
 * introduces `{price}` renders visibly wrong instead of invisibly wrong.
 */
export function fill(template: string, values?: Record<string, string>): string {
  if (!values) return template;
  return template.replace(/\{\s*([a-zA-Z0-9_]+)\s*\}/g, (whole, key: string) =>
    Object.hasOwn(values, key) ? values[key] : whole,
  );
}

/**
 * An accessor over one content tree, optionally rooted at a namespace.
 *
 * IT THROWS ON A MISSING KEY. next-intl printed the key path into the page
 * instead, which is how a site ends up shipping `catalog.blurbs.microblading`
 * as visible copy. Every key here is guaranteed by a Zod schema generated from
 * the catalogue, so a miss means the schema and the component have genuinely
 * diverged, and that should stop a build rather than reach a reader.
 */
export function scope(tree: unknown, prefix?: string): Text {
  const root = prefix ? prefix.split(".") : [];
  return (key, values) => {
    const value = walk(tree, [...root, ...key.split(".")]);
    if (typeof value !== "string") {
      const path = [...root, key].join(".");
      throw new Error(
        value === undefined
          ? `Missing content key "${path}".`
          : `Content key "${path}" is a section, not a string.`,
      );
    }
    return fill(value, values);
  };
}

/** Merge several page trees into one, for a component that spans groups. */
export function merge(trees: unknown[]): Record<string, unknown> {
  return Object.assign({}, ...trees.map((t) => (t && typeof t === "object" ? t : {})));
}
