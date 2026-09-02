"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, useInView, useReducedMotion } from "motion/react";
import { dur, ease } from "@/lib/motion";
import { ArrowsHorizontal } from "@phosphor-icons/react";
import { usePageText } from "@/lib/content/client";

export type Pair = { before: string; after: string; label: string };

/**
 * Drag the handle to wipe between the healed result and the starting point.
 * Keyboard accessible through the range input, which is also what carries the
 * position, so there is no scroll-frame state anywhere.
 *
 * `sizes` is a prop because the same figure now appears at two widths: a third
 * of the row on /courses, and roughly half the field on the homepage. The
 * source frames are 900px wide, which is the ceiling on how large this can be
 * shown before it softens, so neither caller asks for more than it can serve.
 *
 * DIRECTION. The whole figure is pinned to `dir="ltr"`, and that is the fix for
 * a comparison that was silently broken in Arabic. Three things here have a
 * handedness and they disagreed: `clip-path: inset()` is physical and always
 * uncovers from the left edge, a native range input runs right to left under
 * `dir="rtl"` so its value counted backwards, and the handle was positioned
 * with `inset-inline-start`, which put it at 25% from the right while the wipe
 * was at 25% from the left. An Arabic reader got a divider floating somewhere
 * unrelated to the edge it was supposed to be dragging.
 *
 * Pinning the mechanism rather than mirroring it is the right call and not a
 * shortcut: a photograph has no reading order, so there is nothing here to
 * mirror. The two markers under the frame stay in the same flow for the same
 * reason, so "before" sits under the half that is showing before, in all four
 * languages. The Arabic words inside them still shape right to left, which is
 * the bidi algorithm's job and not the container's.
 */
export function BeforeAfter({
  pair,
  sizes = "(max-width: 768px) 100vw, 33vw",
  ratio = "900 / 620",
  focus,
}: {
  pair: Pair;
  sizes?: string;
  /**
   * The shape of the figure, as a CSS aspect ratio. It defaults to the whole
   * aligned frame; a caller that wants a tighter reading of the same file — the
   * results gallery cuts a brow band out of it — passes its own and supplies
   * `focus` to say which part of the frame that band lands on.
   */
  ratio?: string;
  /**
   * `object-position` for each frame, and the two values are expected to
   * differ.
   *
   * A pair is two photographs of one face taken weeks apart, and even after
   * alignment the face does not always sit at the same height in both files. As
   * long as the figure is the same shape as the frame there is nothing to be
   * done about that — `cover` has no overflow to distribute, so an
   * `object-position` is inert and both frames show all 620 rows or none. Once
   * the figure is cut narrower than the frame, the two positions are what
   * decides which rows each side shows, and giving them the same value is what
   * makes a face jump under the handle.
   */
  focus?: { before: string; after: string };
}) {
  const t = usePageText("home", "success");
  const [pos, setPos] = useState(100);

  /**
   * THE OPENING SWEEP, and it is the one piece of motion on this page that is
   * also an instruction.
   *
   * The frame used to arrive parked at 50%: half a face treated, half not, and
   * a handle in the middle that a visitor had to guess was draggable. Most
   * never did. The single strongest piece of evidence the academy owns was
   * sitting behind an affordance nobody could see.
   *
   * So it arrives closed — the whole frame is the "before" — and when it
   * settles into view the wipe travels once to the middle, slowly, on the
   * house curve. Three things happen in that second and a half: the result is
   * revealed rather than presented, the control demonstrates itself, and the
   * handle ends up exactly where a reader would want to take hold of it.
   *
   * It runs once, and it yields immediately. `touched` is set by the input's
   * own change handler, so a visitor who grabs the slider mid-sweep takes it
   * over on that frame rather than fighting an animation for its remaining
   * second. Under `prefers-reduced-motion` the sweep does not run at all and
   * the frame opens at the midpoint, which is where it used to start.
   */
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.55 });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  useEffect(() => {
    if (!seen) return;
    if (reduce) {
      setPos(50);
      return;
    }
    const run = animate(100, 50, {
      duration: dur.plate,
      delay: dur.quick,
      ease: ease.aura,
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => run.stop();
  }, [seen, reduce]);

  return (
    <figure ref={ref} dir="ltr" className="group">
      {/* The whole aligned frame by default; the caller can cut a narrower
          reading of the same file by passing `ratio` and `focus` together. */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ aspectRatio: ratio }}
      >
        <Image
          src={pair.after}
          alt={`${pair.label}, ${t("after")}`}
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: focus?.after }}
        />
        {/* Clipped overlay holds the "before" state. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <Image
            src={pair.before}
            alt={`${pair.label}, ${t("before")}`}
            fill
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition: focus?.before }}
          />
        </div>

        {/* The control comes first in the DOM so the divider below can react to
            its focus. The input is invisible and fills the frame: it is the
            drag surface as well as the keyboard control. */}
        <label className="peer absolute inset-0 cursor-ew-resize">
          <span className="sr-only">{pair.label}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pos}
            aria-valuetext={`${pos}% ${t("before")}`}
            onChange={(e) => {
              touched.current = true;
              setPos(Number(e.target.value));
            }}
            className="h-full w-full cursor-ew-resize opacity-0"
          />
        </label>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-bronze transition-colors duration-300 peer-focus-within:bg-ivory"
          style={{ left: `${pos}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-espresso bg-night/50 text-bronze-hi backdrop-blur-sm transition-[transform,border-color] duration-300 ease-[var(--ease-aura)] group-hover:scale-105 peer-focus-within:border-ivory peer-focus-within:text-ivory"
          style={{ left: `calc(${pos}% - 1.375rem)` }}
        >
          <ArrowsHorizontal size={18} weight="light" />
        </span>
      </div>

      {/* Only the two markers. The pair label carries the alt text and the
          slider's accessible name; printing it here would be a caption the
          studio never wrote. */}
      <figcaption className="mt-5 flex items-center justify-between text-[11px] font-medium tracking-[0.18em] text-mute uppercase">
        <span className={pos > 50 ? "text-bronze-ink" : undefined}>{t("before")}</span>
        <span aria-hidden className="mx-4 h-px flex-1 bg-hair" />
        <span className={pos <= 50 ? "text-bronze-ink" : undefined}>{t("after")}</span>
      </figcaption>
    </figure>
  );
}
