import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { altLanguages, routing } from "@/i18n/routing";
import { programBySlug, programs } from "@/lib/programs";
import { included } from "@/lib/courses";
import { founderMedia } from "@/lib/media";
import { brand, whatsappLinkWith } from "@/lib/studio";
import {
  arrow,
  btnLine,
  btnSolid,
  btnSolidLight,
  displayChapter,
  displayLarge,
  displayRow,
  displaySection,
  eyebrow,
  eyebrowLight,
  linkRule,
  linkRuleLight,
  pageHeader,
  sectionPad,
  sectionPadBottom,
  shell,
} from "@/lib/ui";
import { stagger } from "@/lib/motion";
import { JsonLd, courseSchema, faqSchema } from "@/lib/seo";
import { Curriculum } from "@/components/Curriculum";
import { Faq } from "@/components/Faq";
import { KeyInfo } from "@/components/KeyInfo";
import { Mastery } from "@/components/Mastery";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { MaskReveal } from "@/components/MaskReveal";
import { WorkGallery } from "@/components/WorkGallery";

/**
 * One page per programme: six routes per language, twenty four in all.
 *
 * WHY THESE EXIST NOW AND DID NOT BEFORE. The catalogue page carried all six
 * disciplines and one shared set of conditions, which was the right shape while
 * the site's argument was "here is a beauty academy, here is what it offers".
 * It is the wrong shape for an education brand, for two reasons that have
 * nothing to do with taste. A discipline with no page of its own cannot be
 * found: "corso lip blush" resolves to a catalogue where lip blush is one row of
 * six, and the page's title, its description and its canonical are all about
 * the catalogue. And a visitor who has decided on one discipline has nowhere to
 * be taken; the strongest thing the site could offer her was an anchor.
 *
 * WHAT THIS PAGE IS ALLOWED TO SAY, WHICH IS THE ENTIRE DESIGN.
 *
 * The brief for the repositioning specified a fifteen-part structure: hero,
 * promise, who it is for, who it is not for, what you will master, key
 * information, instructor, results, curriculum, day-by-day schedule, what is
 * included, limited seats, testimonials, questions, application.
 *
 * The academy has supplied the material for nine of those. It has supplied no
 * syllabus, no schedule, no duration, no fee and no consented student quote,
 * for any of the six. So the six modules that need that material are built,
 * translated and gated: each one renders only when the data exists in
 * `lib/programs.ts`, and today none of it does. The page is therefore nine real
 * sections rather than fifteen sections of which six are plausible fiction, and
 * it grows the day Amira sends a curriculum without anyone touching this file.
 *
 * The gated modules and what unlocks each:
 *
 *   what you will master     `program.masters`      a count, plus the strings
 *   curriculum, day by day   `program.curriculum`   days and module counts
 *   duration row             `facts.durationKey`    a duration message key
 *   location row             `facts.locationKey`    a city, else the reach
 *   student voices           `program.voices`       consented quotes only
 *
 * THE FEE IS NOT GATED. It is forbidden. The academy quotes privately, and
 * `courses.test.ts` enforces the absence of any figure across all four
 * catalogues. The action on this page asks for the details, which is also the
 * more premium ask: "Request a seat" selects, "Buy now" sells.
 *
 * SCARCITY IS REAL HERE OR IT IS NOWHERE. The one scarcity claim this page
 * makes is the class size, and it is the academy's own published cap of three
 * to four. There is no countdown, no seat counter and no "only two places
 * left", because the site has no way to know that and inventing it is the
 * fastest way to make a premium brand read as a funnel.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    programs.map((program) => ({ locale, slug: program.slug })),
  );
}

/**
 * Six slugs and no others, decided at the routing layer.
 *
 * Without this, an unknown slug is rendered on demand, and the `notFound()`
 * below is reached only part way through that render: the page streams, so the
 * response headers are already committed by the time the call is made, and the
 * visitor is served the not-found page with a 200 on it. A soft 404 is
 * invisible to a reader and expensive with a crawler, which will index the URL
 * and count it as a duplicate of the not-found page.
 *
 * The catalogue is a fixed set of six that changes only when someone edits
 * `lib/courses.ts`, so there is nothing a dynamic slug could usefully serve.
 * With `dynamicParams` off, anything outside `generateStaticParams` is a real
 * 404 before any rendering starts, which is what `/en/nonsense` already did and
 * what this route should have been doing.
 *
 * The `notFound()` in the body stays. It is what types `program` as defined for
 * everything after it, and it is the backstop if this ever has to be turned
 * back on.
 */
