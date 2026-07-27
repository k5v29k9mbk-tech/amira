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
 */
export function BeforeAfter({ pair }: { pair: Pair }) {
  const t = useTranslations("success");
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);

  return (
    <figure className="group">
      <div ref={frame} className="relative aspect-[4/5] w-full overflow-hidden select-none">
        <Image
          src={pair.after}
          alt={`${pair.label}, ${t("after")}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-accent"
          style={{ insetInlineStart: `${pos}%` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-ink/60 text-accent-hi backdrop-blur-sm"
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

      <figcaption className="mt-4 flex items-center justify-between text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
        <span>{t("before")}</span>
        <span className="text-bone">{pair.label}</span>
        <span>{t("after")}</span>
      </figcaption>
    </figure>
  );
}
