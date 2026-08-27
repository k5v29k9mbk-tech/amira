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
 * The hero film: the academy's own classroom, behind the first screen.
 *
 * Amira at the flipchart with the class behind her, trimmed, stripped of audio
 * and encoded by `scripts/encode-hero.swift` from the camera master. It is the
 * one piece of footage on the site that shows the thing the site is selling
 * happening, which is why it opens the page.
 *
 * WHAT IT REPLACED, AND WHY IT CAME BACK. This screen carried `pigment.mp4` for
 * a period: a macro of pigment moving, used as a ground rather than as a
 * subject. That was a defensible choice while the brand's first screen was
 * about the beauty of the work. It stopped being defensible when the brand's
 * first screen became about education, because a macro of a treatment is a
 * treatment and a room with a teacher in it is a school. The reasoning, and the
 * two measurable things the swap also fixes, are at the fields below.
 *
 * `pigment.mp4` is untouched in `public/brand` and still carries the closing
 * frame at the foot of the page. Nothing was thrown away in either direction,
 * which is the point of keeping both encoded: this screen is one string.
 *
 * The poster is the clip's own frame, so the first paint is the image the video
 * resolves into rather than a cut to somewhere else, and a visitor who has
 * asked for reduced motion is left holding that frame with no video loaded at
 * all.
 *
 * The scrim in `HeroFilm` is four layers pooled in the middle of the frame,
 * where the type is, and released at the corners. It was built for this clip
 * and is unchanged: the classroom is lit and half white flipchart, which is
 * exactly the case the pool was weighted for.
 */
export const heroFilmMedia: Media = {
  /**
   * THE PIGMENT MACRO, BACK ON THE FIRST SCREEN.
   *
   * Pigment moving under a macro lens: the one abstract clip the academy owns,
   * 20.5 seconds, and the film this screen carried until `c502264`, the
   * repositioning, swapped it for the classroom footage. It is restored here
   * because the hero composition it belonged to is restored: the figure band
   * sits inside the title card again, and that band was only ever inside the
   * hero while this clip played. By the time `hero-class.mp4` arrived the
   * figures had already moved out to `AuthorityStrip`, so the two eras cannot
   * be mixed without the screen contradicting one or the other.
   *
   * IT IS ALSO `closingMedia`, and that is the original arrangement rather than
   * an accident: this same file opened and closed the page for the whole of the
   * era this screen belongs to. The two treatments are not the same, which is
   * what keeps it from reading as a repeat. Here it runs full bleed under
   * `HeroFilm`'s four-layer scrim, pooled where the type sits; there it runs
   * inside a 464x656 frame under a flat 52% wash. Same twenty seconds, opened
   * and closed on.
   *
   * NO MOBILE CUT, and none is needed. The clip is a macro with no subject to
   * lose at the edges, so the desktop file crops to a phone without throwing
   * anything away; `MediaFrame` falls back to `videoSrc` when
   * `mobileVideoSrc` is null. `hero-class.mp4` and its 720x1280 phone cut stay
   * on disk, untouched, exactly as this file did while it was unused.
   *
   * `position` pulls to 40% of the height, which is where the pigment actually
   * moves; centred, a tall crop spends most of the frame on the still edges.
   */
  videoSrc: "/brand/pigment.mp4",
  mobileVideoSrc: null,
  posterSrc: "/brand/pigment-poster.jpg",
  alt: "",
  position: "50% 40%",
  width: 464,
  height: 656,
};

