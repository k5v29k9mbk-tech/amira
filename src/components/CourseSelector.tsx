import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { arrow, bodySmall, displayChapter, shell } from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { MediaFrame } from "./MediaFrame";
import { Reveal } from "./Reveal";
import { pageText } from "@/lib/content/server";

/**
 * The catalogue: six disciplines, one list, two shapes.
 *
 * ONE LIST, AND WHY THAT MATTERS MORE THAN IT LOOKS. This was two: an editorial
 * row list marked `lg:hidden` and a card grid marked `hidden lg:grid`, each
 * rendering all six courses. Every course therefore existed twice in the
 * document — twelve headings, twelve links, twelve `next/image` elements — and
 * the copy for the hidden half shipped in the HTML of every page load.
 *
 * `display: none` does not stop an image being fetched. A hidden `next/image`
 * still resolves its `srcset`, still enters the viewport observer, and on a
 * phone the desktop grid's five photographs were downloading behind a layout
 * nobody on that device would ever see. The duplication cost bytes on the wire,
 * not just nodes in the tree.
 *
 * So the content is written once and the layout changes around it. Below lg
 * each row is a twelve-column grid — photograph one side, copy the other,
 * alternating — and from lg the anchor becomes `display: block`, which makes
 * every `sm:col-*` on its children inert without a single class being
 * duplicated, and the same two elements stack into a card. Nothing about either
 * layout changed; there is simply one of it now.
 *
 * MOTION. One thing moves, and only under a pointer that is actually over a
 * card: the photograph scales 4% over 1.2s. Slow enough to read as the image
 * breathing rather than as a hover state firing.
 *
 * WHERE A ROW GOES. Each row is now a link to that discipline's own page
 * (`/courses/<slug>`) rather than an anchor into the catalogue index. The
 * anchors were the best the site could offer while there was one page for six
 * courses; a reader who had decided on lip blush was sent to a list of six with
 * lip blush scrolled into view. The programme pages are the destination the
 * catalogue always wanted, and the index still carries all six for anyone
 * comparing them.
 *
 * This is a server component: it holds no state, so the catalogue ships as HTML
 * and costs the homepage no client JavaScript at all.
 */
export async function CourseSelector() {
  const t = await pageText("catalog", "catalog");
  const p = await pageText("catalog", "programs");
  const c = await pageText("common", "cta");

  return (
    <ul
      className={`${shell} grid lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14 xl:gap-x-14`}
    >
      {courses.map((course, i) => {
        /* Which side the frame takes, below lg. Six rows with the photograph
           always on the same edge is a results list; alternated, the row is a
           composition and the eye crosses the page instead of running down one
           column of thumbnails.

           Explicit `row-start-1` on both cells, because the flipped rows place
           the copy at column 1 after the frame has already claimed column 8:
           auto-placement would read that as a cursor that has gone backwards
           and drop the copy onto a second row. The starts are logical, so
           Arabic mirrors the whole alternation with no separate rule. */
        const flip = i % 2 === 1;

        return (
          /* Dealt in sequence. `stagger.tight` is 50ms, which over six items is
             300ms end to end: enough that the catalogue reads as being dealt
             out rather than switched on, short enough that the sixth is never
             waiting on the first. */
          <Reveal
            as="li"
            key={course.slug}
            delay={i * stagger.tight}
            className="border-b border-hair last:border-b-0 lg:border-b-0"
          >
            <Link
              href={`/courses/${course.slug}`}
              className="group grid gap-5 py-8 sm:grid-cols-12 sm:items-center sm:gap-8 lg:block lg:py-0"
            >
              {/* Landscape on a phone, portrait once the row splits in two and
                  again as a card: six stacked 4:5 frames would make the
                  catalogue a very long scroll for the sake of a crop. */}
              <div
                className={`relative aspect-[3/2] w-full overflow-hidden bg-paper sm:col-span-5 sm:row-start-1 sm:aspect-[4/5] lg:aspect-[4/5] ${
                  flip ? "sm:col-start-8" : "sm:col-start-1"
                }`}
              >
                {!course.posterOffHome ? (
                  <MediaFrame
                    media={course.media}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                    className="transition-transform duration-[1200ms] ease-[var(--ease-aura)] group-hover:scale-[1.04]"
                  />
                ) : (
                  /* The one discipline whose photograph the academy has not
                     supplied. An empty frame reads as a missing image, so the
                     card prints its own number instead, in the display serif
                     inside a hairline: a numeral plate among photographic ones
                     is a convention a reader has seen in a printed catalogue,
                     which is what makes an absent picture read as a choice.
                     Deleting `posterOffHome` in lib/courses.ts when the
                     photograph arrives is the whole of the change. */
                  <span
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center border border-hair"
                  >
                    <span className="display text-[clamp(2.5rem,5vw,4rem)] leading-none text-taupe">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                )}
              </div>

              <div
                className={`sm:col-span-7 sm:row-start-1 lg:mt-6 ${
                  flip ? "sm:col-start-1" : "sm:col-start-6"
                }`}
              >
                {/* Number and level at the two ends of one line: the figure
                    files the entry, the level qualifies it, and neither is
                    large enough to compete with the name under them. */}
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label font-mono text-bronze-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="label text-mute">{t("details.level.value")}</span>
                </div>

                <h3 className={`${displayChapter} mt-3`}>{t(`courses.${course.slug}`)}</h3>

                <p className={`mt-3 max-w-[42ch] ${bodySmall} text-mute`}>
                  {t(`blurbs.${course.slug}`)}
                </p>

                {/* THE TWO CONDITIONS, UNDER THE BLURB.

                    A name and a sentence is a catalogue entry. What makes it
                    read as a programme is the practical frame around it, and the
                    two facts that matter most to someone choosing are the ones a
                    row has room for: how many are in the class, and whether she
                    leaves with a certificate. Both are the academy's shared
                    conditions, quoted from `catalog.details.*`, so the six rows
                    cannot disagree with each other or with the programme pages.

                    The value for one and the label for the other, which is not
                    an inconsistency: "Maximum 3-4 artists" already says what it
                    is, and "Certificate" already says everything a row needs to
                    say about a certificate. Setting both as label plus value
                    produced "Places Maximum 3-4 artists", which is a label
                    colliding with a sentence. The full pair is printed properly
                    in the key-information module on the programme page, where
                    there is a column for each.

                    A middot between them rather than two lines or two columns:
                    at 15px in the muted grade this is one line of small print
                    qualifying the blurb above it, and anything more structured
                    would make six rows of specifications out of a catalogue. The
                    duration is deliberately not here, for the reason `KeyInfo`
                    gives: the academy has published none, and "varies" is not a
                    fact worth a row. */}
                <p className="mt-3 text-[14px] leading-relaxed text-mute">
                  {p("values.seats")} · {p("labels.certificate")}
                </p>

                {/* The rule draws under the action on hover, the same gesture
                    `linkRule` makes everywhere else; it is written out here
                    because it keys off the card's hover rather than its own. */}
                <span className="label mt-5 inline-flex items-center gap-3 border-b border-transparent pb-1 text-espresso transition-colors duration-500 ease-[var(--ease-aura)] group-hover:border-espresso">
                  {c("course")}
                  <ArrowRight size={13} weight="light" className={`flip-x ${arrow}`} />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}
