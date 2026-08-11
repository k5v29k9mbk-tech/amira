"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { chapters } from "@/lib/courses";
import { methodMedia } from "@/lib/media";
import { displayChapter } from "@/lib/ui";
import { MediaFrame } from "./MediaFrame";

/**
 * The method, told against one held image.
 *
 * The visual is pinned with `position: sticky` while the chapters scroll past
 * it, and the frame changes when a chapter crosses the middle of the viewport.
 * IntersectionObserver decides that, not a scroll handler, so nothing runs per
 * frame. All four frames stay mounted and cross-fade, which keeps the clip from
 * reloading every time the reader scrolls back up.
 *
 * Below lg the sticky column is dropped entirely and each chapter carries its
 * own image above it: on a phone a pinned half-screen panel leaves too little
 * room for the text it is meant to support.
 */
export function MethodStory() {
  const t = useTranslations("method");
  const [active, setActive] = useState(0);
  const marks = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = marks.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = nodes.indexOf(entry.target as HTMLLIElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-0 flex h-svh items-center py-16">
          <div className="relative aspect-[4/5] w-full">
            {chapters.map((key, i) => (
              <MediaFrame
                key={key}
                media={methodMedia[key]}
                active={i === active}
                sizes="55vw"
                className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-[1000ms] ease-[var(--ease-aura)] ${
                  i === active ? "opacity-100" : "scale-[1.03] opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ol className="lg:col-span-5 lg:col-start-8">
        {chapters.map((key, i) => (
          <li
            key={key}
            ref={(el) => {
              marks.current[i] = el;
            }}
            className="flex min-h-[60svh] flex-col justify-center py-12 lg:min-h-[80svh] lg:py-0"
          >
            <div className="relative mb-8 aspect-[4/5] w-full lg:hidden">
              <MediaFrame
                media={methodMedia[key]}
                active={i === active}
                sizes="100vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>

            <div
              className={`transition-opacity duration-700 ease-[var(--ease-aura)] ${
                i === active ? "opacity-100" : "lg:opacity-35"
              }`}
            >
              <span
                className={`label font-mono transition-colors duration-700 ${
                  i === active ? "text-bronze-ink" : "text-mute"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={`${displayChapter} mt-5`}>
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-mute">
                {t(`steps.${key}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
