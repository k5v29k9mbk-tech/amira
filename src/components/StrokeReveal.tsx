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
   *
   * THE END MOVED FROM 0.65 TO 0.95 WHEN THE FRAME BECAME A PORTRAIT, and it
   * had to. The tail is measured against the section's bottom edge, so what it
   * really sets is how much of the section has to be above the fold before the
   * sweep is allowed to finish. At 0.65 the photograph completed with the
   * section's end two thirds up the screen, which was fine while the section
   * was around 700px tall and fitted inside a 900px viewport with room over. A
   * 9:10 plate makes it 859, and 859 with its end at 0.65 of 900 puts the top of
   * the figure three hundred pixels above the fold: the reveal landed on a
   * picture the reader could no longer see whole.
   *
   * At 0.95 the sequence resolves with the section's end just inside the bottom
   * of the screen, which for a section a little shorter than the viewport is the
   * moment the whole plate is framed. The sweep is unchanged, and so is
   * everything it is made of; only the scroll it is spent over is, and it is now
   * the section's own height rather than that plus a quarter of a screen.
   */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.95"],
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
        9:10, WHICH IS THE PHOTOGRAPH'S OWN RATIO, AND THAT IS THE WHOLE POINT.

        The frame was 3:2 and landscape, because the photograph under it was a
        1320x689 macro of one brow and the box was cut a fifth narrower than the
        file so `object-cover` could spend that fifth on the treatment bed at the
        right edge. The photograph is now three close-ups of the same brows
        stacked one under the other: the mapping drawn in white and the result of
        the treatment, in a 1600x1777 file. Stacked bands cannot survive a
        landscape crop. A 3:2 box over a 9:10 file discards about two thirds of
        the height, which would have left exactly one of the three bands on the
        page and thrown away the comparison that is the reason to use this
        photograph at all.

        So the box takes the file's own ratio, and `object-cover` has nothing
        left to cut: at every width the three bands are whole, and no crop
        decision is being made by a breakpoint. The alternative was to keep 3:2
        and letterbox with `object-contain`, which paints `bg-paper` bars above
        and below a picture in a section whose ground is ivory, and reads as an
        image that failed to fill its frame.

        THE CROP IS IN THE FILE, NOT IN THE CSS, which is how the rest of this
        site handles a photograph that needs one. `scripts` has no entry for it:
        it is a centred 2493x2770 cut of the academy's 2493x3116 original, taken
        so the top of the first brow and the lower lashes of the third both keep
        a margin, then resampled to 1600 wide. Nothing is graded, and the two
        files are the same photograph the microblading page opens on.

        THE HEIGHT IS CAPPED AT lg, AND THE WIDTH FOLLOWS IT. Seven columns of a
        1600px shell is 839px, and 839 at 9:10 is a 932px plate against a
        four-column paragraph: the figure stops being the argument and becomes
        the section. 40rem holds it to 640px tall and 576 wide, centred in its
        cell. It is the same move, and the same reasoning, as the cap on the
        portrait in `AuthorityStrip`.

        THE NUMBER IS SET BY THE FIXED BAR, not by taste. The sweep below
        resolves with the section's end just inside the bottom of the screen, so
        whatever the section stands is what has to fit above that point, and the
        bar owns the top hundred pixels of it. At 44rem the section was 859 and
        the top of the plate finished under the bar on a 900px laptop; at 40rem
        it is 796, which clears on anything taller than about 960 and leaves a
        sliver on the shortest laptops. It is 81px more than the old landscape
        frame stood, which is the whole of what this change costs the page.

        Below lg the figure takes the column it is given, where a phone spends
        380px of height on it and a tablet 838, and neither has a fixed bar over
        the content to clear.

        The drawing is unaffected: it is a viewBox with `meet`, so it fits
        whatever box it is given and simply centres in this one, which puts the
        drawn brow across the middle band. Both layers still share a single box,
        which is what keeps the second mask travelling over the first with
        nothing reflowing between them. `overflow-hidden` because both masks run
        past the edges by design.
      */}
      <figure className="relative mx-auto aspect-[9/10] w-full overflow-hidden bg-paper lg:max-h-[40rem] lg:w-auto">
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

          `sizes` is the figure's real width rather than 100vw, and the cap
          above is what sets it: from lg the plate is never wider than 576px,
          because past roughly 1200 the 40rem height binds and the width stops
          growing with the column. 620 covers the widest it ever renders with a
          little to spare. Getting this wrong is the difference between a
          700px file and a 2000px one on a phone.

          `object-cover` and a centred origin are deliberate rather than
          leftovers: the box and the file are the same ratio, so cover crops
          nothing today, and if either is ever nudged the trim is taken evenly
          off both ends instead of eating one of the three bands.
        */}
        <motion.div
          className="stroke-plate absolute inset-0"
          style={{
            maskImage: photoMask,
            WebkitMaskImage: photoMask,
          }}
        >
          <Image
            src="/brand/microblading-stages-brows.jpg"
            alt={alt}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 50%" }}
          />
        </motion.div>
      </figure>

      <figcaption className="mt-5 max-w-[46ch] text-[14px] leading-relaxed text-mute">
        {caption}
      </figcaption>
    </div>
  );
}
