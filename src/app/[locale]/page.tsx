import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { altLanguages } from "@/i18n/routing";
import { closingMedia, founderMedia } from "@/lib/media";
import { beforeAfterPairs } from "@/lib/studio";
import {
  btnLineLight,
  btnSolidLight,
  displayLarge,
  displayRow,
  displaySection,
  linkRule,
  sectionPad,
  shell,
} from "@/lib/ui";
import { JsonLd, faqSchema } from "@/lib/seo";
import { Hero } from "@/components/Hero";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Manifesto } from "@/components/Manifesto";
import { CourseSelector } from "@/components/CourseSelector";
import { MethodStory } from "@/components/MethodStory";
import { FrameGallery } from "@/components/FrameGallery";
import { Testimonial } from "@/components/Testimonial";
import { Faq } from "@/components/Faq";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata = { alternates: altLanguages() };

/**
 * The homepage is eight acts and a closing frame, in this order: the hero, the
 * statement, the catalogue, the method, the work, the founder, the gallery, the
 * three claims, the voices, six questions, and the invitation.
 *
 * Everything operational lives one click away rather than here: the shared
 * course conditions on /courses, the booking sequence and the channels on
 * /contact, the full question list on /faq, the values, the business curriculum
 * and the welcome message on /about. The before/after is the one thing that is
 * now in both places: it is the only proof of outcome the academy has supplied,
 * and a visitor who never reaches /courses should still see it.
 *
 * The two grounds are paced in pairs rather than alternated. Alternating on
 * every section makes eight switches on the way down the page, and a ground
 * that changes that often stops reading as a change at all. Paired, each switch
 * marks a turn in the argument:
 *
 *   ivory   hero, statement, catalogue      what this is
 *   paper   the method, the work            how it is taught, what it produces
 *   ivory   Amira, the studio               who teaches it, and where
 *   night   the three claims                the one thing said about ourselves
 *   paper   the questions
 *   night   the invitation
 *
 * Two consequences worth knowing before moving a section. The founder's copy
 * plate is painted with the section's own ground so it can cross the edge of
 * the portrait, so it changes when the section does. And the method section
 * needs its own bottom padding now that the ground changes under it.
 */
const homeFaq = [
  "beginners",
  "students",
  "includes",
  "kit",
  "certificate",
  "booking",
] as const;

/**
 * The three claims, in the academy's own words (`about.different.*`).
 *
 * This is the page's proof section, and it is deliberately not a testimonial:
 * the academy has supplied no consented student quotes, and until it does, the
 * honest form of proof is a claim a visitor can go and check. Each of these is
 * checkable. She trained in a working institute; the class cap is 3-4 and is
 * stated on every course; the support after the course is written into the
 * booking sequence on /contact.
 *
 * The copy is the same copy /about carries, translated once and read twice. It
 * belongs on both: /about argues it at length to someone already interested,
 * the homepage states it to someone deciding whether to be.
 */