/**
 * The hero portrait: the brand photograph, and the subject of the first screen.
 *
 * `amira-brand-portrait.jpg` is the studio frame the academy supplied as final:
 * black blazer, arms crossed, the house pin on the lapel, on a warm beige sweep
 * that darkens toward the corners. It is used exactly as delivered. Nothing was
 * graded, retouched, recompressed or regenerated, and the file in this
 * repository is byte for byte the one that arrived; it was renamed from .png to
 * .jpg and nothing else, because the download carried a .png extension over
 * JPEG data and a lying extension is the kind of thing that breaks a build
 * tool six months later.
 *
 * IT IS SQUARE, AND THAT IS THE ONE THING TO KNOW BEFORE MOVING A CROP. 1024 on
 * both sides, with her head starting about five percent from the top and her
 * body running off the bottom edge. Every frame this photograph is placed in on
 * the site is taller than it is wide, so `cover` scales it to the frame's height
 * and the crop falls entirely on the width: the head is never cut, the hands are
 * never cut, and what is lost is beige. That is why both positions below only
 * really move the horizontal axis, and why the vertical value can stay at the
 * middle without risking the top of her head.
 *
 * The corollary is the resolution ceiling. 1024 is comfortable for a half-width
 * column on a laptop, about right at 1080p, and an upscale on anything larger.
 * If the academy can export the same frame at 2000px or more, drop it at this
 * path and nothing else changes.
 *
 * WHY 45% ON THE DESKTOP AXIS AND NOT 50. She sits a little left of centre in
 * the source, and the desktop frame is the inline end of a split composition
 * with the type beside it. Holding the crop slightly toward her left keeps a
 * band of the beige sweep on the inner edge of the photograph, so the type
 * column and the subject are separated by background rather than meeting at the
 * frame edge. It is the difference between a portrait placed on a page and a
 * portrait pushed against the copy.
 *
 * The phone keeps the middle, where the frame is wider in proportion and the
 * whole subject clears it with room on both sides.
 */
export const heroMedia: Media = {
  videoSrc: null,
  mobileVideoSrc: null,
  posterSrc: "/brand/amira-brand-portrait.jpg",
  alt: "",
  position: "45% 50%",
  mobilePosition: "50% 50%",
  width: 1024,
  height: 1024,
};

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
 * Founder portrait, homepage. The three-quarter studio frame: black blazer,
 * arms folded, the brow calipers held at the collar. Deliberately not the hero
 * portrait, so the page does not print the same photograph twice. Shipped
 * exactly as the academy supplied it, byte for byte: no grade, no retouch, no
 * upscale, and no re-encode, which is why the file is copied rather than
 * exported.
 *
 * PNG, and it has to be. The academy supplied this cut with the studio sweep
 * masked out, so half the file is transparent and the figure stands directly on
 * whatever ground the section paints. A JPEG has no alpha channel and would
 * flatten that mask to a white rectangle sitting on the ivory, so the format is
 * load bearing here rather than incidental: if this file is ever re-exported,
 * it stays PNG (or WebP). Next re-encodes it to WebP on the way out and keeps
 * the alpha, so the 780KB source is not what a visitor downloads.
 *
 * The photograph is 1179x1469 and the frame that holds it is 4:5, a difference
 * of a third of a percent. `cover` spends all of it on the left and right edges
 * and none on the height, so the full figure survives at every breakpoint:
 * nothing is taken off the top of her hair or the foot of the blazer.
 *
 * `position` is doing nothing and cannot do anything, which is worth knowing
 * before reaching for it. With four pixels of horizontal overflow there is no
 * slack to pan: the figure sits where the mask puts it, which is against the
 * right of the frame with the air on the left, because that is how it was shot.
 * To recentre the figure the mask would have to be re-cut, not the crop.
 */
export const founderMedia: Media = {
  posterSrc: "/brand/amira-founder-portrait.png",
  position: "50% 50%",
  width: 1179,
  height: 1469,
};

