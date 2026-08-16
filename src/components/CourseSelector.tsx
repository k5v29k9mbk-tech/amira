import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { arrow, displayChapter, shell } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";

/**
 * The catalogue: six disciplines, all six legible at once, in two layouts.
 *
 * WHAT THIS REPLACED, AND WHY. From lg this was a row of six panels sharing one
 * field of view, driven by `flex-grow`: one open, five collapsed to strips of
 * about 65px with their names turned on their side. It was built for the mouse,
 * and with a mouse it did read well — the pointer crossed the row and the
 * catalogue dealt itself out.
 *
 * It was still the wrong shape for the one section a visitor is here to browse.
 * Five of the six disciplines were a vertical word and nothing else until she
 * hovered them: no description, no level, no action. A reader deciding between
 * Microblading and Powder Brows had to hover one, read it, hover the other, and
 * hold the first in her head — the comparison the section exists to support was
 * the one thing it would not let her make. And the interaction had no meaning
 * for a keyboard, no meaning on a trackpad she was not moving, and no meaning
 * to anyone who simply scrolled past at reading speed.
 *
 * Six cards. Every name, its level, its line of description and its own link
 * are on the screen together, which is what a catalogue is, and the card is the
 * hit area rather than a panel that must first be opened to be used.
 *
 * The clip that used to play behind the open panel is gone with it. It was the
 * one moving image on the page that nobody asked for and it can only ever have
 * been playing in one of the six.
 *
 * MOTION. One thing moves, and only under a pointer that is actually over a
 * card: the photograph scales 4% over 1.2s. That is slow enough to read as the
 * image breathing rather than as a hover state firing, and it is the only
 * animation in the section.
 *
 * The component is a server component now. It held `useState`, a `matchMedia`
 * check and arrow-key handling for the panel row, none of which the grid needs;
 * what is left is markup and translation, so the catalogue ships as HTML and
 * costs the homepage no client JavaScript at all.
 */
export function CourseSelector() {
  const t = useTranslations("catalog");

  return (
    <>
      {/* Below lg: the catalogue as a list you read rather than operate. The
          number and the name carry the row, the hairline between rows is the
          only separator, and the whole row is the link. */}
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
            /* The rows arrive in sequence. `stagger.tight` is 50ms, which over
               six rows is 300ms end to end: enough that the catalogue reads as
               being dealt out rather than switched on, short enough that the
               sixth row is never waiting on the first. */
            <Reveal
              as="li"
              key={course.slug}
              delay={i * stagger.tight}
              className="border-b border-hair last:border-b-0"
            >
              <Link
                href={`/courses#${course.slug}`}
                className="group grid gap-5 py-8 sm:grid-cols-12 sm:items-center sm:gap-8"
              >
                {/* Landscape on a phone, portrait once the row splits in two:
                    six stacked 4:5 frames would make the catalogue a very long
                    scroll for the sake of a crop.

                    A course whose poster is off the homepage drops the cell
                    rather than holding an empty one, and its copy takes the
                    whole row: a blank 4:5 box beside the text is the one thing
                    worse than no photograph. */}
                {!course.posterOffHome ? (
                  <div
                    className={`relative aspect-[3/2] w-full overflow-hidden sm:col-span-5 sm:row-start-1 sm:aspect-[4/5] ${
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
                  <p className="label mt-3 text-mute">{t("details.level.value")}</p>
                  <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-mute">
                    {t(`blurbs.${course.slug}`)}
                  </p>
                  <span className="label mt-6 inline-flex items-center gap-3 text-espresso transition-colors duration-300 group-hover:text-bronze-ink">
                    {t("viewCourse")}
                    <ArrowRight size={13} weight="light" className={`flip-x ${arrow}`} />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      {/* From lg: six cards, two rows of three.
          Three across rather than two, because the catalogue is six: two rows
          of three close, where three rows of two leave the reader scrolling
          through a column of pairs and never see the set as a set. */}
      <ul className={`${shell} hidden gap-x-10 gap-y-16 lg:grid lg:grid-cols-3 xl:gap-x-14`}>
        {courses.map((course, i) => (
          <Reveal
            as="li"
            key={course.slug}
            /* Dealt across the row rather than down it: the stagger is the
               index, so the three cards of the first row arrive 50ms apart and
               the second row follows. */
            delay={i * stagger.tight}
          >
            <Link href={`/courses#${course.slug}`} className="group block">
              {/* 4:5, which is the ratio every photograph in the catalogue was
                  cropped for, and the ratio the work section prints. The frame
                  clips; the photograph inside it is what scales. */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper">
                {!course.posterOffHome ? (
                  <MediaFrame
                    media={course.media}
                    sizes="(max-width: 1280px) 32vw, 30vw"
                    className="transition-transform duration-[1200ms] ease-[var(--ease-aura)] group-hover:scale-[1.04]"
                  />
                ) : (
                  /* The one discipline whose homepage photograph the academy
                     has not supplied.

                     An empty frame with a rule across it is not a design
                     decision, it is a missing image, and it reads as one: the
                     sixth card looked broken next to five photographs. So the
                     card prints its own number instead, in the display serif at
                     the size the section headings use, on paper inside a bronze
                     hairline. A numeral plate among photographic ones is a
                     convention a reader has seen in a printed catalogue, which
                     is the one thing that makes an absent picture read as a
                     choice. Deleting `posterOffHome` in lib/courses.ts when the
                     photograph arrives is the whole of the change. */
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center border border-hair"
                  >
                    <span className="display text-[clamp(3rem,6vw,5rem)] leading-none text-taupe">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                )}
              </div>

              {/* The plate under the frame. Number and level share the first
                  line, at the two ends of the card: the figure files the card,
                  the level qualifies it, and neither is large enough to compete
                  with the name under them. */}
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="label text-mute">{t("details.level.value")}</span>
              </div>

              <h3 className={`${displayChapter} mt-3`}>{t(`courses.${course.slug}`)}</h3>

              <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-mute">
                {t(`blurbs.${course.slug}`)}
              </p>

              {/* The rule draws itself under the action on hover, which is the
                  same gesture `linkRule` makes everywhere else on the site; it
                  is written out here because it has to key off the card's hover
                  rather than its own. */}
              <span className="label mt-6 inline-flex items-center gap-3 border-b border-transparent pb-1 text-espresso transition-colors duration-500 ease-[var(--ease-aura)] group-hover:border-espresso">
                {t("viewCourse")}
                <ArrowRight size={13} weight="light" className={`flip-x ${arrow}`} />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
