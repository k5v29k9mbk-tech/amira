"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The portrait as an object on the page rather than a bleed behind it.
 *
 * Three layers, all decorative except the photograph: a warm pool of light
 * behind, an offset gold hairline arch, then the arch itself. The arch is the
 * studio's own alcove, so the frame is the brand's rather than a generic
 * rounded rectangle.
 *
 * Two motions, both slow enough to read as presence rather than animation: a
 * scroll parallax on the image inside its frame, and a long float on the whole
 * assembly. Driven by motion values, so nothing re-renders per frame.
 */
export function HeroPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
      {/* Pool of warm light. Sits behind everything, never over the copy. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-16 bottom-0 -z-20 bg-[radial-gradient(55%_45%_at_50%_35%,var(--glow),transparent_70%)]"
      />

      <motion.div
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Offset hairline arch: the frame reads as two planes, not a sticker. */}
        <span
          aria-hidden
          className="arch absolute -end-4 -top-5 bottom-8 start-4 -z-10 border border-accent/45 md:-end-6 md:start-6"
        />

        <div className="arch relative aspect-[3/4] w-full shadow-[0_40px_90px_-30px_color-mix(in_srgb,var(--accent)_45%,transparent)]">
          <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-4%]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover object-[52%_22%]"
            />
          </motion.div>

          {/* Light falling from the top of the alcove, as in the studio. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--ink)_22%,transparent),transparent_38%)]"
          />
        </div>
      </motion.div>
    </div>
  );
}
