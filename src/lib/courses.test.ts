// Run: npm test
//
// The site's whole risk is content drift: a claim on the page that the academy
// never made, or a translation that quietly says something the Italian does
// not. These tests guard exactly that, plus the media the redesign made
// data-driven: every poster and clip the pages point at has to exist on disk.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { courses, families, included, chapters } from "./courses.ts";
import { tiers, publishedTiers } from "./pathway.ts";
import { serviceGallery, beforeSrc, afterSrc } from "./service-gallery.ts";
import { programs, programBySlug } from "./programs.ts";
import type { Media } from "./media.ts";
import {
  artistMedia,
  certificateMedia,
  closingMedia,
  demonstrationMedia,
  founderMedia,
  heroFilmMedia,
  mentorshipMedia,
  precisionMedia,
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

/**
 * Width and height of a JPEG, read from the first SOF marker.
 *
 * Small enough to write out rather than take a dependency for, and the only
 * thing the pair test needs: the alignment script always writes JPEG, so there
 * is no other format to handle.
 */
function sizeOfJpeg(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  let i = 2; // skip SOI
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0..SOF15, excluding the four that are not frame headers.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`no JPEG frame header in ${file}`);
}

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
  // The bar's own label for the booking, and the reason it is not a fifth entry
  // in `cta`. The action, the destination and the intention are all unchanged:
  // this goes to /contact like every other booking on the site. What is
  // different is the register. "Prenota una consulenza" is 178px of small caps
  // in a 72px bar that also has to hold a brand mark, four labels and a language
  // control, and a header sets a label rather than a sentence. The full ask is
  // still what the phone menu, the standing bar and every closing frame print.
  "nav.book",
  // The two strings a keyboard or screen-reader user meets before any content.
  // Both shipped in English on the Italian, French and Arabic routes until
  // they were listed here.
  "nav.skip",
  "nav.loading",
  "nav.work",
  "notFound.title",
  "notFound.body",
  "intro.skip",
  // Held, not read. This was the bar over the statement, "Aura Academy ·
  // Formazione professionale PMU · Italia", and the first screen carries the
  // academy's name as a wordmark and its category in the supporting line now.
  // It stays in all four catalogues because putting the bar back is one line of
  // JSX, and a string that has to be re-translated into four languages first is
  // not a decision anyone reverses.
  "hero.eyebrow",
  "hero.titleA",
  "hero.titleB",
  "hero.sub",
  // The hero's second action, beside `cta.courses`. It is a key of this
  // namespace and not of `cta` for the reason argued there: the four verbs are
  // the four intentions the site is allowed to have, and this is not a fifth
  // intention, it is the first screen's own way of opening the page about the
  // academy that the header opens with her name.
  "hero.discoverAura",
  // The portrait credit under the hero photograph: her name from
  // `instructor.title`, her three titles from `hero.founderRole`.
  "hero.founderRole",
  // Held, not read, and it is not `hero.discoverAura` under another name. This
  // said "Conosci Amira" and pointed at her; the first screen's second action
  // now says "Conosci Aura" and points at the academy, which is the whole of the
  // repositioning the hero was rebuilt for. Both strings stay because the two
  // are a real choice about what the screen offers second, not a rewording.
  "hero.meetAmira",
  // The line under the class-size figure, which is the one piece of the proof
  // band that says what the number means rather than repeating it.
  "hero.classesNote",
  // Held, not read. `hero.founder` was the portrait's one-line credit before it
  // became the name over the role, and `manifesto.note` and `students.sub` were
  // removed from their pages as repetition rather than as content. All three
  // stay listed on purpose.
  "hero.founder",
  // THE FOUR ACTIONS THE WHOLE SITE IS ALLOWED TO ASK FOR, and the reason they
  // are four rather than eleven.
  //
  // Eleven labels were shipping for these four intentions: "explore the
  // training" and "explore the courses" for the same catalogue, "request
  // details", "request course details" and "ask about Powder Brows" for the
  // same enquiry, "request a seat", "book your place" and "book your
  // consultation" for the same conversation. Every one of them was written for
  // the block it sat in, which is how a button stops being a system: a reader
  // crossing four pages met four verbs for one thing and had to work out each
  // time whether she was being offered something new.
  //
  // They live in one namespace precisely so a twelfth cannot appear quietly in
  // one language, or one of the four drift into a different verb on one page:
  //
  //   courses       to the catalogue, from anywhere
  //   course        to one discipline's page, from a row or a panel
  //   info          the enquiry, where a reader still has a question
  //   consultation  the booking, and the primary action of every closing frame
  "cta.courses",
  "cta.course",
  "cta.info",
  "cta.consultation",
  // The two halves of the brand lockup under the signature: the person, then
  // the platform she built.
  "positioning.artist",
  "positioning.academy",
  // The credentials band (act 01) and the three acts the repositioning added.
  "sections.authority",
  "sections.pathway",
  "sections.experience",
  "sections.receive",
  "authority.eyebrow",
  "authority.title",
  "authority.sub",
  "authority.note",
  // The method has a name now. The four stages are unchanged; what was missing
  // was a mark for them, and `method.lede` is the sentence that says why the
  // order is the method rather than a list of four things.
  "method.eyebrow",
  "method.name",
  "method.lede",
  "pathway.eyebrow",
  "pathway.title",
  "pathway.sub",
  "pathway.levelLabel",
  "experience.eyebrow",
  "experience.title",
  "experience.sub",
  "receive.eyebrow",
  "receive.title",
  "receive.sub",
  // The programme pages. Every one of these is read on all six routes in all
  // four languages, so one missing translation is six broken pages.
  "programs.eyebrow",
  "programs.title",
  "programs.sub",
  "programs.backToAll",
  "programs.keyInfoTitle",
  "programs.promise.eyebrow",
  "programs.promise.title",
  "programs.promise.body",
  "programs.forWho.eyebrow",
  "programs.forWho.title",
  "programs.forWho.baseLabel",
  "programs.forWho.advancedLabel",
  // THE TWO LEVELS, AS FIVE ANSWERS EACH RATHER THAN A PARAGRAPH EACH.
  //
  // `programs.forWho.base` and `.advanced` were two forty-word paragraphs sat
  // side by side, and a reader deciding which of the two levels was hers had to
  // read both of them in full and hold them in her head to compare. The five
  // rows below are the five questions she is actually asking, asked in the same
  // order of both levels, so the comparison is done by the layout instead: who
  // it is for, what she needs to arrive with, what it is aiming at, what the
  // practice is, and what she leaves with.
  //
  // Nothing in them is a new claim. Every line is a restatement of the two
  // paragraphs they replaced and of the two published tiers in `pathway.tiers`,
  // which is the rule the whole catalogue is held to.
  //
  // All five rows of both levels are listed because the card renders them
  // unconditionally: one missing translation is a blank row on six routes.
  "programs.levels.labels.for",
  "programs.levels.labels.experience",
  "programs.levels.labels.goal",
  "programs.levels.labels.practice",
  "programs.levels.labels.outcome",
  "programs.levels.base.for",
  "programs.levels.base.experience",
  "programs.levels.base.goal",
  "programs.levels.base.practice",
  "programs.levels.base.outcome",
  "programs.levels.advanced.for",
  "programs.levels.advanced.experience",
  "programs.levels.advanced.goal",
  "programs.levels.advanced.practice",
  "programs.levels.advanced.outcome",
  "programs.notFor.title",
  "programs.mastery.eyebrow",
  "programs.mastery.title",
  "programs.curriculum.eyebrow",
  "programs.curriculum.title",
  "programs.curriculum.day",
  "programs.included.eyebrow",
  "programs.included.title",
  "programs.scarcity.eyebrow",
  "programs.scarcity.title",
  "programs.scarcity.body",
  "programs.instructor.eyebrow",
  "programs.instructor.title",
  "programs.work.eyebrow",
  "programs.work.title",
  "programs.work.sub",
  "programs.faq.eyebrow",
  "programs.faq.title",
  "programs.apply.eyebrow",
  "programs.apply.title",
  "programs.apply.body",
  "programs.meta.description",
  // The path's label in the phone menu.
  "nav.pathway",
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
  // The two frames on /about that are photographs of something happening
  // rather than of somebody standing: her hands on a model's brows, and the
  // flip chart mid-lesson. Described from the catalogue for the same reason as
  // the three below.
  "about.demoAlt",
  "about.certificateAlt",
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
  // Alt text for the three supplied photographs. Each is a picture of something
  // happening rather than a texture, so each is described, and described from
  // the catalogue in four languages rather than in English from `lib/media`.
  // The method's live-model frame is `method.steps.model.alt`, listed with the
  // other chapter strings.
  "authority.portraitAlt",
  "experience.guidanceAlt",
  "instructor.title",
  // The artist act (02), rebuilt around the academy's current official
  // portrait. The statement is split across two keys rather than wrapped from
  // one, which is the same pattern `hero.titleA`/`titleB` uses and the only way
  // a line-by-line reveal can break in the same place in four languages: a
  // single string masked per rendered line would break wherever the browser
  // wrapped it, which is a different word in each of them.
  "instructor.statementA",
  "instructor.statementB",
  "instructor.bio",
  // Her two titles under her name in that act. Shorter than `instructor.role`,
  // which names the institute as well and is still read on the six programme
  // pages: beside a photograph the size of this one, the frame is doing the
  // work the third clause used to.
  "instructor.credit",
  // Held, not read. `instructor.headline` was the act's heading before the
  // statement replaced it. Listed on purpose, like the four hero keys above:
  // restoring it is one line, and a translation that rots while its key sits
  // unused is exactly the regression this list exists to catch.
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
  // Held, not read. The footer's fourth column carried the registered address,
  // the VAT number and the REA number, and the academy has asked for all three
  // off it; the column now prints the registered name and an ordinary mailbox.
  //
  // The strings stay in all four catalogues, and so do the values behind them.
  // An Italian registered business publishes these, and the site still does:
  // `legal.vat` is `vatID` in the organisation's structured data and the
  // address is a `PostalAddress` there and a block on /contact. What changed is
  // which surface prints them, which is a layout decision and reversible in one
  // JSX block. Re-translating three labels into four languages to undo it is
  // not, so they are kept.
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
/** The four figures in the credentials band (act 01). */
const AUTHORITY = ["years", "students", "classes", "reach"] as const;
/** The four claims under the photographs of the room (act 07). */
const EXPERIENCE = ["groups", "demo", "practice", "correction"] as const;
/** The eight things every course carries (act 08). */
const RECEIVE = [
  "small",
  "model",
  "feedback",
  "certificate",
  "support",
  "guidance",
  "kit",
  "business",
] as const;
/** The three the programme pages say a course is not for. */
const NOT_FOR = ["quick", "broad", "passive"] as const;
/** The seven rows the key-information module can print. */
const PROGRAM_LABELS = [
  "level",
  "duration",
  "seats",
  "location",
  "certificate",
  "model",
  "language",
] as const;
/** The three of those whose value is a programme-namespace string. */
const PROGRAM_VALUES = ["seats", "certificate", "model"] as const;
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
    // The classroom film. It was unlisted for as long as it was unmounted, and
    // an asset nothing renders is an asset nothing notices going missing. It is
    // the overture ahead of act 02 now, so both cuts and the poster are checked.
    heroFilmMedia,
    closingMedia,
    founderMedia,
    artistMedia,
    // The three photographs the academy supplied for acts 01, 03 and the room.
    precisionMedia,
    mentorshipMedia,
    // The two /about carries: the demonstration at the top of the page and the
    // certificate beside the mission. Listed for the reason the classroom film
    // is listed above it, and because between them they are the whole argument
    // that page makes about who teaches there.
    demonstrationMedia,
    certificateMedia,
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

