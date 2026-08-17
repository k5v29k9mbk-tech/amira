import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, families, included } from "@/lib/courses";
import { beforeAfterPairs, whatsappLinkWith } from "@/lib/studio";
import { BeforeAfter } from "@/components/BeforeAfter";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import {
  arrow,
  btnLine,
  btnSolid,
  btnSolidLight,
  displayLarge,
  displaySection,
  eyebrow,
  eyebrowLight,
  linkRule,
  pageHeader,
  sectionPad,
  shell,
} from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, courseListSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The catalogue is the second page the site is trying to be found for and it
 * was the only one carrying no title and no description of its own, so every
 * search result and every share of it read as the homepage. Both come from the
 * copy already at the top of the page: `catalog.title` names it and
 * `catalog.sub` is the sentence under the heading, which is exactly the sentence
 * a result ought to show.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: t("title"),
    description: t("sub"),
    alternates: altLanguages("/courses", locale),
  };
}

/**
 * One page for six courses.
 *
 * The academy publishes six names, a one-line description of each discipline
 * and one shared set of conditions that applies to all of them: duration,
 * level, language, class size, kit, certificate and venue are the same
 * statement whichever course you choose. Six near-identical pages would be thin
 * duplicate content, and filling them out would mean inventing syllabuses that
 * do not exist, so the conditions are stated once, below the list.
 *
 * Fees are not among them, by instruction. The academy quotes each course
 * privately, so there is no price row, no "from" figure and no price-on-request
 * placeholder: a table row that exists only to say it cannot tell you anything
 * is worse than no row. In its place the conditions column carries one line
 * explaining that the quote comes from Amira directly, and the action next to
 * it asks for exactly that.
 */
