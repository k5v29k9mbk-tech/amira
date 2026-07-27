// ponytail: courses live in code, not a CMS. Swap for Sanity/Payload when a
// non-developer needs to edit them. Copy that varies by language lives in
// messages/*.json under `catalog.<slug>`; structure and pricing live here.

export type Lesson = {
  id: string;
  minutes: number;
  /** Mux playback ID. Empty string renders the preview-locked state. */
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
  modules: Module[];
};

const lesson = (id: string, minutes: number, playbackId = "", free = false): Lesson => ({
  id,
  minutes,
  playbackId,
  free,
});

export const courses: Course[] = [
  {
    slug: "brow-architecture",
    priceId: process.env.STRIPE_PRICE_BROW ?? "price_brow_architecture",
    priceEur: 890,
    hours: 9,
    image: "https://picsum.photos/seed/amira-brow-architecture-studio/1600/1200",
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
        lessons: [
          lesson("hair-stroke", 42),
          lesson("shading", 38),
          lesson("correction", 35),
        ],
      },
      {
        id: "aftercare",
        lessons: [lesson("healing", 22), lesson("retouch", 26)],
      },
    ],
  },
  {
    slug: "lash-couture",
    priceId: process.env.STRIPE_PRICE_LASH ?? "price_lash_couture",
    priceEur: 740,
    hours: 7,
    image: "https://picsum.photos/seed/amira-lash-couture-portrait/1600/1200",
    modules: [
      {
        id: "foundations",
        lessons: [lesson("anatomy", 19, "", true), lesson("adhesive", 24)],
      },
      {
        id: "technique",
        lessons: [
          lesson("classic-set", 44),
          lesson("volume-fans", 51),
          lesson("mega-volume", 47),
        ],
      },
      {
        id: "aftercare",
        lessons: [lesson("retention", 28), lesson("removal", 21)],
      },
    ],
  },
  {
    slug: "permanent-makeup",
    priceId: process.env.STRIPE_PRICE_PMU ?? "price_permanent_makeup",
    priceEur: 1290,
    hours: 14,
    image: "https://picsum.photos/seed/amira-permanent-makeup-atelier/1600/1200",
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
        lessons: [
          lesson("lip-blush", 56),
          lesson("eyeliner", 48),
          lesson("colour-correction", 52),
        ],
      },
      {
        id: "aftercare",
        lessons: [lesson("healing-cycles", 30), lesson("complications", 37)],
      },
    ],
  },
  {
    slug: "atelier-business",
    priceId: process.env.STRIPE_PRICE_BUSINESS ?? "price_atelier_business",
    priceEur: 560,
    hours: 6,
    image: "https://picsum.photos/seed/amira-atelier-business-desk/1600/1200",
    modules: [
      {
        id: "foundations",
        lessons: [lesson("positioning", 26, "", true), lesson("pricing", 34)],
      },
      {
        id: "technique",
        lessons: [lesson("photography", 39), lesson("client-journey", 31)],
      },
      {
        id: "aftercare",
        lessons: [lesson("retention-systems", 28), lesson("scaling", 33)],
      },
    ],
  },
];

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug);

export const allLessons = (course: Course) =>
  course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));

export const lessonCount = (course: Course) => allLessons(course).length;

/** Percentage 0-100 of a course completed, given a set of completed lesson ids. */
export const progressPercent = (course: Course, completed: Set<string>) => {
  const lessons = allLessons(course);
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => completed.has(l.id)).length;
  return Math.round((done / lessons.length) * 100);
};

export const nextLesson = (course: Course, completed: Set<string>) =>
  allLessons(course).find((l) => !completed.has(l.id)) ?? allLessons(course)[0];
