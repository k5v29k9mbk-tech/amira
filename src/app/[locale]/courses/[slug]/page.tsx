import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowLeft, LockSimple, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, getCourse, lessonCount } from "@/lib/courses";
import { isEnrolled } from "@/lib/enrollment";
import { EnrollButton } from "@/components/EnrollButton";
import { Reveal } from "@/components/Reveal";
import { btnGhost, sectionTitle, shell } from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    courses.map((c) => ({ locale, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getCourse(slug)) return {};
  const t = await getTranslations({ locale });
  return {
    title: t(`catalog.${slug}.title`),
    description: t(`catalog.${slug}.description`),
    alternates: altLanguages(`/courses/${slug}`),
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const course = getCourse(slug);
  if (!course) notFound();

  const t = await getTranslations();
  const owned = await isEnrolled(slug);

  return (
    <div className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className={shell}>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
        >
          <ArrowLeft size={15} weight="light" className="flip-x" />
          {t("catalog.back")}
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h1 className={sectionTitle}>{t(`catalog.${slug}.title`)}</h1>
              <p className="mt-5 max-w-[54ch] text-lg leading-snug tracking-tight text-accent-hi">
                {t(`catalog.${slug}.tagline`)}
              </p>
              <p className="mt-7 max-w-[62ch] leading-relaxed text-muted">
                {t(`catalog.${slug}.description`)}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="mt-14 text-sm tracking-wide text-muted">
                {t("catalog.outcomes")}
              </h2>
              <ul className="mt-5 grid gap-4 border-t border-line pt-6">
                {(["one", "two", "three"] as const).map((k) => (
                  <li key={k} className="flex gap-4 leading-relaxed text-bone">
                    <span aria-hidden className="mt-3 h-px w-6 shrink-0 bg-accent" />
                    {t(`catalog.${slug}.outcomes.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="mt-16 text-sm tracking-wide text-muted">
                {t("catalog.curriculum")}
              </h2>
              <div className="mt-5 border-t border-line">
                {course.modules.map((m) => (
                  <div key={m.id} className="border-b border-line py-7">
                    <h3 className="display text-xl text-bone">
                      {t(`modules.${m.id}`)}
                    </h3>
                    <ul className="mt-4 grid gap-3">
                      {m.lessons.map((l) => {
                        const open = owned || l.free;
                        const row = (
                          <>
                            {open ? (
                              <PlayCircle size={17} weight="light" className="shrink-0 text-accent" />
                            ) : (
                              <LockSimple size={17} weight="light" className="shrink-0 text-muted" />
                            )}
                            <span className="flex-1">{t(`lessons.${l.id}`)}</span>
                            {l.free && !owned && (
                              <span className="font-mono text-[11px] text-accent-hi">
                                {t("catalog.preview")}
                              </span>
                            )}
                            <span className="font-mono text-xs text-muted">
                              {l.minutes} {t("learn.duration")}
                            </span>
                          </>
                        );

                        return (
                          <li key={l.id}>
                            {open ? (
                              <Link
                                href={`/learn/${slug}/${l.id}`}
                                className="flex items-center gap-3 text-sm text-bone transition-colors hover:text-accent-hi"
                              >
                                {row}
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 text-sm text-muted">
                                {row}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Purchase panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={course.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="border border-t-0 border-line bg-surface p-7 md:p-8">
                <p className="text-sm text-muted">{t("catalog.from")}</p>
                <p className="mt-2 display text-4xl text-bone">
                  {course.priceEur} EUR
                </p>
                <p className="mt-2 text-sm text-muted">{t("catalog.oneTime")}</p>

                <dl className="mt-7 grid gap-2 border-t border-line pt-6 font-mono text-xs text-muted">
                  <div className="flex justify-between">
                    <dt>{t("catalog.hours")}</dt>
                    <dd className="text-bone">{course.hours}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>{t("catalog.lessons")}</dt>
                    <dd className="text-bone">{lessonCount(course)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>{t("certificate.title")}</dt>
                    <dd className="text-bone">EN IT FR AR</dd>
                  </div>
                </dl>

                {owned ? (
                  <Link
                    href={`/learn/${slug}/${course.modules[0].lessons[0].id}`}
                    className={`${btnGhost} mt-7 w-full`}
                  >
                    {t("catalog.continue")}
                  </Link>
                ) : (
                  <EnrollButton slug={slug} className="mt-7" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
