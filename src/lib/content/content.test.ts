import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { PAGES, assertNamespacesPartition, pageForNamespace } from "./pages.ts";
import { SCHEMAS } from "./schemas/index.ts";
import { countStrings, deriveAll, derivePage, type Tree } from "./derive.ts";
import { fill, scope } from "./path.ts";

const ROOT = path.resolve(import.meta.dirname, "../../..");
const LOCALES = ["it", "en", "fr", "ar"] as const;

const load = (locale: string): Tree =>
  JSON.parse(fs.readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8"));

const leaves = (tree: unknown, prefix = ""): [string, string][] => {
  if (typeof tree === "string") return [[prefix, tree]];
  if (!tree || typeof tree !== "object") return [];
  return Object.entries(tree as Record<string, unknown>).flatMap(([k, v]) =>
    leaves(v, prefix ? `${prefix}.${k}` : k),
  );
};

test("every namespace in the catalogue is owned by exactly one page", () => {
  // The guard that stops a section of the site quietly having no edit form.
  assert.doesNotThrow(() => assertNamespacesPartition(Object.keys(load("en"))));
});

test("the schemas cover every string in the catalogue and invent none", () => {
  const catalogue = leaves(load("en")).length;
  const covered = PAGES.reduce((n, p) => n + countStrings(derivePage(load("en"), p.id)), 0);

  assert.equal(catalogue, 443, "the catalogue changed size; regenerate the schemas");
  assert.equal(
    covered,
    catalogue,
    `schemas cover ${covered} strings, the catalogue has ${catalogue}. Run \`npm run content:schemas\`.`,
  );
});

test("the migration reproduces every string byte for byte, in all four languages", () => {
  // THE BYTE-IDENTICAL GUARANTEE, checked at its source. The public site reads
  // what this produces, so if a string changes here the page changes. Arabic
  // and the Italian typographic apostrophes are the cases that matter: a
  // migration that "tidies" either has changed the site.
  for (const locale of LOCALES) {
    const messages = load(locale);
    const derived = deriveAll(messages);

    for (const [key, value] of leaves(messages)) {
      const ns = key.split(".")[0];
      const page = pageForNamespace(ns);
      assert.ok(page, `no page owns "${ns}"`);

      const read = scope(derived[page]);
      assert.equal(
        read(key),
        value,
        `${locale} ${key} changed in migration:\n  file: ${JSON.stringify(value)}\n  derived: ${JSON.stringify(read(key))}`,
      );
    }
  }
});

test("every language validates against every page schema", () => {
  for (const locale of LOCALES) {
    const messages = load(locale);
    for (const page of PAGES) {
      const result = SCHEMAS[page.id].safeParse(derivePage(messages, page.id));
      assert.ok(
        result.success,
        `${locale}/${page.id} failed: ${result.success ? "" : result.error.issues.slice(0, 3).map((i) => i.path.join(".")).join(", ")}`,
      );
    }
  }
});

test("a missing key throws instead of printing its own path into the page", () => {
  // next-intl rendered the key when a message was absent, which is how a site
  // ships `catalog.blurbs.microblading` as visible copy.
  const t = scope({ hero: { titleA: "Diventa" } });
  assert.equal(t("hero.titleA"), "Diventa");
  assert.throws(() => t("hero.missing"), /Missing content key "hero\.missing"/);
  assert.throws(() => t("hero"), /is a section, not a string/);
});

test("interpolation fills known placeholders and leaves unknown ones alone", () => {
  // One string on the site carries a placeholder: programs.meta.description.
  assert.equal(fill("Corso di {course}", { course: "Microblading" }), "Corso di Microblading");
  assert.equal(fill("Corso di {course}", {}), "Corso di {course}");
  assert.equal(fill("nessun segnaposto", { course: "x" }), "nessun segnaposto");
});

test("the one interpolated string still carries its placeholder in all four languages", () => {
  // If a translator drops {course} the course pages lose the course name from
  // their meta description, silently and only in that language.
  for (const locale of LOCALES) {
    const derived = deriveAll(load(locale));
    const value = scope(derived.catalog)("programs.meta.description");
    assert.match(value, /\{course\}/, `${locale} lost {course} from programs.meta.description`);
  }
});
