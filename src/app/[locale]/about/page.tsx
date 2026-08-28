import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { WelcomeVideo } from "@/components/WelcomeVideo";
import { certificateMedia, demonstrationMedia } from "@/lib/media";
import { welcomeVideoId } from "@/lib/studio";
import {
  bodyBase,
  bodyLede,
  btnLine,
  btnSolid,
  displayItem,
  displayLarge,
  displayPage,
  displayQuote,
  displayRow,
  displaySection,
  displayStat,
  eyebrow,
  eyebrowLight,
  ledeFromTitle,
  pageHeader,
  sectionPad,
  sectionPadBottom,
  shell,
  titleFromLabel,
} from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, personSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altLanguages("/about", locale),
  };
}

/**
 * The founder page.
 *
 * The academy's differentiator is a person: someone who teaches the techniques
 * she performs on paying clients every day, in her own institute. That is the
 * argument this page makes, in the order a first-time visitor needs it. It also
 * holds what the homepage deliberately no longer carries: the academy's stated
 * values, the business curriculum, and the welcome message.
 *
 * The two figures (8+ years, 150+ students) are the only numbers the academy
 * has stated about itself, so they are the only numbers here.
 */
const differences = ["experience", "small", "support"] as const;

const beyond = [
  "mindset",
  "marketing",
  "clients",
  "consultation",
  "photography",
  "communication",
  "branding",
  "growth",
] as const;