test("a ready before/after pair has both of its files, at the shared canvas", () => {
  // `ready` is what puts a pair on the page. If it is set and a file is
  // missing, the catalogue ships a broken image inside the slider that is
  // meant to be the discipline's proof, which is the worst place on the site
  // for one.
  //
  // The size check is the other half of the promise. Both frames of a pair are
  // mapped onto the same 900x620 canvas by `scripts/align-pair.swift` so the
  // eyes sit on the same pixels; a frame that is not that size was not run
  // through the script, and under a wipe two unaligned frames read as two
  // photographs of two different people rather than as one face.
  for (const [slug, pairs] of Object.entries(serviceGallery)) {
    for (const pair of pairs) {
      if (!pair.ready) continue;
      for (const src of [beforeSrc(pair.id), afterSrc(pair.id)]) {
        const file = `public${src}`;
        assert.ok(existsSync(file), `${slug}: ${pair.id} is ready but ${src} is missing`);
        const { width, height } = sizeOfJpeg(file);
        assert.equal(width, 900, `${src} is ${width}px wide, not the shared canvas`);
        assert.equal(height, 620, `${src} is ${height}px tall, not the shared canvas`);
      }
    }
  }
});

test("an unready pair points at nothing, so it cannot half ship", () => {
  // The inverse, and it catches the likelier mistake: files dropped into
  // public/brand/services and nobody remembering to set `ready`. That reads as
  // "the academy has no results for this discipline" on a page that is sitting
  // on two photographs.
  for (const [slug, pairs] of Object.entries(serviceGallery)) {
    for (const pair of pairs) {
      if (pair.ready) continue;
      const present = [beforeSrc(pair.id), afterSrc(pair.id)].filter((src) =>
        existsSync(`public${src}`),
      );
      assert.equal(
        present.length,
        0,
        `${slug}: ${pair.id} has files on disk but is not marked ready: ${present.join(", ")}`,
      );
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
    ...AUTHORITY.flatMap((k) => [
      `authority.items.${k}.value`,
      `authority.items.${k}.label`,
    ]),
    ...EXPERIENCE.flatMap((k) => [
      `experience.items.${k}.title`,
      `experience.items.${k}.body`,
    ]),
    ...RECEIVE.map((k) => `receive.items.${k}`),
    ...NOT_FOR.map((k) => `programs.notFor.items.${k}`),
    ...PROGRAM_LABELS.map((k) => `programs.labels.${k}`),
    ...PROGRAM_VALUES.map((k) => `programs.values.${k}`),
    // Read off `lib/pathway.ts` rather than listed, and off `tiers` rather than
    // `publishedTiers`: a tier that is built and switched off must still be
    // translated in all four languages, because the whole point of the flag is
    // that publishing it is one boolean rather than a translation job. Hiding a
    // tier is not a licence to let its copy rot.
    ...tiers.flatMap((tier) => [
      `pathway.tiers.${tier.key}.name`,
      `pathway.tiers.${tier.key}.level`,
      `pathway.tiers.${tier.key}.for`,
      `pathway.tiers.${tier.key}.body`,
    ]),
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
    // Theory is the classroom at the flipchart, practice is the demonstration on
    // a model. Each frame says what its chapter says, which is why the
    // demonstration is not on theory: a photograph of hands-on work beside the
    // words "before any hands-on work" argued with them.
    "method.steps.theory.alt",
    "method.steps.practice.alt",
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
    // The whole `catalog.gallery` namespace, which held three strings for
    // `ServiceGallery` alone: an empty slot's caption, and a second copy of
    // "before" and "after".
    //
    // The caption backed twenty four placeholder plates on the public
    // catalogue, each printing the internal file path it was waiting for.
    // `ServiceGallery` now renders a pair only when both its files exist, which
    // is the rule every other conditional surface on this site follows, and the
    // slot names live in `lib/service-gallery.ts` where whoever is renaming
    // shoot files is already working.
    //
    // The other two went when that component started using the site's own
    // `BeforeAfter` slider, which reads `success.before` and `success.after`.
    // Two namespaces holding the same two words in four languages is how they
    // end up saying different things in one of them.
    assert.equal(
      at(messages, "catalog.gallery"),
      undefined,
      `${locale} brought back the ServiceGallery-only copy of before/after`,
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

test("the programmes are the catalogue, and carry no fee field", () => {
  // One programme per course, in the catalogue's own order. A page that exists
  // for a discipline the catalogue does not list, or a discipline with no page,
  // is a broken link in the sitemap either way.
  assert.deepEqual(
    programs.map((p) => p.slug),
    courses.map((c) => c.slug),
  );
  for (const course of courses) {
    assert.ok(programBySlug(course.slug), `no programme for ${course.slug}`);
  }

  // Standing instruction from the academy: fees are quoted privately by Amira
  // and never displayed. The message catalogues are already guarded; this
  // guards the data layer, which is the other way a figure could reach a page.
  for (const program of programs) {
    for (const banned of ["price", "fee", "cost", "amount"]) {
      assert.equal(
        banned in (program as Record<string, unknown>),
        false,
        `${program.slug} carries a "${banned}" field`,
      );
      assert.equal(
        banned in (program.facts as Record<string, unknown>),
        false,
        `${program.slug}.facts carries a "${banned}" field`,
      );
    }
  }
});

test("nothing the academy has not supplied is filled in with a guess", () => {
  // The gates. Duration, outcomes, curriculum and student voices are all
  // absent from the official document, and every module that needs one renders
  // nothing while it is undefined. This test is what stops the gap being
  // closed with plausible copy: if a future edit sets one of these, it has to
  // come with the strings in all four languages, and deleting this assertion
  // has to be a deliberate act rather than a side effect.
  //
  // WHEN THE ACADEMY SUPPLIES REAL DATA: move that slug out of this loop
  // rather than deleting the test, and add its keys to the translation list
  // above so the four catalogues stay in step.
  for (const program of programs) {
    assert.equal(program.facts.durationKey, undefined, `${program.slug} invented a duration`);
    assert.equal(program.masters, undefined, `${program.slug} invented its outcomes`);
    assert.equal(program.curriculum, undefined, `${program.slug} invented a curriculum`);
    assert.equal(program.voices, undefined, `${program.slug} invented a testimonial`);
  }
});

test("an unconfirmed tier cannot reach a page", () => {
  // `publishedTiers` is the only export a component may render from, and it is
  // a filter rather than a styling flag: a tier the academy has not confirmed
  // is absent from the DOM, the navigation, the sitemap and the schema payload,
  // not merely hidden by CSS.
  for (const tier of publishedTiers) {
    assert.equal(tier.published, true, `${tier.key} is published but not confirmed`);
  }
  assert.ok(publishedTiers.length > 0, "the path has no levels on it");
  assert.ok(
    publishedTiers.length <= tiers.length,
    "publishedTiers is not a subset of tiers",
  );

  // The two the academy has stated it teaches, which are the two levels every
  // discipline is offered at. If either of these ever goes false, the ladder on
  // the homepage stops matching the FAQ, which says every technique is taught
  // at base and advanced level.
  const live = publishedTiers.map((t) => t.key);
  assert.ok(live.includes("foundations"), "the base level is not on the path");
  assert.ok(live.includes("advanced"), "the advanced level is not on the path");
});

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

/**
 * The results heading, in the client's own words, and the two keys that carry it.
 *
 * ONE HEADING, TWO PLACES, AND THEY MAY NOT DRIFT. `work.title` is the visible
 * one: it stands over the Microblading before/after sliders on the homepage.
 * `success.title` is the same heading on /courses, over the pairs
 * `lib/studio.ts` keeps on file, which is an empty array today so that section
 * renders nothing. The two are separate keys because they are separate
 * sections on separate pages, and they hold the same words because they name
 * the same thing. Written out per locale rather than derived from one another,
 * because a message catalogue has no aliases and a comment is not a check;
 * `the results heading is one form of words` below is the check.
 *
 * They are also the site's only sanctioned em dashes, which is the second
 * reason this lives here rather than inline: the exception is a fixed list of
 * eight exact strings, so a ninth em dash anywhere in any catalogue — a third
 * key, or either of these two reworded — still fails.
 */
const RESULTS_HEADING: Record<string, string> = {
  it: "Microblading — prima e dopo",
  en: "Microblading — before and after",
  fr: "Microblading — avant et après",
  ar: "المايكروبليدنغ — قبل وبعد",
};

/** Every key allowed to hold `RESULTS_HEADING`, and nothing else may. */
const HEADING_KEYS = ["work.title", "success.title"] as const;

test("the results heading is one form of words", () => {
  // The client signed off one wording for the results act. Two keys carry it,
  // and a page that ever showed both would print the same headline twice, so
  // the invariant is checked from two directions: the strings agree in every
  // language, and no page file reads more than one of the keys.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    for (const key of HEADING_KEYS) {
      assert.equal(
        at(messages, key),
        RESULTS_HEADING[locale],
        `${locale}.${key} is not the results heading the client signed off`,
      );
    }
  }

  // `work.title` is read by the homepage and `success.title` by the catalogue.
  // If a future edit points both at one page, that page renders the heading
  // twice, which is the specific thing this pass was asked to avoid.
  const pages = [
    "../app/[locale]/page.tsx",
    "../app/[locale]/courses/page.tsx",
    "../app/[locale]/courses/[slug]/page.tsx",
    "../app/[locale]/about/page.tsx",
  ];
  for (const page of pages) {
    const url = new URL(page, import.meta.url);
    if (!existsSync(url)) continue;
    const src = readFileSync(url, "utf8");
    const used = HEADING_KEYS.filter((key) => src.includes(`"${key}"`));
    assert.ok(
      used.length <= 1,
      `${page} reads ${used.join(" and ")}: one page, two copies of one heading`,
    );
  }
});

test("no em dash survived into the copy", () => {
  // The house rule is a comma or a colon. An em dash in a headline is the one
  // punctuation mark that reads as machine-written.
  //
  // The results heading is the standing exception and it is the client's own:
  // the delivery brief specified those strings verbatim, dash included, to name
  // the technique the pairs under the heading actually show. Copy the client
  // has written is not copy this rule is protecting them from.
  //
  // The exception is removed by key, not by pattern. Every other string in all
  // four catalogues is still held to the rule, including any future rewording
  // of these two, which `the results heading is one form of words` catches
  // first.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const copy = JSON.parse(JSON.stringify(messages)) as Record<
      string,
      Record<string, unknown>
    >;
    for (const key of HEADING_KEYS) {
      const [namespace, leaf] = key.split(".");
      delete copy[namespace]?.[leaf];
    }
    assert.equal(/[—–]/.test(JSON.stringify(copy)), false, `${locale} carries an em dash`);
  }
});

test("the founder's name is never misspelled in Arabic", () => {
  // "بكيني" is the Arabic spelling of "bikini". It shipped once, in the meta
  // description of all six Arabic course pages, crediting the academy to
  // "Amira Bikini". The name is "بشيني" everywhere, forever.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    assert.equal(
      JSON.stringify(messages).includes("بكيني"),
      false,
      `${locale} misspells Bechini as Bikini`,
    );
  }
});

