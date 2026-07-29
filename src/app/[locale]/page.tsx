import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { altLanguages } from "@/i18n/routing";
import { closingMedia, founderMedia } from "@/lib/media";
import {
  btnLineLight,
  btnSolidLight,
  displayLarge,
  displaySection,
  linkRule,
  sectionPad,
  shell,
} from "@/lib/ui";
import { JsonLd, faqSchema } from "@/lib/seo";
import { Hero } from "@/components/Hero";
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
 * The homepage is six acts and a closing frame, in this order: the hero, the
 * statement, the catalogue, the method, the founder, the gallery, the voices,
 * six questions, and the invitation.
 *
 * Everything operational lives one click away rather than here: the shared
 * course conditions and the before/after on /courses, the booking sequence and
 * the channels on /contact, the full question list on /faq, the values, the
 * business curriculum and the welcome message on /about.
 */
const homeFaq = [
  "beginners",
  "students",
  "includes",
  "kit",
  "certificate",
  "booking",
] as const;

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
      <section id="courses" className="scroll-mt-20 bg-ivory pb-20 md:pb-28 lg:pb-36">
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
      <section id="method" className="scroll-mt-20 bg-paper pt-20 md:pt-32 lg:pt-44">
        <div className={shell}>
          <Reveal className="max-w-[20ch] pb-8 lg:pb-4">
            <SectionLabel n={2}>{t("sections.method")}</SectionLabel>
            <h2 className={`${displaySection} mt-8`}>{t("method.title")}</h2>
          </Reveal>
          <MethodStory />
        </div>
      </section>

      {/* 03 AMIRA */}
      <section id="amira" className={`${sectionPad} scroll-mt-20 bg-paper`}>
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-12 lg:gap-0`}>
          <Parallax distance={12} className="lg:col-span-7">
            <div className="relative aspect-[4/5] w-full">
              <MediaFrame
                media={{ ...founderMedia, alt: t("instructor.portrait") }}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </Parallax>

          {/* The copy plate crosses the edge of the portrait rather than
              sitting beside it. Same ground as the page, no border, no card. */}
          <Reveal className="lg:col-span-5 lg:-ms-20 lg:bg-paper lg:py-16 lg:ps-16">
            <SectionLabel n={3}>{t("sections.amira")}</SectionLabel>
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

      {/* 04 INSIDE AURA */}
      <section id="gallery" className={`${sectionPad} scroll-mt-20 bg-ivory`}>
        <div className={shell}>
          <Reveal className="pb-14 md:pb-20">
            <SectionLabel n={4}>{t("sections.inside")}</SectionLabel>
            <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("students.title")}</h2>
            <p className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-mute">
              {t("students.sub")}
            </p>
          </Reveal>
          <FrameGallery />
        </div>
      </section>

      {/* Renders only once real, consented student quotes exist. */}
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
            <h2 className="display max-w-[18ch] text-[clamp(2.25rem,6vw,6.5rem)] text-balance">
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
