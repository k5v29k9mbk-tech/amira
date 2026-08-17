"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * A control that leans very slightly toward the pointer.
 *
 * FOUR PIXELS, AND WHY IT IS FOUR. The magnetic button is one of the most
 * copied effects on award sites and it is almost always overdone: twenty or
 * thirty pixels of travel, so the thing a visitor is trying to click runs away
 * from the cursor and has to be chased. That is a toy. At `dist.hair` the
 * button does not move anywhere a pointer is not already going — it reads as
 * weight, as though the control had a little mass and the cursor a little pull,
 * and most people never consciously see it. That is the whole intent: the
 * difference between a page that feels expensive and one that feels animated is
 * usually that the expensive one is doing less.
 *
 * The label travels at 40% of the box, which is the only other trick here. Two
 * elements moving the same distance is a shape sliding; the frame leading and
 * the type following inside it is parallax at button scale, and it is what
 * stops the movement reading as the whole button being dragged.
 *
 * WHERE IT IS NOT. Never on touch: there is no pointer to lean toward, and a
 * transform that only resolves on tap would fire as a flinch under the finger.
 * The guard is `(hover: hover) and (pointer: fine)`, read per event rather than
 * stored in state, so a hybrid laptop that gets a mouse plugged in halfway
 * through a session is handled without a listener. Never under
 * `prefers-reduced-motion` either, where the spring is simply never fed.
 *
 * Nothing about the control's layout, hit area or focus behaviour changes: this
 * wraps in an inline-flex span that inherits the button's own box, and the
 * transform is composited, so the hit target stays exactly where the layout put
 * it even while the paint leans.
 */
export function Magnetic({
  children,
  strength = 6,
  className = "",
}: {
  children: ReactNode;
  /** Peak travel in pixels at the far edge of the control. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Stiff and well damped: it arrives with the cursor rather than trailing it,
  // and it returns without a wobble. A springy button is a bouncy button.
  const spring = { stiffness: 260, damping: 26, mass: 0.4 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  // The label counter-moves a third of the frame's travel, so the two are not
  // one shape sliding: the box leads, the type follows at about two thirds of
  // the distance. Derived from the same spring rather than sprung again, so
  // there is exactly one animation driving both.
  const lx = useTransform(sx, (v) => v * -0.35);
  const ly = useTransform(sy, (v) => v * -0.35);

  const canLean = () =>
    !reduce &&
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className}`}
      onPointerMove={(e) => {
        if (!canLean() || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        // Offset from the centre, normalised to the half-size, so the pull is
        // the same at the edge of a wide button as a narrow one.
        x.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
        y.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.span style={{ x: lx, y: ly }} className="inline-flex w-full">
        {children}
      </motion.span>
    </motion.span>
  );
}
