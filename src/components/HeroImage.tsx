"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Hero photograph with a slow parallax drift.
 *
 * The image is scaled to 112% and travels 6% of its height as the hero leaves
 * the viewport, so the copy appears to lift off it. Driven by motion values,
 * which live outside React's render cycle: no state, no re-render per frame.
 *
 * Collapses to a static image under prefers-reduced-motion, where parallax is
 * a common trigger for motion sickness.
 */
export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    // Keeps the hero's existing responsive behaviour: a square well that the
    // copy sits under on phones, full-bleed behind the copy from lg.
    <div
      ref={ref}
      className="relative aspect-square w-full overflow-hidden lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto"
    >
      <motion.div
        style={reduce ? undefined : { y }}
        className={reduce ? "relative h-full w-full" : "relative h-[112%] w-full will-change-transform"}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_28%]"
        />
      </motion.div>
    </div>
  );
}
