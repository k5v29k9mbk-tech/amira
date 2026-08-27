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
export const programs: Program[] = courses.map((course) => ({
  ...course,
  facts: {},
}));

export const programBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);

/**
 * THERE IS NO PER-DISCIPLINE RESULTS SET, AND THAT IS A DELIBERATE REFUSAL.
 *
 * The obvious thing for a programme page to do is show the academy's results
 * for that discipline: brow photographs on the brow pages, a lip photograph on
 * the lip page. An earlier draft of this file did exactly that, keyed by family.
 *
 * It cannot be done honestly, and `media.ts` already says why, at the `caption`
 * field on the Frame type: the site does not know which treatment produced any
 * given result photograph, so a caption naming one "would be a guess printed
 * under someone's face". The same is true of a section heading. The published
 * alt text establishes the area treated, brows or lips, and no more than that.
 * Microblading and powder brows are two different techniques that produce a
 * brow, so a brow photograph under either page's name asserts something nobody
 * has confirmed, and a permanent makeup brow shown on the brow lamination page,
 * which is not permanent makeup at all, would be plainly wrong.
 *
 * So every programme page shows the same set, under a heading that claims what
 * is true of all of it: this is the standard you are training towards. It is
 * the academy's own client work, photographed in its own studio, and it is
 * evidence of what the teaching produces without pretending to be a portfolio
 * of one course.
 *
 * If the academy ever supplies results tagged by the treatment that produced
 * them, this is where that mapping goes, and the heading can then say so.
 */
