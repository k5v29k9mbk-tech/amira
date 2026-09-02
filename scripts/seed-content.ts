/**
 * Copy today's copy into the `content` table, for all four languages.
 *
 *   npm run seed:content                 write to the database
 *   npm run seed:content -- --dry-run    derive, validate and report, write nothing
 *   npm run seed:content -- --out DIR    also write the derived JSON to DIR
 *
 * BOTH `draft` AND `published` ARE WRITTEN. The public site reads `published`
 * from phase 4 onward, so a row seeded with only a draft would be a page with
 * no words on it. Seeding both means the site is fully published the moment the
 * table has rows, and Amira's first edit starts from exactly what is live.
 *
 * IT DOES NOT OVERWRITE AN EDITED PAGE. A row whose `updated_by` is set was
 * touched by a person, and re-running a migration must not throw their work
 * away. `--force` is the deliberate override.
 */
import fs from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { content } from "../src/lib/db/schema.ts";
import { PAGES } from "../src/lib/content/pages.ts";
import { countStrings, deriveAll, type Tree } from "../src/lib/content/derive.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALES = ["it", "en", "fr", "ar"] as const;

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const outIndex = process.argv.indexOf("--out");
const outDir = outIndex >= 0 ? process.argv[outIndex + 1] : null;

const load = (locale: string): Tree =>
  JSON.parse(fs.readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8"));

/* ---------------------------------------------------------------- derive -- */

const derived: Record<string, Record<string, unknown>> = {};
for (const locale of LOCALES) {
  derived[locale] = deriveAll(load(locale));
}

console.log("Strings per page per language\n");
const header = "page".padEnd(10) + LOCALES.map((l) => l.padStart(7)).join("");
console.log(header);
console.log("-".repeat(header.length));

let grand = 0;
for (const page of PAGES) {
  const counts = LOCALES.map((l) => countStrings(derived[l][page.id]));
  grand += counts.reduce((a, b) => a + b, 0);
  console.log(page.id.padEnd(10) + counts.map((c) => String(c).padStart(7)).join(""));

  /* Every language must carry the same number of strings for a page. A
     difference here means one locale file gained or lost a key, which would
     make that page unvalidatable and is worth stopping for. */
  if (new Set(counts).size !== 1) {
    console.error(`\n  ${page.id}: the four languages do not agree on how many strings it has.`);
    process.exit(1);
  }
}
console.log("-".repeat(header.length));
console.log(
  "total".padEnd(10) +
    LOCALES.map((l) => String(PAGES.reduce((n, p) => n + countStrings(derived[l][p.id]), 0)).padStart(7)).join(""),
);
console.log(`\n${grand} strings across ${PAGES.length} pages x ${LOCALES.length} languages.`);

if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const locale of LOCALES) {
    for (const page of PAGES) {
      fs.writeFileSync(
        path.join(outDir, `${page.id}.${locale}.json`),
        JSON.stringify(derived[locale][page.id], null, 2),
      );
    }
  }
  console.log(`\nDerived JSON written to ${outDir}`);
}

if (dryRun) {
  console.log("\nDry run: nothing was written to the database.");
  process.exit(0);
}

/* ----------------------------------------------------------------- write -- */

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("\nDATABASE_URL is not set. Put it in .env.local; see .env.example.");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
const db = drizzle(sql);

try {
  const existing = await db
    .select({ page: content.page, locale: content.locale, updatedBy: content.updatedBy })
    .from(content);

  const edited = new Set(
    existing.filter((r) => r.updatedBy !== null).map((r) => `${r.page}:${r.locale}`),
  );

  let written = 0;
  let skipped = 0;

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      const id = `${page.id}:${locale}`;
      if (edited.has(id) && !force) {
        console.log(`· ${id} has been edited — left untouched.`);
        skipped++;
        continue;
      }

      const value = derived[locale][page.id];
      await db
        .insert(content)
        .values({ page: page.id, locale, draft: value, published: value })
        .onConflictDoUpdate({
          target: [content.page, content.locale],
          set: { draft: value, published: value, updatedAt: new Date() },
        });
      written++;
    }
  }

  console.log(`\n${written} rows written, ${skipped} left alone.`);
} catch (error) {
  console.error("Seeding failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
