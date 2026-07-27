// Run: npm test
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { allLessons, courses, getCourse, nextLesson, progressPercent, resultStills } from "./courses.ts";
import { certificateCode } from "./mux.ts";

import en from "../../messages/en.json" with { type: "json" };
import it from "../../messages/it.json" with { type: "json" };
import fr from "../../messages/fr.json" with { type: "json" };
import ar from "../../messages/ar.json" with { type: "json" };

const LOCALES = { en, it, fr, ar } as unknown as Record<string, Record<string, never>>;

const course = getCourse("brow-artistry")!;
const ids = allLessons(course).map((l) => l.id);

const at = (obj: unknown, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj);

test("lesson ids are unique across ALL courses", () => {
  // The dashboard reads one flat set of completed ids. A shared id would make
  // finishing one course silently advance another.
  const all = courses.flatMap((c) => allLessons(c).map((l) => l.id));
  assert.equal(new Set(all).size, all.length);
});

test("progress runs 0 to 100 and rounds", () => {
  assert.equal(progressPercent(course, new Set()), 0);
  assert.equal(progressPercent(course, new Set(ids)), 100);
  assert.equal(progressPercent(course, new Set(ids.slice(0, 4))), 50);
  // Ids from another course must not count towards this one.
  assert.equal(progressPercent(course, new Set(["lip-blush", "hygiene"])), 0);
});

test("resume points at the first unfinished lesson", () => {
  assert.equal(nextLesson(course, new Set()).id, ids[0]);
  assert.equal(nextLesson(course, new Set(ids.slice(0, 3))).id, ids[3]);
  // A finished course still has somewhere to land.
  assert.equal(nextLesson(course, new Set(ids)).id, ids[0]);
});

test("certificate codes are stable and distinct per enrollment", () => {
  const a = certificateCode("11111111-1111-4111-8111-111111111111");
  assert.equal(a, certificateCode("11111111-1111-4111-8111-111111111111"));
  assert.notEqual(a, certificateCode("22222222-2222-4222-8222-222222222222"));
  assert.match(a, /^[0-9A-F]{12}$/);
});

test("every free preview lesson sits in the first module", () => {
  for (const c of courses) {
    const free = allLessons(c).filter((l) => l.free);
    assert.ok(free.length >= 1, c.slug);
    assert.ok(free.every((l) => l.moduleId === c.modules[0].id), c.slug);
  }
});

// Homepage sections whose keys are enumerated in code, so a missing translation
// only surfaces as a raw key on the rendered page.
const HOMEPAGE_KEYS = [
  ...["home", "courses", "about", "method", "students", "gallery", "faq", "contact"].map(
    (k) => `nav.${k}`,
  ),
  ...["luxury", "groups", "mentoring", "certification", "business", "support"].flatMap((k) => [
    `why.items.${k}.title`,
    `why.items.${k}.body`,
  ]),
  ...[
    "lipBlush",
    "darkLips",
    "powderBrows",
    "browMapping",
    "colourTheory",
    "pigment",
    "machine",
    "liveDemo",
    "latex",
    "model",
    "branding",
    "packaging",
    "business",
    "social",
    "consultation",
    "aftercare",
    "certification",
  ].map((k) => `syllabus.items.${k}`),
  ...["years", "students", "locations", "practice"].map((k) => `stats.${k}`),
  ...["roma", "milano", "tortoreto"].map((k) => `contact.cities.${k}.name`),
  "contact.map",
  "contact.whatsapp",
  "contact.instagram",
  "catalog.payments",
  "students.title",
  "students.sub",
];

test("every course, module and lesson is translated in all four languages", () => {
  const required = HOMEPAGE_KEYS.concat(courses.flatMap((c) => [
    `catalog.${c.slug}.title`,
    `catalog.${c.slug}.tagline`,
    `catalog.${c.slug}.description`,
    ...(["one", "two", "three"] as const).map((k) => `catalog.${c.slug}.outcomes.${k}`),
    ...c.modules.map((m) => `modules.${m.id}`),
    ...allLessons(c).map((l) => `lessons.${l.id}`),
  ]));

  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const path of required) {
      const value = at(messages, path);
      assert.equal(typeof value, "string", `${locale} is missing ${path}`);
      assert.ok(String(value).trim().length > 0, `${locale} has an empty ${path}`);
    }
  }
});

test("no orphan lesson strings left behind after a catalogue change", () => {
  const live = new Set(courses.flatMap((c) => allLessons(c).map((l) => l.id)));
  const declared = Object.keys((en as unknown as { lessons: object }).lessons);
  assert.deepEqual(
    declared.filter((id) => !live.has(id)),
    [],
    "messages/*.json still define lessons no course uses",
  );
});

test("every referenced image is actually on disk", () => {
  const paths = [
    ...courses.flatMap((c) => [c.image, ...c.gallery]),
    ...resultStills,
    "/brand/amira-hero.jpg",
    "/brand/amira-studio.jpg",
  ];
  for (const p of new Set(paths)) {
    assert.ok(existsSync(`public${p}`), `missing asset: public${p}`);
  }
});
