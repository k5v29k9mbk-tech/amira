// Run: npm test
//
// The site's whole risk is content drift: a claim on the page that the academy
// never made, or a translation that quietly says something the Italian does
// not. These tests guard exactly that, plus the media the redesign made
// data-driven: every poster and clip the pages point at has to exist on disk.
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { courses, families, included, chapters } from "./courses.ts";
import type { Media } from "./media.ts";
import {
  closingMedia,
  founderMedia,
  galleryFrames,
  heroMedia,
  introMedia,
  methodMedia,
  resultFrames,
} from "./media.ts";
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
  "nav.faq",
  "nav.contact",
  "nav.language",
  "nav.menu",
  "nav.close",
  // The two strings a keyboard or screen-reader user meets before any content.
  // Both shipped in English on the Italian, French and Arabic routes until
  // they were listed here.
  "nav.skip",
  "nav.loading",
  "nav.work",
  "notFound.title",
  "notFound.body",
  "intro.skip",
  "hero.eyebrow",
  "hero.titleA",
  "hero.titleB",
  "hero.sub",
  // Held, not read. `hero.founder` was the portrait's one-line credit and
  // `hero.meetAmira` its secondary action; the credit is now `instructor.title`
  // over `hero.founderRole`, and the action is the booking. `manifesto.note` and
  // `students.sub` are the same case: both were removed from the page as
  // repetition, not as content. All four stay listed here on purpose. They are
  // one line from being rendered again, and a translation that rots while the
  // key sits unused is exactly the regression this list exists to catch.
  "hero.founder",
  "hero.founderRole",
  "hero.primary",
  "hero.secondary",
  "hero.meetAmira",
  // The three actions the whole site is allowed to ask for, in the order a
  // visitor meets them: browse, ask a person, ask for a date. They live in one
  // namespace precisely so a fourth cannot appear quietly in one language, or
  // one of the three drift into a different verb on one page.
  "cta.courses",
  "cta.talk",
  "cta.availability",
  "sections.courses",
  "sections.method",
  "sections.work",
  "sections.amira",
  "sections.inside",
  "manifesto.one",
  "manifesto.two",
  "manifesto.note",
  "about.meta.title",
  "about.meta.description",
  "about.eyebrow",
  "about.titleA",
  "about.titleB",
  "about.lede",
  "about.portrait",
  "about.readStory",
  "about.story.eyebrow",
  "about.story.title",
  "about.story.role",
  "about.story.imageAlt",
  "about.story.p1",
  "about.story.p2",
  "about.story.p3",
  "about.story.p4",
  "about.story.signature",
  "about.different.eyebrow",
  "about.different.title",
  "about.different.sub",
  "about.beyond.eyebrow",
  "about.beyond.title",
  "about.beyond.sub",
  "about.mission.eyebrow",
  "about.mission.quote",
  "about.mission.body",
  "about.vision.eyebrow",
  "about.vision.title",
  "about.vision.body",
  "about.vision.closing",
  "about.cta.title",
  "about.cta.body",
  "instructor.title",
  "instructor.headline",
  "instructor.role",
  "instructor.mission",
  "instructor.body",
  "instructor.valuesLabel",
  "instructor.portrait",
  "method.title",
  "method.sub",
  "catalog.eyebrow",
  "catalog.title",
  "catalog.sub",
  "catalog.selectorTitle",
  "catalog.viewCourse",
  "catalog.detailsTitle",
  "catalog.includes",
  "catalog.cta",
  "catalog.privateNote",
  "catalog.paymentsLabel",
  "catalog.payments",
  "journey.eyebrow",
  "journey.title",
  "journey.sub",
  "students.title",
  "students.sub",
  "voices.title",
  "voices.prev",
  "voices.next",
  "faq.title",
  "faq.more",
  "faq.viewAll",
  "faq.meta.title",
  "faq.meta.description",
  "closing.title",
  "closing.sub",
  "contact.meta.title",
  "contact.meta.description",
  "contact.title",
  "contact.sub",
  "contact.venue",
  "contact.map",
  "contact.channels",
  "contact.whatsapp",
  "contact.whatsappMessage",
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
  "mentor.play",
  "mentor.videoAlt",
  "success.title",
  "success.before",
  "success.after",
  "work.title",
  "work.sub",
  "work.open",
  "work.close",
] as const;

