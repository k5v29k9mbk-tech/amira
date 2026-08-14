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
 * The hero film: the academy's own footage, behind the first screen.
 *
 * The file is the one the academy supplied, at the name it supplied it under,
 * used byte for byte and never re-encoded. The extension is upper case because
 * that is how the camera wrote it and how the file sits in `public/`; a URL path
 * is case sensitive in production even where macOS is forgiving locally, so this
 * string has to match the file exactly rather than tidily.
 *
 * The footage is 480x848, shot vertically on a phone in a treatment room lit by
 * one magenta tube. Two things follow from that and both are deliberate here.
 * It is dark to begin with, so the scrim over it is 52 rather than the 70 a
 * daylight clip would need to carry ivory type. And it is 480px wide against a
 * desktop viewport that is three or four times that, so `cover` is scaling it
 * up: what survives the scale is the colour and the movement, which is what a
 * ground is for, and the detail that does not survive is not being asked to
 * carry anything. Drop a larger master at this path and the frame sharpens with
 * no change to any component.
 *
 * The poster is a frame of the film itself, so the first paint is the same image
 * the video resolves into, and a visitor who has asked for reduced motion gets
 * that frame and no video at all.
 */
export const heroFilmMedia: Media = {
  videoSrc: "/06aa8692-35d7-4b5a-8475-4d9504116b39.MP4",
  posterSrc: "/brand/hero-film-poster.jpg",
  alt: "",
  /**
   * The subject sits low and inline-end in the frame, and the tall crop is what
   * a wide viewport throws away. Holding at 40% keeps the lit tablet and the
   * student in shot on a laptop instead of cropping to the empty curtain above
   * her; phones see almost the whole frame and sit at the centre.
   */
  position: "50% 40%",
  mobilePosition: "50% 50%",
  overlay: 52,
  width: 480,
  height: 848,
};

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

/**
 * The method's frames, keyed by the chapter's message key.
 *
 * Not every chapter has one. Practice carries no photograph, and MethodStory
 * reads this record for what is in it rather than assuming one entry per
 * chapter: the sticky column mounts the frames that exist and holds the one
 * above while an unframed chapter is read, so it never fades to an empty panel.
 */
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
  /**
   * The one moving frame on the homepage that is a technique rather than a
   * texture: the academy's own macro of the machine working a brow, poster and
   * clip from the same take. It sits on the practice chapter, which had no
   * photograph at all, and it holds through the live-model chapter below it,
   * which is what MethodStory does with a chapter that carries no frame.
   *
   * It used to hang off the microblading panel in the catalogue above, with an
   * unrelated still as its poster: the panel opened on a healed brow and then
   * cross-faded to a needle. Poster and clip are the same footage here, so the
   * frame resolves into motion instead of cutting to a different photograph.
   *
   * 480x768 is the whole of the source. The sticky column is about 620px at
   * desktop, which is the reason its `sizes` is set to the column and not to
   * the old 55vw: a macro at 1.3x is grain, the same macro at 1.7x is mush.
   */
  practice: {
    videoSrc: "/brand/mapping.mp4",
    posterSrc: "/brand/mapping-poster.jpg",
    alt: "",
    position: "50% 45%",
    width: 480,
    height: 768,
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
  /**
   * Message key under `students.captions.*`, for a frame that is named on the
   * page rather than left to the atmosphere.
   *
   * Set on the studio frames and deliberately absent from every result. A
   * caption under a client's healed brow would have to name the discipline that
   * produced it, and the site does not know that from the photograph: it would
   * be a guess printed under someone's face. The studio frames are the opposite
   * case, because what they show is exactly what the academy's own copy already
   * says they show.
   */
  captionKey?: string;
};

