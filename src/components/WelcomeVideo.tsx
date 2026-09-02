"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Play } from "@phosphor-icons/react";
import { usePageText } from "@/lib/content/client";

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
 * `aspect` is there for the same reason, and it earns its keep the moment the
 * still is a portrait. This box is 16:9 by default because the video it will
 * one day hold is; a portrait photograph in it loses more than half its height
 * to `cover`, and containing it instead leaves the subject drawn at 42% of the
 * column with paper either side. Handing the caller the box lets a portrait be
 * shown at the column's full width, whole and uncropped, which is the only way
 * it is ever actually large. The player stays 16:9 whatever the still does: a
 * 16:9 film letterboxed into a 3:4 box would be smaller, not bigger.
 */
export function WelcomeVideo({
  playbackId,
  poster,
  position = "50% 50%",
  aspect = "aspect-video",
  alt,
}: {
  playbackId: string;
  poster: string;
  /** CSS object-position for the still. Pass the `Media` it came with. */
  position?: string;
  /** The still's box, as a Tailwind aspect class. Match the photograph to fill it. */
  aspect?: string;
  alt: string;
}) {
  const t = usePageText("home", "mentor");
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
      sizes="(max-width: 1024px) 100vw, 44vw"
      style={{ objectPosition: position }}
      className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover:scale-[1.03]"
    />
  );

  if (!playbackId) {
    return (
      <div className={`relative ${aspect} w-full overflow-hidden`}>{still}</div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`group relative block ${aspect} w-full overflow-hidden`}
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
