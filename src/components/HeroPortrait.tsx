"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { heroMedia } from "@/lib/media";
import { displayItem } from "@/lib/ui";
import { dur, ease, heroBeat, imageScale } from "@/lib/motion";
import { useIntroReady } from "@/lib/use-intro-ready";
import { MediaFrame } from "./MediaFrame";
import { FrameMask, MaskReveal } from "./MaskReveal";

/**
 * The hero portrait, and the site's signature moment.
 *
 * COMPOSITION, unchanged. Four layers, only one of which is the photograph: a
 * warm pool of light wider than the frame so the arch is lit rather than pasted
 * on; a hairline beige mat, evenly offset, that reads as the frame's edge; the
 * arch itself, carrying one warm shadow for depth; and the image, oversized
 * inside the arch so the drift never exposes an edge. The arch is the alcove from
 * the academy's own room and is the brand's shape, so nothing here morphs it.
 *
 * THE ENTRANCE. The portrait arrives through an aperture rather than a fade: the
 * arch opens over its own height while the photograph inside holds still, which
 * is the one reveal in the vocabulary that reads as a camera rather than as a
 * web page. It is the second beat of the first screen's score (`heroBeat`), after
 * the bar and before its own frame, and the mat and the pool follow it in so the
 * furniture assembles around the face instead of arriving with it.
 *
 * THE SIGNATURE SEQUENCE. As the first screen scrolls away, the composition
 * resolves into a plate. Four things move together, all of them scroll-linked and
 * all of them transforms:
 *
 *   the arch scales up, slowly, so the frame reads as opening rather than leaving
 *   the photograph inside scales further, so the crop tightens on her as it opens
 *   the mat, the pool and the credit recede and fade, so the furniture clears
 *   the whole plate lifts a little against the scroll, so it holds the eye
 *
 * The effect is a frame becoming immersive under the reader's own scroll: she
 * stays in control the entire time, nothing is pinned, nothing is hijacked, and
 * the section leaves on the same gesture that would have scrolled it away
 * anyway. The ceiling on the scale is `imageScale.depth`, which is where the crop
 * starts eating the edge of the composition; the shadow deepens with it, which is
 * the only non-transform in the sequence and it is on a single element.
 *
 * AMIRA'S FILM. The sequence is built to carry her footage and the slot is
 * `heroMedia.videoSrc` in lib/media.ts, which has always existed for this.
 * MediaFrame renders the poster as the LCP candidate, layers the clip over it
 * once it can actually play, and falls back to the poster alone under reduced
 * motion or a dead source. So setting that one field turns the portrait beat into
 * a portrait-to-film reveal inside this same choreography, with no change here.
 *
 * It is null today because the project contains no footage of Amira. All four
 * clips in the repository are treatment macros: two brow close-ups in the root,
 * and mapping.mp4 and pigment.mp4, both of which are already placed elsewhere on
 * the page. Substituting one of those would put a stranger's gloved hands where
 * the site says the founder is, and would print the same clip twice, so the beat
 * waits for the real asset rather than borrowing one.
 *
 * WIDTH. Capped against viewport height as well as against a maximum, since a 3:4
 * frame left to fill its grid column overruns the fold on every common laptop.
 * The credit is part of that budget and the budget is tighter than it looks: a 3:4
 * frame is a third taller than it is wide, so every vh added to the cap costs 1.33
 * in height. From lg the frame is aligned to the inline end of its column rather
 * than centred: a portrait centred in half a page reads as an illustration beside
 * some text, the same portrait held against the edge of the paper reads as the
 * composition the text was set into. The alignment is logical, so Arabic gets the
 * mirror rather than a special case.
 *
 * The credit is two lines, her name in the display serif over the role in small
 * caps, and it opens through the same aperture as everything else.
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
  // opens with the copy rather than behind the overlay.
  const ready = useIntroReady();

  /**
   * Two scroll readings, deliberately not one.
   *
   * `drift` is the old in-frame parallax and runs across the whole time the
   * section is on screen, which is what keeps the photograph alive inside its
   * crop while the hero is being read.
   *
   * `exit` runs only from the moment the section starts leaving the top of the
   * viewport, which is what the signature sequence is keyed to. Keying the
   * sequence to the same range as the drift would have it a third of the way
   * open before a reader had finished the headline.
   */
  const { scrollYProgress: drift } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: exit } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Travel stays well inside the -6% inset on the image.
  const imageY = useTransform(drift, [0, 1], ["-2.5%", "2.5%"]);

  // The sequence. Nothing moves for the first fifth, so the composition is at
  // rest for as long as the first screen is actually being read.
  const plateScale = useTransform(exit, [0.2, 1], [1, 1.06]);
  const plateY = useTransform(exit, [0.2, 1], [0, -28]);
  const mediaScale = useTransform(exit, [0.2, 1], [1, imageScale.depth]);

  /**
   * The furniture recede, as one derived value per element rather than one value
   * shared by three.
   *
   * This looks like pointless duplication and is not. The three elements first
   * shared a single `furniture` motion value for opacity, and only one of them
   * ever received it: the ambient pool kept the opacity React server-rendered and
   * was never written to again, while the mat and the credit were written the
   * constant 1 no matter where the scroll was. The giveaway was that `y`, shared
   * between two of the same elements, updated correctly on both, so the scroll
   * source and the ranges were provably right. A motion value drives the element
   * that binds it; handing the same instance to three of them is not a contract
   * Motion makes, and the failure is silent, which is the worst kind.
   *
   * Deriving one per element costs three subscriptions to a scroll value that
   * already exists and removes the question entirely. If a fourth thing ever needs
   * to recede, give it its own.
   */
  const glowOpacity = useTransform(exit, [0.15, 0.6], [1, 0]);
  const matOpacity = useTransform(exit, [0.15, 0.6], [1, 0]);
  const matY = useTransform(exit, [0.15, 0.6], [0, -14]);
  const creditOpacity = useTransform(exit, [0.15, 0.6], [1, 0]);
  const creditY = useTransform(exit, [0.15, 0.6], [0, -14]);
  const shadow = useTransform(
    exit,
    [0.2, 1],
    [
      "0 46px 90px -46px color-mix(in srgb, var(--aura-espresso) 55%, transparent)",
      "0 70px 130px -50px color-mix(in srgb, var(--aura-espresso) 70%, transparent)",
    ],
  );

  return (
    <motion.div
      ref={ref}
      style={{ y: plateY }}
      className="signature relative mx-auto w-full max-w-[min(17rem,30svh)] sm:max-w-[min(22rem,40svh)] lg:ms-auto lg:me-0 lg:max-w-[min(40rem,56vh)]"
    >
      {/* Ambient warmth. A plain radial rather than a blurred disc: a 40rem
          element under a blur filter is a large, repeatedly composited paint.
          It clears with the rest of the furniture as the plate takes over. */}
      <motion.span
        aria-hidden
        style={{ opacity: furniture }}
        className="signature pointer-events-none absolute -inset-x-[22%] -top-[14%] bottom-[-8%] -z-20 bg-[radial-gradient(52%_46%_at_50%_42%,color-mix(in_srgb,var(--aura-bronze)_16%,transparent),transparent_70%)]"
      />

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Hairline mat. Same arch, evenly offset, so it reads as a frame rather
            than a misregistered second copy. It arrives after the portrait and
            clears before it, which is what makes the frame read as furniture
            around her rather than as part of the photograph. */}
        <motion.span
          aria-hidden
          initial={{ opacity: 0, scale: 0.985 }}
          animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.985 }}
          transition={{
            duration: dur.slow,
            delay: heroBeat.frame,
            ease: ease.aura,
          }}
          className="arch pointer-events-none absolute -inset-x-4 -top-4 bottom-4 -z-10 border border-bronze/35 md:-inset-x-6 md:-top-6 md:bottom-6"
        >
          <motion.span
            aria-hidden
            style={{ opacity: furniture, y: furnitureY }}
            className="signature block h-full w-full"
          />
        </motion.span>

        {/* The plate. Scales under scroll; the arch shape itself never changes,
            because it is the brand's shape and not a transition. */}
        <motion.div
          style={{ scale: plateScale, boxShadow: shadow }}
          className="signature arch relative aspect-[3/4] w-full origin-center overflow-hidden"
        >
          {/* The entrance aperture. Opens over the arch's own height while the
              photograph holds still inside it. */}
          <FrameMask
            onMount
            play={ready}
            delay={heroBeat.portrait}
            duration={dur.plate}
          >
            <motion.div
              style={{ scale: mediaScale }}
              className="signature h-full w-full origin-center"
            >
              <motion.div style={{ y: imageY }} className="drift absolute inset-[-6%]">
                <MediaFrame
                  media={{ ...heroMedia, alt }}
                  priority
                  sizes="(max-width: 640px) 72vw, (max-width: 1024px) 22rem, 40rem"
                  imageClassName="settle"
                />
              </motion.div>
            </motion.div>
          </FrameMask>

          {/* Light falling from the crown of the arch, as in the room. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--aura-white)_28%,transparent),transparent_32%)]"
          />
        </motion.div>
      </motion.div>

      {name ? (
        <motion.div
          style={{ opacity: furniture, y: furnitureY }}
          className="signature mt-5 text-center md:mt-6"
        >
          <MaskReveal onMount play={ready} delay={heroBeat.name} duration={dur.base}>
            <p className={`${displayItem} leading-none text-espresso`}>{name}</p>
          </MaskReveal>
          {role ? (
            <MaskReveal
              onMount
              play={ready}
              delay={heroBeat.role}
              duration={dur.base}
              className="mt-2.5"
            >
              <p className="label leading-[1.7] text-mute">{role}</p>
            </MaskReveal>
          ) : null}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
