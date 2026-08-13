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
 * frame. Every frame stays mounted and they cross-fade, which keeps the clip
 * from reloading every time the reader scrolls back up.
 *
 * Below lg the sticky column is dropped entirely and each chapter carries its
 * own image above it: on a phone a pinned half-screen panel leaves too little
 * room for the text it is meant to support.
 *
 * THE SPINE. The chapters run against a hairline rail with a bronze rule that
 * fills to the chapter being read. The section's argument is that the technique
 * is built in a fixed order, and until now the only thing on the page saying so
 * was the figures 01 to 04: four numbers, which is a list, not a progression. A
 * reader four fifths of the way through could not see that she was four fifths
 * of the way through. The rail is what makes the order visible as distance
 * travelled, and it is the one addition on this page that earns a scroll-linked
 * state rather than decorating one.
 *
 * It costs nothing to run. The fill is a single 1px element scaled on the y
 * axis, so it is composited rather than laid out, and it is driven by the same
 * IntersectionObserver that already changes the frame: no scroll handler, no
 * state per frame, one transform per chapter crossed. The rail is the only thing
 * on the page that is not either type or a photograph, which is the reason it is
 * a hairline in the brand metal and not a track with a knob.
 *
 * It matters on a phone more than anywhere: below lg there is no sticky frame,
 * so without it the method is four headings and four paragraphs in a column.
 * That is why the chapters are indented into the rail at every width and not
 * only where the two-column layout exists.
 */
export function MethodStory() {
  const t = useTranslations("method");
  const [active, setActive] = useState(0);
  const marks = useRef<(HTMLLIElement | null)[]>([]);

  /**
   * Theory is the only chapter whose frame is a photograph of the academy
   * teaching rather than a texture, so it is the only one with something to
   * describe. The others stay decorative and keep their empty alt, which is
   * what a screen reader wants from an image the sentence beside it already
   * covers.
   */
  const altFor = (key: string) => (key === "theory" ? t("steps.theory.alt") : undefined);

  /**
   * Not every chapter has a frame. Practice no longer carries a photograph, so
   * the sticky column mounts only the frames that exist and holds the one from
   * the chapter above while that chapter is read, rather than cross-fading to
   * an empty panel. Below lg the chapter simply arrives without an image.
   */
  const framed = chapters.filter((key) => methodMedia[key]);
  const heldFrame = (() => {
    for (let i = active; i >= 0; i -= 1) {
      if (methodMedia[chapters[i]]) return chapters[i];
    }
    return framed[0];
  })();

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
          {/* The frames overlay, and the position has to be on this wrapper
              rather than on MediaFrame.

              MediaFrame hardcodes `relative` on its own root and appends the
              caller's classes after it. That is a class-attribute order, not a
              cascade order: `.relative` and `.absolute` are single classes of
              equal specificity, so the one that wins is whichever Tailwind
              emitted later in the stylesheet, and that is `.relative`. Passing
              `absolute inset-0` straight to MediaFrame therefore did nothing.

              Everywhere else on the site that is invisible, because every other
              caller puts one frame inside a box that already has a ratio, and a
              static child with `h-full w-full` fills it either way. This is the
              only place three frames share one box, and here it was the whole
              bug: the three stacked in flow instead of overlaying, so the panel
              measured 2340px rather than 780, the sticky pin was computed
              against a box three times too tall, and the first frame rode up out
              of the column and printed over the section heading above it. The
              cross-fade never ran at all; what looked like it was the three
              frames scrolling past one behind the other.

              A plain div takes the absolute position and the cross-fade, and
              MediaFrame simply fills it. */}
          <div className="relative aspect-[4/5] w-full">
            {framed.map((key) => (
              <div
                key={key}
                className={`absolute inset-0 transition-[opacity,transform] duration-[1000ms] ease-[var(--ease-aura)] ${
                  key === heldFrame ? "opacity-100" : "scale-[1.03] opacity-0"
                }`}
              >
                <MediaFrame
                  media={methodMedia[key]}
                  alt={altFor(key)}
                  active={key === heldFrame}
                  // The column is 6 of 12 with a 64px gutter, so it measures
                  // ~416px at lg and 704px once the shell hits its 1600px cap.
                  // 55vw asked for half again as much file as it can ever show.
                  sizes="(min-width: 1600px) 704px, 45vw"
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ol className="relative ps-6 lg:col-span-5 lg:col-start-8 lg:ps-12">
        {/* The rail, and the distance travelled along it. Logical inset, so in
            Arabic the spine runs down the right edge of the column and the
            chapters indent away from it, with no separate rule. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 w-px bg-hair"
        />
        <span
          aria-hidden
          style={{ transform: `scaleY(${(active + 1) / chapters.length})` }}
          className="pointer-events-none absolute inset-y-0 start-0 w-px origin-top bg-bronze transition-transform duration-[900ms] ease-[var(--ease-aura)]"
        />

        {chapters.map((key, i) => (
          <li
            key={key}
            ref={(el) => {
              marks.current[i] = el;
            }}
            className="flex min-h-[60svh] flex-col justify-center py-12 lg:min-h-[80svh] lg:py-0"
          >
            {methodMedia[key] ? (
              <div className="relative mb-8 aspect-[4/5] w-full lg:hidden">
                <MediaFrame
                  media={methodMedia[key]}
                  alt={altFor(key)}
                  active={i === active}
                  sizes="100vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : null}

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
