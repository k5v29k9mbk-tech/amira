/**
 * The programme layer: what a single course page is allowed to say.
 *
 * `courses.ts` stays the catalogue — six slugs, their family, their poster —
 * and is what the homepage selector and the tests read. This file is the
 * per-programme detail that a dedicated page needs and the catalogue never
 * carried, and it exists as a separate module for one reason: almost all of it
 * is missing, and missing has to be a shape the page can read rather than a
 * gap someone fills in with plausible copy.
 *
 * WHAT THE ACADEMY HAS ACTUALLY SUPPLIED, AND WHAT IT HAS NOT.
 *
 * Supplied, in the official document, for every course without exception:
 *
 *   level        base and advanced
 *   language     Italian
 *   class size   3 to 4 students
 *   certificate  issued on completion
 *   live model   where the course schedules one
 *   location     across Italy
 *   included     theory, practice, live model where scheduled, support after
 *
 * Those are the shared conditions. They are true of all six and are stated
 * once, in `catalog.*`, which is where this file reads them from rather than
 * restating them six times and letting the six drift apart.
 *
 * Not supplied, for any course: duration in days, a syllabus, a day-by-day
 * schedule, a fee, a specific city, a date. Every one of those is a field
 * below, every one of them is optional, and every module on the page that
 * needs one renders nothing while it is undefined. That is the whole design.
 * A page with four modules of real information is a premium page; the same
 * page with eleven modules, seven of them invented, is a liability the academy
 * has to answer for on the phone.
 *
 * THE FEE IS NOT A GATED FIELD, IT IS ABSENT. There is deliberately no `price`
 * here and there must never be one. The academy's standing instruction is that
 * fees are quoted privately by Amira and never displayed, `courses.test.ts`
 * enforces it against the message catalogues in all four languages, and the
 * action on every programme page asks for the details rather than showing a
 * figure. Adding a price field to this type is the one change to this file
 * that would break a promise to the client.
 *
 * HOW TO FILL ONE IN. Everything optional below is keyed off the message
 * catalogues, not written here: this file says a module exists and how many
 * entries it has, and `messages/*.json` says what they read. So adding a
 * curriculum means adding the day count here and the day titles and module
 * lines to all four locales, which is exactly the coupling that stops a
 * syllabus shipping in Italian and nowhere else.
 */

// `.ts` on the specifier, deliberately. `tsconfig` sets
// `allowImportingTsExtensions`, and it is what lets `courses.test.ts` import
// this module under the node test runner, which resolves specifiers literally
// and cannot find an extensionless one. The gating contract in this file is
// the thing most worth having under test, so it has to be importable there.
import { courses, type Course } from "./courses.ts";
import {
  browsDefinedFrame,
  browsDefinedPortraitFrame,
  browsPairFrame,
  resultFrames,
  type Media,
  type ResultFrame,
  // `.ts` on the specifier for the same reason `./courses.ts` above carries
  // one: this import used to be `import type`, erased before it ever ran, and
  // it now pulls real values. `courses.test.ts` imports this module under the
  // node test runner, which resolves specifiers literally.
} from "./media.ts";

/**
 * Facts that vary per programme.
 *
 * All optional, all currently unset, all rendered by `KeyInfo` only when
 * present. The shared facts that apply to every course are NOT here: they come
 * from `catalog.details.*` so that the six cannot disagree with each other.
 */
export type ProgramFacts = {
  /**
   * Duration, as a message key under `programs.durations.*`, never as a
   * literal. The academy states only that duration "varies by course"; until
   * it names one, the key stays undefined and the Duration row is absent from
   * the key-information module rather than reading "varies", which is what the
   * shared conditions already say two sections above it.
   */
  durationKey?: string;
  /**
   * The city or region a programme actually runs in, as a message key under
   * `programs.locations.*`. Undefined falls back to the academy's stated reach
   * (across Italy), which is true of all six.
   */
  locationKey?: string;
};