test("Arabic prose carries no Latin commas", () => {
  // A "," directly after an Arabic letter is a typesetting slip; Arabic
  // clauses separate with "،". Latin spans inside ar.json (brand names,
  // PagoDIL, addresses) keep their own punctuation and are not matched here.
  assert.equal(
    /[؀-ۿ],/.test(JSON.stringify(ar)),
    false,
    "ar carries a Latin comma after an Arabic letter",
  );
});

test("the form that collects a name and an email links to a privacy notice", () => {
  // The contact form takes a name, an address, a subject and a message and
  // forwards them to the academy's inbox. That is personal data processed by
  // an Italian registered business, and a visitor is owed the notice before she
  // sends rather than after. The page, the footer link and the sentence under
  // the submit button are the three parts of that, and all three are strings:
  // if any of them is dropped in a future rewrite, this fails.
  for (const [locale, messages] of Object.entries(LOCALES)) {
    const m = messages as Record<string, Record<string, unknown>>;
    assert.ok(m.privacy, `${locale} has no privacy notice`);
    assert.ok(m.footer.privacy, `${locale} footer does not link the privacy notice`);
    assert.ok(m.contact.privacyNote, `${locale} form states nothing before sending`);
    assert.ok(m.contact.privacyLink, `${locale} form does not link the notice`);

    // The notice has to answer the questions it exists to answer. A page that
    // says less than this is decoration.
    for (const section of [
      "controller",
      "data",
      "purpose",
      "basis",
      "recipients",
      "retention",
      "cookies",
      "rights",
      "contact",
    ]) {
      const s = (m.privacy.sections as Record<string, { title: string; body: string }>)[
        section
      ];
      assert.ok(s?.title && s?.body, `${locale} privacy notice is missing "${section}"`);
    }
  }
});

