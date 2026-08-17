"use client";

import { useEffect, useRef, useState } from "react";
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
 *
 * A PHONE GETS LESS OF IT, and that is a motion decision rather than a
 * performance one. Parallax is a depth cue and depth is read against the size
 * of the frame: 16px of travel on a 700px-wide desktop frame is a suggestion,
 * and the same 16px on a 342px phone frame is twice the proportion — the same
 * number that reads as weight on a laptop reads as the picture sliding in its
 * box on a phone. Below 768px the travel is halved.
 *
 * The scale is applied after mount rather than during render, for the reason
 * the whole comment above exists: the server has no viewport, so choosing the
 * distance while rendering is the hydration mismatch this file was written to
 * avoid. At scroll position zero the transform is at its start value on both
 * sides of the swap, so the correction is invisible — there is no jump to see.
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
  const [travel, setTravel] = useState(distance);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setTravel(mq.matches ? distance / 2 : distance);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [distance]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [travel, -travel]);

  return (
    <motion.div ref={ref} style={{ y }} className={`drift ${className}`}>
      {children}
    </motion.div>
  );
}
