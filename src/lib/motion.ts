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
 * The first screen is now the academy's film with type set over it, and the
 * score is the order a reader meets that type: the wordmark, the byline under
 * it, the statement line by line, the supporting line, the two actions, and
 * last of all the proof. Written as delays in one place because the only thing
 * that makes a sequence read as choreography rather than as things appearing is
 * the interval between beats, and that is impossible to tune when the numbers
 * live in six components.
 *
 * THE SIGNATURE USED TO LAND LAST, and `name` and `role` are the two beats it
 * landed on. The homepage no longer plays them: her name is set further down the
 * page, as the caption to the portrait in `AuthorityStrip`, so it arrives on
 * scroll rather than on a delay measured from the opening, and the score now
 * ends on the proof band at 0.82.
 *
 * They stay here, and not only out of tidiness. `HeroPortrait` still plays both,
 * and the interval between them is the part worth keeping: 0.10 is the smallest
 * gap on the site that still reads as two beats rather than as one block
 * arriving, and it is the number to reuse anywhere a name is set over a role.
 *
 * `portrait` and `frame` are the arch's two beats. Nothing on the homepage plays
 * them any more: the portrait came off the first screen when the film went
 * behind it, and `HeroPortrait` is kept, unmounted, for whatever composition
 * wants an arch next. They stay in the score so that component still reads from
 * one place rather than inventing its own numbers when it is next mounted.
 *
 * `intro` is added to all of these by the components when the opening film has
 * played, so the sequence starts after the overlay rather than behind it.
 */
export const heroBeat = {
  /**
   * THE WORDMARK OPENS THE SCORE, and it is the beat that used to be the bar.
   * The first screen no longer carries a line of middot-joined facts above the
   * statement; it carries the academy's name, and the name is the first thing
   * the sequence plays for the same reason it is the first thing the screen
   * says. The key keeps a neutral name because what the beat defines is a
   * position in the score, not a component.
   */
  brand: 0.0,
  /**
   * The byline under it, 120ms later. It is the same interval `name` and `role`
   * hold apart further down this file, and for the same reason: it is the
   * smallest gap on the site that still reads as two beats rather than as one
   * block arriving. A lockup that opened as a single reveal would print the
   * founder's name at the same instant as the academy's, which is the one
   * hierarchy this screen exists to state.
   */
  byline: 0.12,
  headline: 0.26,
  sub: 0.6,
  /**
   * 0.72, and it is now the fifth beat rather than the last. The composition
   * puts the two actions above the proof band, so the score follows: brand,
   * statement, supporting line, action, evidence.
   */
  actions: 0.72,
  /**
   * The proof closes the sequence. 100ms after the actions rather than a full
   * beat: the band is a rule with three figures in it, not a movement of its
   * own, and a longer wait after the last control reads as a stall.
   */
  facts: 0.82,
  name: 0.86,
  role: 0.96,
  portrait: 0.12,
  frame: 0.26,
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