export type Program = Course & {
  facts: ProgramFacts;
  /**
   * The photograph that opens this programme's own page, when the academy has
   * supplied one that is about the treatment rather than about the discipline.
   *
   * `media` on the course stays what it is: the catalogue poster, printed on
   * the homepage row and on the courses page, and it is not touched by this.
   * This is the one frame below the facts on the detail page, and it exists as
   * a separate field for the reason the whole file exists: a picture chosen to
   * open a page a reader has already chosen is doing a different job from a
   * picture chosen to make her choose, and the two are allowed to differ.
   *
   * The frame reads its own shape from `width`/`height`. A portrait photograph
   * is not printed into the landscape band the catalogue posters use, because
   * a 21:9 crop of a 4:5 photograph keeps a fifth of it; it is centred at its
   * own ratio instead, full width on a phone and in a column above it.
   *
   * Undefined and the page prints `media` in the landscape band, which is what
   * five of the six do.
   */
  heroMedia?: Media;
  /**
   * How many outcome lines the programme publishes, read as
   * `programs.masters.<slug>.<n>`. Undefined and the "what you will master"
   * module does not render.
   *
   * This is a count rather than an array of strings because the strings live
   * in the four message catalogues; the count is what tells the page how many
   * to ask for and what tells `courses.test.ts` how many translations to
   * require.
   */
  masters?: number;
  /**
   * The curriculum, as days and the number of modules in each. Read as
   * `programs.curriculum.<slug>.d<i>.title` and `.m<n>`.
   *
   * Undefined and both the curriculum and the day-by-day schedule are absent:
   * they are the same data at two levels of detail, and a schedule without a
   * curriculum above it is a timetable for a course whose contents have not
   * been stated.
   */
  curriculum?: { modules: number }[];
  /**
   * Whether the programme publishes its own student voices, read as
   * `programs.voices.<slug>.*`. Nothing here yet, and nothing may be written
   * here that a student has not consented to in writing: the site-wide rule is
   * in `Testimonial.tsx` and is enforced by name in `courses.test.ts`.
   */
  voices?: number;
  /**
   * The photographs this programme's own results section prints, in order.
   *
   * EMPTY IS THE DEFAULT AND IT IS A STATEMENT. Three of the six have no
   * result photograph the academy has attributed to them, and until one exists
   * the honest set is none: `WorkGallery` renders nothing for an empty array
   * and the page drops the whole act rather than heading a band of brow
   * photographs on the Lip Blush page.
   *
   * WHAT THIS REPLACED. Every one of the six printed `resultFrames`, the
   * homepage set, which is three brow photographs. So Lip Blush proved itself
   * with eyebrows, Eyeliner PMU showed no eyeliner and Lash Lamination showed
   * no lashes — under a heading saying this is the result you are training
   * towards. The set was shared because the academy has never said which
   * technique produced which photograph, and the answer to that is to show
   * fewer photographs, not to show the wrong ones.
   *
   * DROPPING REAL PHOTOGRAPHS IN LATER TOUCHES NOTHING BUT THIS FILE. A frame
   * is a `ResultFrame` from lib/media.ts: a file, an alt key, the columns it
   * occupies and its own aspect ratio. Add the entry to the array for its slug,
   * add `work.alt.<altKey>` to the four catalogues, and the page prints it.
   * No component knows which course it is rendering.
   */
  gallery: ResultFrame[];
};

/**
 * Opening photographs supplied for a single programme, keyed by slug.
 *
 * Microblading is the only one so far: three stages of one client's brows in a
 * single frame — grown out, mapped, and healed — which is the treatment's whole
 * argument in one picture and is worth more at the top of its page than the
 * catalogue's healed-brow poster, which is still what the homepage prints.
 *
 * The photograph is 4:5 and is shown at 4:5. Nothing is stretched and nothing
 * is cropped away: at that ratio `object-fit: cover` has nothing to cut, so all
 * three stages survive on a phone as well as on a desktop.
 */
const heroMedia: Record<string, Media> = {
  microblading: {
    posterSrc: "/brand/microblading-hero-stages.jpg",
    alt: "Three stages of one client's brows in a single frame: grown out, mapped, and healed after microblading.",
    position: "50% 50%",
    width: 1600,
    height: 2000,
  },
};