const VALUES = ["professionalism", "quality", "innovation", "ethics", "growth"] as const;
const HERO_FACTS = ["years", "students", "classes"] as const;
const ABOUT_FACTS = ["years", "students", "reach"] as const;
const ABOUT_DIFFERENT = ["experience", "small", "support"] as const;
const ABOUT_BEYOND = [
  "mindset",
  "marketing",
  "clients",
  "consultation",
  "photography",
  "communication",
  "branding",
  "growth",
] as const;
const ABOUT_VISION = ["quality", "professionalism", "innovation", "growth"] as const;
const JOURNEY = ["contact", "deposit", "training", "certificate", "support"] as const;
const DETAILS = [
  "duration",
  "level",
  "language",
  "students",
  "kit",
  "certificate",
  "location",
] as const;
const FAQ = [
  "courses",
  "beginners",
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

test("every poster and clip the pages point at exists on disk", () => {
  const media: Media[] = [
    heroMedia,
    closingMedia,
    founderMedia,
    ...Object.values(methodMedia),
    ...galleryFrames,
    ...resultFrames,
    ...courses.map((c) => c.media),
  ];

  for (const m of media) {
    for (const src of [m.posterSrc, m.videoSrc, m.mobileVideoSrc]) {
      if (src) assert.ok(existsSync(`public${src}`), `missing asset: ${src}`);
    }
  }
});

test("the opening sequence ships whole, or not at all", () => {
  // The overlay stands down cleanly when the film is missing, so an empty
  // public/videos is a valid state. What must never ship is half a set: an mp4
  // with no poster means a first frame of black, an mp4 with no webm means
  // every visitor downloads the larger file.
  const has = (src: string) => existsSync(`public${src}`);
  if (has(introMedia.mp4Src)) {
    assert.ok(has(introMedia.webmSrc), `missing ${introMedia.webmSrc}`);
    assert.ok(has(introMedia.posterSrc), `missing ${introMedia.posterSrc}`);
  }
});

test("every cut of the logo the pages ask for exists", () => {
  // All of these are derived from one supplied master by scripts/build-logo.py.
  // If the academy sends new artwork, re-run it rather than editing a file
  // here: the three inks and two crops have to stay the same drawing.
  const cuts = ["logo", "mark"].flatMap((crop) =>
    ["gold", "dark", "light"].map((ink) => `public/brand/aura-${crop}-${ink}.png`),
  );
  for (const file of [...cuts, "public/brand/aura-logo-source.jpg"]) {
    assert.ok(existsSync(file), `missing ${file}`);
  }
  // Next serves these two by filename. Without them there is no tab icon.
  assert.ok(existsSync("src/app/icon.png"), "missing src/app/icon.png");
  assert.ok(existsSync("src/app/apple-icon.png"), "missing src/app/apple-icon.png");
});

test("every method frame belongs to a chapter that is actually told", () => {
  // A chapter may go without a photograph: MethodStory mounts the frames that
  // exist and holds the one above while an unframed chapter is read, so the
  // sticky column never fades to an empty panel. A frame keyed to a chapter
  // that is not in `chapters`, on the other hand, is a file nothing renders.
  for (const key of Object.keys(methodMedia)) {
    assert.ok(
      (chapters as readonly string[]).includes(key),
      `methodMedia.${key} is not a chapter`,
    );
  }
  assert.ok(chapters.some((key) => methodMedia[key]), "the method has no frames at all");
});

test("no treatment photograph is cropped by its own frame", () => {
  // The work section's whole claim is that the result is shown as it was
  // photographed. `cover` crops whatever the frame's ratio does not match, so a
  // frame set to anything but the file's own ratio takes a slice off a brow or
  // a lip line. Native ratio is the only setting that takes nothing.
  for (const frame of resultFrames) {
    assert.equal(
      frame.ratio.replace(/\s+/g, ""),
      `${frame.width}/${frame.height}`,
      `${frame.posterSrc} is framed at "${frame.ratio}" rather than its own ratio`,
    );
  }
});

test("only photographs with pixels to spare open full screen", () => {
  // Opening a frame larger has to actually show more. The academy's close-ups
  // are 232px to 371px wide and are already displayed at about that size, so
  // an overlay on one of them would enlarge nothing and soften what is there.
  // If a small file ever gets the flag, this is where it stops.
  for (const frame of resultFrames) {
    if (!frame.zoom) continue;
    assert.ok(
      frame.width >= 900,
      `${frame.posterSrc} is only ${frame.width}px wide and opens full screen`,
    );
  }
});

test("the graded portrait never appears among the results", () => {
  // The work section's copy is a claim about the photographs in it, so what may
  // sit in it is constrained. `amira-portrait-hero.jpg` is the one graded file on
  // the site, by a light unsharp pass and a four percent lift in colour (see
  // heroMedia in media.ts), and the results are shipped exactly as the academy
  // supplied them apart from three rotations. Those two facts are compatible only
  // while the graded master stays out of this section. Putting it in, or reusing
  // it as a result, would make the section's own standfirst false.
  const graded = [heroMedia.posterSrc];
  for (const src of graded) {
    assert.ok(
      !resultFrames.some((f) => f.posterSrc === src),
      `${src} is graded and cannot be shown as a result`,
    );
  }
});

test("no absolute authenticity claim is made about the page", () => {
  // `work.title` read "Real work, unretouched." and `work.sub` ended "Nothing on
  // this page is retouched, filtered or generated." True of the results, false of
  // the page: the hero portrait two acts above them is a graded master. The copy
  // now claims only what is checkable, which is that these are the academy's own
  // client photographs.
  //
  // A word list cannot police this across four languages and is not trying to.
  // What it can do is catch the exact wording coming back, in the two languages
  // the copy is drafted in, which is how it got here the first time.
  const absolutes = [/unretouch/i, /senza ritocchi/i, /sans retouche/i, /nothing on this page/i];
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const text = JSON.stringify(messages);
    for (const pattern of absolutes) {
      assert.equal(
        pattern.test(text),
        false,
        `${locale} claims ${pattern} about the whole page again`,
      );
    }
  }
});

