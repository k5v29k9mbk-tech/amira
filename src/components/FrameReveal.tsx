"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { dur, ease } from "@/lib/motion";

/**
 * How a photograph arrives: through an aperture.
 *
 * This used to be a fade with a lift and a settle inwards from 98.5%, which is a
 * perfectly good reveal and the same one every other site uses. A frame now opens
 * instead. The outer element clips and slides up off its own height while the
 * photograph inside slides down by exactly as much, so the sums cancel and the
 * image never travels: what a reader sees is a slot opening over a stationary
 * photograph, which is how a printed page turns and how a camera shutter works,
 * and it is the single biggest difference between this pass and the last one.
 *
 * The photograph resolves out of a six percent overshoot as the slot opens. That
 * is what stops the two edges reading as one rigid panel sliding past: with the
 * scale held at 1 the effect is a wipe, with the scale resolving it is a reveal.
 *
 * WHY NOT clip-path, which is the obvious way to build this. `clipPath` is not in
 * Motion's positional set, so a clip-path wipe would keep running for a visitor
 * who has asked for no movement and would need its own reduced-motion override.
 * Two translates are transforms, so `reducedMotion="user"` in MotionProvider
 * already makes them instant and the frame is simply present. No new CSS, no
 * branch on the preference during render, nothing to keep in sync. The full
 * reasoning is in lib/motion.ts.
 *
 * Nothing here touches layout. Transform and opacity are composited, the box is
 * exactly the size the caller reserved, and `overflow: hidden` adds none of its
 * own, so no frame moves its neighbours while it arrives and there is no shift at
 * any point in the sequence.
 *
 * The API is unchanged from the fade it replaces: same props, same call sites, so
 * the composition data in lib/media.ts and the two galleries did not have to know
 * this happened.
 *
 * A cautionary note for whoever changes this next: it was a clip-path wipe once
 * before, and it did not survive contact with the browser. `inset(0 0 100% 0)` is
 * normalised to the three-value `inset(0px 0px 100%)`, the two forms do not
 * interpolate, and every frame in the work section stayed clipped shut. Transform
 * and opacity are the two properties that animate reliably everywhere.
 */
export function FrameReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const transition = { duration: dur.frame, delay, ease: ease.aura };
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      {/* `overflow-hidden` is on this element, the one that moves, and that is the
          whole mechanism. The aperture has to be the thing that clips: put it on
          the static parent alone and the two translates below cancel into a
          photograph sitting exactly where it started, inside a clip box that never
          excluded it. No reveal, and nothing to see in the console. The parent
          clips as well, but only to keep the displaced aperture out of the layout
          while it is off frame. */}
      <motion.div
        className="overflow-hidden"
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={viewport}
        transition={transition}
      >
        <motion.div
          initial={{ y: "-100%", scale: 1.06 }}
          whileInView={{ y: "0%", scale: 1 }}
          viewport={viewport}
          transition={transition}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
