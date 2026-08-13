"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { heroMedia } from "@/lib/media";
import { displayItem } from "@/lib/ui";
import { useIntroReady } from "@/lib/use-intro-ready";
import { MediaFrame } from "./MediaFrame";

/**
 * The hero portrait, as an object on the page rather than a bleed behind it.
 *
 * Four layers, only one of which is the photograph:
 *   1. a warm pool of light, wider than the frame, so the arch is lit rather
 *      than pasted onto the ground,
 *   2. a hairline beige mat, evenly offset, that reads as the frame's edge,
 *   3. the arch itself, carrying a single warm shadow for depth,
 *   4. the image, oversized inside the arch so the parallax never exposes an
 *      edge.
 *
 * There were two more: an outline ring set off centre and a small filled disc
 * low on the other side. Both have gone. A bronze circle floating behind a
 * portrait is the single most reproduced device on a beauty-industry template,
 * and with the arch, the mat, the pool and the page's own two washes already in
 * this corner of the composition, they were the fifth and sixth decorative
 * shape competing for the same glance. The arch is the shape here.
 *
 * Three motions, all of them slow enough to read as presence: a fade and rise
 * on load, a 3px float over nine seconds, and a parallax on the image inside
 * its frame. Float and parallax are separate elements so the two transforms
 * never fight, and both run on motion values, so nothing re-renders per frame.
 *
 * Under a reduced-motion preference the portrait fades in and holds still, and it
 * takes two mechanisms to get there because the three motions are not the same
 * kind of thing. The entrance and the float are animations, so MotionProvider's
 * `reducedMotion="user"` gives their transforms an instant transition: the rise
 * resolves to nothing and the float never travels. The parallax is a scroll-bound
 * motion value written to `style`, which no animation policy can see, so it
 * carries `drift` and is neutralised by the `prefers-reduced-motion` block in
 * globals.css. All three used to branch on the preference during render, which
 * put a hydration mismatch in the first element of the first screen.
 *
 * Width is capped against viewport height as well as against a maximum, since
 * a 3:4 frame left to fill its grid column overruns the fold on every common
 * laptop. The caption is part of that budget, and the budget is tighter than it
 * looks: a 3:4 frame is a third taller than it is wide, so every vh added to
 * the cap costs 1.33 of them in height. On a 900px laptop the section keeps
 * 744px for the frame and its caption, which is what puts the ceiling at 56vh.
 * Above that the caption lands on the fold line, which is what 60vh did.
 *
 * From lg the frame is aligned to the inline end of its column rather than
 * centred in it. A portrait centred in half a page reads as an illustration
 * beside some text; the same portrait held against the edge of the paper reads
 * as the composition the text was set into. The alignment is logical, so Arabic
 * gets the mirror of it rather than a special case.
 *
 * `name` and `role` are the gallery credit under the frame: they put a name on
 * the face, which is the one thing the photograph cannot say by itself. It sits
 * outside the float so the type stays still while the portrait breathes.
 *
 * The credit is two lines rather than one, and the name is in the display serif.
 * It used to be a single small-caps line, "Amira Bechini · Founder and PMU
 * Master", which is a photo credit: the same 11px the site uses for the word
 * "Level". This page's whole argument is that the academy is a named master
 * rather than an institution, and on the one screen where her face is at full
 * size her name was the smallest type in the composition. Set in the serif it
 * reads as a signature under a portrait, which is what it is, and the role
 * stays in the small caps underneath so the hierarchy between them is legible.
 */
export function HeroPortrait({
  alt,
  name,
  role,
}: {
  alt: string;
  name?: string;
  role?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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
      initial={{ opacity: 0, y: 26 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      /* The phone cap was 12.5rem, which is 200px whatever the handset, and a
         200px arch above a 40px headline reads as a thumbnail of a portrait
         rather than as the portrait. It was set that tight to hold the whole
         hero inside one screen, a budget the section has never actually met:
         the copy alone is over 500px before the frame is counted. Spending the
         truth of that gets the composition a portrait at about two thirds of
         the screen width, which is the size at which a face is a person. */
      className="relative mx-auto w-full max-w-[min(17rem,30svh)] sm:max-w-[min(22rem,40svh)] lg:ms-auto lg:me-0 lg:max-w-[min(40rem,56vh)]"
    >
      {/* Ambient warmth. A plain radial rather than a blurred disc: a 40rem
          element under a blur filter is a large, repeatedly composited paint. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-[22%] -top-[14%] bottom-[-8%] -z-20 bg-[radial-gradient(52%_46%_at_50%_42%,color-mix(in_srgb,var(--aura-bronze)_16%,transparent),transparent_70%)]"
      />
      <motion.div
        animate={{ y: [0, -3, 0] }}
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
          <motion.div style={{ y }} className="drift absolute inset-[-6%]">
            <MediaFrame
              media={{ ...heroMedia, alt }}
              priority
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 22rem, 40rem"
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

      {name ? (
        <div className="mt-5 text-center md:mt-6">
          <p className={`${displayItem} leading-none text-espresso`}>{name}</p>
          {role ? (
            <p className="label mt-2.5 leading-[1.7] text-mute">{role}</p>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}