test("the certified mailbox is not published as a way to write to the academy", () => {
  // An Italian PEC rejects ordinary mail. It used to be printed on /contact and
  // in the privacy notice under a label naming the channel, on the reasoning
  // that a registered business publishes it and a rights request goes there.
  // The label warned a visitor, but the row still offered her an address that
  // bounces, and a data subject exercising a right under the Regulation had to
  // already hold a PEC of her own to use it.
  //
  // Both places now print `studio.email`, the ordinary inbox, which is what the
  // footer has always carried. `studio.pec` stays in lib/studio.ts as a fact
  // about the registered business; nothing renders it.
  const pages = new URL("../app/[locale]/", import.meta.url);
  for (const page of ["contact/page.tsx", "privacy/page.tsx"]) {
    const src = readFileSync(new URL(page, pages), "utf8");
    assert.equal(
      /studio\.pec/.test(src),
      false,
      `${page} publishes the PEC, which rejects the mail it invites`,
    );
    assert.match(
      src,
      /mailto:\$\{studio\.email\}/,
      `${page} prints no address that reaches the academy`,
    );
  }

  // And it is not the organisation's `email` in structured data either, where a
  // machine would read it as the way to write to the business.
  const schema = readFileSync(new URL("./seo.tsx", import.meta.url), "utf8");
  assert.equal(
    /^\s*email:\s*studio\.pec/m.test(schema),
    false,
    "schema.org publishes the PEC as the organisation's email",
  );
});

