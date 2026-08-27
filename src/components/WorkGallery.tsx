"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { resultFrames } from "@/lib/media";
import { dur, ease } from "@/lib/motion";
import { FrameReveal } from "./FrameReveal";
import { MediaFrame } from "./MediaFrame";
import { Parallax } from "./Parallax";

/**
 * The work: four treatment photographs, set as one composition rather than a
 * grid of equal tiles.
 *
 * Every decision about where a frame sits, how wide it is and what proportion
 * it holds is data (`resultFrames` and `pairFrame` in lib/media.ts). This file
 * only lays them out and opens the three that are worth opening. That split is
 * deliberate: the academy will send more photographs, and adding one should be
 * an entry in a list, not a change to this component.
 *
 * Two rules hold the section together and neither is negotiable:
 *
 * The photograph is never altered. Each frame is set to its file's own aspect
 * ratio, so `cover` crops nothing at any breakpoint, and no frame is ever wider
 * than the file behind it, so nothing is upscaled. There is no filter, no
 * grade, no overlay and no scrim over a result. The `position` values carried
 * in the data are a safety net for a future replacement file, not a crop
 * applied to these.
 *
 * The result is the only thing on show. No captions, no badges, no technique
 * labels: the site does not know from the photograph alone which discipline
 * produced it, and printing a guess under a client's face would be inventing a
 * result. What each frame shows is described in `work.alt.*` instead, for
 * anyone reading with a screen reader, in all four languages.
 *
 * The interaction is the site's existing vocabulary and nothing more: three
 * percent of scale over 1.4s on hover, and the scroll drift the studio gallery
 * below already uses. No lift, no shadow, no zoom cursor on a frame that does
 * not open. Under prefers-reduced-motion the drift and the reveal both stand
 * down, which they inherit from Parallax and Reveal, and the global stylesheet
 * cuts the hover transition to nothing.
 */
export function WorkGallery() {
  const t = useTranslations("work");

  /** Index into `resultFrames`, or null when the overlay is closed. */
  const [open, setOpen] = useState<number | null>(null);
  const active = open === null ? null : resultFrames[open];

  /** The frame that was opened, so focus goes back where it came from. */
  const opener = useRef<HTMLButtonElement | null>(null);
  const closer = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  // Escape closes, the page underneath stops scrolling, and the close button
  // takes focus so the overlay is operable from the keyboard the moment it
  // appears. Everything is undone on the way out, including the scroll lock,
  // which is why the body style is restored rather than cleared.
  //
  // Tab is held here too. The overlay has exactly one focusable control, so the
  // trap is the whole of it: without this, tabbing walks off into the page
  // behind a full screen photograph, where a keyboard user cannot see what they
  // have landed on.
  useEffect(() => {
    if (active === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        e.preventDefault();
        closer.current?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closer.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <>
      {/* Fragments, so every frame is a direct child of the grid: each one
          carries its own `col-start`, and auto-placement reads that order.

          The before/after slider used to be emitted inside this loop at its own
          index. It has moved up into the section itself, above this
          composition, where it leads the act at full width instead of sitting
          third among seven photographs at six columns of twelve. It was the one
          piece of proof on the page a visitor can operate, and it was the size
          of a thumbnail. The frames close up behind it with no other change,
          which is what the per-frame `col-start` was always for. */}
      <div className="grid grid-cols-12 gap-5 md:gap-8">
        {resultFrames.map((frame, i) => (
          <Fragment key={frame.posterSrc}>
            <Parallax distance={i % 2 === 0 ? 14 : -10} className={frame.span}>
              <FrameReveal delay={(i % 3) * 0.06}>
                <div
                  className="group relative w-full"
                  style={{ aspectRatio: frame.ratio }}
                >
                  <MediaFrame
                    media={frame}
                    alt={t(`alt.${frame.altKey}`)}
                    sizes={frame.sizes}
                    imageClassName="transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover:scale-[1.03]"
                  />

                  {/* Only the frames with pixels to spare open. The rest are
                      already shown at the size their file actually is, so an
                      overlay would enlarge nothing. The affordance stays
                      visible on touch, where there is no hover to reveal it. */}
                  {frame.zoom ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        opener.current = e.currentTarget;
                        setOpen(i);
                      }}
                      className="absolute inset-0 z-10 h-full w-full cursor-zoom-in"
                    >
                      <span className="sr-only">{t("open")}</span>
                      <span
                        aria-hidden
                        className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center bg-night/45 text-ivory opacity-80 backdrop-blur-sm transition-opacity duration-500 ease-[var(--ease-aura)] md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                      >
                        <ArrowsOut size={16} weight="light" />
                      </span>
                    </button>
                  ) : null}
                </div>
              </FrameReveal>
            </Parallax>

          </Fragment>
        ))}
      </div>

      {/*
        The overlay. Near black, the photograph, and one way out.

        It never enlarges past the file: `maxWidth` is the smaller of 92vw and
        the photograph's own pixel width, so a 1179px frame fills a laptop and
        stops there rather than being stretched to a 4K panel. That is the whole
        point of opening it, and it is also why only three frames offer it.
      */}
      <AnimatePresence>
        {active ? (
          <motion.div
            key="work-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={t(`alt.${active.altKey}`)}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.micro, ease: ease.aura }}
            className="no-print fixed inset-0 z-[70] flex items-center justify-center bg-night/95 p-5 md:p-10"
          >
            <button
              ref={closer}
              type="button"
              onClick={close}
              className="absolute end-5 top-5 flex h-11 w-11 items-center justify-center text-ivory transition-colors duration-300 hover:text-bronze-hi md:end-8 md:top-8"
            >
              <span className="sr-only">{t("close")}</span>
              <X size={20} weight="light" />
            </button>

            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: dur.quick, ease: ease.aura }}
            >
              <Image
                src={active.posterSrc}
                alt={t(`alt.${active.altKey}`)}
                width={active.width}
                height={active.height}
                sizes="92vw"
                className="h-auto max-h-[86vh] w-auto object-contain"
                style={{ maxWidth: `min(92vw, ${active.width}px)` }}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