test("the work section and the studio gallery never show the same frame", () => {
  // They sit two sections apart on one page. The results moved out of the
  // studio gallery precisely so that neither is competing with the other for
  // the same glance, and a photograph reused across both undoes that quietly.
  const shared = resultFrames
    .map((f) => f.posterSrc)
    .filter((src) => galleryFrames.some((g) => g.posterSrc === src));
  assert.deepEqual(shared, [], "a photograph is printed twice on the homepage");
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
    ...HERO_FACTS.flatMap((k) => [`hero.facts.${k}.value`, `hero.facts.${k}.label`]),
    ...ABOUT_FACTS.flatMap((k) => [`about.facts.${k}.value`, `about.facts.${k}.label`]),
    ...ABOUT_DIFFERENT.flatMap((k) => [
      `about.different.items.${k}.title`,
      `about.different.items.${k}.body`,
    ]),
    ...ABOUT_BEYOND.map((k) => `about.beyond.items.${k}`),
    ...ABOUT_VISION.map((k) => `about.vision.points.${k}`),
    ...chapters.flatMap((k) => [`method.steps.${k}.title`, `method.steps.${k}.body`]),
    // The frames with a described photograph rather than a decorative one.
    // An alt that exists in Italian and not in Arabic is a silent regression.
    "method.steps.theory.alt",
    // Read off the composition rather than listed, so a frame added to the
    // work section cannot ship without its description in all four languages.
    ...resultFrames.map((f) => `work.alt.${f.altKey}`),
    // Same for the studio gallery's captions, which are the clauses the
    // section's old standfirst listed, now set under the frame each one names.
    // Read off the data for the same reason: caption a fourth frame and its
    // translations are required by this test rather than by someone remembering.
    ...galleryFrames.flatMap((f) => (f.captionKey ? [`students.captions.${f.captionKey}`] : [])),
    ...JOURNEY.flatMap((k) => [`journey.steps.${k}.title`, `journey.steps.${k}.body`]),
    ...DETAILS.flatMap((k) => [`catalog.details.${k}.label`, `catalog.details.${k}.value`]),
    ...FAQ.flatMap((k) => [`faq.items.${k}.q`, `faq.items.${k}.a`]),
    ...included.map((k) => `catalog.included.${k}`),
    ...courses.flatMap((c) => [
      `catalog.courses.${c.slug}`,
      `catalog.blurbs.${c.slug}`,
    ]),
    // The three family headings on the courses page, read off the data for the
    // same reason the frames are: add a fourth family and its title and
    // standfirst are required in all four languages by this test rather than by
    // someone remembering to add them.
    ...families.flatMap((f) => [
      `catalog.families.${f}.title`,
      `catalog.families.${f}.sub`,
    ]),
    // The Powder Brows section. It is the one discipline with copy of its own
    // rather than a single blurb, so it is the one most likely to ship in
    // Italian and English and nothing else.
    "powder.eyebrow",
    "powder.title",
    "powder.intro",
    "powder.points.technique",
    "powder.points.finish",
    "powder.points.levels",
    "powder.cta",
  ];

  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const key of keys) {
      const value = at(messages, key);
      assert.equal(typeof value, "string", `${locale} is missing ${key}`);
      assert.ok((value as string).length > 0, `${locale}.${key} is empty`);
    }
  }
});

