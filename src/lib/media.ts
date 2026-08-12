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
 * The opening sequence.
 *
 * Drop the graded promotional film at these three paths and it plays once per
 * browser session over the homepage. WebM is offered first and MP4 is the
 * fallback; the poster is what a visitor sees for the frame before playback
 * begins, and is also what a blocked autoplay leaves on screen for the instant
 * before the overlay stands down.
 *
 * `scripts/encode-intro.sh` produces all three from one master file. Until they
 * exist the overlay finds no playable source, exits immediately, and the site
 * behaves as though there were no intro at all.
 */
export const introMedia = {
  webmSrc: "/videos/aura-intro.webm",
  mp4Src: "/videos/aura-intro.mp4",
  posterSrc: "/videos/aura-intro-poster.webp",
} as const;

/**
 * Homepage hero portrait.
 *
 * The studio frame rather than the salon one: Amira against a seamless beige
 * sweep, so the arch holds a person and not a room. `amira-portrait-hero.jpg`
 * is the graded master, derived from `amira-studio.jpg` at 1440x1920 with a
 * light unsharp pass for clarity and a 4% lift in colour. The original is kept
 * beside it; regenerate with the recipe in the README if the grade needs
 * changing.
 *
 * The clip fields stay: dropping a `videoSrc` here plays it inside the arch,
 * with this frame as the poster and the reduced-motion fallback.
 */
export const heroMedia: Media = {
  videoSrc: null,
  mobileVideoSrc: null,
  posterSrc: "/brand/amira-portrait-hero.jpg",
  alt: "",
  position: "50% 22%",
  mobilePosition: "50% 18%",
  width: 1440,
  height: 1920,
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

/**
 * Founder portrait, homepage. The studio frame: black blazer, arms crossed,
 * against a plain sweep. Deliberately not the hero portrait, so the page does
 * not print the same photograph twice. Real photography, never generated, and
 * shipped exactly as the academy supplied it — no grade, no retouch, no upscale.
 *
 * The photograph is 928x1152 and the frame that holds it is 4:5, a difference of
 * under a percent. `cover` spends all of it on the left and right edges of the
 * backdrop and none on the height, so the whole figure survives at every
 * breakpoint and the centred crop needs no pull in either direction.
 */
export const founderMedia: Media = {
  posterSrc: "/brand/amira-founder-portrait.jpg",
  position: "50% 50%",
  width: 928,
  height: 1152,
};

/** One frame per method chapter, keyed by the chapter's message key. */
export const methodMedia: Record<string, Media> = {
  /**
   * The academy's own classroom, supplied by the client: Amira at the flipchart
   * drawing the stroke patterns, the class following from the bench. It stands
   * where a cropped mapping still used to, because the theory chapter is the one
   * place on the page that has to show teaching rather than a technique.
   *
   * The frame is 4:5 and the photograph is 3:4, so `cover` scales it to the full
   * width and loses 6% of its height, nothing else. There is no horizontal crop
   * at any breakpoint, which is why one `position` serves phone and desktop
   * alike: the pull upward keeps the raised hand and the whiteboard whole and
   * spends the loss on the foreground table instead.
   *
   * `alt` is set by MethodStory from the message catalogue, not here, because it
   * is the one frame on the site that carries meaning in four languages.
   */
  theory: {
    posterSrc: "/brand/theory-classroom.jpg",
    position: "50% 40%",
    width: 1200,
    height: 1600,
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