test("a broken link can reach the site's own 404, in every language", () => {
  // `[locale]/not-found.tsx` is only reachable because `[locale]/[...rest]`
  // throws into it: without that route an unmatched URL never enters the locale
  // segment and Next serves its own black-on-white default instead. The page is
  // also a client component reading `notFound` through the provider, because a
  // not-found boundary is handed no params and `getTranslations()` there has
  // nothing to resolve against. Three things, each of which silently undoes the
  // custom 404 on its own.
  const here = new URL("../app/[locale]/", import.meta.url);
  assert.ok(
    existsSync(new URL("[...rest]/page.tsx", here)),
    "no catch-all route, so unmatched URLs get the framework default 404",
  );

  const notFound = readFileSync(new URL("not-found.tsx", here), "utf8");
  assert.match(notFound, /^"use client";/, "the 404 page is not a client component");
  // The import, not the word: the file's own note explains why
  // `getTranslations` is the wrong call here, so matching the bare name would
  // fail on the explanation.
  assert.equal(
    /from "next-intl\/server"/.test(notFound),
    false,
    "the 404 page reads translations off a request that carries no locale",
  );

  const layout = readFileSync(new URL("layout.tsx", here), "utf8");
  assert.match(
    layout,
    /"notFound"/,
    "notFound is not in CLIENT_NAMESPACES, so the 404 renders its own message keys",
  );

  for (const [locale, messages] of Object.entries(LOCALES)) {
    const m = messages as Record<string, Record<string, unknown>>;
    assert.ok(m.notFound.title && m.notFound.body, `${locale} has no 404 copy`);
  }
});
