"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { browHairs } from "@/lib/brow-hairs";

/**
 * THE STROKE. The one signature interaction on the site, and the only thing on
 * it that animates for its own sake.
 *
 * WHAT IT IS. A brow is drawn, hair by hair, from the head to the tail, in the
 * order and the direction a blade actually works in. When the drawing is
 * finished the academy's own macro photograph travels across it on the same
 * line and replaces it, so the last thing the reader sees is the real brow
 * where the drawn one was. Microblading is the only discipline on the
 * catalogue that is literally the drawing of single hairs, so this is the one
 * animation on the site that is about the craft rather than about the page.
 *
 * IT IS ONE MOTION VALUE, NOT A HUNDRED AND FIFTY. The obvious build gives
 * every hair its own `stroke-dashoffset` bound to scroll, which is 150 motion
 * values, 150 subscriptions and 150 style writes a frame on a phone. What is
 * used instead is a mask with a soft edge that travels across the whole
 * drawing: because the hairs are short, sorted head to tail and roughly the
 * width of the mask's own gradient, each one resolves as the edge crosses it,
 * which is the same thing to look at and one style write a frame. The second
 * edge, the photograph's, is the same trick again.
 *
 * NO NEW DEPENDENCY, and no canvas. The art is 150 quadratic paths in the
 * markup, which gzip well because they are all the same shape of string, and
 * the whole effect is two CSS masks.
 *
 * REDUCED MOTION IS HANDLED IN CSS, NOT HERE. Both masks and both opacities are
 * motion values bound straight to `style`, which is the one category Motion's
 * `reducedMotion="user"` cannot reach: nothing is ever animated, the values are
 * written every frame from scroll position. `globals.css` pins them inside its
 * `prefers-reduced-motion` block, where an author `!important` outranks the
 * inline style. The classes below are that contract. Moving the `style` to
 * another element means moving the class with it, or the preference silently
 * stops working.
 *
 * The resting state is deliberately the finished composition: the photograph
 * present and the drawing behind it. So a reader who has asked for no movement
 * lands on the same picture everyone else ends on, held still, rather than on
 * an empty frame.
 */
export function StrokeReveal({
  alt,
  caption,
}: {
  alt: string;
  caption: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * The window the whole sequence plays in.
   *
   * It starts when the frame is most of the way up the screen and ends before
   * the frame leaves it, so the drawing finishes while the figure is still
   * being looked at rather than as it exits. A reader who scrolls past quickly
   * sees a finished brow, not a half-drawn one.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.65"],
  });

  // The drawing's edge. Runs past both ends of the box so the sweep clears the
  // art completely at each end rather than stopping with a band still showing.
  const inkEdge = useTransform(scrollYProgress, [0, 0.62], [-14, 118], {
    clamp: true,
  });
  const inkTail = useTransform(inkEdge, (v) => v - 11);
  const inkMask = useMotionTemplate`linear-gradient(90deg, #000 ${inkTail}%, transparent ${inkEdge}%)`;

  // The photograph's edge, starting as the drawing completes.
  const photoEdge = useTransform(scrollYProgress, [0.55, 0.98], [-14, 118], {
    clamp: true,
  });
  const photoTail = useTransform(photoEdge, (v) => v - 13);
  const photoMask = useMotionTemplate`linear-gradient(90deg, #000 ${photoTail}%, transparent ${photoEdge}%)`;

  return (
    <div ref={ref} className="relative">
      {/*
        The frame carries the photograph's own 1320x689, so the drawing and the
        picture occupy exactly the same box and nothing reflows when the second
        mask starts. `overflow-hidden` because both masks travel past the edges.
      */}
      <figure className="relative aspect-[1320/689] w-full overflow-hidden bg-paper">
        {/*
          THE DRAWING. A viewBox of 520x190 against a 1320x689 frame, centred
          with `xMidYMid meet`, so the brow keeps its proportion at every width
          and simply sits smaller on a phone. `vectorEffect` holds the hairline
          at the same optical weight however far the SVG is scaled up, which is
          what stops the strokes turning into ribbons on a desktop.
        */}
        <motion.svg
          viewBox="0 0 520 190"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          className="stroke-ink absolute inset-0 h-full w-full"
          style={{
            maskImage: inkMask,
            WebkitMaskImage: inkMask,
          }}
        >
          <g fill="none" stroke="var(--aura-espresso)" strokeLinecap="round">
            {browHairs.map((hair, i) => (
              <path
                key={i}
                d={hair.d}
                strokeWidth={hair.w}
                vectorEffect="non-scaling-stroke"
                opacity={0.78}
              />
            ))}
          </g>
        </motion.svg>

        {/*
          THE PHOTOGRAPH, travelling over the drawing on the same line.

          `sizes` is the figure's real width rather than 100vw: it is seven of
          twelve columns inside the page shell from lg and full width below it.
          Getting this wrong is the difference between a 1320px file and a
          3000px one on a phone.
        */}
        <motion.div
          className="stroke-plate absolute inset-0"
          style={{
            maskImage: photoMask,
            WebkitMaskImage: photoMask,
          }}
        >
          <Image
            src="/brand/brows-pair-macro.jpg"
            alt={alt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "38% 62%" }}
          />
        </motion.div>
      </figure>

      <figcaption className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-mute">
        {caption}
      </figcaption>
    </div>
  );
}
