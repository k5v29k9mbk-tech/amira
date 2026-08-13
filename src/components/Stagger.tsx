"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * Orchestrated entrance for above-the-fold content.
 *
 * Reveal handles scroll-triggered sections; this handles the first three
 * seconds, where the sequence matters. Children animate on mount in order,
 * driven by staggerChildren rather than hand-tuned delay props, so adding or
 * reordering a line does not require retiming everything after it.
 *
 * When the opening film is playing, the sequence waits for it: it would
 * otherwise run to completion behind a black overlay, and the homepage would
 * arrive already finished.
 *
 * Neither the container nor the item branches on a reduced-motion preference; the
 * policy is MotionProvider's. Under it the travel and the blur arrive instantly
 * and the first screen fades in, in sequence, which is the intended effect minus
 * the movement. Both used to branch here, and since this is the hero, the
 * mismatch it caused was above the fold.
 */
const container = (stagger: number, delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const item = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Stagger({
  children,
  className,
  stagger = 0.11,
  delay = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ready = useIntroReady();
  return (
    <motion.div
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      animate={ready ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

/** One beat of the sequence. Must sit inside a Stagger to inherit the timing. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
