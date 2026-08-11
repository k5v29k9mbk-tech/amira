"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { shell } from "@/lib/ui";
import { MediaFrame } from "./MediaFrame";

/**
 * The catalogue, in two layouts, because the expanding panel is a pointer idea.
 *
 * From lg it is six panels sharing one field of view: one open, the rest held
 * as narrow strips, driven by `flex-grow`. With a mouse this costs nothing to
 * read. The pointer crosses the row and all six open in turn, so the whole
 * catalogue is legible in one gesture and the section keeps the cinematic
 * weight it was designed for. That layout is untouched.
 *
 * Below lg it was the same mechanism with none of what makes it work. Six
 * strips of about 65px inside a 92svh cage, five of them collapsed, no hover to
 * open them: reading the catalogue on a phone took six deliberate taps, and the
 * copy for a discipline was invisible until you had already chosen to tap it.
 * The catalogue is the one thing on this page a visitor is here to browse, so
 * below lg it is now a plain editorial list. Every name, every line of
 * description and the level are on the page at once, in one column, and the
 * whole row is the link.
 *
 * The copy was always in the HTML, collapsed panels included: this changes what
 * a person can read, not what a crawler can.
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
    <>
      {/* Below lg: the catalogue as a list you read rather than operate. The
          number and the name carry the row, the hairline between rows is the
          only separator, and the whole row is the link. No panel, no cage, no
          tap required to find out what a discipline is. */}
      <ul className={`${shell} lg:hidden`}>
        {courses.map((course, i) => (
          <li key={course.slug} className="border-b border-hair last:border-b-0">
            <Link
              href={`/courses#${course.slug}`}
              className="group grid gap-5 py-8 sm:grid-cols-12 sm:items-center sm:gap-8"
            >
              {/* Landscape on a phone, portrait once the row splits in two:
                  six stacked 4:5 frames would make the catalogue a very long
                  scroll for the sake of a crop. The focal point in lib/media
                  carries the crop, so both work. */}
              <div className="relative aspect-[3/2] w-full sm:col-span-5 sm:aspect-[4/5]">
                <MediaFrame
                  media={course.media}
                  sizes="(max-width: 640px) 100vw, 45vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              <div className="sm:col-span-7">
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-3 text-[clamp(1.75rem,7vw,2.5rem)]">
                  {t(`courses.${course.slug}`)}
                </h3>
                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-mute">
                  {t(`blurbs.${course.slug}`)}
                </p>
                <p className="label mt-5 text-mute">{t("details.level.value")}</p>
                <span className="label mt-6 inline-flex items-center gap-3 text-espresso transition-colors duration-300 group-hover:text-bronze-ink">
                  {t("viewCourse")}
                  <ArrowRight size={13} weight="light" className="flip-x" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* From lg: the panel row, unchanged. */}
      <ul className="hidden lg:flex lg:h-[76vh] lg:min-h-[34rem] lg:flex-row">
        {courses.map((course, i) => {
          const open = i === active;
          const title = t(`courses.${course.slug}`);

          return (
            <li
              key={course.slug}
              style={{ flexGrow: open ? 4.2 : 1 }}
              className={`group relative basis-0 overflow-hidden bg-night transition-[flex-grow] duration-[900ms] ease-[var(--ease-aura)] ${
                i > 0 ? "border-white/15 lg:border-s" : ""
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
    </>
  );
}
