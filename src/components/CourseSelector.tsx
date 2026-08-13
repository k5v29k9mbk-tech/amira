"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { chapterSize, displayChapter, shell } from "@/lib/ui";
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
        {courses.map((course, i) => {
          /* Which side the frame takes, from sm. Six rows with the photograph
             always on the same edge is a results list; alternated, the row is a
             composition and the eye crosses the page instead of running down one
             column of thumbnails. It is the cheapest rhythm available in a
             stacked layout and the reason this reads as a catalogue rather than
             as six repeats of one card.

             Explicit `row-start-1` on both cells, because the flipped rows place
             the copy at column 1 after the frame has already claimed column 8:
             auto-placement would read that as a cursor that has gone backwards
             and drop the copy onto a second row. The starts are logical, so
             Arabic mirrors the whole alternation with no separate rule. */
          const flip = i % 2 === 1;

          return (
          <li key={course.slug} className="border-b border-hair last:border-b-0">
            <Link
              href={`/courses#${course.slug}`}
              className="group grid gap-5 py-8 sm:grid-cols-12 sm:items-center sm:gap-8"
            >
              {/* Landscape on a phone, portrait once the row splits in two:
                  six stacked 4:5 frames would make the catalogue a very long
                  scroll for the sake of a crop. The focal point in lib/media
                  carries the crop, so both work.

                  A course whose poster is off the homepage drops the cell
                  rather than holding an empty one, and its copy takes the whole
                  row: a blank 4:5 box beside the text is the one thing worse
                  than no photograph. */}
              {!course.posterOffHome ? (
                <div
                  className={`relative aspect-[3/2] w-full sm:col-span-5 sm:row-start-1 sm:aspect-[4/5] ${
                    flip ? "sm:col-start-8" : "sm:col-start-1"
                  }`}
                >
                  <MediaFrame
                    media={course.media}
                    sizes="(max-width: 640px) 100vw, 45vw"
                  />
                </div>
              ) : null}

              <div
                className={
                  course.posterOffHome
                    ? "sm:col-span-12"
                    : `sm:col-span-7 sm:row-start-1 ${
                        flip ? "sm:col-start-1" : "sm:col-start-6"
                      }`
                }
              >
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayChapter} mt-3`}>
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
          );
        })}
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
              className={`group relative basis-0 overflow-hidden transition-[flex-grow] duration-[900ms] ease-[var(--ease-aura)] ${
                course.posterOffHome ? "bg-paper" : "bg-night"
              } ${i > 0 ? (course.posterOffHome ? "border-hair lg:border-s" : "border-hair-dark lg:border-s") : ""}`}
            >
              {/* A course whose poster is off the homepage used to keep the
                  night ground the photographic panels carry, which made it a
                  black rectangle with a gradient over nothing: the one panel in
                  the row that looked like a template block rather than a
                  photograph someone chose.

                  It is now set on paper instead, in espresso, so the absence
                  reads as a typographic panel deliberately placed among
                  photographic ones rather than as an image that failed to load.
                  It opens, reads and links exactly like the other five. When the
                  academy supplies the replacement photograph, deleting the
                  `posterOffHome` flag returns it to the night ground with no
                  other change. */}
              {!course.posterOffHome ? (
                <MediaFrame
                  media={course.media}
                  active={open}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className={`transition-opacity duration-[900ms] ${
                    open ? "opacity-100" : "opacity-55"
                  }`}
                />
              ) : null}
              {!course.posterOffHome ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-night/10"
                />
              ) : null}

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
                className={`pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-7 lg:p-9 ${
                  course.posterOffHome ? "text-espresso" : "text-ivory"
                }`}
              >
                {/* A closed strip on a phone is ~65px tall, which is room for the
                    title and nothing else, so the figure steps aside there. */}
                <span
                  className={`label font-mono ${
                    course.posterOffHome ? "text-bronze-ink" : "text-bronze-hi"
                  } ${open ? "" : "hidden lg:block"}`}
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
                      ? chapterSize
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
                    <p
                      className={`max-w-[42ch] text-[15px] leading-relaxed ${
                        course.posterOffHome ? "text-mute" : "text-ivory/85"
                      }`}
                    >
                      {t(`blurbs.${course.slug}`)}
                    </p>
                    <p
                      className={`label mt-5 ${
                        course.posterOffHome ? "text-mute" : "text-ivory/60"
                      }`}
                    >
                      {t("details.level.value")}
                    </p>
                    <Link
                      href={`/courses#${course.slug}`}
                      tabIndex={open ? 0 : -1}
                      className={`label pointer-events-auto mt-6 inline-flex items-center gap-3 border-b pb-1 transition-colors duration-300 ${
                        course.posterOffHome
                          ? "border-espresso/40 text-espresso hover:border-espresso"
                          : "border-ivory/40 text-ivory hover:border-ivory"
                      }`}
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
