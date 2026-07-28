"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { sectionTitle, shell } from "@/lib/ui";

const AUTOPLAY_MS = 7000;

/**
 * Student voices.
 *
 * Renders nothing until real, consented quotes exist in messages/*.json under
 * `voices.items`. Inventing testimonials for a real business is not an option,
 * so the section stays out of the page rather than showing a placeholder.
 *
 * One quote at a time, at display size: a testimonial that has to compete with
 * two neighbours reads as filler. Advances on its own, pauses on hover, focus
 * and touch, and stops entirely under prefers-reduced-motion.
 */
export function Voices() {
  const t = useTranslations("voices");
  const messages = useMessages() as { voices?: { items?: Record<string, unknown> } };
  const keys = Object.keys(messages.voices?.items ?? {});
  const reduce = useReducedMotion();

  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (d: 1 | -1) => setI((v) => (v + d + keys.length) % keys.length),
    [keys.length],
  );

  useEffect(() => {
    if (reduce || held || keys.length < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % keys.length), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduce, held, keys.length]);

  if (keys.length === 0) return null;
  const k = keys[i];

  return (
    <section id="voices" className="seam py-28 md:py-36">
      <div className={shell}>
        <h2 className={`${sectionTitle} text-center`}>{t("title")}</h2>

        <div
          className="relative mx-auto mt-16 max-w-3xl"
          onMouseEnter={() => setHeld(true)}
          onMouseLeave={() => setHeld(false)}
          onFocusCapture={() => setHeld(true)}
          onBlurCapture={() => setHeld(false)}
          onTouchStart={() => setHeld(true)}
        >
          {/* Oversized gold quote mark, set behind the words rather than
              stamped on top of them. */}
          <span
            aria-hidden
            className="script pointer-events-none absolute -top-16 start-0 -z-10 text-[10rem] leading-none text-accent/15 select-none md:-top-20 md:text-[14rem]"
          >
            &ldquo;
          </span>

          {/* aria-live so the change is announced; the quote is a figure. */}
          <div aria-live="polite" className="min-h-[16rem] sm:min-h-[14rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={k}
                initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(5px)" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                <blockquote className="display text-2xl leading-[1.45] text-balance text-bone md:text-[2rem]">
                  {t(`items.${k}.quote`)}
                </blockquote>
                <figcaption className="mt-8">
                  <span aria-hidden className="mx-auto mb-6 block h-px w-12 bg-accent/60" />
                  <span className="block text-[11px] font-medium tracking-[0.22em] text-bone uppercase">
                    {t(`items.${k}.name`)}
                  </span>
                  <span className="mt-2 block text-sm text-muted">
                    {t(`items.${k}.role`)}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {keys.length > 1 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={t("title")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 text-bone transition-colors duration-300 hover:border-accent hover:bg-surface-2 hover:text-accent-hi"
              >
                <ArrowLeft size={16} weight="light" className="flip-x" />
              </button>

              {/* Rules rather than dots: the page has no other dot motif. */}
              <div className="flex items-center gap-2">
                {keys.map((key, n) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setI(n)}
                    aria-label={`${n + 1}`}
                    aria-current={n === i ? "true" : undefined}
                    className={`h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      n === i ? "w-10 bg-accent" : "w-5 bg-line hover:bg-accent/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => go(1)}
                aria-label={t("title")}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/50 text-bone transition-colors duration-300 hover:border-accent hover:bg-surface-2 hover:text-accent-hi"
              >
                <ArrowRight size={16} weight="light" className="flip-x" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
