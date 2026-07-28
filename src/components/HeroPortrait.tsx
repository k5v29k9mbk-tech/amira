"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * The portrait as an object on the page rather than a bleed behind it.
 *
 * Width is capped rather than left to fill its grid column. At col-span-6 the
 * 3:4 frame came out 837px tall, which overflowed the fold on every common
 * laptop; 27rem keeps the whole composition inside an 800px viewport.
 *
 * Three layers, all decorative except the photograph: a pool of warm light
 * behind, a symmetric hairline mat, then the arch. The arch is the studio's own
 * alcove, so the frame belongs to the brand rather than to a UI kit.
 *
 * Two motions, both slow enough to read as presence rather than animation: a
 * parallax on the image inside its frame, and a long float on the assembly.
 * Both run on motion values, so nothing re-renders per frame.
 */
export function HeroPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Travel stays well inside the -7% inset, so no frame edge is ever exposed.
  const y = useTransform(scrollYProgress, [0, 1], ["-3.5%", "3.5%"]);

  return (
    <motion.div
      ref={ref}
      // Enters from the outer edge, so it arrives into the composition rather
      // than rising into it like the copy does.
      initial={reduce ? false : { opacity: 0, x: 52, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.3, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      // Larger than before, still capped by viewport height so short screens
      // shrink the frame instead of burying the call to action.
      className="group relative mx-auto w-full max-w-[23rem] sm:max-w-[27rem] lg:max-w-[min(32rem,54vh)] rtl:[--enter:-52px]"
    >
      {/* Warm pool. A plain radial rather than a blurred disc: a 38rem element
          under blur-3xl is a large, repeatedly composited paint. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-16 -top-20 bottom-0 -z-20 bg-[radial-gradient(50%_42%_at_50%_38%,var(--glow),transparent_72%)]"
      />

      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Champagne disc the portrait breaks out of: the editorial overlap
            that stops the frame reading as a box. Offset up and outward so the
            arch crosses it rather than sitting concentrically inside. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-10 -top-14 -z-20 aspect-square w-[78%] rounded-full bg-[radial-gradient(circle_at_35%_30%,color-mix(in_srgb,var(--accent)_16%,transparent),color-mix(in_srgb,var(--surface-2)_70%,transparent)_62%,transparent_72%)]"
        />
        {/* Hairline mat, evenly offset on all four sides so it reads as a frame
            rather than a misregistered second copy. */}
        <span
          aria-hidden
          className="arch absolute -inset-x-5 -top-5 bottom-5 -z-10 border border-accent/45 md:-inset-x-7 md:-top-7 md:bottom-7"
        />

        <div className="arch relative aspect-[3/4] w-full shadow-[0_44px_90px_-34px_color-mix(in_srgb,var(--accent)_50%,transparent)] transition-shadow duration-700 group-hover:shadow-[0_54px_110px_-34px_color-mix(in_srgb,var(--accent)_62%,transparent)]">
          <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-7%]">
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 640px) 84vw, (max-width: 1024px) 24rem, 27rem"
              className="object-cover object-[52%_20%] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
            />
          </motion.div>

          {/* Light falling from the crown of the alcove, as in the room. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--ink)_20%,transparent),transparent_36%)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