/**
 * The six, in the catalogue's own order, each carrying an empty fact set.
 *
 * Every optional field above is deliberately omitted rather than set to a
 * plausible value. When Amira supplies a syllabus for, say, Lip Blush, this is
 * where it lands:
 *
 *   { slug: "lip-blush", ..., masters: 5, curriculum: [{ modules: 4 }, { modules: 5 }] }
 *
 * and the four catalogues gain `programs.masters.lip-blush.0` through `.4` and
 * `programs.curriculum.lip-blush.d0.title` and so on. Nothing else changes:
 * the page is already built for both modules and shows them the moment the
 * data is there.
 */
/**
 * The results each programme is allowed to print, keyed by slug.
 *
 * MICROBLADING keeps the homepage set. It is the one discipline with pairs the
 * academy has attributed by name (lib/service-gallery.ts), so the brow
 * photographs beside them are on topic and the portrait among them may say so.
 *
 * POWDER BROWS and BROW LAMINATION keep the two brow results and swap the
 * third. `browsPairFrame` and `browsDefinedFrame` are brow outcomes whose alt
 * text names no technique, so they carry across; `microbladingPortraitFrame`
 * says "Microblading" in four languages and cannot. `browsDefinedPortraitFrame`
 * takes its slot with an alt that claims only what the photograph shows.
 *
 * LIP BLUSH, EYELINER PMU and LASH LAMINATION get nothing, because nothing on
 * file is a lip, an eyeliner or a lash result the academy has attributed. Three
 * eyebrow photographs on the Lip Blush page were not weak evidence, they were
 * evidence for a different course, and the page is better without the section
 * than with someone else's work in it. This is the same refusal the note at the
 * foot of this file has always described, applied one level finer: it used to
 * mean every page shows the same set, and it now means a page shows its own set
 * or none.
 */
const gallery: Record<string, ResultFrame[]> = {
  microblading: resultFrames,
  "powder-brows": [browsPairFrame, browsDefinedFrame, browsDefinedPortraitFrame],
  "brow-lamination": [browsPairFrame, browsDefinedFrame, browsDefinedPortraitFrame],
  "lip-blush": [],
  "eyeliner-pmu": [],
  "lash-lamination": [],
};

export const programs: Program[] = courses.map((course) => ({
  ...course,
  facts: {},
  // `?? []` rather than a lookup that may be undefined: a course added to the
  // catalogue without an entry above shows no results, which is the safe
  // direction. The unsafe direction is the one this replaced, where a new
  // course silently inherited three brow photographs.
  gallery: gallery[course.slug] ?? [],
  ...(heroMedia[course.slug] ? { heroMedia: heroMedia[course.slug] } : {}),
}));

export const programBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);

/**
 * WHAT `gallery` ABOVE MAY AND MAY NOT CLAIM, WHICH IS THE WHOLE OF THE RULE.
 *
 * The obvious thing for a programme page to do is show the academy's results
 * for that discipline: brow photographs on the brow pages, a lip photograph on
 * the lip page. For a long time this file refused to do it at all and every
 * page printed one shared set, because `media.ts` says at the `caption` field
 * on the Frame type that the site does not know which treatment produced any
 * given result photograph, and a caption naming one "would be a guess printed
 * under someone's face".
 *
 * That refusal was right about the guess and wrong about the remedy. Showing
 * three brow photographs on the Lip Blush page does not avoid the guess, it
 * makes a worse one: it tells a reader who came for lips that this is the
 * result she is training towards. `gallery` is now per slug, and the rule the
 * refusal was protecting is enforced by what may go in it rather than by
 * giving every page the same contents.
 *
 * THE RULE. A frame may sit under a discipline only if what it asserts is true
 * on that page. The published alt text establishes the area treated, brows or
 * lips, and no more than that, so a brow photograph whose alt names no
 * technique is admissible on any brow page. A frame whose alt names a
 * technique may appear only on that technique's page: `microbladingPortrait`
 * says Microblading in four languages and is therefore on one page and not
 * three. And an empty array is always available and always honest, which is
 * what the three disciplines with no attributed result of their own get.
 *
 * The heading above the set still claims only what is true of all of it: this
 * is the standard you are training towards. It is the academy's own client
 * work, photographed in its own studio. If the academy supplies results tagged
 * by the treatment that produced them, they go in `gallery` under that slug
 * and the heading can then say so.
 */
