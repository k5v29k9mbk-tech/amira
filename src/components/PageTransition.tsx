"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

/**
 * Cross-page fade. Mounted from template.tsx, which Next remounts on every
 * navigation, so this runs once per route change.
 *
 * The children are passed straight through, so they stay server components and
 * this costs nothing beyond the wrapper. Deliberately short and translation
 * free: a long slide on navigation reads as latency, not luxury.
 *
 * A fade is all this ever was, so there is nothing here for a reduced-motion
 * preference to remove and no branch on it. There used to be one, returning the
 * children bare, and because it wrapped every route it put the hydration mismatch
 * on every page of the site rather than only on the homepage.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.quick, ease: ease.soft }}
    >
      {children}
    </motion.div>
  );
}
