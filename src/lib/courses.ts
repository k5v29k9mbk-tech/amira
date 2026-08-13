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

export type Course = {
  slug: string;
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
    slug: "microblading",
    media: {
      videoSrc: "/brand/mapping.mp4",
      posterSrc: "/brand/brow-macro.jpg",
      position: "50% 45%",
      width: 371,
      height: 295,
    },
  },
  {
    slug: "powder-brows",
    media: {
      posterSrc: "/brand/brows-healed-hero.jpg",
      position: "50% 36%",
      width: 1179,
      height: 884,
    },
  },
  {
    slug: "lip-blush",
    media: {
      posterSrc: "/brand/lips-neutralization.jpg",
      position: "50% 45%",
      width: 232,
      height: 300,
    },
  },
  {
    slug: "eyeliner-pmu",
    media: {
      posterSrc: "/brand/brows-eyes.jpg",
      position: "50% 42%",
      width: 235,
      height: 300,
    },
  },
  {
    slug: "lash-lamination",
    media: {
      posterSrc: "/brand/live-demo.jpg",
      position: "50% 40%",
      width: 557,
      height: 335,
    },
  },
  {
    slug: "brow-lamination",
    posterOffHome: true,
    media: {
      posterSrc: "/brand/brow-mapping.jpg",
      position: "50% 50%",
      width: 332,
      height: 295,
    },
  },
];

/** What every course includes, exactly as the academy states it. */
export const included = ["theory", "practice", "model", "support"] as const;

/** The method, in the order the academy teaches it. Media in lib/media.ts. */
export const chapters = ["theory", "practice", "model", "support"] as const;
