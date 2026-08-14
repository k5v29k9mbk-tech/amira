"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dist, dur, ease } from "@/lib/motion";

/**
 * An aperture opening, which is the one motion primitive the rest of this pass is
 * built from.
 *
 * Two elements move in opposite directions by the same amount. The outer element
 * clips, and slides up from fully covering its own height; the inner element
 * slides down by exactly as much. The sum is zero, so the content never travels:
 * what a reader sees is a slot opening over stationary type or a stationary
 * photograph. That is the difference between an editorial reveal and a panel
 * sliding in, and it is why this is not a fade.
 *
 * WHY NOT clip-path. A clip-path wipe is the obvious way to build this and it is
 * the wrong one here for a specific reason: `clipPath` is not a positional value
 * in Motion's reduced-motion set, so it would keep wiping for a visitor who has
 * asked for no movement, and would need its own CSS override to switch off. Two
 * translates are transforms, so MotionProvider's `reducedMotion="user"` already
 * makes them instant and the content is simply present. No new CSS, no branch on
 * the preference, nothing to keep in sync. See the note in lib/motion.ts.
 *
 * `overflow: hidden` on type clips descenders, which is why the outer element
 * carries vertical padding and pulls it straight back off with a negative margin.
 * Without it the tail of a "g" or a "y" is shaved for the length of the animation
 * and, on a heading whose last line ends in one, permanently. The pad is in em so
 * it tracks the type size rather than being a fixed guess at one. A frame passes
 * `pad="0px"`, because a photograph has no descenders and the box has to stay
 * exactly the size the layout reserved for it.
 *
 * Both levels carry their own `initial` and target rather than relying on
 * Motion's parent-to-child variant propagation. Propagation would work, and it
 * would also mean the inner element's server-rendered markup depended on the
 * parent resolving first; stating both is one line longer and has no such
 * ordering.
 *
 * `once` is on for the scroll form: a reveal that replays every time a section
 * re-enters the viewport stops being a reveal and becomes a loop.
 */
export function MaskReveal({
  children,
  delay = 0,
  duration = dur.base,
  className = "",
  pad = "0.14em",
  amount = 0.4,
  /** Fill the parent, for a frame rather than a line of type. */
  fill = false,
  /** Play on mount instead of on scroll, for above-the-fold choreography. */
  onMount = false,
  /** Held false while something upstream (the opening film) owns the screen. */
  play = true,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  pad?: string;
  amount?: number;
  fill?: boolean;
  onMount?: boolean;
  play?: boolean;
}) {
  const transition = { duration, delay, ease: ease.aura };
  const box = fill ? "block h-full w-full" : "block";

  const state = onMount
    ? { animate: play ? { y: "0%" } : { y: "100%" } }
    : { whileInView: { y: "0%" }, viewport: { once: true, amount } };

  const inner = onMount
    ? { animate: play ? { y: "0%" } : { y: "-100%" } }
    : { whileInView: { y: "0%" }, viewport: { once: true, amount } };

  return (
    <span
      className={`${box} overflow-hidden ${className}`}
      style={pad === "0px" ? undefined : { paddingBlock: pad, marginBlock: `-${pad}` }}
    >
      <motion.span
        className={box}
        initial={{ y: "100%" }}
        transition={transition}
        {...state}
      >
        <motion.span
          className={box}
          initial={{ y: "-100%" }}
          transition={transition}
          {...inner}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

/**
 * The same aperture, for a photograph entering on scroll.
 *
 * A frame differs from a line of type in three ways and each is a separate
 * decision. It opens over a longer duration, because the eye needs longer on an
 * image than on a sentence and a fast reveal on a large frame reads as a flicker.
 * It carries no descender padding, so the box stays exactly the size the layout
 * reserved and there is no shift at any point. And the photograph resolves out of
 * a six percent overshoot as the aperture opens, which is what stops the two
 * edges reading as one rigid panel sliding past.
 */
export function FrameMask({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const transition = { duration: dur.frame, delay, ease: ease.aura };
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <span className={`block h-full w-full overflow-hidden ${className}`}>
      <motion.span
        className="block h-full w-full"
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={viewport}
        transition={transition}
      >
        <motion.span
          className="block h-full w-full"
          initial={{ y: "-100%", scale: 1.06 }}
          whileInView={{ y: "0%", scale: 1 }}
          viewport={viewport}
          transition={transition}
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
