"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Cross-page fade. Mounted from template.tsx, which Next remounts on every
 * navigation, so this runs once per route change.
 *
 * The children are passed straight through, so they stay server components and
 * this costs nothing beyond the wrapper. Deliberately short and translation
 * free: a long slide on navigation reads as latency, not luxury.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
