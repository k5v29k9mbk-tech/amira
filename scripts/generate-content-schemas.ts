/**
 * Write `src/lib/content/schemas/*.ts` from `messages/en.json`.
 *
 *   npm run content:schemas
 *
 * DERIVED, NOT HAND-WRITTEN, and that is the whole point. The brief asks for
 * schemas covering every string the public site renders, inventing no field and
 * dropping none. Typing 443 fields by hand satisfies that on the day it is done
 * and starts drifting the next time somebody adds a sentence to the catalogue.
 * Generating them means the schema cannot disagree with the catalogue, and the
 * check that they still agree is re-running this and finding no diff.
 *
 * English is the structural source because all four files carry identical keys
 * -- asserted below, and by `courses.test.ts` independently. The VALUES are
 * never read here; only the shape.
 */
import fs from "node:fs";
import path from "node:path";
import { PAGES, assertNamespacesPartition } from "../src/lib/content/pages.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src/lib/content/schemas");
const LOCALES = ["en", "it", "fr", "ar"] as const;

type Tree = { [key: string]: string | Tree };

const load = (locale: string): Tree =>
  JSON.parse(fs.readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8"));

const leaves = (tree: Tree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([k, v]) =>
    typeof v === "string" ? [prefix + k] : leaves(v, `${prefix}${k}.`),
  );

const base = load("en");

/* Every locale must have exactly the same keys, or a generated schema would
   validate one language and reject another. */
const baseKeys = new Set(leaves(base));
for (const locale of LOCALES.slice(1)) {
  const other = new Set(leaves(load(locale)));
  const missing = [...baseKeys].filter((k) => !other.has(k));
  const extra = [...other].filter((k) => !baseKeys.has(k));
  if (missing.length || extra.length) {
    console.error(`messages/${locale}.json differs from en.json.`);
    if (missing.length) console.error("  missing:", missing.slice(0, 10).join(", "));
    if (extra.length) console.error("  extra:", extra.slice(0, 10).join(", "));
    process.exit(1);
  }
}

assertNamespacesPartition(Object.keys(base));

/** A JS identifier can be a bare key; anything else has to be quoted. */
const key = (k: string) => (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k) ? k : JSON.stringify(k));

/**
 * `z.string()` for a leaf, `z.object({…})` for a branch.
 *
 * No `.min(1)`. An empty value means "this string is not translated yet", which
 * the editor has to be able to save -- refusing it would make a half-finished
 * Arabic page unsaveable. Phase 5 reports emptiness in the interface instead,
 * where it is information rather than an error.
 */
function render(node: Tree, indent: string): string {
  const inner = Object.entries(node)
    .map(([k, v]) =>
      typeof v === "string"
        ? `${indent}  ${key(k)}: z.string(),`
        : `${indent}  ${key(k)}: ${render(v, indent + "  ")},`,
    )
    .join("\n");
  return `z.object({\n${inner}\n${indent}})`;
}

const pascal = (id: string) =>
  id.split(/[-_]/).map((s) => s[0].toUpperCase() + s.slice(1)).join("");

fs.mkdirSync(OUT, { recursive: true });

let total = 0;
const index: string[] = [];

for (const page of PAGES) {
  const subtree: Tree = {};
  for (const ns of page.namespaces) {
    const value = base[ns];
    if (value === undefined) {
      console.error(`Page "${page.id}" claims namespace "${ns}", which en.json does not have.`);
      process.exit(1);
    }
    subtree[ns] = value as Tree;
  }

  const count = leaves(subtree).length;
  total += count;

  const name = `${page.id.replace(/-/g, "")}Schema`;
  const type = `${pascal(page.id)}Content`;

  fs.writeFileSync(
    path.join(OUT, `${page.id}.ts`),
    `// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts from messages/en.json.
// Re-run \`npm run content:schemas\` after changing the catalogue.
//
// ${page.label}: ${count} strings across ${page.namespaces.length} section(s).
import { z } from "zod";

export const ${name} = ${render(subtree, "")};

export type ${type} = z.infer<typeof ${name}>;
`,
  );

  index.push(`  "${page.id}": ${name},`);
  console.log(`  ${page.id.padEnd(9)} ${String(count).padStart(3)} strings  (${page.namespaces.join(", ")})`);
}

fs.writeFileSync(
  path.join(OUT, "index.ts"),
  `// GENERATED FILE — do not edit by hand.
// Written by scripts/generate-content-schemas.ts.
import type { z } from "zod";
import type { PageId } from "../pages.ts";
${PAGES.map((p) => `import { ${p.id.replace(/-/g, "")}Schema } from "./${p.id}.ts";`).join("\n")}

${PAGES.map((p) => `export * from "./${p.id}.ts";`).join("\n")}

/** Every page's schema, keyed by the id used in the \`content\` table. */
export const SCHEMAS = {
${index.join("\n")}
} as const satisfies Record<PageId, z.ZodType>;

export type ContentFor<P extends PageId> = z.infer<(typeof SCHEMAS)[P]>;
`,
);

console.log(`\n  ${total} strings written across ${PAGES.length} pages.`);
if (total !== baseKeys.size) {
  console.error(`MISMATCH: catalogue has ${baseKeys.size} strings, schemas cover ${total}.`);
  process.exit(1);
}
console.log(`  matches messages/en.json exactly (${baseKeys.size}).`);
