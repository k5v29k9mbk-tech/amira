"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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

  if (!playbackId) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="aspect-video w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
    );
  }

  if (playing) {
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

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={t("play")}
      className="group relative block aspect-video w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${poster})` }}
    >
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
