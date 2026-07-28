import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, included } from "@/lib/courses";
import { Reveal } from "@/components/Reveal";
import { btnPrimary, eyebrow, sectionTitle, shell } from "@/lib/ui";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, courseListSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = { alternates: altLanguages("/courses") };

/**
 * The academy publishes six course names and one shared set of conditions that
 * applies to all of them — duration, price, level, language, class size, kit,
 * certificate and venue are the same statement for every course.
 *
 * So there is one courses page rather than six near-identical ones. Six pages
 * differing only in their title would be thin duplicate content, and filling
 * them out would mean inventing syllabuses the academy has not supplied.
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
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Course rich results: one entry per course, provider and language. */}
      <JsonLd
        data={courseListSchema(
          locale,
          courses.map((c) => t(`catalog.courses.${c.slug}`)),
          t("catalog.sub"),
        )}
      />

      <div className={shell}>
        {/* Same orchestrated entrance as the homepage hero, so arriving here
            does not feel like landing on a different site. */}
        <Stagger className="max-w-3xl">
          <StaggerItem>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("catalog.eyebrow")}
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className={`${sectionTitle} mt-6`}>{t("catalog.title")}</h1>
          </StaggerItem>
          <StaggerItem>
            <span aria-hidden className="mt-6 flex items-center gap-3">
              <span className="h-px w-16 bg-accent/70" />
              <span className="text-[8px] text-accent">◆</span>
              <span className="h-px w-6 bg-accent/40" />
            </span>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-[58ch] leading-[1.85] text-muted">{t("catalog.sub")}</p>
          </StaggerItem>
        </Stagger>

        <ul className="mt-16 border-t border-line">
          {courses.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.05} id={c.slug}>
              <Link
                href="/#contact"
                // The row inhales on hover: it warms, gains a little inline
                // space and the image drifts. Cheaper than a card, and it keeps
                // the editorial list feeling of the page.
                className="group grid gap-6 border-b border-line py-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-surface hover:ps-4 md:grid-cols-12 md:items-center md:gap-8 md:py-10"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden md:col-span-4 md:aspect-[4/3]">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                </div>

                <div className="md:col-span-6">
                  <h2 className="display text-2xl text-bone md:text-3xl">
                    {t(`catalog.courses.${c.slug}`)}
                  </h2>
                  {/* No per-course blurb: the academy publishes one shared set
                      of conditions, stated once beneath the list. Repeating it
                      on all six rows read as filler. */}
                  <p className="mt-3 text-sm text-muted">
                    {t("catalog.details.level.value")} · {t("catalog.details.language.value")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end md:justify-center md:gap-3">
                  <span className="text-sm text-bone">{t("catalog.priceOnRequest")}</span>
                  <span className="inline-flex items-center gap-2 text-sm text-accent-hi">
                    {t("catalog.cta")}
                    <ArrowRight size={15} weight="light" className="flip-x" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* The shared conditions, stated once. Every value here is a direct
            quotation of the academy's own course information. */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="display text-3xl leading-tight text-bone md:text-[2.5rem]">
              {t("catalog.detailsTitle")}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted">{t("catalog.payments")}</p>
            <Link href="/#contact" className={`${btnPrimary} mt-8`}>
              {t("catalog.cta")}
              <ArrowRight size={16} weight="light" className="flip-x" />
            </Link>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7 lg:col-start-6">
            <dl className="grid border-t border-line">
              {detailKeys.map((k) => (
                <div
                  key={k}
                  className="grid gap-1 border-b border-line py-5 sm:grid-cols-5 sm:gap-6"
                >
                  <dt className="text-[11px] font-medium tracking-[0.16em] text-muted uppercase sm:col-span-2 sm:pt-1">
                    {t(`catalog.details.${k}.label`)}
                  </dt>
                  <dd className="leading-relaxed text-bone sm:col-span-3">
                    {t(`catalog.details.${k}.value`)}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
              {t("catalog.includes")}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {included.map((k) => (
                <li key={k} className="flex items-baseline gap-4 text-bone">
                  <span aria-hidden className="h-px w-5 shrink-0 bg-accent" />
                  {t(`catalog.included.${k}`)}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