test("no placeholder copy stands in for media the academy has not supplied", () => {
  // "Welcome message coming soon" was a caption under a play control that could
  // not play. A promise with no date is worse than the photograph on its own,
  // so WelcomeVideo now renders the still alone and the string is gone from all
  // four catalogues. If it reappears, a placeholder is shipping again.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    assert.equal(
      at(messages, "mentor.videoSoon"),
      undefined,
      `${locale} brought back the "coming soon" placeholder`,
    );
  }
});

test("no orphaned strings survived the rewrites", () => {
  // Namespaces that belonged to the online-course build, plus the ones the
  // redesign folded into a single source. If one comes back it means dead copy
  // is shipping to the browser again.
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
    "proof",
    "results",
    "why",
  ];
  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const ns of gone) {
      assert.equal(at(messages, ns), undefined, `${locale} still carries "${ns}"`);
    }
  }
});

test("course fees stay private", () => {
  // Standing instruction from the academy: pricing is never displayed. It is
  // quoted to an enquirer by Amira directly, so the site carries no figure, no
  // price row in the shared conditions, and no "price on request" placeholder
  // standing in for one. `catalog.privateNote` says the fee comes from her and
  // the action beside it starts that conversation; that is the whole of it.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    assert.equal(
      at(messages, "catalog.details.price"),
      undefined,
      `${locale} put the price row back into the shared conditions`,
    );
    assert.equal(
      at(messages, "catalog.priceOnRequest"),
      undefined,
      `${locale} brought back the price-on-request placeholder`,
    );
    assert.equal(
      typeof at(messages, "catalog.privateNote"),
      "string",
      `${locale} is missing the note that replaces the price`,
    );
  }
  // The page must not render a price row even if a key reappears.
  assert.equal(
    (DETAILS as readonly string[]).includes("price"),
    false,
    "the shared conditions table lists a price row again",
  );
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

/**
 * Quotes invented for the removed online-course build. They were deleted, but
 * they are still reachable in this repository's git history, which makes them
 * exactly the kind of thing that gets "restored" by someone looking for content
 * that already exists. No testimonial on this site may be authored by anyone
 * but the student who said it.
 */
const FABRICATED = [
  "Ghita Benslimane",
  "Sofia Marchetti",
  "Camille Dorval",
  "Yasmine Trabelsi",
  "Fixture",
];

test("no fabricated testimonial can come back from git history", () => {
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const text = JSON.stringify(at(messages, "voices.items") ?? {});
    for (const name of FABRICATED) {
      assert.equal(text.includes(name), false, `${locale} carries invented quote "${name}"`);
    }
  }
});

test("any testimonial that does exist is complete in all four languages", () => {
  // Zero is a valid state and stays valid: the section removes itself from the
  // page when `voices.items` is empty. What must never ship is a half-supplied
  // set, where a visitor switching to French gets a carousel one quote shorter
  // than the Italian one, or an attribution with no name against it.
  const perLocale = Object.entries(LOCALES).map(
    ([locale, messages]) =>
      [locale, (at(messages, "voices.items") ?? {}) as Record<string, unknown>] as const,
  );

  const [, reference] = perLocale[0];
  const expected = Object.keys(reference);

  for (const [locale, items] of perLocale) {
    assert.deepEqual(
      Object.keys(items),
      expected,
      `${locale} carries a different set of testimonials`,
    );

    for (const key of expected) {
      const voice = items[key] as Record<string, unknown>;
      // `course` is optional, but optional per testimonial, not per language:
      // if the Italian quote names the discipline, every other language does.
      for (const field of ["quote", "name", "role"]) {
        assert.equal(
          typeof voice?.[field],
          "string",
          `${locale}.voices.items.${key} is missing ${field}`,
        );
        assert.ok(
          (voice[field] as string).trim().length > 0,
          `${locale}.voices.items.${key}.${field} is empty`,
        );
      }
      assert.equal(
        "course" in voice,
        "course" in (reference[key] as Record<string, unknown>),
        `${locale}.voices.items.${key} disagrees about the course line`,
      );
      if ("course" in voice) {
        assert.equal(
          typeof voice.course,
          "string",
          `${locale}.voices.items.${key}.course is not a string`,
        );
        assert.ok(
          (voice.course as string).trim().length > 0,
          `${locale}.voices.items.${key}.course is empty`,
        );
      }
    }
  }
});

test("no em dash survived into the copy", () => {
  // The house rule is a comma or a colon. An em dash in a headline is the one
  // punctuation mark that reads as machine-written.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    assert.equal(/[—–]/.test(JSON.stringify(messages)), false, `${locale} carries an em dash`);
  }
});
