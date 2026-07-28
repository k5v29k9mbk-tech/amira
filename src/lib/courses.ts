// ponytail: the catalogue lives in code, not a CMS. Swap for Sanity/Payload
// when a non-developer needs to edit it.
//
// The academy supplied six course names and one shared set of facts that apply
// to all of them (variable duration, price on request, base and advanced
// levels, theory + practice + live model + post-course support, kit on request,
// certificate, 3-4 students, taught in Italian). It supplied no per-course
// description, price or syllabus, so there is deliberately none here: the
// shared facts are stated once, in `catalog.*`, on the courses page.
//
// Names are translated in messages/*.json under `catalog.courses.<slug>`.
// Images are decorative studio photographs (alt=""), not claims about a course.

export type Course = {
  slug: string;
  image: string;
};

export const courses: Course[] = [
  { slug: "microblading", image: "/brand/brow-macro.jpg" },
  { slug: "powder-brows", image: "/brand/brows-healed-hero.jpg" },
  { slug: "lip-blush", image: "/brand/lips-result-hero.jpg" },
  { slug: "eyeliner-pmu", image: "/brand/brows-eyes.jpg" },
  { slug: "lash-lamination", image: "/brand/at-work.jpg" },
  { slug: "brow-lamination", image: "/brand/brow-mapping.jpg" },
];

/** What every course includes, exactly as the academy states it. */
export const included = ["theory", "practice", "model", "support"] as const;

/** Every still the academy has supplied, for the gallery. */
export const resultStills = [
  "/brand/brow-macro.jpg",
  "/brand/brow-mapping.jpg",
  "/brand/lips-neutralization.jpg",
  "/brand/brows-eyes.jpg",
  "/brand/practice-latex.jpg",
  "/brand/at-work.jpg",
  "/brand/group-training.jpg",
];
