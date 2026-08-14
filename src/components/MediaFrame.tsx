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
 *
 * POSITIONING. The root is `absolute inset-0`, and that is a contract rather than
 * a default: this component must be given a positioned parent that has a size of
 * its own, which in practice means a box carrying an aspect ratio or an explicit
 * height. Every one of the nine callers already does exactly that.
 *
 * It used to be `relative`, and every caller then passed `absolute inset-0
 * h-full w-full` to override it. None of them did. `relative` and `absolute` are
 * single classes of equal specificity, so which one applies is decided by their
 * order in the compiled stylesheet, not by their order in the class attribute,
 * and Tailwind emits `.relative` last. The override was silently dropped
 * everywhere.
 *
 * It was mostly invisible, because a static child with `h-full w-full` fills a
 * ratio box just as an absolute one does. It was not invisible in the two places
 * something else shared the box. In the method's sticky column the three frames
 * stacked in flow instead of overlaying, making the panel three times too tall
 * and riding up over the heading above it. In the closing frame the media became
 * a flex item beside the copy and rendered at 687px of a 1440px viewport, which
 * is what Next was reporting when it warned that an image with `sizes="100vw"`
 * was not being rendered at full viewport width.
 *
 * Both are the same bug, and this is the one line that fixes it. Callers no
 * longer pass positioning; if a future caller needs something other than filling
 * its parent, give this a prop rather than passing a class that cannot win.
 */
export function MediaFrame({
  media,
  alt,
  sizes = "100vw",
  priority = false,
  active = true,
  eager = false,
  className = "",
  imageClassName = "",
}: {
  media: Media;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  active?: boolean;
  /**
   * Load the clip on mount rather than on approach, and let the browser buffer
   * ahead instead of holding at `preload="none"`.
   *
   * For the eight frames that scroll into view this would be waste: it is the
   * observer and the idle preload that keep a page of clips from costing a page
   * of downloads. The hero film is the one case where both are backwards. It is
   * on screen at nought pixels of scroll, so "near the viewport" is a question
   * with a known answer, and it is the first thing a visitor sees, so the frame
   * it resolves on is the frame they judge the site by.
   *
   * What this deliberately does not do is mount the video during the first
   * render. `near` still starts false on the server and on the client, and this
   * flips it from an effect, because the decision downstream is gated on
   * `prefers-reduced-motion` and that preference has no answer on a server. One
   * render's delay is imperceptible; a hydration mismatch on the homepage is
   * not, and is the exact bug MotionProvider documents.
   */
  eager?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [phone, setPhone] = useState(false);

  const src = media.videoSrc;

  // Which cut of the clip to play. Read from a listener rather than inline
  // during render: computed inline it was decided once, on the first client
  // render, and a tablet turned on its side or a window dragged narrower kept
  // whichever cut it had happened to pick.
  useEffect(() => {
    if (!src) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [src]);

  useEffect(() => {
    if (!src || reduce) return;
    if (eager) {
      setNear(true);
      return;
    }
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setNear(true),
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [src, reduce, eager]);

  // Pausing the off-panel clips keeps six decoders from running at once.
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (active) void el.play().catch(() => {});
    else el.pause();
  }, [active, ready]);

  const chosen = phone ? (media.mobileVideoSrc ?? src) : src;

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden ${className}`}
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
