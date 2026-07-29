"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { MediaFrame } from "./MediaFrame";

/**
 * The catalogue as six panels that share one field of view.
 *
 * Interaction is the expanding-panel pattern: one panel is open, the rest hold
 * a narrow strip. Both axes use the same mechanism, `flex-grow` inside a fixed
 * height container, so the desktop row and the phone stack are the same
 * component rather than two implementations.
 *
 * Open on hover only where hovering is real (a fine pointer). On touch, and for
 * keyboard users, opening is the click or the focus. Every panel is a button
 * with aria-expanded, and the link inside the open panel sits above it rather
 * than nested in it, since a link inside a button is not valid HTML.
 */
export function CourseSelector() {
  const t = useTranslations("catalog");
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const move = (from: number, step: 1 | -1) => {
    const next = (from + step + courses.length) % courses.length;
    setActive(next);
    items.current[next]?.focus();
  };

  return (
    <ul className="flex h-[92svh] min-h-[32rem] flex-col lg:h-[76vh] lg:min-h-[34rem] lg:flex-row">
      {courses.map((course, i) => {
        const open = i === active;
        const title = t(`courses.${course.slug}`);

        return (
          <li
            key={course.slug}
            style={{ flexGrow: open ? 4.2 : 1 }}
            className={`group relative basis-0 overflow-hidden bg-night transition-[flex-grow] duration-[900ms] ease-[var(--ease-aura)] ${
              i > 0 ? "border-t border-white/15 lg:border-t-0 lg:border-s" : ""
            }`}
          >
            <MediaFrame
              media={course.media}
              active={open}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className={`absolute inset-0 h-full w-full transition-opacity duration-[900ms] ${
                open ? "opacity-100" : "opacity-55"
              }`}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-night/10"
            />

            {/* The hit area. Covers the panel, names itself for screen readers. */}
            <button
              ref={(el) => {
                items.current[i] = el;
              }}
              type="button"
              aria-expanded={open}
              aria-controls={`course-panel-${course.slug}`}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseEnter={() => canHover && setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  move(i, 1);
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  move(i, -1);
                }
              }}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer"
            >
              <span className="sr-only">{title}</span>
            </button>

            <div
              id={`course-panel-${course.slug}`}
              className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 text-ivory md:p-7 lg:p-9"
            >
              {/* A closed strip on a phone is ~65px tall, which is room for the
                  title and nothing else, so the figure steps aside there. */}
              <span
                className={`label font-mono text-bronze-hi ${open ? "" : "hidden lg:block"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Closed: the title turns on its side and holds the strip.
                  Open: it sits at display size over the media. */}
              <h3
                className={`display transition-[font-size,opacity] duration-700 ease-[var(--ease-aura)] ${
                  open ? "mt-4" : "mt-0 lg:mt-6"
                } ${
                  open
                    ? "text-[clamp(1.75rem,2.8vw,3rem)]"
                    : "vtext-lg text-[1.0625rem] lg:tracking-[0.18em] lg:uppercase"
                }`}
              >
                {title}
              </h3>

              {/* grid-template-rows 0fr to 1fr, so the panel opens to whatever
                  the copy actually needs instead of a guessed max-height that
                  clips the link on a small phone. */}
              <div
                className={`grid transition-[grid-template-rows,opacity,margin] duration-700 ease-[var(--ease-aura)] ${
                  open ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-[42ch] text-[15px] leading-relaxed text-ivory/85">
                    {t(`blurbs.${course.slug}`)}
                  </p>
                  <p className="label mt-5 text-ivory/60">{t("details.level.value")}</p>
                  <Link
                    href={`/courses#${course.slug}`}
                    tabIndex={open ? 0 : -1}
                    className="label pointer-events-auto mt-6 inline-flex items-center gap-3 border-b border-ivory/40 pb-1 text-ivory transition-colors duration-300 hover:border-ivory"
                  >
                    {t("viewCourse")}
                    <ArrowRight size={13} weight="light" className="flip-x" />
                  </Link>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
