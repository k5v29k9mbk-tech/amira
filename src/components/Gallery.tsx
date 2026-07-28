"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";

/**
 * Masonry gallery with a lightbox.
 *
 * Masonry is CSS multi-column, not a JS layout library: the browser does the
 * packing, so there is nothing to measure, nothing to recalculate on resize and
 * no layout shift. The trade-off is that columns fill top-to-bottom rather than
 * left-to-right, which for an unordered set of stills does not matter.
 */
export function Gallery({ images }: { images: string[] }) {
  const t = useTranslations("results");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: 1 | -1) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Stop the page scrolling behind the overlay.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <>
      <div className="columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`${t("title")} ${i + 1}`}
            className="group relative block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
          >
            <Image
              src={src}
              alt=""
              width={800}
              height={800}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {/* Gold veil on hover, in the brand's own ink rather than black. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[var(--ink)] opacity-0 transition-opacity duration-500 group-hover:opacity-15"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={close}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-[color-mix(in_srgb,var(--bone)_88%,transparent)] p-4 backdrop-blur-md md:p-10"
          >
            <motion.div
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-full w-full max-w-4xl"
            >
              <Image
                src={images[open]}
                alt=""
                width={1600}
                height={1600}
                priority
                className="h-auto max-h-[80dvh] w-full object-contain"
              />
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute end-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-ink/80 text-bone backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-hi md:end-8 md:top-8"
            >
              <X size={20} weight="light" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous"
                  className="absolute start-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-ink/80 text-bone backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-hi md:start-8"
                >
                  <ArrowLeft size={18} weight="light" className="flip-x" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next"
                  className="absolute end-3 flex h-12 w-12 items-center justify-center rounded-full border border-accent/50 bg-ink/80 text-bone backdrop-blur-sm transition-colors hover:border-accent hover:text-accent-hi md:end-8"
                >
                  <ArrowRight size={18} weight="light" className="flip-x" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
