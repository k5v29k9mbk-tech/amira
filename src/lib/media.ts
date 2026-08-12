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
 * Founder portrait, homepage. The studio frame: black blazer, the brow calipers
 * raised to the eye, against a plain sweep. Deliberately not the hero portrait,
 * so the page does not print the same photograph twice. Shipped exactly as the
 * academy supplied it, byte for byte: no grade, no retouch, no upscale, and no
 * re-encode, which is why the file is copied rather than exported.
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
 * One frame in an editorial composition.
 *
 * `span` carries the whole of the frame's placement: its column span at every
 * breakpoint, its explicit `col-start` at lg, and the vertical offset that
 * makes the set stagger rather than line up. The grid is twelve columns and
 * auto-placement is what reads these: an item whose `col-start` is behind the
 * cursor drops to a new row, which is how the rows below are built out of a
 * flat list. Composition is data, so a frame moves by editing this file.
 *
 * `ratio` is the frame's aspect. Everywhere below it is the photograph's own
 * ratio, to the pixel: at native ratio `cover` crops nothing, so no part of a
 * treatment is ever cut off by the layout. That is also why the spans are what
 * they are. Every frame is held at or under the width its file actually has,
 * so nothing on the page is upscaled. The academy's close-ups are small files
 * (235px, 232px, 332px wide), and a small photograph shown small is sharp,
 * where the same photograph stretched across a desktop column is not.
 *
 * Replace a file with a larger one and the frame can grow: raise its span, and
 * keep the new `width`/`height` in step so the ratio stays native.
 */
export type Frame = Media & {
  /** Column span, start and offset, per breakpoint. */
  span: string;
  /** Aspect ratio. The photograph's own, so the crop is nothing. */
  ratio: string;
  /**
   * What the frame actually measures at each breakpoint, so next/image asks
   * for the right file rather than the widest one. Derived from `span`: move a
   * frame and move this with it, or the page downloads the wrong picture.
   */
  sizes: string;
};

/**
 * The work, homepage section 03. What the method produces, in the academy's
 * own photographs: healed permanent makeup, the hair strokes close up, and the
 * lip work. The before/after slider sits inside this composition too, at
 * `pairFrame` below.
 *
 * The order is the reading order on a phone, where the composition collapses to
 * a single column: the healed brow, the strokes that built it, the pair that
 * proves it, a second brow, then the lip work, closing on the strongest lip
 * frame. On desktop the same six land in three staggered rows, two frames to a
 * row, alternating which side carries the weight.
 *
 * `altKey` names the frame's alt text under `work.alt.*`. These are the only
 * photographs on the site that are the argument rather than the atmosphere, so
 * every one of them is described, in all four languages, rather than shipped
 * decorative.
 *
 * `zoom` opens the frame full screen. It is set only where the file has pixels
 * the layout is not already spending: these two are 1179 and 1286 wide against
 * frames of 864 and 736. The other four are shown at their own size already,
 * so opening them larger would enlarge nothing and soften what is there.
 *
 * students-certificates.jpg is deliberately absent, here and everywhere. It
 * shows identifiable students and their certificate numbers and stays off the
 * site until the academy holds written consent.
 */