/**
 * The work, homepage section 03. What the method produces, in the academy's
 * own photographs: healed permanent makeup, the hair strokes close up, and the
 * lip work. The before/after slider sits inside this composition too, at
 * `pairFrame` below.
 *
 * The order is the reading order on a phone, where the composition collapses to
 * a single column: the healed brow, the strokes that built it, the pair that
 * proves it, a second brow, both brows across the full width, the lip detail,
 * closing on two finished faces. On desktop the same seven land in four
 * staggered rows, two frames to a row, alternating which side carries the
 * weight.
 *
 * `altKey` names the frame's alt text under `work.alt.*`. These are the only
 * photographs on the site that are the argument rather than the atmosphere, so
 * every one of them is described, in all four languages, rather than shipped
 * decorative.
 *
 * `zoom` opens the frame full screen. It is set only where the file has pixels
 * the layout is not already spending: the 1179 wide file against a frame of
 * 864, and the three 1320 wide ones the academy supplied last, against frames
 * of 992, 736 and 480. The three small close-ups are shown at their own size
 * already, so opening them larger would enlarge nothing and soften what is
 * there.
 *
 * students-certificates.jpg is deliberately absent, here and everywhere. It
 * shows identifiable students and their certificate numbers and stays off the
 * site until the academy holds written consent.
 *
 * ORIENTATION. Four of these were shot with the client reclined and the camera
 * over her, which is how every PMU artist photographs a finished brow and why
 * the files come off the phone lying on their side or upside down. Three of
 * them printed that way: a face inverted, a face on its side, a mouth standing
 * vertically. On a portfolio grid that reads as a mistake in the website rather
 * than as a convention of the trade, and the one thing this section cannot
 * afford is to look careless about the work it is proving.
 *
 * `*-upright.jpg` is each of those files turned the right way up and nothing
 * else: a 90 or 180 degree rotation, which resamples no pixel and moves no
 * detail, plus one border trim on the lip macro where the source carried the
 * grey edge of a screenshot. No grade, no retouch, no upscale, and the
 * originals are kept beside them untouched. The claim in `work.sub` is
 * unaffected and stays true.
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
  /**
   * The band. Both brows in one frame, close enough to read the individual
   * strokes, and the only landscape photograph the academy has supplied at a
   * width worth spending. It carries its row almost alone: the brow half of the
   * section is above it, the two finished faces are below, and the lip detail
   * tucks into the two columns left at its right edge.
   *
   * Eight columns is 992px against a 1320px file, so it is the widest frame in
   * the section and still not upscaled.
   */
  {
    posterSrc: "/brand/brows-pair-upright.jpg",
    altKey: "browsPair",
    zoom: true,
    span: "col-span-12 lg:col-span-8 lg:col-start-3 lg:mt-16",
    sizes: "(max-width: 1024px) 100vw, 62vw",
    ratio: "1320 / 689",
    position: "50% 50%",
    width: 1320,
    height: 689,
  },
  {
    posterSrc: "/brand/lips-upright.jpg",
    altKey: "lipDetail",
    span: "col-span-6 md:col-span-4 lg:col-span-2 lg:col-start-11 lg:mt-40",
    sizes: "(max-width: 768px) 47vw, (max-width: 1024px) 31vw, 14vw",
    ratio: "230 / 206",
    position: "50% 50%",
    width: 230,
    height: 206,
  },
  /**
   * The closing pair: two faces rather than two details, which is what the
   * section has been building towards. Both are 1320px files, the largest the
   * academy has supplied, and both are held well under that width.
   *
   * They are deliberately not the same size. Six columns beside four, with the
   * smaller one dropped 112px, keeps the row a composition rather than two
   * equal tiles, and the near-square proportions of both files are close enough
   * that any other arrangement would read as a pair of thumbnails. On tablet
   * they halve into a diptych, on a phone they stack full width.
   */
  {
    posterSrc: "/brand/brows-defined-upright.jpg",
    altKey: "browsPortrait",
    zoom: true,
    span: "col-span-12 md:col-span-6 lg:col-start-1",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 47vw, 46vw",
    ratio: "1323 / 1320",
    position: "50% 45%",
    width: 1323,
    height: 1320,
  },
  {
    posterSrc: "/brand/brows-lips-upright.jpg",
    altKey: "browsLips",
    zoom: true,
    span: "col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-8 lg:mt-28",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 47vw, 30vw",
    ratio: "1320 / 1235",
    position: "50% 48%",
    width: 1320,
    height: 1235,
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
 *
 * Three frames now, and they are the three things the copy names, in that
 * order: the room during a lesson, the mapping drawn out by hand, the
 * demonstration on skin. It was two, and neither of them said "guided
 * practice".
 *
 * The classroom is deliberately cropped differently from the way the method
 * section above sets the same photograph. There it is a 3:4 portrait of Amira
 * at the flipchart; here it is a 4:3 band pulled down into the bench, so what
 * this section prints is the class and the kit rather than the teacher. Same
 * room, different frame, which is what stops a reader who has scrolled three
 * sections from feeling she has seen this picture already. The academy has one
 * photograph of its classroom; until it sends more, a second crop of it is the
 * honest way to show the room twice.
 *
 * No frame is ever wider than the file behind it: 845px of a 1200px classroom,
 * 344px of a 332px mapping still, 469px of a 557px close-up.
 */
export const galleryFrames: Frame[] = [
  {
    posterSrc: "/brand/theory-classroom.jpg",
    captionKey: "lesson",
    span: "col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-1",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 56vw, 54vw",
    ratio: "4 / 3",
    position: "50% 58%",
    width: 1200,
    height: 1600,
  },
  {
    posterSrc: "/brand/brow-mapping.jpg",
    captionKey: "mapping",
    span: "col-span-5 md:col-span-4 md:col-start-9 md:mt-16 lg:col-span-3 lg:col-start-9 lg:mt-40",
    sizes: "(max-width: 768px) 40vw, (max-width: 1024px) 31vw, 22vw",
    ratio: "332 / 295",
    position: "50% 50%",
    width: 332,
    height: 295,
  },
  {
    posterSrc: "/brand/live-demo.jpg",
    captionKey: "demo",
    span: "col-span-7 md:col-span-6 md:col-start-4 md:mt-6 lg:col-span-4 lg:col-start-4 lg:mt-10",
    sizes: "(max-width: 768px) 56vw, (max-width: 1024px) 47vw, 31vw",
    ratio: "557 / 335",
    position: "50% 40%",
    width: 557,
    height: 335,
  },
];
