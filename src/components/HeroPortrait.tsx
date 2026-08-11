"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { heroMedia } from "@/lib/media";
import { useIntroReady } from "@/lib/use-intro-ready";
import { MediaFrame } from "./MediaFrame";

/**
 * The hero portrait, as an object on the page rather than a bleed behind it.
 *
 * Five layers, only one of which is the photograph:
 *   1. a warm pool of light, wider than the frame, so the arch is lit rather
 *      than pasted onto the ground,
 *   2. a thin outline ring set off centre, the one decorative shape in the
 *      composition,
 *   3. a hairline beige mat, evenly offset, that reads as the frame's edge,
 *   4. the arch itself, carrying a single warm shadow for depth,
 *   5. the image, oversized inside the arch so the parallax never exposes an
 *      edge.
 *
 * Three motions, all of them slow enough to read as presence: a fade and rise
 * on load, a 3px float over nine seconds, and a parallax on the image inside
 * its frame. Float and parallax are separate elements so the two transforms
 * never fight, and both run on motion values, so nothing re-renders per frame.
 * Under prefers-reduced-motion the portrait simply appears and holds still.
 *
 * Width is capped against viewport height as well as against a maximum, since
 * a 3:4 frame left to fill its grid column overruns the fold on every common
 * laptop. The caption is part of that budget: the caps came down a step when it
 * was added, so the block as a whole still clears the fold. Within the cap the
 * frame is still the largest object on the page.
 *
 * `caption` is the gallery label under the frame: it puts a name and a role on
 * the face, which is the one thing the photograph cannot say by itself. It sits
 * outside the float so the type stays still while the portrait breathes.
 */
export function HeroPortrait({ alt, caption }: { alt: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Holds the entrance until the opening film has finished, so the portrait
  // rises into view with the copy rather than behind the overlay.
  const ready = useIntroReady();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Travel stays well inside the -6% inset on the image.
  const y = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[min(17.5rem,36svh)] sm:max-w-[min(26rem,46svh)] lg:max-w-[min(38rem,54vh)]"
    >
      {/* Ambient warmth. A plain radial rather than a blurred disc: a 40rem
          element under a blur filter is a large, repeatedly composited paint. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[22%] -top-[14%] bottom-[-8%] -z-20 bg-[radial-gradient(52%_46%_at_50%_42%,color-mix(in_srgb,var(--aura-bronze)_16%,transparent),transparent_70%)]"
      />
      {/* Outline ring, off centre so it crosses the arch instead of framing it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -end-[14%] -top-[9%] -z-20 aspect-square w-[62%] rounded-full border border-bronze/25"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -start-[16%] bottom-[6%] -z-20 aspect-square w-[34%] rounded-full bg-bronze/[0.07]"
      />

      <motion.div
        animate={reduce ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Hairline mat. Same arch, evenly offset, so it reads as a frame
            rather than a misregistered second copy. */}
        <span
          aria-hidden
          className="arch pointer-events-none absolute -inset-x-4 -top-4 bottom-4 -z-10 border border-bronze/35 md:-inset-x-6 md:-top-6 md:bottom-6"
        />

        <div className="arch relative aspect-[3/4] w-full overflow-hidden shadow-[0_46px_90px_-46px_color-mix(in_srgb,var(--aura-espresso)_55%,transparent)]">
          <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-6%]">
            <MediaFrame
              media={{ ...heroMedia, alt }}
              priority
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 28rem, 38rem"
              className="absolute inset-0 h-full w-full"
              imageClassName="settle"
            />
          </motion.div>

          {/* Light falling from the crown of the arch, as in the room. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-white)_28%,transparent),transparent_32%)]"
          />
        </div>
      </motion.div>

      {caption ? (
        <p className="label mt-5 text-center leading-[1.9] text-mute md:mt-6">{caption}</p>
      ) : null}
    </motion.div>
  );
}
