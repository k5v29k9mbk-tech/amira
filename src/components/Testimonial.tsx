"use client";

import { useCallback, useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import {
  displayQuote,
  sectionPad,
  shell,
} from "@/lib/ui";

/**
 * One voice at a time, on a near-black field.
 *
 * No cards, no stars, no avatar row, no marquee: a quotation at display size,
 * an attribution, and a counter. It advances only when the reader asks it to,
 * by arrow, by key or by swipe.
 *
 * The section renders nothing until real, consented quotes exist in
 * messages/*.json under `voices.items`. Inventing testimonials for a working
 * business is not an option, so the section stays out of the page rather than
 * shipping a placeholder. Four fabricated quotes from the removed online-course
 * build sit in this repository's git history; `npm test` blocks them by name so
 * they cannot be restored by accident. See "Adding student testimonials" in the
 * README for the shape and the consent rule.
 *
 * `course` is the optional fourth line, and it is the one that does the work: a
 * quote signs itself with a name, but it earns its place with the discipline
 * the student actually trained in. It is set in the same bronze small caps as
 * the section numbers, so it reads as a filing mark rather than as a caption.
 */
type Voice = { quote?: string; name?: string; role?: string; course?: string };

export function Testimonial() {
  const t = useTranslations("voices");
  const messages = useMessages() as { voices?: { items?: Record<string, Voice> } };
  const items = messages.voices?.items ?? {};
  const keys = Object.keys(items);

  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (d: 1 | -1) => {
      setDir(d);
      setI((v) => (v + d + keys.length) % keys.length);
    },
    [keys.length],
  );

  if (keys.length === 0) return null;
  const k = keys[i];
  const many = keys.length > 1;

  return (
    <section className={`${sectionPad} bg-night text-ivory`}>
      {/* The heading this section never shows. `voices.title` was already
          translated in all four languages and rendered nowhere: on a field this
          bare a visible heading would compete with the quotation, but a
          keyboard or screen-reader user still needs to know what the region is
          and that the arrows belong to it. Focusable only when there is more
          than one voice to move between. */}
      <div
        role="region"
        aria-label={t("title")}
        tabIndex={many ? 0 : undefined}
        className={shell}
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (!many || touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div aria-live="polite" className="mx-auto max-w-[46rem] lg:ms-[8%]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={k}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className={`${displayQuote} text-balance`}>
                {t(`items.${k}.quote`)}
              </blockquote>
              <figcaption className="mt-12 flex flex-col gap-1">
                <span className="label text-ivory">{t(`items.${k}.name`)}</span>
                <span className="text-[15px] text-mute-dark">{t(`items.${k}.role`)}</span>
                {items[k]?.course ? (
                  <span className="label mt-3 font-mono text-bronze-hi">
                    {t(`items.${k}.course`)}
                  </span>
                ) : null}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {many && (
          <div className="mt-16 flex items-center gap-8 lg:ms-[8%]">
            <span className="label font-mono text-mute-dark">
              {String(i + 1).padStart(2, "0")} / {String(keys.length).padStart(2, "0")}
            </span>
            <span aria-hidden className="h-px w-16 bg-white/20" />
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t("prev")}
              className="p-2 text-ivory/70 transition-colors duration-300 hover:text-ivory"
            >
              <ArrowLeft size={18} weight="light" className="flip-x" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("next")}
              className="p-2 text-ivory/70 transition-colors duration-300 hover:text-ivory"
            >
              <ArrowRight size={18} weight="light" className="flip-x" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
