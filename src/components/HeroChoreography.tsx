"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
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
 * The conductor for the whole first screen.
 *
 * It carries whatever layout classes it is given and adds nothing of its own, so
 * it can be the grid the composition is built on rather than one column inside
 * it. That is what it is used as now: one provider around both halves of the
 * hero, the statement and the signature, so the two cannot start on different
 * frames. It began as a wrapper for the copy column alone, which was correct
 * only while the other half was a portrait that read the cue for itself.
 */
export function HeroCopy({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ready = useIntroReady();
  const ref = useRef<HTMLDivElement>(null);

  /**
   * THE COMPOSITION LEAVES BEFORE THE FILM DOES.
   *
   * `HeroFilm` already drifts five percent as the first screen scrolls away.
   * The type sat perfectly still against it, which is the one thing that gives
   * a full-bleed hero away as a photograph with text on top: in a real frame
   * the near plane travels further than the far one, and here the near plane
   * was nailed down.
   *
   * So the copy rises 8% of the section as it exits, against the film's 5%
   * downward drift. The two move in opposite directions at similar rates,
   * which is what reads as depth rather than as either element moving; and
   * because the range is keyed to the hero *leaving*, nothing happens at all
   * until a visitor scrolls.
   *
   * `.drift` is the contract with globals.css. A motion value written to
   * `style` is not an animation as far as Motion's reduced-motion policy is
   * concerned, so the class is what lets the media query zero this out with an
   * author `!important`. Move the transform and the class moves with it.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <HeroReady.Provider value={ready}>
      <motion.div ref={ref} style={{ y }} className={`drift ${className ?? ""}`}>
        {children}
      </motion.div>
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
