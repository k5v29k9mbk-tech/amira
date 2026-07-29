"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * A few pixels of drift, and nothing else.
 *
 * Travel is deliberately tiny (10-20px): enough that two neighbouring frames
 * separate in depth, small enough that nobody reads it as an animation. Bound
 * to a motion value, so it costs no re-renders, and switched off entirely under
 * prefers-reduced-motion.
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
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}
