// Run: npm test
//
// The site's whole risk is content drift: a claim on the page that the academy
// never made, or a translation that quietly says something the Italian does
// not. These tests guard exactly that.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { courses, included, resultStills } from "./courses.ts";
import { academy, addressLine, brand, legal, studio } from "./studio.ts";

import en from "../../messages/en.json" with { type: "json" };
import it from "../../messages/it.json" with { type: "json" };
import fr from "../../messages/fr.json" with { type: "json" };
import ar from "../../messages/ar.json" with { type: "json" };

const LOCALES = { en, it, fr, ar } as unknown as Record<string, Record<string, never>>;

const at = (obj: unknown, path: string) =>
  path.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], obj);

/** Every key the pages actually read, outside the per-course ones. */
const PAGE_KEYS = [
  "meta.title",
  "meta.tagline",
  "meta.description",
  "nav.home",
  "nav.courses",
  "nav.about",
  "nav.method",
  "nav.students",
  "nav.gallery",
  "nav.faq",
  "nav.contact",
  "nav.language",
  "nav.menu",
  "hero.eyebrow",
  "hero.titleA",
  "hero.titleB",
  "hero.sub",
  "hero.primary",
  "hero.secondary",
  "hero.portrait",
  "proof.location",
  "proof.groups",
  "proof.certificate",
  "proof.support",
  "instructor.eyebrow",
  "instructor.title",
  "instructor.role",
  "instructor.mission",
  "instructor.body",
  "instructor.valuesLabel",
  "instructor.portrait",
  "why.eyebrow",
  "why.title",
  "why.sub",
  "method.title",
  "method.sub",
  "method.clips.mapping",
  "method.clips.pigment",
  "catalog.eyebrow",
  "catalog.title",
  "catalog.sub",
  "catalog.detailsTitle",
  "catalog.includes",
  "catalog.priceOnRequest",
  "catalog.cta",
  "catalog.payments",
  "journey.eyebrow",
  "journey.title",
  "journey.sub",
  "students.title",
  "students.sub",
  "results.title",
  "results.sub",
  "voices.title",
  "faq.title",
  "faq.eyebrow",
  "faq.more",
  "contact.title",
  "contact.sub",
  "contact.venue",
  "contact.map",
  "contact.channels",
  "contact.whatsapp",
  "contact.instagram",
  "contact.tiktok",
  "contact.facebook",
  "contact.pec",
  "contact.name",
  "contact.email",
  "contact.subject",
  "contact.message",
  "contact.send",
  "contact.sending",
  "contact.sent",
  "contact.error",
  "footer.tagline",
  "footer.explore",
  "footer.studio",
  "footer.legal",
  "footer.activity",
  "footer.vat",
  "footer.rea",
  "footer.rights",
  "mentor.videoAlt",
  "success.title",
  "success.before",
  "success.after",
] as const;

const VALUES = ["professionalism", "quality", "innovation", "ethics", "growth"] as const;
const REASONS = [
  "groups",
  "levels",
  "language",
  "kit",
  "certificate",
  "venue",
] as const;
const STEPS = ["theory", "practice", "model", "support"] as const;
const JOURNEY = ["contact", "deposit", "training", "certificate", "support"] as const;
const DETAILS = [
  "duration",
  "price",
  "level",
  "language",
  "students",
  "kit",
  "certificate",
  "location",
] as const;
const FAQ = [
  "courses",
  "duration",
  "price",
  "includes",
  "kit",
  "students",
  "certificate",
  "language",
  "booking",
  "location",
] as const;

test("the catalogue is the six courses the academy published", () => {
  assert.deepEqual(
    courses.map((c) => c.slug),
    [
      "microblading",
      "powder-brows",
      "lip-blush",
      "eyeliner-pmu",
      "lash-lamination",
      "brow-lamination",
    ],
  );
});

test("every course image exists on disk", () => {
  for (const src of [...courses.map((c) => c.image), ...resultStills]) {
    assert.ok(existsSync(`public${src}`), `missing image: ${src}`);
  }
});

test("official facts match the client's document exactly", () => {
  // These are quoted, not paraphrased. If one changes, the client changed it.
  assert.equal(brand.full, "Aura Academy di Amira Bechini");
  assert.equal(brand.short, "Aura Academy");
  assert.equal(brand.founder, "Amira Bechini");
  assert.equal(addressLine, "Lungomare Rodi 20, 64021 Giulianova (TE)");
  assert.equal(academy.maxStudents, "3-4");
  assert.equal(legal.vat, "02228390676");
  assert.equal(legal.rea, "TE-221017");
  assert.equal(studio.pec, "amirabechini@pec.it");
  assert.equal(studio.instagram, "amirabechini_master");
  assert.equal(studio.tiktok, "amirabchini1");
});

test("nothing links to a WhatsApp number the academy never supplied", () => {
  // The number is missing from the official document. Until it arrives the
  // links must stay absent rather than point at a guess.
  if (!studio.whatsapp) {
    assert.equal(studio.whatsapp, "");
  } else {
    assert.match(studio.whatsapp, /^\d{8,15}$/, "digits only, no + or spaces");
  }
});

test("every page string is translated in all four languages", () => {
  const keys = [
    ...PAGE_KEYS,
    ...VALUES.map((k) => `instructor.values.${k}`),
    ...REASONS.flatMap((k) => [`why.items.${k}.title`, `why.items.${k}.body`]),
    ...STEPS.flatMap((k) => [`method.steps.${k}.title`, `method.steps.${k}.body`]),
    ...JOURNEY.flatMap((k) => [`journey.steps.${k}.title`, `journey.steps.${k}.body`]),
    ...DETAILS.flatMap((k) => [`catalog.details.${k}.label`, `catalog.details.${k}.value`]),
    ...FAQ.flatMap((k) => [`faq.items.${k}.q`, `faq.items.${k}.a`]),
    ...included.map((k) => `catalog.included.${k}`),
    ...courses.map((c) => `catalog.courses.${c.slug}`),
  ];

  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const key of keys) {
      const value = at(messages, key);
      assert.equal(typeof value, "string", `${locale} is missing ${key}`);
      assert.ok((value as string).length > 0, `${locale}.${key} is empty`);
    }
  }
});

test("no orphaned strings survived the rewrite", () => {
  // Namespaces that belonged to the online-course build. If one comes back it
  // means dead copy is shipping to the browser again.
  const gone = [
    "syllabus",
    "stats",
    "brand",
    "modules",
    "lessons",
    "auth",
    "dashboard",
    "learn",
    "certificate",
    "checkout",
  ];
  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const ns of gone) {
      assert.equal(at(messages, ns), undefined, `${locale} still carries "${ns}"`);
    }
  }
});

test("no price, refund or lifetime-access claim is left anywhere", () => {
  // The academy quotes per course and takes an agreed deposit. Any figure or
  // guarantee in the copy would be invented.
  const banned = [
    /\bEUR\b/i,
    /€\s?\d/,
    /lifetime|a vita|à vie/i,
    /refund|rimbors|rembours/i,
    /\b\d{2,3}\s?(days|giorni|jours)\b/i,
  ];
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const text = JSON.stringify(messages);
    for (const pattern of banned) {
      assert.equal(pattern.test(text), false, `${locale} matches ${pattern}`);
    }
  }
});

test("testimonials render nothing until real ones are supplied", () => {
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const items = at(messages, "voices.items");
    assert.deepEqual(items, {}, `${locale} has unverified testimonials`);
  }
});
