"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Gold hairline across the top, tracking read position.
 *
 * Bound straight to a motion value and softened with a spring, so it never
 * touches React state and costs nothing per frame. Two pixels tall: present
 * enough to read as craft, quiet enough not to become a UI element.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.3 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="no-print fixed inset-x-0 top-0 z-[60] h-0.5 origin-[left] bg-gradient-to-r from-accent/40 via-accent to-accent-hi rtl:origin-[right]"
    />
  );
}
