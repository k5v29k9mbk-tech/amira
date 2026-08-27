// ponytail: the catalogue lives in code, not a CMS. Swap for Sanity/Payload
// when a non-developer needs to edit it.
//
// The academy supplied six course names and one shared set of facts that apply
// to all of them (variable duration, price on request, base and advanced
// levels, theory + practice + live model + post-course support, kit on request,
// certificate, 3-4 students, taught in Italian). It supplied no per-course
// price or syllabus, so there is none here: the shared facts are stated once,
// in `catalog.*`, on the courses page.
//
// Names live in messages/*.json under `catalog.courses.<slug>` and the one-line
// description of each discipline under `catalog.blurbs.<slug>`. Those blurbs
// describe the technique itself, not the academy's version of it, so they carry
// no claim the academy has not made.
//
// `media` is a Media object (see lib/media.ts): set `videoSrc` on any course to
// give its expanded panel a muted clip instead of a still.

import type { Media } from "./media";

/**
 * The three families the six courses fall into, in the order the courses page
 * prints them.
 *
 * This is a grouping, not a reordering: `courses` below stays in the exact
 * sequence the academy published it in, because that order is asserted in
 * courses.test.ts and is what the homepage catalogue and the selector read. The
 * families are applied at render time, so the same six entries can be listed
 * flat in one place and grouped in another without either being a fork of the
 * other.
 *
 * Brows first because it is the largest of the three and the reason most
 * enquiries arrive, and because it is the family a visitor most needs help
 * telling apart: microblading and powder brows are both permanent and are
 * routinely confused with one another, and brow lamination is not permanent at
 * all. The family's standfirst says exactly that, and Powder Brows keeps its
 * own section below the catalogue on top of its row here.
 */
export const families = ["brows", "lips", "eyes", "lashes"] as const;

export type Family = (typeof families)[number];

export type Course = {
  slug: string;
  /** Which of the four groups the courses page lists this course under. */
  family: Family;
  media: Media;
  /**
   * Keep the course in the homepage catalogue but stand its photograph down
   * there. The row keeps its number, name, blurb, level and link, and the
   * courses page still ships the poster, so nothing about the course changes
   * except which of the two pages prints its frame.
   *
   * Set on brow-lamination while the academy replaces the supplied photograph.
   * Delete the flag when the new one lands and the homepage prints it again.
   */
  posterOffHome?: true;
};

export const courses: Course[] = [
  {
    /**
     * The clip that used to hang off this panel has gone to the method section,
     * where it belongs: the poster here was a healed brow and the clip was a
     * needle, so opening the panel cross-faded between two unrelated pictures.
     * A catalogue panel wants the outcome of the discipline it names, and a
     * hair-stroke macro is exactly that.
     */
    slug: "microblading",
    family: "brows",
    media: {
      posterSrc: "/brand/brow-macro.jpg",
      position: "50% 45%",
      width: 371,
      height: 295,
    },
  },
  {
    slug: "powder-brows",
    family: "brows",
    media: {
      posterSrc: "/brand/powder-brows-result.jpg",
      position: "50% 35%",
      width: 1350,
      height: 1800,
    },
  },
  {
    slug: "lip-blush",
    family: "lips",
    media: {
      posterSrc: "/brand/lip-blush-result.jpg",
      position: "50% 50%",
      width: 1350,
      height: 1800,
    },
  },
  {
    slug: "eyeliner-pmu",
    family: "eyes",
    media: {
      posterSrc: "/brand/eyeliner-pmu-result.jpg",
      position: "50% 50%",
      width: 1800,
      height: 1350,
    },
  },
  {
    slug: "lash-lamination",
    family: "lashes",
    media: {
      posterSrc: "/brand/lash-lamination-result.jpg",
      position: "50% 50%",
      width: 1063,
      height: 1400,
    },
  },
  {
    slug: "brow-lamination",
    family: "brows",
    posterOffHome: true,
    media: {
      posterSrc: "/brand/brow-lamination-result.jpg",
      position: "50% 50%",
      width: 1800,
      height: 1350,
    },
  },
];

/** What every course includes, exactly as the academy states it. */
export const included = ["theory", "practice", "model", "support"] as const;

/** The method, in the order the academy teaches it. Media in lib/media.ts. */
export const chapters = ["theory", "practice", "model", "support"] as const;