export const resultFrames: (Frame & {
  altKey: string;
  zoom?: boolean;
  /** Required here, not optional: the overlay sizes itself off these. */
  width: number;
  height: number;
})[] = [
  {
    posterSrc: "/brand/brows-healed-hero.jpg",
    altKey: "healedBrows",
    zoom: true,
    span: "col-span-12 lg:col-span-7 lg:col-start-1",
    sizes: "(max-width: 1024px) 100vw, 54vw",
    ratio: "1179 / 884",
    position: "50% 36%",
    width: 1179,
    height: 884,
  },
  {
    posterSrc: "/brand/brow-macro.jpg",
    altKey: "strokes",
    span: "col-span-12 md:col-span-6 lg:col-span-3 lg:col-start-9 lg:mt-32",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 47vw, 22vw",
    ratio: "371 / 295",
    position: "50% 45%",
    width: 371,
    height: 295,
  },
  {
    posterSrc: "/brand/brows-eyes.jpg",
    altKey: "brows",
    span: "col-span-6 md:col-span-4 lg:col-span-2 lg:col-start-9 lg:mt-44",
    sizes: "(max-width: 768px) 47vw, (max-width: 1024px) 31vw, 14vw",
    ratio: "235 / 300",
    position: "50% 42%",
    width: 235,
    height: 300,
  },
  {
    posterSrc: "/brand/lips-neutralization.jpg",
    altKey: "lipDetail",
    span: "col-span-6 md:col-span-4 lg:col-span-2 lg:col-start-2 lg:mt-24",
    sizes: "(max-width: 768px) 47vw, (max-width: 1024px) 31vw, 14vw",
    ratio: "232 / 300",
    position: "50% 45%",
    width: 232,
    height: 300,
  },
  {
    posterSrc: "/brand/lips-result-hero.jpg",
    altKey: "lips",
    zoom: true,
    span: "col-span-12 lg:col-span-6 lg:col-start-5 lg:mt-8",
    sizes: "(max-width: 1024px) 100vw, 46vw",
    ratio: "1286 / 965",
    position: "50% 40%",
    width: 1286,
    height: 965,
  },
];

/**
 * Where the before/after slider sits in the same composition: third in reading
 * order, second row on desktop, under the opening frame and across from the
 * brow detail. Held to six columns because the aligned source frames are 900px
 * wide and six columns is 736.
 *
 * The slider is the one piece of proof the academy has supplied that a visitor
 * can operate rather than look at, which is why it is set among the results
 * rather than off in a section of its own. If the pair is ever withdrawn the
 * component drops it and the five frames around it close up: each one carries
 * its own `col-start`, so they keep their columns and lose only a row.
 */
export const pairFrame = {
  /**
   * Rendered directly after this index in `resultFrames`, which puts it third
   * in the reading order and opens the second row on desktop. Order is what the
   * grid places by, so this is not cosmetic: move the slider to the end of the
   * list and the second row is a single 2-column frame beside a void.
   */
  after: 1,
  span: "col-span-12 lg:col-span-6 lg:col-start-2 lg:mt-28",
  sizes: "(max-width: 1024px) 100vw, 46vw",
} as const;

/**
 * Inside Aura, homepage section 05: the room and the teaching, which is what
 * the section's own copy promises ("moments from the courses: demonstration,
 * guided practice and work on a model").
 *
 * It used to carry four of the treatment results as well. They have moved to
 * the work section above, where they are the argument rather than atmosphere,
 * and where they are not competing with a photograph of a classroom for the
 * same glance. Nothing is shown twice on the page.
 */
export const galleryFrames: Frame[] = [
  {
    posterSrc: "/brand/theory-classroom.jpg",
    span: "col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-1",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 47vw, 30vw",
    ratio: "3 / 4",
    position: "50% 40%",
    width: 1200,
    height: 1600,
  },
  {
    posterSrc: "/brand/group-training.jpg",
    span: "col-span-12 lg:col-span-6 lg:col-start-6 lg:mt-20",
    sizes: "(max-width: 1024px) 100vw, 46vw",
    ratio: "1800 / 1004",
    position: "50% 42%",
    width: 1800,
    height: 1004,
  },
  {
    posterSrc: "/brand/practice-latex.jpg",
    span: "col-span-12 md:col-span-8 lg:col-span-5 lg:col-start-2 lg:mt-24",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 63vw, 38vw",
    ratio: "690 / 265",
    position: "50% 55%",
    width: 690,
    height: 265,
  },
  {
    posterSrc: "/brand/brow-mapping.jpg",
    span: "col-span-6 md:col-span-4 lg:col-span-3 lg:col-start-8 lg:mt-16",
    sizes: "(max-width: 768px) 47vw, (max-width: 1024px) 31vw, 22vw",
    ratio: "332 / 295",
    position: "50% 50%",
    width: 332,
    height: 295,
  },
  {
    posterSrc: "/brand/live-demo.jpg",
    span: "col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-6 lg:mt-28",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 47vw, 30vw",
    ratio: "557 / 335",
    position: "50% 40%",
    width: 557,
    height: 335,
  },
];
