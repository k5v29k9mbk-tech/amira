"use client";

import { createContext, useContext } from "react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dist, dur, ease } from "@/lib/motion";
import { useIntroReady } from "@/lib/use-intro-ready";

/**
 * The cue the first screen waits for.
 *
 * Every beat of the hero's entrance is on a delay measured from the moment the
 * page is visible, which is not the moment it mounts: on a first visit the
 * opening film covers the screen for several seconds. Without a cue the whole
 * 1.8s score would run to completion behind a black overlay, and the homepage
 * would arrive already finished, with the one sequence that is supposed to
 * introduce the academy having happened where nobody could see it.
 *
 * `Stagger` solved this for itself by reading `useIntroReady()` internally, which
 * worked while the entrance was one component. The score is now spread across
 * the copy column and the portrait, and both have to start on the same frame, so
 * the cue is read once here and handed down by context instead of being read
 * independently in each place. Two components polling the same event is how a
 * sequence acquires a stutter nobody can find later.
 *
 * The default is `true`, so a `MaskReveal` used anywhere else on the site, in a
 * section that has no opening film to wait for, is unaffected.
 *
 * Hero.tsx is a server component and holds the copy and the translations, which
 * is why this is a provider wrapped around its children rather than a client
 * component that renders them: the markup, the message lookups and the careful
 * per-locale measure notes all stay on the server, and only the timing crosses
 * the boundary.
 */
const HeroReady = createContext(true);

export const useHeroReady = () => useContext(HeroReady);

/**
 * The copy column, and the conductor for the whole first screen.
 *
 * It carries the column's own grid classes so the layout is unchanged from the
 * `Stagger` it replaces: same order, same span, same measure.
 */
export function HeroCopy({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ready = useIntroReady();
  return (
    <HeroReady.Provider value={ready}>
      <div className={className}>{children}</div>
    </HeroReady.Provider>
  );
}

/**
 * One beat of the score, as a fade up.
 *
 * The supporting line, the figures and the actions use this rather than an
 * aperture. An aperture is the expensive-looking reveal and spending it four
 * times on one screen is how it stops being an event; it is kept for the eyebrow,
 * the two headline lines and the portrait, which are the type that carries the
 * argument. Everything downstream of them supports, and supporting copy that
 * announces itself as loudly as the headline flattens the hierarchy the
 * typography just established.
 *
 * Travel is `dist.text`, which is 18px: far enough to read as arriving, close
 * enough that it never reads as flying in.
 */
export function HeroBeat({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ready = useHeroReady();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: dist.text }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: dist.text }}
      transition={{ duration: dur.base, delay, ease: ease.soft }}
    >
      {children}
    </motion.div>
  );
}
