"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
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
 *
 * WHAT THE SLOT HAS TO OBSERVE, and why this is not `whileInView`. The scroll
 * trigger watches the *slot*, through `useInView` on `wrap`, and drives the
 * inner span from the boolean. `whileInView` on the inner span is the obvious
 * spelling and it is a silent no-op, which is worth stating plainly because the
 * markup gives no hint: `whileInView` observes the element it is written on,
 * IntersectionObserver clips a target by its ancestors' overflow before it
 * reports, and the inner span begins life translated 130% down, entirely
 * outside the very slot that clips it. So it measures a 0x0 intersection at
 * every scroll position on the page, the observer never fires, and the line
 * stays parked below its clip box for good. Measured: slot ratio 1, inner span
 * ratio 0, at the same instant, dead centre of the viewport.
 *
 * It cost the homepage fifteen headings. Sections 02 through 08 rendered their
 * eyebrow and their h2 into layout at full height and painted neither, which is
 * what the page's "too much empty space" actually was. The slot is never
 * translated and never clipped by anything, so observing it is both correct and
 * the thing that cannot regress this way.
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

  const wrap = useRef<HTMLSpanElement>(null);
  const seen = useInView(wrap, { once: true, amount });

  const state = onMount
    ? { animate: go ? { y: "0%" } : { y: hidden } }
    : { animate: seen ? { y: "0%" } : { y: hidden } };

  return (
    <span
      ref={wrap}
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
  amount = 0.2,
  onMount = false,
  play,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number;
  /** Play on mount instead of on scroll, for the hero's own plate. */
  onMount?: boolean;
  play?: boolean;
}) {
  const cue = useHeroReady();
  const go = play ?? cue;
  const transition = { duration, delay, ease: ease.aura };

  /**
   * The scroll trigger watches the static wrapper, for the same reason the type
   * reveal above does, and this branch carried the same silent no-op until the
   * artist act became the first thing on the site to actually use it.
   *
   * `whileInView` on the aperture is the obvious spelling and cannot work here.
   * IntersectionObserver clips a target by its ancestors' overflow before it
   * reports, and the aperture begins life translated 100% down, entirely outside
   * the wrapper whose `overflow: hidden` clips it. So it measures a zero
   * intersection at every scroll position on the page, the observer never fires,
   * and the photograph stays parked below its own frame for good. What a reader
   * sees is an empty box exactly where the picture should be, with no error
   * anywhere: the element is in the DOM, the image has loaded, and the frame has
   * reserved its space.
   *
   * It was invisible until now only because nothing rendered this path. The one
   * other caller is `HeroPortrait`, which is currently unmounted and in any case
   * passes `onMount`, and the mount branch drives both spans from a boolean
   * rather than from an observer.
   *
   * The wrapper is never translated and is clipped by nothing, so observing it
   * is both correct and the thing that cannot regress this way.
   */
  const wrap = useRef<HTMLSpanElement>(null);
  const seen = useInView(wrap, { once: true, amount });

  const open = onMount ? go : seen;
  const aperture = { animate: open ? { y: "0%" } : { y: "100%" } };
  const content = {
    animate: open ? { y: "0%", scale: 1 } : { y: "-100%", scale: 1.06 },
  };

  return (
    <span ref={wrap} className={`block h-full w-full overflow-hidden ${className}`}>
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
