"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import MuxPlayer from "@mux/mux-player-react";
import { Play } from "@phosphor-icons/react";

/**
 * Amira's welcome message. Click-to-load: the player is only mounted once the
 * poster is clicked, so the homepage never pays for the video bundle on load.
 * With no playback id set it stays a still with a caption, rather than a
 * broken frame.
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
        accentColor="#b8974f"
        metadata={{ video_title: alt }}
        className="aspect-video w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => playbackId && setPlaying(true)}
      disabled={!playbackId}
      aria-label={playbackId ? t("play") : t("videoSoon")}
      className="group relative block aspect-video w-full overflow-hidden bg-cover bg-center disabled:cursor-default"
      style={{ backgroundImage: `url(${poster})` }}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--ink)_78%,transparent),transparent_62%)]"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-accent bg-ink/40 text-accent-hi backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <Play size={22} weight="fill" className="flip-x" />
        </span>
        <span className="text-[11px] font-medium tracking-[0.2em] text-bone uppercase">
          {playbackId ? t("play") : t("videoSoon")}
        </span>
      </span>
    </button>
  );
}
