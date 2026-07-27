import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Link, redirect } from "@/i18n/navigation";
import { getUser } from "@/lib/supabase/server";
import { getCompletedLessons, getEnrollments } from "@/lib/enrollment";
import { allLessons, getCourse, nextLesson, progressPercent } from "@/lib/courses";
import { btnGhost, btnPrimary, sectionTitle, shell } from "@/lib/ui";

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
        <p className="text-sm text-muted">{t("dashboard.welcome")}</p>
        <h1 className={`${sectionTitle} mt-2`}>{t("dashboard.title")}</h1>

        {checkout === "success" && (
          <p className="mt-8 border border-accent bg-surface p-5 text-sm text-bone">
            {t("checkout.success")}
          </p>
        )}
        {checkout === "cancelled" && (
          <p className="mt-8 border border-line bg-surface p-5 text-sm text-muted">
            {t("checkout.cancelled")}
          </p>
        )}

        {enrollments.length === 0 ? (
          <div className="mt-16 border border-line bg-surface p-10 md:p-14">
            <h2 className="text-2xl font-medium tracking-tight text-bone">
              {t("dashboard.empty")}
            </h2>
            <p className="mt-4 max-w-[46ch] leading-relaxed text-muted">
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
                <li key={e.id} className="border border-line bg-surface">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={course.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-7 md:p-8">
                    <h2 className="text-2xl font-medium tracking-tight text-bone">
                      {t(`catalog.${course.slug}.title`)}
                    </h2>

                    <div className="mt-6 flex items-baseline justify-between font-mono text-xs text-muted">
                      <span>
                        {done} {t("dashboard.lessonsDone", { total })}
                      </span>
                      <span className="text-bone">{percent}%</span>
                    </div>
                    <div
                      className="mt-2 h-px w-full bg-line"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={t(`catalog.${course.slug}.title`)}
                    >
                      <div className="h-px bg-accent" style={{ width: `${percent}%` }} />
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
