/**
 * Every piece of art direction on the site, in one file.
 *
 * A `Media` object is the only thing the page components know about: they never
 * hardcode a path, a crop or an overlay. To swap a still for a clip, set
 * `videoSrc` (and `mobileVideoSrc` if the vertical cut differs) and leave the
 * poster in place. `MediaFrame` handles the rest: the poster is always rendered
 * and always the LCP candidate, the video layers over it once it can play, and
 * under `prefers-reduced-motion` the video never loads at all.
 *
 * `position` is a CSS object-position. Faces and brows sit high in most of the
 * academy's photographs, so several crops pull upward rather than centring.
 */
export type Media = {
  /** Full-bleed clip. Leave null to ship the poster alone. */
  videoSrc?: string | null;
  /** Vertical cut of the same clip. Falls back to videoSrc. */
  mobileVideoSrc?: string | null;
  posterSrc: string;
  /** Empty string for decorative media; a sentence when it carries meaning. */
  alt?: string;
  /** object-position, desktop. */
  position?: string;
  /** object-position, below 768px. */
  mobilePosition?: string;
  /** 0-100. Espresso scrim strength over the media, for copy legibility. */
  overlay?: number;
  /** Intrinsic size, so the poster reserves its space and never shifts. */
  width?: number;
  height?: number;
};

/**
 * Homepage hero.
 *
 * TODO(academy): drop the abstract pigment/glass clip in here when it is
 * graded. `videoSrc` is the 16:9 cut, `mobileVideoSrc` the 9:16 one. Nothing
 * else has to change: the poster below stays as the fallback and the
 * reduced-motion frame.
 */
export const heroMedia: Media = {
  videoSrc: null,
  mobileVideoSrc: null,
  posterSrc: "/brand/amira-hero.jpg",
  alt: "",
  position: "50% 28%",
  mobilePosition: "58% 24%",
  overlay: 34,
  width: 2560,
  height: 1429,
};

/** Closing frame. The pigment macro is the one abstract clip the academy owns. */
export const closingMedia: Media = {
  videoSrc: "/brand/pigment.mp4",
  posterSrc: "/brand/pigment-poster.jpg",
  alt: "",
  position: "50% 45%",
  overlay: 52,
  width: 464,
  height: 656,
};

/** Founder portrait. Real photography, never generated. */
export const founderMedia: Media = {
  posterSrc: "/brand/amira-studio.jpg",
  position: "52% 22%",
  width: 1200,
  height: 1600,
};

/** One frame per method chapter, keyed by the chapter's message key. */
export const methodMedia: Record<string, Media> = {
  theory: {
    posterSrc: "/brand/mapping-poster.jpg",
    alt: "",
    position: "50% 40%",
    width: 480,
    height: 768,
  },
  practice: {
    posterSrc: "/brand/group-training.jpg",
    alt: "",
    position: "50% 42%",
    width: 1800,
    height: 1004,
  },
  model: {
    posterSrc: "/brand/at-work.jpg",
    alt: "",
    position: "48% 38%",
    width: 1800,
    height: 1004,
  },
  support: {
    posterSrc: "/brand/amira-hero.jpg",
    alt: "",
    position: "50% 26%",
    width: 2560,
    height: 1429,
  },
};

/**
 * The editorial gallery: six frames, mixed proportions, deliberately not a grid
 * of squares. `span` is the column span at lg, `ratio` the aspect the frame is
 * cropped to, so the composition is data rather than markup.
 *
 * students-certificates.jpg is deliberately absent. It shows identifiable
 * students and their certificate numbers and stays out of every page until the
 * academy holds written consent.
 */
export const galleryFrames: (Media & { span: string; ratio: string })[] = [
  {
    posterSrc: "/brand/brow-macro.jpg",
    span: "lg:col-span-5 lg:col-start-1",
    ratio: "4 / 5",
    position: "50% 45%",
    width: 371,
    height: 295,
  },
  {
    posterSrc: "/brand/lips-result-hero.jpg",
    span: "lg:col-span-4 lg:col-start-8 lg:mt-32",
    ratio: "3 / 4",
    position: "50% 40%",
    width: 1286,
    height: 965,
  },
  {
    posterSrc: "/brand/practice-latex.jpg",
    span: "lg:col-span-7 lg:col-start-3 lg:mt-24",
    ratio: "16 / 7",
    position: "50% 55%",
    width: 690,
    height: 265,
  },
  {
    posterSrc: "/brand/brow-mapping.jpg",
    span: "lg:col-span-3 lg:col-start-10 lg:mt-16",
    ratio: "1 / 1",
    position: "50% 50%",
    width: 332,
    height: 295,
  },
  {
    posterSrc: "/brand/group-training.jpg",
    span: "lg:col-span-6 lg:col-start-1 lg:mt-24",
    ratio: "3 / 2",
    position: "50% 42%",
    width: 1800,
    height: 1004,
  },
  {
    posterSrc: "/brand/brows-healed-hero.jpg",
    span: "lg:col-span-4 lg:col-start-8 lg:mt-40",
    ratio: "4 / 5",
    position: "50% 38%",
    width: 1179,
    height: 884,
  },
];
