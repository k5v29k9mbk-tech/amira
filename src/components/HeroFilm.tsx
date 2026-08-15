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
 * THE SCRIM, IN TWO PARTS AND NOT ONE FLAT WASH.
 *
 * A single even tint is the obvious way to make white type safe and it is the
 * one thing that reliably makes footage look like a stock background: it lifts
 * the blacks, flattens the highlights, and leaves every part of the frame
 * equally compromised whether anything is written over it or not.
 *
 * So the strength goes where the words are. The vertical gradient is heavy at
 * the two edges, under the fixed header and under the statement and its
 * actions, and drops to eight percent across the middle band, which is where
 * the lit tablet sits and where nothing is set. The horizontal one weights the
 * inline start, because the statement, the figures and the buttons all hang off
 * that margin while the signature sits at the other end over open frame. It is
 * mirrored for Arabic rather than flipped, so the dark side follows the type.
 *
 * Both are espresso rather than black. The film is lit by one magenta tube and
 * a tablet, and a neutral black scrim over it reads cold and slightly grey;
 * the brand's own near-black keeps the warmth that is actually in the footage.
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

      {/* Under the header, and under the composition.
          A quiet band across the upper middle, which is the part of the frame
          the film has to itself; then a long ramp rather than a late one,
          because the copy column starts at the eyebrow and not at the buttons,
          and a gradient that waits until the last quarter leaves the statement
          to take its chances against whatever the footage is doing. Long is the
          operative word: over roughly 60% of the height nothing about it reads
          as an edge.

          The strengths are the classroom's, not the treatment room's. The clip
          this screen used to carry was a dark room lit by one magenta tube, and
          ivory type sat on it at ten percent. The academy's own lesson is the
          opposite exposure: a lit room, and a white flipchart that fills half
          the frame and passes directly under the statement. Ten percent of
          espresso over white paper leaves ivory type on ivory. The quiet band is
          22 here, and the ramp opens earlier and closes darker.

          Two sets of stops, because the crop is two different pictures. A
          desktop keeps a 16:9 slice of the middle of the frame and the copy
          occupies its bottom half; a phone keeps almost the whole 9:16 frame and
          the same copy runs from a quarter of the way down to the foot of the
          screen, so there is far less film to leave alone and the ramp has to
          start where the eyebrow does. */}
      <span className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-espresso)_62%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_34%,transparent)_14%,color-mix(in_srgb,var(--aura-espresso)_40%,transparent)_28%,color-mix(in_srgb,var(--aura-espresso)_66%,transparent)_62%,color-mix(in_srgb,var(--aura-espresso)_86%,transparent)_100%)] md:bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-espresso)_62%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_24%,transparent)_18%,color-mix(in_srgb,var(--aura-espresso)_22%,transparent)_38%,color-mix(in_srgb,var(--aura-espresso)_64%,transparent)_72%,color-mix(in_srgb,var(--aura-espresso)_84%,transparent)_100%)]" />

      {/* The inline start, where every line of type in the composition hangs.
          It carries the statement specifically: the clip is a lit room and the
          brightest thing in it, a white sleeve, drifts through the middle of the
          frame where the headline is set. Mirrored in Arabic so the weight
          follows the margin rather than staying on the left. */}
      <span className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--aura-espresso)_58%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_28%,transparent)_38%,transparent_70%)] rtl:bg-[linear-gradient(to_left,color-mix(in_srgb,var(--aura-espresso)_58%,transparent)_0%,color-mix(in_srgb,var(--aura-espresso)_28%,transparent)_38%,transparent_70%)]" />
    </div>
  );
}
