"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Media } from "@/lib/media";

/**
 * One frame of art direction: a poster that always renders, and a clip that
 * layers over it only when it is worth loading.
 *
 * The poster is a plain next/image, so it is the LCP candidate and reserves its
 * own space. The video is mounted client side only, which means:
 *  - no hydration mismatch when the mobile cut differs from the desktop one,
 *  - nothing downloads until the frame is near the viewport,
 *  - `prefers-reduced-motion` never loads a byte of video,
 *  - a dead or slow source degrades to the poster instead of a black rectangle.
 *
 * `active` is for panels that share a section: only the open one plays.
 *
 * `alt` overrides the art direction's own. Art direction is written once, in
 * English, in media.ts, which is right for the frames that are decorative and
 * wrong for a frame that describes something; a caller holding a translation
 * passes it here instead.
 */
export function MediaFrame({
  media,
  alt,
  sizes = "100vw",
  priority = false,
  active = true,
  className = "",
  imageClassName = "",
}: {
  media: Media;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  active?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  const src = media.videoSrc;

  useEffect(() => {
    if (!src || reduce || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [src, reduce]);

  // Pausing the off-panel clips keeps six decoders from running at once.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (active) void el.play().catch(() => {});
    else el.pause();
  }, [active, ready]);

  const mobileSrc = media.mobileVideoSrc ?? src;
  const chosen =
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches
      ? mobileSrc
      : src;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={
        {
          "--obj": media.position ?? "50% 50%",
          "--obj-m": media.mobilePosition ?? media.position ?? "50% 50%",
        } as React.CSSProperties
      }
    >
      <Image
        src={media.posterSrc}
        alt={alt ?? media.alt ?? ""}
        fill
        priority={priority}
        sizes={sizes}
        className={`media-fit ${imageClassName}`}
      />

      {near && chosen && (
        <video
          ref={video}
          src={chosen}
          poster={media.posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          className={`media-fit absolute inset-0 h-full w-full transition-opacity duration-1000 ease-[var(--ease-aura)] ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {media.overlay ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-night"
          style={{ opacity: media.overlay / 100 }}
        />
      ) : null}
    </div>
  );
}
