import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Link, redirect } from "@/i18n/navigation";
import { getUser } from "@/lib/supabase/server";
import { getCompletedLessons, getEnrollments } from "@/lib/enrollment";
import { allLessons, getCourse, nextLesson, progressPercent } from "@/lib/courses";
import { btnGhost, btnPrimary, eyebrow, sectionTitle, shell } from "@/lib/ui";
import { Stagger, StaggerItem } from "@/components/Stagger";

export const dynamic = "force-dynamic";

export default async function Dashboard({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { locale } = await params;
  const { checkout } = await searchParams;
  setRequestLocale(locale);

  const user = await getUser();
  if (!user) redirect({ href: "/login?next=/dashboard", locale });

  const t = await getTranslations();
  const enrollments = await getEnrollments();
  const completed = await getCompletedLessons();

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className={shell}>
        <Stagger>
          <StaggerItem>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("dashboard.welcome")}
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className={`${sectionTitle} mt-6`}>{t("dashboard.title")}</h1>
          </StaggerItem>
          <StaggerItem>
            <span aria-hidden className="mt-6 flex items-center gap-3">
              <span className="h-px w-16 bg-accent/70" />
              <span className="text-[8px] text-accent">◆</span>
            </span>
          </StaggerItem>
        </Stagger>

        {checkout === "success" && (
          <p className="mt-10 rounded-[2px] border border-accent bg-surface p-6 text-sm text-bone shadow-[0_14px_40px_color-mix(in_srgb,var(--accent)_14%,transparent)]">
            {t("checkout.success")}
          </p>
        )}
        {checkout === "cancelled" && (
          <p className="mt-10 rounded-[2px] border border-line bg-surface p-6 text-sm text-muted">
            {t("checkout.cancelled")}
          </p>
        )}

        {enrollments.length === 0 ? (
          <div className="mt-16 rounded-[2px] border border-line bg-surface p-10 text-center shadow-[0_18px_50px_color-mix(in_srgb,var(--accent)_10%,transparent)] md:p-16">
            <h2 className="display text-2xl text-bone">
              {t("dashboard.empty")}
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] leading-[1.85] text-muted">
              {t("dashboard.emptyBody")}
            </p>
            <Link href="/courses" className={`${btnPrimary} mt-8`}>
              {t("dashboard.emptyCta")}
            </Link>
          </div>
        ) : (
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {enrollments.map((e) => {
              const course = getCourse(e.course_slug);
              if (!course) return null;
              const total = allLessons(course).length;
              const done = allLessons(course).filter((l) => completed.has(l.id)).length;
              const percent = progressPercent(course, completed);
              const resume = nextLesson(course, completed);

              return (
                <li key={e.id} className="group overflow-hidden rounded-[2px] border border-line bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent hover:shadow-[0_22px_60px_color-mix(in_srgb,var(--accent)_18%,transparent)]">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={course.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </div>

                  <div className="p-7 md:p-8">
                    <h2 className="display text-2xl text-bone">
                      {t(`catalog.${course.slug}.title`)}
                    </h2>

                    <div className="mt-6 flex items-baseline justify-between font-mono text-xs text-muted">
                      <span>
                        {done} {t("dashboard.lessonsDone", { total })}
                      </span>
                      <span className="text-bone">{percent}%</span>
                    </div>
                    <div
                      className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-line"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t(`catalog.${course.slug}.title`)}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent-hi transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/learn/${course.slug}/${resume.id}`}
                        className={percent === 100 ? btnGhost : btnPrimary}
                      >
                        {percent === 100 ? t("dashboard.review") : t("dashboard.continue")}
                      </Link>
                      {percent === 100 && (
                        <Link
                          href={`/certificate/${e.id}`}
                          className={`${btnPrimary} gap-2`}
                        >
                          <CheckCircle size={17} weight="light" />
                          {t("dashboard.certificate")}
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
