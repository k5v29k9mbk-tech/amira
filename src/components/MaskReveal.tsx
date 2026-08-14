"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dist, dur, ease } from "@/lib/motion";
import { useHeroReady } from "./HeroChoreography";

/**
 * A line of type rising into a fixed slot: the site's text reveal.
 *
 * The slot is a static box with `overflow: hidden`; the content starts below it
 * and translates up into place. One moving element, one property, and the reason
 * it is that simple is worth recording, because the first attempt at this was
 * cleverer and silently did nothing.
 *
 * WHAT NOT TO DO. The richer version of this effect keeps the content stationary
 * and moves the aperture over it: an element translating down while its child
 * translates up by the same amount, so the sums cancel and what the reader sees is
 * a slot growing rather than type travelling. That is the `FrameMask` construction
 * below, and it only works if the *moving* element is the one that clips. Put the
 * `overflow: hidden` on a static parent instead and the two translates still
 * cancel, so the content sits exactly where it always was, inside a clip box that
 * never excluded it: no reveal, no error, nothing in the console, and type that is
 * simply present from the first frame. It measured as animating the whole time,
 * because it was, in equal and opposite directions.
 *
 * DESCENDERS. `overflow: hidden` on a line of type shaves the tail of a "g" or a
 * "y", and permanently, not just while the animation runs. The slot carries
 * vertical padding so the clip box is taller than the glyphs and pulls the same
 * amount back off as negative margin so the layout is unchanged. The travel is
 * then 130% rather than 100%, because 100% of the content's own height leaves it
 * still overlapping the padding at the bottom of the slot, which shows as a sliver
 * of the tops of the letters before the reveal starts.
 *
 * REDUCED MOTION. `y` is a transform, so `reducedMotion="user"` in MotionProvider
 * already gives it an instant transition and a reader who has asked for no
 * movement simply finds the type in place. This is why the reveal is not built
 * from `clip-path`: clip-path is not in Motion's positional set, so it would keep
 * animating for that reader and would need its own CSS override. The full
 * reasoning is in lib/motion.ts.
 */
export function MaskReveal({
  children,
  delay = 0,
  duration = dur.base,
  className = "",
  pad = "0.14em",
  amount = 0.4,
  /** Play on mount instead of on scroll, for above-the-fold choreography. */
  onMount = false,
  /**
   * Held false while something upstream owns the screen. Left undefined it reads
   * the hero's cue, which is `true` everywhere outside the first screen, so a
   * scroll reveal elsewhere on the site is unaffected.
   */
  play,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  pad?: string;
  amount?: number;
  onMount?: boolean;
  play?: boolean;
}) {
  const cue = useHeroReady();
  const go = play ?? cue;
  const hidden = "130%";

  const state = onMount
    ? { animate: go ? { y: "0%" } : { y: hidden } }
    : { whileInView: { y: "0%" }, viewport: { once: true, amount } };

  return (
    <span
      className={`block overflow-hidden ${className}`}
      style={pad === "0px" ? undefined : { paddingBlock: pad, marginBlock: `-${pad}` }}
    >
      <motion.span
        className="block"
        initial={{ y: hidden }}
        transition={{ duration, delay, ease: ease.aura }}
        {...state}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * An aperture opening over a stationary photograph.
 *
 * This is the construction the type reveal above deliberately does not use, and
 * here it is worth the extra element. Two boxes move by the same amount in
 * opposite directions: the aperture translates down out of view and back up, and
 * the photograph inside translates up and back down. The sums cancel, so the
 * photograph never travels. What opens is the slot.
 *
 * The load-bearing detail, and the one that made the first attempt at this a
 * no-op: `overflow: hidden` is on the *moving* element, not on the static parent.
 * The aperture has to be the thing that clips, or the two translates cancel into
 * a photograph sitting exactly where it started inside a clip box that never
 * excluded it. The static wrapper clips too, but only to keep the displaced
 * aperture from spilling into the layout while it is out of frame.
 *
 * Neither box carries padding, so both are exactly the height of the frame and
 * the cancellation is exact. A photograph has no descenders to protect, and the
 * box has to stay precisely the size the layout reserved so there is no shift at
 * any point in the reveal.
 *
 * The photograph resolves out of a six percent overshoot as the slot opens, which
 * is what stops the two edges reading as one rigid panel sliding past: held at 1
 * the effect is a wipe, resolving it is a reveal.
 */
export function FrameMask({
  children,
  delay = 0,
  duration = dur.frame,
  className = "",
  onMount = false,
  play,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** Play on mount instead of on scroll, for the hero's own plate. */
  onMount?: boolean;
  play?: boolean;
}) {
  const cue = useHeroReady();
  const go = play ?? cue;
  const transition = { duration, delay, ease: ease.aura };
  const viewport = { once: true, amount: 0.2 } as const;

  const aperture = onMount
    ? { animate: go ? { y: "0%" } : { y: "100%" } }
    : { whileInView: { y: "0%" }, viewport };
  const content = onMount
    ? { animate: go ? { y: "0%", scale: 1 } : { y: "-100%", scale: 1.06 } }
    : { whileInView: { y: "0%", scale: 1 }, viewport };

  return (
    <span className={`block h-full w-full overflow-hidden ${className}`}>
      <motion.span
        className="block h-full w-full overflow-hidden"
        initial={{ y: "100%" }}
        transition={transition}
        {...aperture}
      >
        <motion.span
          className="block h-full w-full"
          initial={{ y: "-100%", scale: 1.06 }}
          transition={transition}
          {...content}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

/**
 * A block that fades up as it enters. The plainest reveal in the system and still
 * the right one for a paragraph, a list row or a definition list, where an
 * aperture would be four apertures in a column and read as machinery.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  as = "div",
  id,
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
  id?: string;
  amount?: number;
}) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: dist.text }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: dur.base, delay, ease: ease.soft }}
    >
      {children}
    </Tag>
  );
}