export const dynamicParams = false;

/**
 * Title and description per programme, per language.
 *
 * This is most of the reason the routes exist. The description is a template
 * with the course name interpolated (`programs.meta.description`) rather than
 * six hand-written strings in four languages, because twenty four descriptions
 * maintained by hand is twenty four chances for one of them to say something
 * the academy has not agreed to. The template says only what is true of every
 * course, and the name is the variable.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!programBySlug(slug)) return {};

  const t = await getTranslations({ locale });
  const name = t(`catalog.courses.${slug}`);

  return {
    title: name,
    description: t("programs.meta.description", { course: name }),
    alternates: altLanguages(`/courses/${slug}`, locale),
  };
}

/**
 * The questions this page answers inline. Six of the eleven, chosen for someone
 * looking at one course rather than at the school: what it includes, whether a
 * beginner can take it, how many are in the room, whether the kit comes with
 * it, whether there is a certificate, and how to book. The fee question is
 * deliberately among them: it is the question a page with no price on it most
 * needs to answer, and the academy's own answer is a good one.
 */
const programFaq = [
  "beginners",
  "includes",
  "students",
  "kit",
  "price",
  "booking",
] as const;

const notForItems = ["quick", "broad", "passive"] as const;

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const program = programBySlug(slug);
  if (!program) notFound();

  const t = await getTranslations();
  const name = t(`catalog.courses.${slug}`);
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));

  return (
    <>
      <JsonLd
        data={courseSchema(
          locale,
          slug,
          name,
          t("programs.meta.description", { course: name }),
          brand.founder,
        )}
      />
      <JsonLd
        data={faqSchema(
          programFaq.map((k) => ({ q: t(`faq.items.${k}.q`), a: t(`faq.items.${k}.a`) })),
        )}
      />

      {/* 01 HERO
          Type on ivory rather than a photograph behind a scrim. The homepage
          opens on film because it is a title card for the brand; this page opens
          on a name because it is a document about one thing, and a reader who
          arrived here from a search has already decided what she is looking at.
          The photograph is directly below, at full width, where it can be the
          size it deserves instead of a texture under a headline.

          The back link is above the eyebrow, not below the fold: this is a leaf
          page and a good proportion of its traffic lands on it cold. */}
      <section className={`${pageHeader} bg-ivory`}>
        <div className={shell}>
          <Reveal>
            <Link href="/courses" className={linkRule}>
              <ArrowLeft size={14} weight="light" className={`flip-x ${arrow}`} />
              {t("programs.backToAll")}
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">
              <MaskReveal>
                <p className={eyebrow}>{t("programs.eyebrow")}</p>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-6">
                <h1 className={`${displaySection} max-w-[16ch]`}>{name}</h1>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-4 lg:col-start-9 lg:pb-3">
              <p className="max-w-[46ch] text-[17px] leading-relaxed text-mute">
                {t(`catalog.blurbs.${slug}`)}
              </p>
            </Reveal>
          </div>

          {/* 06 KEY INFORMATION, brought to the top.
              The brief put this sixth. On a page a reader reaches having already
              chosen the discipline, the six facts are the first thing she scans
              and the reason she either keeps reading or leaves, so they sit
              directly under the name. Rows with no data do not render: see
              `KeyInfo`. */}
          <div className="mt-14 md:mt-20">
            <KeyInfo program={program} />
          </div>

          {/* Two actions, in the site's own order: the conversation that needs
              no form, then the request that goes on the record. Neither says
              "buy": there is no price on this page and the ask is a place, not a
              transaction. */}
          <Reveal delay={0.12} className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6 md:mt-16">
            <Link href={`/contact?course=${slug}`} className={btnSolid}>
              {t("cta.requestSeat")}
            </Link>
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className={btnLine}>
                <WhatsappLogo size={17} weight="light" />
                {t("contact.whatsapp")}
              </a>
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* The programme's own photograph, full bleed, between the facts and the
          argument. The one on file for this discipline, at the crop `courses.ts`
          gives it.

          `posterOffHome` marks the one discipline whose supplied photograph the
          academy is replacing. The homepage stands its frame down and so does
          this page: an empty band is worse than no band, so the section simply
          does not render and the argument below closes up. */}
      {!program.posterOffHome ? (
        <section className="bg-ivory">
          <Parallax distance={16}>
            <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
              <MediaFrame media={program.media} sizes="100vw" />
            </div>
          </Parallax>
        </section>
      ) : null}

      {/* 02 THE PROMISE
          One claim, at pull-quote size, and it is the same claim on all six
          pages because it is the academy's own promise about all six: you leave
          able to perform the treatment. Writing six different promises would
          mean writing five things nobody has said. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <p className={eyebrow}>{t("programs.promise.eyebrow")}</p>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <MaskReveal>
              <h2 className={`${displayLarge} max-w-[24ch] text-balance`}>
                {t("programs.promise.title")}
              </h2>
            </MaskReveal>
            <Reveal delay={stagger.line}>
              <p className="mt-8 max-w-[56ch] text-[17px] leading-relaxed text-mute">
                {t("programs.promise.body")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 03 WHO IT IS FOR and 04 WHO IT IS NOT FOR, as one act in two halves.
          The brief asked for two sections. They are two columns of one, because
          separated by a full section break the second reads as the page turning
          on the reader; side by side it reads as the page being straight with
          her, which is the tone the whole positioning is after.

          The two levels are the academy's own (`faq.items.beginners.a`), and
          they are the same two the ladder on the homepage draws. */}
      <section className={`${sectionPadBottom} bg-paper`}>
        <div className={shell}>
          <MaskReveal>
            <p className={eyebrow}>{t("programs.forWho.eyebrow")}</p>
          </MaskReveal>
          <MaskReveal delay={stagger.base} className="mt-6">
            <h2 className={`${displaySection} max-w-[16ch]`}>{t("programs.forWho.title")}</h2>
          </MaskReveal>

          <div className="mt-12 grid gap-x-16 gap-y-12 border-t border-hair pt-10 md:mt-16 lg:grid-cols-12">
            {/* The two ways in. */}
            <div className="lg:col-span-7">
              <ol className="grid gap-10 sm:grid-cols-2 lg:gap-x-10">
                {(["base", "advanced"] as const).map((k, i) => (
                  <Reveal as="li" key={k} delay={i * 0.06}>
                    <span className="label font-mono text-bronze-ink">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`${displayRow} mt-4`}>{t(`programs.forWho.${k}Label`)}</h3>
                    <p className="mt-3 max-w-[42ch] text-[16px] leading-relaxed text-mute">
                      {t(`programs.forWho.${k}`)}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>

            {/* And who it is not for. Set in the muted grade under a hairline of
                its own, so it reads as a caveat the page volunteers rather than
                as a second heading competing with the first. */}
            <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
              <p className="label text-mute">{t("programs.notFor.title")}</p>
              <ul className="mt-6 border-t border-hair">
                {notForItems.map((k) => (
                  <li
                    key={k}
                    className="border-b border-hair py-4 text-[15px] leading-relaxed text-mute"
                  >
                    {t(`programs.notFor.items.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 WHAT YOU WILL MASTER. Gated: renders nothing until `program.masters`
          is set. See `Mastery`. */}
      {program.masters ? (
        <section className={`${sectionPad} bg-ivory`}>
          <div className={shell}>
            <MaskReveal>
              <p className={eyebrow}>{t("programs.mastery.eyebrow")}</p>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-6">
              <h2 className={`${displaySection} max-w-[18ch]`}>
                {t("programs.mastery.title")}
              </h2>
            </MaskReveal>
            <Mastery program={program} />
          </div>
        </section>
      ) : null}

      {/* 09 and 10 CURRICULUM, DAY BY DAY. One module, gated. See `Curriculum`
          for why the brief's two sections are one here. */}
      {program.curriculum?.length ? (
        <section className={`${sectionPad} bg-ivory`}>
          <div className={shell}>
            <MaskReveal>
              <p className={eyebrow}>{t("programs.curriculum.eyebrow")}</p>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-6">
              <h2 className={`${displaySection} max-w-[18ch]`}>
                {t("programs.curriculum.title")}
              </h2>
            </MaskReveal>
            <Curriculum program={program} />
          </div>
        </section>
      ) : null}

      {/* 11 WHAT IS INCLUDED
          The four things every course carries, in the academy's own words, plus
          the method that orders them. Four columns under one hairline: the same
          construction the homepage uses for its practical strip. */}
      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <p className={eyebrow}>{t("programs.included.eyebrow")}</p>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-6">
                <h2 className={`${displaySection} max-w-[16ch]`}>
                  {t("programs.included.title")}
                </h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[16px] leading-relaxed text-mute">
                {t("method.lede")}
              </p>
            </Reveal>
          </div>

          <ol className="mt-12 grid gap-x-10 gap-y-10 border-t border-hair pt-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
            {included.map((k, i) => (
              <Reveal as="li" key={k} delay={i * 0.06}>
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} mt-4`}>{t(`method.steps.${k}.title`)}</h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-mute">
                  {t(`method.steps.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 THE INSTRUCTOR
          Not a biography. The one thing an applicant to a small-group course
          needs to know is who is in the room with her, and the answer is the
          founder rather than a member of staff. Her portrait, her quotation, her
          titles, and a link to the story for anyone who wants it.

          Copy is `about.mission.quote` and `about.story.p3`, both already hers
          and both already on /about and the homepage. This is the third place on
          the site that signs her, with the same construction. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={`${shell} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Parallax distance={12} className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full">
              <MediaFrame
                media={{ ...founderMedia, alt: t("about.portrait") }}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Parallax>

          <Reveal className="lg:col-span-6 lg:col-start-7">
            <MaskReveal>
              <p className={eyebrow}>{t("programs.instructor.eyebrow")}</p>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-6">
              <h2 className={`${displaySection} max-w-[16ch]`}>
                {t("programs.instructor.title")}
              </h2>
            </MaskReveal>

            <blockquote className={`${displayLarge} mt-10 max-w-[24ch] text-balance text-mute`}>
              &ldquo;{t("about.mission.quote")}&rdquo;
            </blockquote>

            <div className="mt-10 border-t border-hair pt-6">
              <p className="text-[17px] text-espresso">{t("instructor.title")}</p>
              <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-mute">
                {t("instructor.role")}
              </p>
            </div>

            <p className="mt-8 max-w-[48ch] text-[16px] leading-relaxed text-mute">
              {t("about.story.p3")}
            </p>

            <Link href="/about" className={`${linkRule} mt-10`}>
              {t("about.readStory")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 08 THE WORK
          The academy's own client photographs, under a heading that claims only
          what is true of all of them: this is the standard being trained
          towards. It is deliberately NOT "results from this course". The site
          cannot know which treatment produced any given photograph, and
          `lib/programs.ts` records at length why a per-discipline set was built
          and then removed rather than shipped. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={shell}>
          <div className="grid gap-8 pb-12 md:pb-16 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-6">
              <MaskReveal>
                <p className={eyebrow}>{t("programs.work.eyebrow")}</p>
              </MaskReveal>
              <MaskReveal delay={stagger.base} className="mt-6">
                <h2 className={`${displaySection} max-w-[16ch]`}>{t("programs.work.title")}</h2>
              </MaskReveal>
            </div>
            <Reveal delay={stagger.line} className="lg:col-span-5 lg:col-start-8 lg:pb-3">
              <p className="max-w-[48ch] text-[17px] leading-relaxed text-mute">
                {t("programs.work.sub")}
              </p>
            </Reveal>
          </div>
          <WorkGallery />
        </div>
      </section>

      {/* 12 LIMITED PLACES
          The one scarcity claim on the site, and it is the academy's own class
          cap rather than a counter. On the near-black ground because it is the
          single sentence this page most wants read, and because the page has run
          light for six sections and needs a turn before the ask.

          Nothing here counts down and nothing says how many places are left.
          The site has no way to know, and a premium brand that invents urgency
          stops being one. */}
      <section className={`${sectionPad} bg-night text-ivory`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <p className={eyebrowLight}>{t("programs.scarcity.eyebrow")}</p>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <MaskReveal>
              <h2 className={`${displaySection} max-w-[18ch] text-balance`}>
                {t("programs.scarcity.title")}
              </h2>
            </MaskReveal>
            <Reveal delay={stagger.line}>
              <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-mute-dark">
                {t("programs.scarcity.body")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 13 STUDENT VOICES. Gated on `program.voices`, which is unset for all
          six and may only be set once a student has consented in writing. The
          site-wide rule is in `Testimonial.tsx` and `courses.test.ts` blocks the
          fabricated quotes that were once in this repository's history from
          coming back by name. */}

      {/* 14 THE QUESTIONS */}
      <section className={`${sectionPad} bg-ivory`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <p className={eyebrow}>{t("programs.faq.eyebrow")}</p>
            </MaskReveal>
            <MaskReveal delay={stagger.base} className="mt-6">
              <h2 className={`${displaySection} max-w-[10ch]`}>{t("programs.faq.title")}</h2>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={programFaq} />
            <Link href="/faq" className={`${linkRule} mt-10`}>
              {t("faq.viewAll")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* 15 THE APPLICATION
          "Request a seat", not "Buy now". There is no price on this page, the
          class is capped at three or four, and the academy quotes and confirms
          in a conversation: the honest verb is also the more selective one.

          The form itself is on /contact rather than duplicated here. It is four
          fields, one of them the course, and a second copy of it on twenty four
          routes is twenty four places for the destination address to drift. */}
      <section className={`${sectionPad} bg-espresso text-ivory`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <MaskReveal>
              <p className={eyebrowLight}>{t("programs.apply.eyebrow")}</p>
            </MaskReveal>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <MaskReveal>
              <h2 className={`${displaySection} max-w-[18ch] text-balance`}>
                {t("programs.apply.title")}
              </h2>
            </MaskReveal>
            <Reveal delay={stagger.line}>
              <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-mute-dark">
                {t("programs.apply.body")}
              </p>
            </Reveal>

            <Reveal delay={0.12} className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <Link href={`/contact?course=${slug}`} className={btnSolidLight}>
                {t("cta.requestSeat")}
              </Link>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className={linkRuleLight}
                >
                  <WhatsappLogo size={15} weight="light" />
                  {t("contact.whatsapp")}
                </a>
              ) : null}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Back to the other five. A leaf page should end with a way sideways as
          well as a way in: a reader who has read this far and decided this is
          not her discipline has one question left, and it is "what else". */}
      <section className={`${sectionPadBottom} bg-espresso pt-16 text-ivory md:pt-20`}>
        <div className={`${shell} border-t border-hair-dark pt-10`}>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {programs
              .filter((p) => p.slug !== slug)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/courses/${p.slug}`}
                    className={`${displayChapter} text-mute-dark transition-colors duration-300 hover:text-ivory`}
                  >
                    {t(`catalog.courses.${p.slug}`)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </>
  );
}
