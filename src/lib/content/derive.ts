import { PAGES, type PageId } from "./pages.ts";
import { SCHEMAS } from "./schemas/index.ts";

/**
 * Turn one language's message catalogue into the seven page objects the
 * `content` table stores.
 *
 * A PURE FUNCTION OVER A TREE, deliberately: no database, no filesystem, no
 * Next.js. That is what lets the byte-identical proof in phase 4 be run without
 * a live Postgres -- the derivation is the part that can lose a string, and it
 * can be tested on its own.
 *
 * It COPIES rather than transforms. No trimming, no normalising, no quote
 * conversion: the Italian copy contains typographic apostrophes (`l’eccezione`)
 * that are correct as written, and the Arabic contains characters whose order
 * matters. A migration that "tidies" them is a migration that changes the
 * public site, which is the one thing this must not do.
 */
export type Tree = { [key: string]: string | Tree };

export function derivePage(messages: Tree, page: PageId): unknown {
  const definition = PAGES.find((p) => p.id === page);
  if (!definition) throw new Error(`Unknown page: ${page}`);

  const out: Tree = {};
  for (const ns of definition.namespaces) {
    const value = messages[ns];
    if (value === undefined) {
      throw new Error(`messages is missing the "${ns}" section required by page "${page}".`);
    }
    out[ns] = structuredClone(value) as Tree;
  }
  return out;
}

/** All seven pages for one language, validated against their schemas. */
export function deriveAll(messages: Tree): Record<PageId, unknown> {
  const out = {} as Record<PageId, unknown>;
  for (const page of PAGES) {
    const value = derivePage(messages, page.id);
    /* Parsing here rather than trusting the shape is what turns "the generator
       and the catalogue agree" from an assumption into a checked fact, at the
       exact moment the value is about to be written to the database. */
    const parsed = SCHEMAS[page.id].safeParse(value);
    if (!parsed.success) {
      throw new Error(
        `Page "${page.id}" does not match its schema:\n` +
          parsed.error.issues
            .slice(0, 10)
            .map((i) => `  ${i.path.join(".")}: ${i.message}`)
            .join("\n"),
      );
    }
    out[page.id] = parsed.data;
  }
  return out;
}

/** Count the leaf strings in a derived page, for the migration's report. */
export function countStrings(value: unknown): number {
  if (typeof value === "string") return 1;
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (n, v) => n + countStrings(v),
      0,
    );
  }
  return 0;
}