const values = ["professionalism", "quality", "innovation", "ethics", "growth"] as const;
const visionPoints = ["quality", "professionalism", "innovation", "growth"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const inst = await getTranslations("instructor");
  const cta = await getTranslations("cta");
  const mentor = await getTranslations("mentor");

  return (
    <>
      <JsonLd data={personSchema(locale, t("story.role"), t("lede"))} />

      {/* THE SPLIT, AND WHY THE PHOTOGRAPH IS THE LARGER HALF.

          Five columns of type against six of picture, with the twelfth between
          them as the gutter. It used to be the other way round, and the section
          read as a paragraph with a photograph beside it rather than as a
          photograph with a caption: at 1440 the type took 632px and the frame
          519, so the first thing on the page about a person was the smaller
          half of its own composition.

          The frame is the demonstration, which is the one image on this page
          that shows the work being taught rather than the person teaching it,
          and the copy beside it is the method for exactly that reason. See the
          note on `about.lede`.

          The measure does not move with the column. `max-w-[50ch]` was already
          binding at 510px inside a 632px column, so the lede sets to the same
          line it always did; the column simply stops being wider than the text
          it holds. */}
      <section className={`${pageHeader} bg-ivory`}>
        <div className={`${shell} grid items-end gap-10 lg:grid-cols-12 lg:gap-12`}>
          <Stagger className="lg:col-span-5">
            <StaggerItem>
              <p className={eyebrow}>{t("eyebrow")}</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${displayPage} ${titleFromLabel} max-w-[14ch] text-balance`}>
                {/* The space is a real one. See the note in Hero.tsx: two
                    sibling blocks with no whitespace between them read as one
                    run-together token to anything that parses the document
                    instead of painting it. */}
                <span className="block">{t("titleA")}</span>{" "}
                <span className="block text-mute">{t("titleB")}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className={`${ledeFromTitle} max-w-[50ch] ${bodyLede} text-mute`}>
                {t("lede")}
              </p>
            </StaggerItem>
          </Stagger>

          {/* THE TABLET CAP, AND WHY IT IS ONE STACKED MEDIA QUERY.

              The split engages at lg, so from 768 to 1023 the frame is stacked
              under the type at the full width of the gutter: 754px on an 834px
              tablet, which at 3:4 is 1005px tall. That is ninety percent of the
              screen given to one photograph, and the reader meets it as a
              banner rather than as a plate. Capped and centred it is 416 wide
              and the section comes down by roughly four hundred and fifty
              pixels. The crop does not change: the box is the same ratio, so
              the frame simply prints smaller.

              `md:max-[1023px]:` rather than `md:` undone by `lg:`, and that is
              the trap `AuthorityStrip` documents at length: two min-width
              queries of equal specificity are resolved by the order Tailwind
              emits them in, not by the order they are typed, and an arbitrary
              variant is not guaranteed to sort after a named breakpoint. One
              query with both bounds applies only in the band it is meant for
              and there is nothing left to override.

              Below md the phone keeps the full width, where a 342px frame is
              the right size and there is nothing to cap. */}
          <Parallax distance={10} className="lg:col-span-6 lg:col-start-7">
            <div className="relative mx-auto aspect-[3/4] w-full md:max-[1023px]:max-w-[26rem]">
              <MediaFrame
                media={{ ...demonstrationMedia, alt: t("demoAlt") }}
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                imageClassName="settle"
              />
            </div>
          </Parallax>
        </div>
      </section>

      {/* The two figures the academy states about itself, and where it is.

          Two columns on a phone rather than three stacked rows. The three facts
          are the academy's whole claim to authority and they were reading as a
          list: three full width rows, one figure each, about a screen and a half
          of scrolling to get past 8+ and 150+. Set side by side the two numbers
          are read together, which is the only way a pair of figures argues
          anything, and the reach line takes the full width beneath them because
          it is a place rather than a quantity and does not belong in the
          comparison. Nothing is added and no figure changes: this is the same
          three facts in the shape they should have been in. */}
      <section className="bg-ivory pb-16 md:pb-24">
        <div className={shell}>
          <dl className="grid grid-cols-2 border-t border-hair sm:grid-cols-3">
            {(["years", "students", "reach"] as const).map((k, i) => (
              <Reveal
                key={k}
                delay={i * 0.08}
                className={`border-b border-hair py-8 sm:border-b-0 ${
                  i === 1 ? "border-s border-hair ps-6 sm:ps-8" : ""
                } ${i === 2 ? "col-span-2 sm:col-span-1 sm:border-s sm:ps-8" : ""} ${
                  i === 0 ? "pe-6 sm:pe-0" : ""
                }`}
              >
                <dt className={displayStat}>{t(`facts.${k}.value`)}</dt>
                <dd className="label mt-4 max-w-[24ch] text-mute">{t(`facts.${k}.label`)}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Her story, in her own voice.
          The heading used to travel with the reader down a sticky left column,
          because the section had no photograph and there was nothing else to
          put beside the text. That is the shape of a biography, and a
          biography is what this page most has to avoid being: four paragraphs
          of prose in a bare column, with the only face on the page two screens
          above it.

          The heading now sits over both columns and the column beside the text
          carries the founder portrait, so the story is read against the person
          telling it. The frame is her studio portrait and `story.imageAlt`
          describes exactly what it shows. It is deliberately not the cut-out
          the homepage opens its first act on: this page is the long account of
          who she is, and it is read better against a photograph the homepage
          does not already spend. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={shell}>
          <Reveal className="max-w-[36rem]">
            <p className={eyebrow}>{t("story.eyebrow")}</p>
            <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("story.title")}</h2>
            <p className="label mt-8 max-w-[34ch] text-mute">{t("story.role")}</p>
          </Reveal>

          {/* SIX COLUMNS OF PORTRAIT AGAINST FIVE OF PROSE, AND THE MEASURE ON
              THE PROSE RATHER THAN ON THE COLUMN.

              The split was five against six the other way, which put the one
              formal portrait of the founder at 509px beside a 624px column of
              her own account of herself. A page whose whole argument is a person
              should not set the person smaller than the paragraph about her.

              THE MEASURE IS THE PART THAT WAS ACTUALLY BROKEN. `max-w-[62ch]`
              resolved to 595px here, and 595px of this face is 85 to 88
              characters a line: twenty past the top of the range prose is read
              comfortably at, and the reason this section read as an article
              rather than as a story. `ch` is the width of the font's own zero,
              which in a humanist sans is a good deal wider than its average
              letter, so a cap written in `ch` always buys more line than it
              looks like it does. 46ch lands at about 63 characters and is the
              measure the rest of the site already sets body copy at.

              The copy came down with it: four paragraphs of forty words each
              were the method, the offer and the support stated a second time,
              and all three have sections of their own below. What is left is who
              she is and what she has done, which is what the portrait is of. */}
          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-16">
            <Parallax distance={12} className="lg:col-span-6">
              {/* Capped and centred in the stacked band. See the note on the
                  page header's frame. */}
              <div className="relative mx-auto aspect-[4/5] w-full md:max-[1023px]:max-w-[24rem]">
                <MediaFrame
                  media={{
                    posterSrc: "/brand/amira-founder-studio-portrait.jpg",
                    alt: t("story.imageAlt"),
                    // Centred, and the numbers say it should be. The file is
                    // 1708x2560 and the box is 4:5, so cover keeps 2135px of
                    // height and spends 425. Half of that off each end opens
                    // the frame about 100px above her hair and closes it just
                    // under her folded hands: her head whole, the length of the
                    // hair, the shoulders and the arms, which is the whole
                    // portrait. Pulling the crop up loses the hands and pulling
                    // it down cuts the crown; there is no third option in 425px.
                    position: "50% 50%",
                  }}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                />
              </div>
            </Parallax>

            <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
              {(["p1", "p2", "p3", "p4"] as const).map((k, i) => (
                <Reveal key={k} delay={0.06 + i * 0.04}>
                  <p
                    className={`max-w-[46ch] leading-relaxed text-mute ${
                      i === 0 ? "text-[18px] text-espresso" : "mt-7 text-[16px]"
                    }`}
                  >
                    {t(`story.${k}`)}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={0.24}>
                <p className="display mt-12 text-[clamp(1.5rem,2.6vw,2.25rem)] italic">
                  {t("story.signature")}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Amira's welcome message. Click to load, so the page never carries the
          player bundle for a video most visitors will not open.

          On paper, with the story above it: the two sections are one chapter,
          her account of the work and then her own voice over it, and the page
          had them on two different grounds. The alt follows what is actually
          on screen. Until the clip is uploaded this frame is a photograph of a
          student with her certificate and nothing else, so describing it as a
          welcome message would be describing something that is not there.

          The box is the photograph's own 3:4 rather than the 16:9 the player
          wants, so the frame is filled at the column's full width with nothing
          cropped off it. Argued in the note on `certificateMedia`. */}
      <section className={`${sectionPadBottom} bg-paper`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          {/* SIX AND FIVE, DOWN FROM SEVEN AND FOUR, and the reason is the
              column rather than the frame.

              Four columns is 395px, and `displayLarge` is 40px at this width, so
              the line above the paragraph was setting at about nine characters
              to the line: five stacked fragments down a narrow strip, which is
              what a pull quote looks like when it has been given a caption's
              width. Five columns is 519px and the same line sets in two. The
              frame gives up 107px to pay for it and is still the larger half of
              the composition, which is what this pair is for. */}
          <Reveal className="lg:col-span-6">
            {/* Capped and centred in the stacked band, on the wrapper rather
                than on the frame: `WelcomeVideo` sizes its own aspect box to the
                full width of whatever holds it. See the note on the page
                header's frame. */}
            <div className="mx-auto md:max-[1023px]:max-w-[26rem]">
              <WelcomeVideo
                playbackId={welcomeVideoId}
                poster={certificateMedia.posterSrc}
                position={certificateMedia.position}
                aspect="aspect-[3/4]"
                alt={welcomeVideoId ? mentor("videoAlt") : t("certificateAlt")}
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5 lg:col-start-8 lg:self-center">
            {/* NO MEASURE ON THIS LINE, AND THAT IS DELIBERATE.

                The Italian is four words and would sit inside almost any cap;
                the other three catalogues are not, and a `ch` cap struck for the
                short line put the English at five stacked fragments and the
                French at seven. The column is 519px, which is the measure, and
                `text-balance` is what evens the rag in whichever language is
                being set. A display line this short does not need a second
                constraint on top of the column holding it. */}
            <p className={`${displayLarge} text-balance`}>{inst("mission")}</p>
            <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-mute">
              {inst("body")}
            </p>
            {/* HER TITLES ARE NOT THE CAPTION TO THIS PHOTOGRAPH.

                `instructor.role` used to close this block, and once the copy
                beside the frame became the student's outcome rather than the
                academy's mission it was three of Amira's credentials sitting
                under a paragraph about somebody else's first clients. They are
                also the third statement of them on this page: `story.role`
                carries the same two titles one section above, and the course
                pages carry the full line under her name.

                The key stays in all four catalogues and is still read by
                `courses/[slug]`. It is only this printing of it that goes. */}
          </Reveal>
        </div>
      </section>

      {/* Three claims a visitor can check, and the curriculum under them: one
          chapter on ivory about what the school is, between her story on paper
          and the mission on black. The grounds used to change on every section
          down this page, which is seven switches on the way to the bottom and
          the point at which a change of ground stops reading as a change. */}
      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in Manifesto.tsx. */}
          <Reveal>
            <p className={eyebrow}>{t("different.eyebrow")}</p>
            <h2 className={`${displaySection} mt-6 max-w-[22ch]`}>{t("different.title")}</h2>
          </Reveal>

          {/* THE ROW SPLITS AT lg, NOT AT md.

              Twelve columns inside the page gutter is 26px a column at 834, so
              four of them plus a gutter is 225px, and a title set in the display
              face at that width broke over four lines of about seven characters
              each. The whole 768 to 1023 band read as a column of fragments
              beside a comfortable paragraph.

              Below lg the three parts stack, which is what a row of a number, a
              title and a paragraph wants at that width, and the twelve-column
              split starts where a column is wide enough to hold a title on one
              line. */}
          <ol className="mt-14 border-t border-hair md:mt-20">
            {differences.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={i * 0.06}
                className="grid gap-3 border-b border-hair py-8 lg:grid-cols-12 lg:gap-10"
              >
                <span className="label font-mono text-bronze-ink lg:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} lg:col-span-4`}>
                  {t(`different.items.${k}.title`)}
                </h3>
                <p className={`max-w-[52ch] ${bodyBase} text-mute lg:col-span-6 lg:col-start-7`}>
                  {t(`different.items.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* The business curriculum. Names only: the academy supplied no syllabus
          for these, and eight invented blurbs would be eight invented claims. */}
      <section className={`${sectionPadBottom} bg-ivory`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className={eyebrow}>{t("beyond.eyebrow")}</p>
                <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("beyond.title")}</h2>
                <p className="mt-8 max-w-[44ch] text-[16px] leading-relaxed text-mute">
                  {t("beyond.sub")}
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {beyond.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={(i % 4) * 0.05}
                className="flex items-baseline gap-5 border-b border-hair py-5"
              >
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={displayItem}>
                  {t(`beyond.items.${k}`)}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission, vision and the values the academy publishes. */}
      <section className={`${sectionPad} bg-night text-ivory`}>
        <div className={shell}>
          {/* The measure belongs on the quote, not on the block around it.
              `ch` resolves against the element's own font size, so a 24ch cap
              set on the wrapper was 24 characters of body text, about 260px,
              and the quote inside it was being set at 72px: eight lines of one
              or two words each down the left edge of an empty section. Moving
              the cap onto the line itself, at the size it is actually set in,
              gives it the three lines it was written for. */}
          <Reveal>
            <p className={eyebrowLight}>{t("mission.eyebrow")}</p>
            <p className={`${displayQuote} mt-10 max-w-[18ch] text-balance`}>
              {t("mission.quote")}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-12 max-w-[62ch]">
            <p className="text-[17px] leading-relaxed text-mute-dark">{t("mission.body")}</p>
          </Reveal>

          <div className="mt-20 grid gap-10 border-t border-hair-dark pt-14 lg:grid-cols-12 lg:gap-16 md:mt-28">
            <Reveal className="lg:col-span-5">
              <p className={eyebrowLight}>{t("vision.eyebrow")}</p>
              <h2 className={`${displayLarge} mt-8 max-w-[16ch]`}>{t("vision.title")}</h2>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
              <p className="max-w-[58ch] text-[16px] leading-relaxed text-mute-dark">
                {t("vision.body")}
              </p>
              <p className="mt-8 max-w-[58ch] text-[16px] leading-relaxed text-ivory">
                {t("vision.closing")}
              </p>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                {visionPoints.map((k) => (
                  <li key={k} className="label text-mute-dark">
                    {t(`vision.points.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-16 border-t border-hair-dark pt-10">
            <p className={eyebrowLight}>{inst("valuesLabel")}</p>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {values.map((k) => (
                <li key={k} className={displayItem}>
                  {inst(`values.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          {/* Measure on the heading. See the note in Manifesto.tsx. */}
          <Reveal>
            <h2 className={`${displaySection} max-w-[20ch]`}>{t("cta.title")}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
              {t("cta.body")}
            </p>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <Link href="/contact" className={btnSolid}>
                {cta("consultation")}
              </Link>
              <Link href="/courses" className={btnLine}>
                {cta("courses")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
