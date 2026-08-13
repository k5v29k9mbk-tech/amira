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
 * meant this frame shipped the full 2560px original to every phone: no
 * srcset, no WebP, no lazy loading and no reserved box. It is the largest
 * photograph on /about, so that was the single most expensive thing on the
 * page, and it was invisible to every image budget because the browser found
 * it in a style attribute rather than in the markup.
 */
export function WelcomeVideo({
  playbackId,
  poster,
  alt,
}: {
  playbackId: string;
  poster: string;
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
      sizes="(max-width: 1024px) 100vw, 52vw"
      className="object-cover object-[50%_26%] transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover:scale-[1.03]"
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