const differences = ["experience", "small", "support"] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* Only the six questions this page actually shows. The other four are
          marked up on /faq, where they are visible. */}
      <JsonLd
        data={faqSchema(
          homeFaq.map((k) => ({ q: t(`faq.items.${k}.q`), a: t(`faq.items.${k}.a`) })),
        )}
      />

      <Hero />

      <Manifesto />

      {/* 01 COURSES */}
      <section id="courses" className="scroll-mt-20 bg-ivory pb-20 md:pb-32 lg:pb-44">
        <div className={`${shell} pb-12 md:pb-16`}>
          <Reveal>
            <SectionLabel n={1}>{t("sections.courses")}</SectionLabel>
            <h2 className={`${displaySection} mt-8 max-w-[16ch]`}>
              {t("catalog.selectorTitle")}
            </h2>
          </Reveal>
        </div>
        <CourseSelector />
      </section>

      {/* 02 THE METHOD */}
      <section id="method" className="scroll-mt-20 bg-paper pt-20 pb-20 md:pt-32 md:pb-32 lg:pt-44 lg:pb-44">
        <div className={shell}>
          <Reveal className="max-w-[20ch] pb-8 lg:pb-4">
            <SectionLabel n={2}>{t("sections.method")}</SectionLabel>
            <h2 className={`${displaySection} mt-8`}>{t("method.title")}</h2>
          </Reveal>
          <MethodStory />
        </div>
      </section>

      {/* 03 THE WORK
          The method section above explains how the technique is built; this is
          what it produces. It sits directly after it for that reason, and it is
          the only place on the homepage that shows an outcome rather than a
          process: the gallery further down is the room, not the result.

          One pair is what the academy has supplied and one pair is what shows.
          The section removes itself if that ever becomes none, and lays the set
          out two-up if it becomes more, so it never has to be rewritten to take
          the photographs the academy still owes.

          Held to 34rem rather than filling the column: the source frames are
          900px wide, and stretched across two thirds of a desktop field they
          would soften. Better a smaller frame that is sharp. */}
      {beforeAfterPairs.length > 0 && (
        <section id="work" className={`${sectionPad} scroll-mt-20 bg-paper`}>
          <div className={`${shell} grid items-start gap-12 lg:grid-cols-12 lg:gap-16`}>
            <Reveal className="lg:col-span-4">
              <SectionLabel n={3}>{t("sections.work")}</SectionLabel>
              <h2 className={`${displaySection} mt-8 max-w-[10ch]`}>{t("success.title")}</h2>
            </Reveal>

            <div
              className={`lg:col-span-7 lg:col-start-6 ${
                beforeAfterPairs.length === 1
                  ? "max-w-[34rem]"
                  : "grid gap-8 sm:grid-cols-2"
              }`}
            >
              {beforeAfterPairs.map((pair, i) => (
                <Reveal key={pair.label} delay={i * 0.06}>
                  <BeforeAfter
                    pair={pair}
                    sizes={
                      beforeAfterPairs.length === 1
                        ? "(max-width: 1024px) 100vw, 34rem"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 26vw"
                    }
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 04 AMIRA */}
      <section id="amira" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-12 lg:gap-0`}>
          <Parallax distance={12} className="lg:col-span-7">
            <div className="relative aspect-[4/5] w-full">
              <MediaFrame
                media={{ ...founderMedia, alt: t("about.portrait") }}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </Parallax>

          {/* The copy plate crosses the edge of the portrait rather than
              sitting beside it. Same ground as the page, no border, no card. */}
          <Reveal className="lg:col-span-5 lg:-ms-20 lg:bg-ivory lg:py-16 lg:ps-16">
            <SectionLabel n={4}>{t("sections.amira")}</SectionLabel>
            <h2 className={`${displaySection} mt-8 max-w-[12ch]`}>
              {t("instructor.headline")}
            </h2>
            <p className="mt-10 text-[17px] text-espresso">{t("instructor.title")}</p>
            <p className="mt-2 text-[15px] text-mute">{t("instructor.role")}</p>
            <p className={`${displayLarge} mt-10 max-w-[26ch] text-balance`}>
              {t("instructor.mission")}
            </p>
            <Link href="/about" className={`${linkRule} mt-12`}>
              {t("about.readStory")}
              <ArrowRight size={14} weight="light" className="flip-x" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 05 INSIDE AURA */}
      <section id="gallery" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          <Reveal className="pb-12 md:pb-16">
            <SectionLabel n={5}>{t("sections.inside")}</SectionLabel>
            <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("students.title")}</h2>
            <p className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-mute">
              {t("students.sub")}
            </p>
          </Reveal>
          <FrameGallery />
        </div>
      </section>

      {/* 06 WHAT MAKES US DIFFERENT
          On the near-black ground, which is the page's weight: the gallery
          above and the questions below are both light, and this is the one
          claim the page makes about itself rather than about the craft. The
          hairlines and the muted text switch to their dark-ground variants;
          nothing else about the row changes from the way /about sets it. */}
      <section id="why" className={`${sectionPad} scroll-mt-20 bg-night text-ivory`}>
        <div className={shell}>
          <Reveal className="max-w-[22ch]">
            <SectionLabel n={6} tone="light">
              {t("about.different.eyebrow")}
            </SectionLabel>
            <h2 className={`${displaySection} mt-8`}>{t("about.different.title")}</h2>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute-dark">
              {t("about.different.sub")}
            </p>
          </Reveal>

          <ol className="mt-12 border-t border-hair-dark md:mt-16">
            {differences.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={i * 0.06}
                className="grid gap-3 border-b border-hair-dark py-8 md:grid-cols-12 md:gap-10"
              >
                <span className="label font-mono text-bronze-hi md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} md:col-span-4`}>
                  {t(`about.different.items.${k}.title`)}
                </h3>
                <p className="max-w-[52ch] text-[16px] leading-relaxed text-mute-dark md:col-span-6 md:col-start-7">
                  {t(`about.different.items.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Renders only once real, consented student quotes exist. When they do,
          they land here, directly under the claims: the claim, then the person
          who can confirm it. */}
      <Testimonial />

      <section id="faq" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-4">
            <h2 className={`${displaySection} max-w-[10ch]`}>{t("faq.title")}</h2>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={homeFaq} />
            <Link href="/faq" className={`${linkRule} mt-10`}>
              {t("faq.viewAll")}
              <ArrowRight size={14} weight="light" className="flip-x" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing frame. */}
      <section className="relative flex h-[92svh] min-h-[32rem] items-end overflow-hidden bg-night">
        <MediaFrame
          media={closingMedia}
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/25"
        />
        <div className={`${shell} relative pb-20 text-ivory md:pb-28`}>
          <Reveal>
            <h2 className={`${displaySection} max-w-[18ch] text-balance`}>
              {t("closing.title")}
            </h2>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-ivory/80">
              {t("closing.sub")}
            </p>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <Link href="/contact" className={btnSolidLight}>
                {t("hero.secondary")}
              </Link>
              <Link href="/courses" className={btnLineLight}>
                {t("hero.primary")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