/**
 * The artist portrait: the academy's current official photograph of Amira, and
 * the one frame the homepage's own act about her is built on.
 *
 * DELIBERATELY NOT `founderMedia`, which is still directly above and still the
 * frame the six programme pages carry. Two reasons, and neither is taste. The
 * programme pages quote her beside a course she teaches, where the older
 * masked cut sits correctly on the ivory those panels paint; the homepage act
 * is a full editorial plate on its own ground, where a masked figure with no
 * frame of its own has nothing to be revealed *through*. And a media object
 * read by seven routes is not the place to make a change meant for one: swapped
 * in place, this photograph would have appeared on every course page as a side
 * effect of a homepage edit.
 *
 * SHIPPED AS SUPPLIED, byte for byte: no grade, no retouch, no upscale and no
 * re-encode. The source arrived named `.png` and is in fact a baseline JPEG
 * (JFIF, three components, no alpha), so it is stored here under the extension
 * it actually is. Nothing about the file changed; only its name is now true,
 * which matters because Next's optimiser and every cache in front of it decide
 * how to treat a file from its type.
 *
 * THE CROP. The photograph is square and the frame that holds it is 4:5, the
 * house ratio every other portrait on the site is set in. `cover` therefore
 * spends the whole difference on the left and right edges and none on the
 * height: the full figure survives at every breakpoint, from the crown of her
 * hair to the foot of the blazer, and nothing is taken off the top or the
 * bottom. The subject occupies roughly the middle seventy percent of the square,
 * so a centred crop clears her folded arms on one side and her hair on the
 * other with room to spare, which is why `position` is dead centre and can stay
 * there. The studio sweep it stands on is a warm beige within a few degrees of
 * the ivory the section paints, so the plate reads as a photograph on the page
 * rather than as a rectangle cut into it.
 */
/**
 * The precision portrait: Amira holding the brow calipers to her own eye.
 *
 * The measuring tool is the subject, not the prop, which is what makes this the
 * frame for act 01 rather than another portrait. Precision is the section's
 * whole claim and this is a photograph of somebody measuring.
 *
 * IT IS SET SQUARE, AND THAT IS A CONSTRAINT RATHER THAN A DEFAULT. The calipers
 * open across the middle of the frame and the hand holding them runs out to
 * about an eighth of the width from the left edge; a 3:4 crop of a 1024 square
 * keeps 768 of the width and puts its edge within two pixels of her knuckles.
 * At 4:5 there is room, at 1:1 there is no crop at all, and since the brief for
 * this frame is that the tool is never cut, native is the honest ratio. It also
 * separates this plate from the two below it: square here, 4:5 in the method,
 * landscape beside the room.
 *
 * Shipped as supplied, byte for byte, under the extension it actually is: the
 * file arrived named `.png` and is a baseline JPEG, as all of this set did.
 */
export const precisionMedia: Media = {
  posterSrc: "/brand/amira-precision-calipers.jpg",
  position: "50% 50%",
  width: 1024,
  height: 1024,
};

/**
 * The student-guidance frame: a student drawing her mapping while Amira stands
 * over the work.
 *
 * It belongs beside the room rather than beside the method, and the difference
 * is who the photograph is about. The method's frames are about the technique;
 * this one is about supervision, and it is the only picture on the site in which
 * the student is the subject and Amira is the person watching. That is the claim
 * the room makes in words, and this is it happening.
 *
 * THE CROP IS PULLED UP, NOT CENTRED. It is landscape here, so height is what
 * gets spent, and the two faces sit in the top half of a square original: the
 * student's at about 45% of the height, Amira's at about 20%. Centred, a 3:2
 * crop takes 170px off the top and cuts her forehead. At 30% the band opens at
 * 102 and holds both heads, the drawing hand and the paper. Any change to the
 * ratio here has to be checked against that number.
 */
export const mentorshipMedia: Media = {
  posterSrc: "/brand/amira-student-guidance-01.jpg",
  position: "50% 30%",
  width: 1024,
  height: 1024,
};

