"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { heroFilmMedia } from "@/lib/media";
import { imageScale } from "@/lib/motion";
import { MediaFrame } from "./MediaFrame";

/**
 * The first screen's ground: the academy's own film, full bleed, and the two
 * gradients that let type sit on it.
 *
 * WHY THIS IS A COMPONENT AND NOT THREE SPANS IN THE HERO. The gradients are not
 * decoration, they are the other half of the crop: each one is shaped to the
 * type it sits under, and moving the type without moving them is how a hero ends
 * up either illegible or uniformly grey. Keeping the film, its travel and its
 * scrim in one file means the composition can be re-aimed in one place.
 *
 * THE SCRIM, IN FOUR LAYERS, AND WHY IT IS BUILT THIS WAY.
 *
 * The composition over this film is centred, and that is what the scrim is
 * shaped to. Every layer is espresso rather than black: the classroom is lit
 * warm, and a neutral tint over it reads cold and slightly grey, where the
 * brand's own near-black keeps the light that is actually in the room.
 *
 *   1. A flat 42% grade over the whole frame, which holds the picture back a
 *      stop so the words sit in front of it rather than in it.
 *   2. A soft elliptical pool over the middle, where the type is. This is the
 *      layer that buys legibility; the flat grade alone cannot, because half of
 *      this clip is a white flipchart.
 *   3. A vertical frame, darker at the top and bottom edges, under the fixed
 *      header and under the scroll cue.
 *   4. A vignette in the corners, weak enough that it is only read as the
 *      picture having a centre.
 *
 * Each is commented at the element itself. What matters as a whole: the darkness
 * is concentrated where the reading happens and released everywhere else, so the
 * corners and the top of the frame stay film. None of them is mirrored for
 * Arabic and none needs to be — a centred composition has no inline start to
 * weight, which is the one simplification centring buys here.
 *
 * THE TRAVEL. One scroll-linked transform, and it is the smallest one on the
 * site: the frame drifts five percent of its own height and scales by
 * `imageScale.depth` across the whole time the hero is leaving. That is enough
 * for the ground to lag behind the type it carries, which is what reads as
 * depth, and far short of anything a reader would call an effect.
 *
 * The element carrying it is `.drift`, which is a contract with globals.css:
 * a motion value written straight to `style` is not an animation, so Motion's
 * `reducedMotion` policy cannot see it, and the rule inside the
 * `prefers-reduced-motion` block zeroes the transform with an author
 * `!important` instead. Move the transform off this class and the preference
 * silently stops working.
 *
 * The oversize is what makes the travel safe. The frame is inset by -6% on every
 * side, so five percent of drift and six of scale never bring an edge into the
 * section; without it the bottom of the viewport would show through as the hero
 * scrolled away.
 */
export function HeroFilm() {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Keyed to the hero leaving, not to the hero being on screen. The section
   * starts at the top of the page, so a range that opened at "start end" would
   * already be part-way through before a visitor had scrolled at all.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, imageScale.depth]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <motion.div style={{ y, scale }} className="drift absolute inset-[-6%]">
        <MediaFrame
          media={heroFilmMedia}
          priority
          eager
          sizes="100vw"
          imageClassName="settle"
        />
      </motion.div>

      {/* 1. THE GRADE. An even wash at 42%, and it is the one layer here that
          treats the whole frame alike.

          This is the layer the earlier version of this screen argued against,
          and the argument was right about a composition set against the inline
          margin: a flat tint spends contrast evenly whether type is over a part
          of the frame or not, and evenly-spent contrast is what makes footage
          read as a stock background. A centred composition changes the premise.
          The type is now in the middle of the frame rather than down one side,
          so there is no side to weight, and the even wash is what holds the
          whole picture back a stop so the words sit in front of it rather than
          in it. It is espresso and not black: the classroom is lit warm, and a
          neutral tint over it reads as grey television. */}
      <span className="absolute inset-0 bg-espresso/[0.42]" />

      {/* 2. THE POOL. What actually makes the centred type legible.

          42% over a white flipchart still leaves ivory on near-ivory, and the
          flipchart is half of this clip. So the darkness is concentrated where
          the words are: a wide, soft ellipse over the middle of the screen,
          strongest at its core and gone by the edges of the frame. Composited
          with the wash above it, the type sits on roughly three quarters
          coverage while the corners of the picture stay near the 42% grade.

          The long falloff is the whole trick. The stops run 54, 46, 24, 0 across
          a radius that is wider than the screen, so there is no ring anywhere in
          it: a reader sees a lit room that happens to be darker in the middle,
          which is what a light in a real room does, not a panel over a video. */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_92%_74%_at_50%_50%,color-mix(in_srgb,var(--aura-espresso)_54%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_46%,transparent)_38%,color-mix(in_srgb,var(--aura-espresso)_24%,transparent)_68%,transparent_100%)]" />

      {/* 3. THE FRAME. Top and bottom, the two edges the composition does not
          own: the fixed header sits on one and the scroll cue on the other, and
          both need a ground that is darker than the middle or they float on
          whatever the footage is doing behind them. A cinema frame is darker at
          its edges than at its centre, and this is that, done vertically. */}
      <span className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-espresso)_58%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_16%,transparent)_22%,transparent_46%,color-mix(in_srgb,var(--aura-espresso)_20%,transparent)_78%,color-mix(in_srgb,var(--aura-espresso)_56%,transparent)_100%)]" />

      {/* 4. THE VIGNETTE. The corners, and nothing else: transparent across the
          middle 55% of the frame and 26% at the very edge. It is deliberately
          the weakest layer on the screen. A vignette that can be seen as a
          vignette is a filter; one this soft is only read as the picture having
          a centre, which is the entire point of it under a centred composition. */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_78%_70%_at_50%_50%,transparent_55%,color-mix(in_srgb,var(--aura-espresso)_26%,transparent)_100%)]" />
    </div>
  );
}
