"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * How a photograph arrives.
 *
 * `Reveal` is tuned for type: a short lift, quick enough that a heading is
 * readable almost immediately. A photograph wants the opposite, a slower
 * settle, because the eye needs longer on an image than on a line of text and
 * a fast fade on a large frame reads as a flicker. Same curve, half again the
 * duration, and a touch more travel.
 *
 * The frame also settles *inwards*, from 98.5% to full size. Inwards matters:
 * an entrance that scales up past 100% would overrun the gutter between two
 * frames in a composition packed as tightly as the work section's, and clip
 * against its neighbour for the length of the animation.
 *
 * This was a clip-path wipe first, uncovering each frame from its bottom edge,
 * which is the better effect and does not survive contact with the browser:
 * `inset(0 0 100% 0)` is normalised to the three-value `inset(0px 0px 100%)`,
 * the two forms do not interpolate, and every frame in the section stayed
 * clipped shut. Transform and opacity are the two properties that animate
 * reliably everywhere, so that is what this uses.
 *
 * Nothing here touches layout: transform and opacity are composited, so no
 * frame moves its neighbours while it arrives and the space is reserved from
 * the first paint.
 *
 * Under a reduced-motion preference the travel and the scale arrive instantly and
 * the frame simply fades up, which is what MotionProvider's policy does to every
 * transform on the site. This component used to return a plain `<div>` in that
 * case, swapping the element out from under React: the server has no way to know
 * the preference, so it rendered the motion element, and a reduced-motion client
 * rendered the div. That was the loudest half of a hydration mismatch that made
 * React discard the server markup for the entire page.
 */
export function FrameReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