export const artistMedia: Media = {
  posterSrc: "/brand/amira-artist-portrait.jpg",
  position: "50% 50%",
  width: 1024,
  height: 1024,
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
   * 01 THEORY. The academy's own classroom: Amira at the flipchart drawing the
   * stroke patterns, the class following from the bench.
   *
   * IT CAME BACK, and the round trip is worth recording so it is not undone
   * again by accident. The demonstration photograph was moved here for a while
   * because the flipchart read as too theoretical to open the act with. It is
   * theoretical, and that is the point: this chapter's copy is "the theory
   * behind the technique, before any hands-on work", and a photograph of
   * hands-on work set beside those words contradicted them on the one screen a
   * reader meets first. Leading with the strongest picture is worth nothing if
   * it argues with the sentence next to it. The demonstration now sits on
   * chapter 02, where the copy is about practice, and each frame says what its
   * chapter says.
   *
   * The frame is 4:5 and the photograph is 3:4, so `cover` scales it to the full
   * width and loses 6% of its height, nothing else. There is no horizontal crop
   * at any breakpoint, which is why one `position` serves phone and desktop
   * alike: the pull upward keeps the raised hand and the whiteboard whole and
   * spends the loss on the foreground table.
   *
   * `alt` is set by MethodStory from the message catalogue, not here, because it
   * is a photograph of something happening rather than a texture.
   */
  theory: {
    videoSrc: "/brand/theory-teaching.mp4",
    posterSrc: "/brand/theory-teaching-poster.jpg",
    position: "50% 50%",
    width: 480,
    height: 848,
  },

  /**
   * 02 PRACTICE. The demonstration: Amira measuring a model's brow with the
   * calipers, the marker still in her other hand, the model in the academy's own
   * shirt.
   *
   * This is the frame the whole act is really about, and this is the chapter it
   * belongs to. The copy beside it is the guided practice, and this is the
   * academy's only photograph of the technique actually being performed on a
   * person by the person who teaches it: her face, both hands, the tool against
   * the brow, and enough of the room to read it as a class rather than a
   * treatment.
   *
   * `position` is dead centre, checked rather than assumed. The file is square
   * and the frame is 4:5, so `cover` spends the difference on the left and right
   * edges and nothing on the height. The centred crop was cut and looked at:
   * everything above sits inside the middle eighty percent of the width, and
   * what it trims is the far edge of the screen behind her and the outside of
   * her arm.
   *
   * IT APPEARS ONCE ON THE PAGE. It was keyed to the live-model chapter first
   * and briefly to theory; both are gone. The same photograph mounted twice in
   * one sticky column cross-fades into itself, and the same scene twice on one
   * homepage is the thing the room's own frame was chosen to avoid.
   */
  practice: {
    videoSrc: "/brand/guided-practice.mp4",
    posterSrc: "/brand/guided-practice-poster.jpg",
    position: "50% 50%",
    width: 480,
    height: 848,
  },

  /**
   * 03 LIVE MODEL. The mapping macro, moved down from the practice chapter it
   * used to sit on.
   *
   * It is the one moving frame in the act: the academy's own macro of the
   * machine working a brow, poster and clip from the same take. Under this
   * chapter it is doing the job it was always best at, which is showing the
   * technique at the distance the work is actually judged from, and it carries
   * the correction chapter below it as well.
   *
   * No `alt`. It is a macro of a needle against skin with no subject to name,
   * which is the case `MediaFrame` treats as decorative.
   */
  model: {
    videoSrc: "/brand/mapping.mp4",
    posterSrc: "/brand/mapping-poster.jpg",
    alt: "",
    position: "50% 50%",
    width: 480,
    height: 768,
  },

  /**
   * 04 POST-COURSE SUPPORT has no frame, and that is a decision rather than an
   * omission.
   *
   * It carried a photograph of a student drawing her mapping under Amira's eye,
   * and that turned out to be the same moment, from the same shoot, as the frame
   * beside the room: one scene printed twice on a single page. Every still in
   * `public/brand` was reviewed for a replacement that reads as support rather
   * than as teaching and none does; the reasoning is at `support-mapping.jpg`
   * below. So the chapter is text led, which below lg means no picture and at lg
   * means the column holds the mapping macro above it rather than fading to an
   * empty panel.
   *
   * `support-mapping.jpg` stays in `public/brand`, unreferenced. Restoring it is
   * one object, if the academy ever supplies a second guidance photograph and
   * this one stops being a duplicate of it.
   */

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
    posterSrc: "/brand/classroom-practice.jpg",
    captionKey: "lesson",
    span: "col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-1",
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 56vw, 54vw",
    ratio: "4 / 3",
    position: "50% 50%",
    width: 1800,
    height: 1350,
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
