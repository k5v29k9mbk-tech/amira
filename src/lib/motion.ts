/**
 * The site's motion language, in one file.
 *
 * Every duration, curve, distance, stagger and image scale used anywhere comes
 * from here. Before this existed the numbers were retyped per component: four
 * different easing arrays, durations from 0.4 to 1.4 chosen locally, travel
 * distances of 14, 18, 22, 26 and 30px with nothing to say which was right. That
 * is how a site ends up with motion that is individually fine and collectively
 * incoherent, and it is the difference between a page that feels art-directed
 * and one that feels assembled.
 *
 * WHAT THE CURVES ARE FOR. Luxury motion is asymmetric: it leaves quickly and
 * arrives slowly, because that reads as weight being carried rather than a
 * value being interpolated. All three curves below are heavily out-weighted for
 * that reason, and nothing on the site uses a symmetric ease-in-out except a
 * cross-fade, where the whole point is that neither end is an event.
 *
 * TRANSFORMS ONLY, AND WHY IT MATTERS HERE. Every reveal in this system is built
 * from `transform` and `opacity`, never from clip-path, width, height or inset.
 * Two reasons, and the second is the load-bearing one:
 *
 *   1. Transform and opacity are composited. Nothing in this system can trigger
 *      layout, so no reveal can shift its neighbours or cost a reflow per frame.
 *
 *   2. Motion's `reducedMotion="user"`, set once in MotionProvider, gives
 *      *positional* values an instant transition. That set is width, height, the
 *      inset properties and every transform prop. `clipPath` is not in it. A mask
 *      built from clip-path would keep animating for a visitor who asked for no
 *      movement, and would need a CSS override to switch off. A mask built from
 *      `overflow: hidden` plus a translate needs nothing: it is a transform, so
 *      the existing policy already covers it and arrives instantly.
 *
 * That is why `MaskReveal` moves an aperture rather than clipping a shape, and
 * why no new reduced-motion CSS was needed for any of this.
 */

/**
 * Curves.
 *
 * `aura` is the house curve and was already in the stylesheet as `--ease-aura`;
 * it is quoted here so the JS and the CSS cannot drift apart. Use it for
 * anything a visitor is meant to notice arriving: a frame, a panel, a plate.
 *
 * `soft` is the same idea with less overshoot in the tail, for type. A headline
 * on the house curve decelerates so hard it reads as landing, which is right for
 * an image and slightly theatrical for a sentence.
 *
 * `inOut` is the only symmetric curve on the site and exists for cross-fades,
 * where both ends should be unremarkable.
 */
export const ease = {
  aura: [0.22, 1, 0.36, 1],
  soft: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/**
 * Durations, in seconds.
 *
 * The spread is deliberate and the rule behind it is that duration scales with
 * the size of the thing moving: a link's underline at 0.3s reads as responsive,
 * the same 0.3s on a full-height plate reads as a snap. `plate` is the longest
 * and is only for the hero's own media.
 */
export const dur = {
  micro: 0.3,
  quick: 0.5,
  base: 0.7,
  slow: 1.0,
  frame: 1.2,
  plate: 1.6,
} as const;

/**
 * Travel, in pixels.
 *
 * Small on purpose. Every one of these is a distance a reader registers as the
 * element settling rather than as the element travelling; past roughly 40px a
 * reveal stops being editorial and starts being an entrance.
 */
export const dist = {
  hair: 6,
  text: 18,
  block: 24,
  frame: 32,
} as const;

/** Stagger between siblings, in seconds. */
export const stagger = {
  tight: 0.05,
  base: 0.08,
  line: 0.11,
} as const;

/**
 * Image scale.
 *
 * `hover` is the three percent the whole site already used on frames, kept
 * exactly. `settle` is the entrance overshoot a photograph resolves out of, and
 * `depth` is the ceiling for scroll-linked scale on the hero's plate: past about
 * eight percent the crop starts eating the edge of the composition.
 */
export const imageScale = {
  hover: 1.03,
  settle: 1.04,
  depth: 1.08,
} as const;

/**
 * The hero's opening sequence, as an ordered score.
 *
 * The brief for the first screen is eight beats in a fixed order: the bar, the
 * portrait, its frame, her name, her role, the headline line by line, the
 * supporting line, then the figures. Written as delays in one place because the
 * only thing that makes a sequence read as choreography rather than as things
 * appearing is the interval between beats, and that is impossible to tune when
 * the numbers live in eight components.
 *
 * The whole reveal lands inside 1.8s, which is the budget and is met by measuring
 * from the last thing to finish rather than the last thing to start. The portrait's
 * aperture is the longest single move on the screen and closes at 1.72
 * (0.12 + `plate`); the headline's second line closes at 1.79; the figures, which
 * are deliberately last, close at 1.75. Nothing here waits on anything below the
 * fold, and the headline is legible from about 0.9.
 *
 * `intro` is added to all of these by the components when the opening film has
 * played, so the sequence starts after the overlay rather than behind it.
 */
export const heroBeat = {
  bar: 0.0,
  portrait: 0.12,
  frame: 0.26,
  name: 0.44,
  role: 0.56,
  headline: 0.68,
  sub: 0.94,
  facts: 1.05,
} as const;

/** Shared variant: a block fading up into place. */
export const fadeUp = {
  hidden: { opacity: 0, y: dist.block },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: ease.soft },
  },
} as const;
