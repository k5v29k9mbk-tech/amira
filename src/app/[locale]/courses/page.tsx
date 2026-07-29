import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, included } from "@/lib/courses";
import { beforeAfterPairs } from "@/lib/studio";
import { BeforeAfter } from "@/components/BeforeAfter";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import {
  btnSolid,
  displayLarge,
  displaySection,
  linkRule,
  sectionPad,
  shell,
} from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, courseListSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = { alternates: altLanguages("/courses") };

/**
 * One page for six courses.
 *
 * The academy publishes six names, a one-line description of each discipline
 * and one shared set of conditions that applies to all of them: duration,
 * price, level, language, class size, kit, certificate and venue are the same
 * statement whichever course you choose. Six near-identical pages would be thin
 * duplicate content, and filling them out would mean inventing syllabuses that
 * do not exist, so the conditions are stated once, below the list.
 */
const detailKeys = [
  "duration",
  "price",
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

  return (
    <>
      <JsonLd
        data={courseListSchema(
          locale,
          courses.map((c) => t(`catalog.courses.${c.slug}`)),
          t("catalog.sub"),
        )}
      />

      <section className="bg-ivory pt-[7.5rem] pb-16 md:pt-40 md:pb-24">
        <div className={shell}>
          <Stagger className="max-w-[24ch]">
            <StaggerItem>
              <p className="label text-bronze-ink">{t("catalog.eyebrow")}</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${displaySection} mt-8`}>{t("catalog.title")}</h1>
            </StaggerItem>
          </Stagger>
          <p className="mt-10 max-w-[56ch] text-[17px] leading-relaxed text-mute">
            {t("catalog.sub")}
          </p>
        </div>
      </section>

      {/* The catalogue as a list of rows rather than a grid of cards: the media
          leads, the name carries the row, the conditions are stated once. */}
      <section className="bg-ivory">
        <ol className={`${shell} border-t border-hair`}>
          {courses.map((course, i) => (
            <Reveal
              as="li"
              key={course.slug}
              id={course.slug}
              className="grid scroll-mt-28 gap-6 border-b border-hair py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <div className="relative aspect-[16/10] w-full md:col-span-5 md:aspect-[4/3]">
                <MediaFrame
                  media={course.media}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>

              <div className="md:col-span-6 md:col-start-7 md:self-center">
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className={`${displayLarge} mt-4`}>{t(`catalog.courses.${course.slug}`)}</h2>
                <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-mute">
                  {t(`catalog.blurbs.${course.slug}`)}
                </p>
                <p className="label mt-6 text-mute">
                  {t("catalog.details.level.value")} · {t("catalog.details.language.value")}
                </p>
                <Link href="/contact" className={`${linkRule} mt-6`}>
                  {t("catalog.cta")}
                  <ArrowRight size={14} weight="light" className="flip-x" />
                </Link>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* The shared conditions. Every value is a direct quotation of the
          academy's own course information. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-4">
            <h2 className={`${displaySection} max-w-[12ch]`}>{t("catalog.detailsTitle")}</h2>
            <p className="mt-8 text-[15px] text-mute">{t("catalog.payments")}</p>
            <Link href="/contact" className={`${btnSolid} mt-10`}>
              {t("hero.secondary")}
            </Link>
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
    </>
  );
}
