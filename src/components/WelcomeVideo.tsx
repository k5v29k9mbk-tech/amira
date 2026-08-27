"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "@phosphor-icons/react";

/**
 * The player is imported dynamically, NOT statically. Deferring the render
 * alone is not enough: a top-level import pulls the whole 1 MB Mux bundle into
 * the homepage payload whether or not anyone presses play. This way the chunk
 * is fetched on the click that needs it.
 */
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), { ssr: false });

/**
 * Amira's welcome message. With no playback id set it is her still and nothing
 * else: a play control that cannot play, and a caption promising a video that
 * has no date, are both worse than the photograph on its own.
 *
 * The still is a `next/image`, not a CSS background. It used to be one, which
 * meant this frame shipped the full-size original to every phone (a 2560px
 * still, at the time): no srcset, no WebP, no lazy loading and no reserved box.
 * It is the widest frame on /about, so that was the single most expensive thing
 * on the page, and it was invisible to every image budget because the browser
 * found it in a style attribute rather than in the markup.
 *
 * `position` is the crop, and it arrives from the caller rather than living
 * here, because the poster arrives from the caller too. Both come off one
 * `Media` object in lib/media.ts, which is where the reasoning for the number
 * is written; a crop hardcoded in this file would be a crop computed for a
 * photograph the next caller may not be showing.
 *
 * `fit` is there for the same reason. A portrait photograph in this landscape
 * box loses more than half its height to `cover`, and when what it loses is the
 * subject there is no crop worth tuning: `contain` sets it whole on whatever
 * ground the section is on. `sizes` travels with `fit`, because a contained
 * portrait is drawn at a fraction of the box width and a `sizes` written for
 * the covered case would ship the browser several times the pixels it needs.
 */
export function WelcomeVideo({
  playbackId,
  poster,
  position = "50% 50%",
  fit = "cover",
  sizes = "(max-width: 1024px) 100vw, 52vw",
  alt,
}: {
  playbackId: string;
  poster: string;
  /** CSS object-position for the still. Pass the `Media` it came with. */
  position?: string;
  /** `contain` sets a portrait whole on the section's ground instead of cropping it. */
  fit?: "cover" | "contain";
  /** Widths the still is actually drawn at. Narrow it when `fit` is `contain`. */
  sizes?: string;
  alt: string;
}) {
  const t = useTranslations("mentor");
  const [playing, setPlaying] = useState(false);

  if (playing && playbackId) {
    return (
      <MuxPlayer
        playbackId={playbackId}
        autoPlay
        streamType="on-demand"
        accentColor="#98715a"
        metadata={{ video_title: alt }}
        className="aspect-video w-full"
      />
    );
  }

  const still = (
    <Image
      src={poster}
      alt={playbackId ? "" : alt}
      fill
      sizes={sizes}
      style={{ objectPosition: position }}
      className={`${
        fit === "contain" ? "object-contain" : "object-cover"
      } transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover:scale-[1.03]`}
    />
  );

  if (!playbackId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">{still}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden"
    >
      {still}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-night/75 to-transparent"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-ivory">
        <span className="flex h-16 w-16 items-center justify-center border border-ivory/60 transition-colors duration-500 group-hover:bg-ivory group-hover:text-espresso">
          <Play size={20} weight="light" className="flip-x" />
        </span>
        <span className="label">{t("play")}</span>
      </span>
    </button>
  );
}
