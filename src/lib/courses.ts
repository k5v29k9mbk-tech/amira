// ponytail: courses live in code, not a CMS. Swap for Sanity/Payload when a
// non-developer needs to edit them. Copy that varies by language lives in
// messages/*.json under `catalog.<slug>`; structure and pricing live here.
//
// The three courses mirror what the studio actually trains and certifies:
// brow artistry, the two-day lip masterclass, and the one-to-one VIP intensive.
//
// Lesson ids must be UNIQUE ACROSS ALL COURSES. The dashboard reads one flat set
// of completed ids, so a shared id would count progress twice. courses.test.ts
// enforces this.

export type Lesson = {
  id: string;
  minutes: number;
  /** Mux playback ID. Empty string renders the "video uploading" state. */
  playbackId: string;
  free?: boolean;
};

export type Module = {
  id: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  /** Stripe Price ID, set in .env or the Stripe dashboard. */
  priceId: string;
  priceEur: number;
  hours: number;
  image: string;
  /** Extra stills for the course page and the results strip. */
  gallery: string[];
};

type Draft = Omit<Course, "modules"> & { modules: Module[] };

const lesson = (id: string, minutes: number, playbackId = "", free = false): Lesson => ({
  id,
  minutes,
  playbackId,
  free,
});

export const courses: (Course & { modules: Module[] })[] = [
  {
    slug: "brow-artistry",
    priceId: process.env.STRIPE_PRICE_BROW ?? "price_brow_artistry",
    priceEur: 890,
    hours: 9,
    image: "/brand/brows-healed-hero.jpg",
    gallery: ["/brand/brow-mapping.jpg", "/brand/brow-macro.jpg", "/brand/brows-eyes.jpg"],
    modules: [
      {
        id: "foundations",
        lessons: [
          lesson("morphology", 24, "", true),
          lesson("mapping", 31),
          lesson("pigment-theory", 27),
        ],
      },
      {
        id: "technique",
        lessons: [lesson("hair-stroke", 42), lesson("shading", 38), lesson("correction", 35)],
      },
      {
        id: "aftercare",
        lessons: [lesson("healing", 22), lesson("retouch", 26)],
      },
    ],
  },
  {
    slug: "lip-blush",
    priceId: process.env.STRIPE_PRICE_LIP ?? "price_lip_blush",
    priceEur: 1290,
    hours: 12,
    image: "/brand/lips-result-hero.jpg",
    gallery: ["/brand/lips-neutralization.jpg", "/brand/at-work.jpg"],
    modules: [
      {
        id: "foundations",
        lessons: [
          lesson("skin-science", 33, "", true),
          lesson("hygiene", 29),
          lesson("device-setup", 25),
        ],
      },
      {
        id: "technique",
        lessons: [lesson("lip-blush", 56), lesson("colour-correction", 52)],
      },
      {
        id: "aftercare",
        lessons: [lesson("healing-cycles", 30), lesson("complications", 37)],
      },
    ],
  },
  {
    slug: "vip-training",
    priceId: process.env.STRIPE_PRICE_VIP ?? "price_vip_training",
    priceEur: 1890,
    hours: 8,
    image: "/brand/live-demo.jpg",
    gallery: ["/brand/practice-latex.jpg", "/brand/at-work.jpg"],
    modules: [
      {
        id: "foundations",
        lessons: [lesson("consultation", 28, "", true)],
      },
      {
        id: "technique",
        lessons: [
          lesson("live-demo", 64),
          lesson("latex-practice", 46),
          lesson("model-session", 71),
        ],
      },
      {
        id: "aftercare",
        lessons: [lesson("portfolio-shot", 33), lesson("launch-plan", 39)],
      },
    ],
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

export const allLessons = (course: { modules: Module[] }) =>
  course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));

export const lessonCount = (course: { modules: Module[] }) => allLessons(course).length;

/** Percentage 0-100 of a course completed, given a set of completed lesson ids. */
export const progressPercent = (course: { modules: Module[] }, completed: Set<string>) => {
  const lessons = allLessons(course);
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completed.has(l.id)).length;
  return Math.round((done / lessons.length) * 100);
};

export const nextLesson = (course: { modules: Module[] }, completed: Set<string>) =>
  allLessons(course).find((l) => !completed.has(l.id)) ?? allLessons(course)[0];

/** Every still the studio has supplied, for the results strip. */
export const resultStills = [
  "/brand/brow-macro.jpg",
  "/brand/brow-mapping.jpg",
  "/brand/lips-neutralization.jpg",
  "/brand/brows-eyes.jpg",
  "/brand/practice-latex.jpg",
  "/brand/at-work.jpg",
];

export type { Draft };
