"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowsHorizontal } from "@phosphor-icons/react";

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
 */
export function BeforeAfter({
  pair,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: {
  pair: Pair;
  sizes?: string;
}) {
  const t = useTranslations("success");
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);

  return (
    <figure className="group">
      {/* Matches the aligned source frames, 900x620. */}
      <div ref={frame} className="relative aspect-[900/620] w-full overflow-hidden select-none">
        <Image
          src={pair.after}
          alt={`${pair.label}, ${t("after")}`}
          fill
          sizes={sizes}
          className="object-cover"
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
          />
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-bronze"
          style={{ insetInlineStart: `${pos}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-espresso bg-night/50 text-bronze-ink backdrop-blur-sm"
          style={{ insetInlineStart: `calc(${pos}% - 1.375rem)` }}
        >
          <ArrowsHorizontal size={18} weight="light" />
        </span>

        <label className="absolute inset-0 cursor-ew-resize">
          <span className="sr-only">{pair.label}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="h-full w-full cursor-ew-resize opacity-0"
          />
        </label>
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
