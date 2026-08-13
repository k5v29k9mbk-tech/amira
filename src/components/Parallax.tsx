"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * A few pixels of drift, and nothing else.
 *
 * Travel is deliberately tiny (10-20px): enough that two neighbouring frames
 * separate in depth, small enough that nobody reads it as an animation. Bound
 * to a motion value, so it costs no re-renders.
 *
 * REDUCED MOTION. This is the one kind of movement on the site that
 * MotionProvider's policy cannot reach, and the reason is worth knowing before
 * changing either. `reducedMotion="user"` works on animations: it gives the
 * transform an instant transition when one is started. Nothing is ever started
 * here. `y` is a motion value derived from scroll position and bound straight to
 * `style`, so Motion writes it to the inline style every frame and no animation
 * exists to shorten.
 *
 * The branch that used to switch it off, `style={reduce ? undefined : { y }}`,
 * decided during render, which is exactly what the server cannot do: it emitted
 * the transform and a reduced-motion client emitted none, and the two trees
 * disagreed. So the class is unconditional now and `globals.css` neutralises it
 * inside its `prefers-reduced-motion` block, where an author `!important` beats
 * the inline style Motion writes. Same markup for everyone, the browser's own
 * media query decides, and it is decided before the first paint rather than a
 * frame into it.
 *
 * The class has to stay on the element that carries the transform. If this ever
 * wraps another element or moves the `style` down a level, `drift` moves with it.
 */
export function Parallax({
  children,
  distance = 14,
  className = "",
}: {
  children: ReactNode;
  /** Total travel in pixels. Negative moves against the scroll. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={{ y }} className={`drift ${className}`}>
      {children}
    </motion.div>
  );
}