const detailKeys = [
  "duration",
  "level",
  "language",
  "students",
  "kit",
  "certificate",
  "location",
] as const;

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  // Null while no number is on file, which is what hides the action.
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));

  return (
    <>
      <JsonLd
        data={courseListSchema(
          locale,
          courses.map((c) => t(`catalog.courses.${c.slug}`)),
          t("catalog.sub"),
        )}
      />

      <section className={`${pageHeader} bg-ivory`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in Manifesto.tsx. */}
          <Stagger>
            <StaggerItem>
              <p className={eyebrow}>{t("catalog.eyebrow")}</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${displaySection} mt-6 max-w-[24ch]`}>{t("catalog.title")}</h1>
            </StaggerItem>
          </Stagger>
          <p className="mt-10 max-w-[56ch] text-[17px] leading-relaxed text-mute">
            {t("catalog.sub")}
          </p>
        </div>
      </section>

      {/* The catalogue as a list of rows rather than a grid of cards: the media
          leads, the name carries the row, the conditions are stated once.

          The six rows are now grouped into the three families rather than run
          as one flat list of six. A flat list made a visitor do the sorting: the
          two techniques most often confused with each other, microblading and
          powder brows, sat next to a lip treatment and a lash treatment with
          nothing to say they were answers to different questions. Grouped, the
          page states the discipline first and the technique second, which is the
          order someone chooses in.

          The row markup, the numbering, the anchors and every string are the
          ones that were already here. What is new is the heading above each
          group, so nothing is lost by the regrouping and no course moves out of
          the catalogue.

          The number is `n`, counted across the whole page rather than restarted
          per family, so the catalogue still reads as six courses under one
          standard and the figure on a row is stable no matter which group it
          lands in. */}
      <section className="bg-ivory">
        <div className={`${shell} border-t border-hair`}>
          {(() => {
            let n = 0;
            return families.map((family) => {
              const inFamily = courses.filter((c) => c.family === family);
              if (!inFamily.length) return null;
              return (
                <section key={family} className="border-b border-hair last:border-b-0">
                  <Reveal className="pt-14 pb-2 md:pt-20">
                    <h2 className={`${displayLarge} max-w-[16ch]`}>
                      {t(`catalog.families.${family}.title`)}
                    </h2>
                    <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-mute">
                      {t(`catalog.families.${family}.sub`)}
                    </p>
                  </Reveal>

                  <ol>
                    {inFamily.map((course) => {
                      const i = n++;
                      return (
                        <Reveal
                          as="li"
                          key={course.slug}
                          id={course.slug}
                          className="group/row grid scroll-mt-28 gap-6 border-t border-hair py-10 md:grid-cols-12 md:gap-10 md:py-14"
                        >
                          {/* The same treatment the work section gives a
                              photograph: a few pixels of drift against the
                              scroll for depth, and a slow push in on hover. The
                              hover is keyed to the whole row rather than to the
                              frame, because the row is what a reader is pointing
                              at when they are reading a course. */}
                          <Parallax distance={10} className="md:col-span-5">
                            <div className="relative aspect-[16/10] w-full md:aspect-[4/3]">
                              <MediaFrame
                                media={course.media}
                                sizes="(max-width: 768px) 100vw, 40vw"
                                imageClassName="transition-transform duration-[1400ms] ease-[var(--ease-aura)] group-hover/row:scale-[1.03]"
                              />
                            </div>
                          </Parallax>

                          <div className="md:col-span-6 md:col-start-7 md:self-center">
                            <span className="label font-mono text-bronze-ink">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {/* h3, not h2. The family above is the h2 now, and a
                                course sits under it: the outline was six h2s in
                                a row with nothing saying which of them were
                                answers to the same question. */}
                            <h3 className={`${displayLarge} mt-4`}>
                              {t(`catalog.courses.${course.slug}`)}
                            </h3>
                            <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-mute">
                              {t(`catalog.blurbs.${course.slug}`)}
                            </p>
                            <p className="label mt-6 text-mute">
                              {t("catalog.details.level.value")} ·{" "}
                              {t("catalog.details.language.value")}
                            </p>
                            <Link href="/contact" className={`${linkRule} mt-6`}>
                              {t("catalog.cta")}
                              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
                            </Link>
                          </div>
                        </Reveal>
                      );
                    })}
                  </ol>
                </section>
              );
            });
          })()}
        </div>
      </section>

      {/* Powder Brows, standing on its own.

          It is one of the six and it keeps its row in the brows family above;
          this is the second thing the page says about it, not a duplicate
          catalogue entry. The reason it gets one and the other five do not is
          that it is the technique most often mistaken for the one directly
          above it in the list, and a one line blurb in a row cannot carry the
          difference between a blade drawing hairs and a machine building shade.

          The ground is espresso, and that is the whole of its distinct visual
          identity: no new colour, no card, no border, no shape the site does not
          already own. The page runs ivory, ivory, paper, so one dark block in
          the middle of it reads as a held breath. It is the same device the hero
          and the closing frame already use.

          Every sentence in it describes the technique in general terms and
          nothing else: what it is (permanent makeup for the eyebrow), what it
          is worked with (a machine, in fine dots), and what it looks like (a
          soft shaded finish rather than drawn hairs). There is no healing time,
          no longevity, no treatment duration, no suitability claim, no before
          and after, no result and no price, because the academy has supplied
          none of those and a section like this is exactly where invented ones
          would look most at home. Nothing here describes how Amira in
          particular works, only what the discipline is.

          Of the three lines under the standfirst, the first is the distinction
          from microblading stated as instrument and mark, which is the one thing
          a reader most needs and the only reason this section exists rather than
          a second blurb. The second is `catalog.blurbs.powder-brows` verbatim,
          so it introduces no claim that was not already approved and shipping.
          The third is level, language and group size, which the academy states
          about every course it runs.

          The photograph carries alt="" on purpose. The site's standing rule is
          that it does not name the discipline that produced a client's brow,
          because it cannot know that from the file, and a frame in a section
          headed Powder Brows would be doing precisely that if it were
          described. It is here as atmosphere; the copy carries the meaning. */}
      <section id="powder-brows-detail" className={`${sectionPad} scroll-mt-28 bg-espresso`}>
        {/* `grid-cols-1` is load bearing on the phone and is not decoration.
            A bare `grid` gives the implicit column `auto`, which sizes to the
            widest min-content in it, and the button below is `whitespace-nowrap`
            with 40px of padding a side. In Italian its label ran the track to
            416px inside a 342px shell, so the whole document measured 441px
            against a 390px viewport and every section on the page inherited a
            sideways scroll. Tailwind's `grid-cols-1` is `minmax(0, 1fr)`, and
            the zero floor is what stops one long word deciding the page width.
            The label is short enough to fit on its own now; this is the guard
            that means the next translation cannot undo that. */}
        <div className={`${shell} grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16`}>
          <Parallax distance={10} className="lg:col-span-5">
            {/* Native ratio: the file is 1320x1323, so a square frame crops it
                by three pixels and nothing in the photograph is at risk. */}
            <div className="relative aspect-square w-full">
              <MediaFrame
                media={{
                  posterSrc: "/brand/brows-defined-portrait.jpg",
                  alt: "",
                  position: "50% 50%",
                  width: 1320,
                  height: 1323,
                }}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Parallax>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className={eyebrowLight}>{t("powder.eyebrow")}</p>
              <h2 className={`${displaySection} mt-8 max-w-[14ch] text-ivory`}>
                {t("powder.title")}
              </h2>
              <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute-dark">
                {t("powder.intro")}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-10 border-t border-hair-dark">
                {(["technique", "finish", "levels"] as const).map((k) => (
                  <li
                    key={k}
                    className="border-b border-hair-dark py-5 text-[16px] leading-relaxed text-mute-dark"
                  >
                    {t(`powder.points.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <Link href="/contact" className={`${btnSolidLight} mt-10`}>
                {t("powder.cta")}
                <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The shared conditions. Every value is a direct quotation of the
          academy's own course information. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-4">
            <h2 className={`${displaySection} max-w-[12ch]`}>{t("catalog.detailsTitle")}</h2>

            {/* Where the price row used to be. The fee is a conversation with
                Amira, so the page says so plainly and then offers the action
                that starts it, rather than leaving a visitor to guess whether
                the figure is hidden or simply missing. */}
            <p className="mt-8 max-w-[42ch] text-[16px] leading-relaxed text-mute">
              {t("catalog.privateNote")}
            </p>
            <Link href="/contact" className={`${btnSolid} mt-8`}>
              {t("catalog.cta")}
            </Link>
            <p className="label mt-8 text-mute">{t("catalog.payments")}</p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
            <dl className="border-t border-hair">
              {detailKeys.map((k) => (
                <div
                  key={k}
                  className="grid gap-1 border-b border-hair py-5 sm:grid-cols-5 sm:gap-6"
                >
                  <dt className="label text-mute sm:col-span-2 sm:pt-1">
                    {t(`catalog.details.${k}.label`)}
                  </dt>
                  <dd className="text-[16px] leading-relaxed sm:col-span-3">
                    {t(`catalog.details.${k}.value`)}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="label mt-10 text-mute">{t("catalog.includes")}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {included.map((k) => (
                <li key={k} className="flex items-baseline gap-4 text-[16px]">
                  <span aria-hidden className="h-px w-5 shrink-0 bg-bronze" />
                  {t(`catalog.included.${k}`)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* The work itself. Title and the comparison, no caption invented on the
          academy's behalf. */}
      {beforeAfterPairs.length > 0 && (
        <section className={`${sectionPad} bg-ivory`}>
          <div className={shell}>
            <Reveal>
              <h2 className={`${displaySection} max-w-[12ch]`}>{t("success.title")}</h2>
            </Reveal>
            <div
              className={`mt-14 grid gap-10 ${
                beforeAfterPairs.length === 1 ? "max-w-3xl" : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {beforeAfterPairs.map((pair, i) => (
                <Reveal key={pair.label} delay={(i % 3) * 0.06}>
                  <BeforeAfter pair={pair} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The end of the catalogue.
          This page used to stop: six courses, the conditions, a comparison,
          and then the footer. A reader who has gone through the whole
          catalogue is the most decided reader the site has, and the last thing
          she was offered was a link inside a course row a screen and a half
          back. The heading and the sentence are the contact page's own, which
          is where both actions go, so nothing here is copy written twice to
          fill a band.

          On ivory, not on the near black the homepage closes with. The footer
          is already near black, and a flat black band directly above it makes
          one undifferentiated field half a screen tall: the homepage gets away
          with it because its closing frame is a photograph. This is the same
          shape /about ends on, which is what the three inner pages should have
          in common. */}
      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in Manifesto.tsx. */}
          <Reveal>
            <h2 className={`${displaySection} max-w-[20ch] text-balance`}>
              {t("contact.title")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
              {t("contact.sub")}
            </p>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className={btnSolid}
                >
                  <WhatsappLogo size={17} weight="light" />
                  {t("contact.whatsapp")}
                </a>
              ) : null}
              {/* Not `hero.secondary`. In English that string and the heading
                  above it are the same three words, so the band was printing
                  "Book your place" twice, once at 7rem and once inside the
                  button underneath it. The label the six rows already use is
                  the honest one anyway: the fee is quoted in the conversation
                  this starts, so the first step is asking, not booking. */}
              <Link href="/contact" className={whatsappHref ? btnLine : btnSolid}>
                {t("catalog.cta")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
