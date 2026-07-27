import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { getSupabase, getUser } from "@/lib/supabase/server";
import { getCompletedLessons } from "@/lib/enrollment";
import { getCourse, progressPercent } from "@/lib/courses";
import { certificateCode } from "@/lib/mux";
import { PrintButton } from "@/components/PrintButton";
import { Wordmark } from "@/components/Wordmark";
import { btnGhost, shell } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getUser();
  if (!user) {
    redirect({ href: `/login?next=/certificate/${id}`, locale });
    return null;
  }

  const t = await getTranslations("certificate");
  const tc = await getTranslations();
  const format = await getFormatter();
  const supabase = await getSupabase();

  // RLS scopes this to the signed-in student, so an id from someone else returns nothing.
  const { data: enrollment } = await supabase!
    .from("enrollments")
    .select("id, course_slug, created_at, completed_at")
    .eq("id", id)
    .maybeSingle();

  const course = enrollment ? getCourse(enrollment.course_slug) : null;
  if (!enrollment || !course) {
    return (
      <div className={`${shell} flex min-h-[100dvh] items-center pt-28`}>
        <p className="text-muted">{t("notYet")}</p>
      </div>
    );
  }

  const completed = await getCompletedLessons(course.slug);
  if (progressPercent(course, completed) < 100) {
    return (
      <div className={`${shell} flex min-h-[100dvh] flex-col justify-center pt-28`}>
        <p className="max-w-[46ch] text-lg leading-snug tracking-tight text-muted">
          {t("notYet")}
        </p>
        <Link href="/dashboard" className={`${btnGhost} mt-8 self-start`}>
          {t("back")}
        </Link>
      </div>
    );
  }

  if (!enrollment.completed_at) {
    await supabase!
      .from("enrollments")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", enrollment.id);
  }

  const issued = new Date(enrollment.completed_at ?? Date.now());
  const name =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "";

  return (
    <div className="pt-28 pb-20 md:pt-36">
      <div className={`${shell} max-w-[900px]`}>
        <article className="relative rounded-[2px] border border-accent/50 bg-surface px-8 py-14 text-center md:px-16 md:py-20">
          {/* Inner gold rule, the double-frame of a printed certificate. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-[2px] border border-accent/25 md:inset-5"
          />

          <Wordmark stacked className="mx-auto w-fit" />

          <p className="mt-12 text-[11px] font-medium tracking-[0.28em] text-accent-hi uppercase">
            {t("title")}
          </p>

          <p className="mt-12 text-sm text-muted">{t("awarded")}</p>
          <h1 className="script mt-3 pb-2 text-5xl leading-[1.2] text-bone md:text-7xl">
            {name}
          </h1>

          <p className="mt-10 text-sm text-muted">{t("completed")}</p>
          <p className="display mt-3 text-2xl leading-snug text-bone md:text-3xl">
            {tc(`catalog.${course.slug}.title`)}
          </p>
          <p className="mt-3 font-mono text-xs text-muted">
            {course.hours} {t("hours")}
          </p>

          <div className="mx-auto mt-16 grid max-w-lg gap-6 border-t border-line pt-10 text-start sm:grid-cols-2">
            <div>
              <p className="text-xs tracking-wide text-muted">{t("issued")}</p>
              <p className="mt-1 font-mono text-sm text-bone">
                {format.dateTime(issued, { dateStyle: "long" })}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-muted">{t("code")}</p>
              <p className="mt-1 font-mono text-sm text-bone">
                {certificateCode(enrollment.id)}
              </p>
            </div>
          </div>

          <p className="script mt-16 text-4xl leading-[1.3] text-accent-hi">Amira</p>
          <span aria-hidden className="mx-auto mt-2 block h-px w-40 bg-accent/50" />
          <p className="mt-3 text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
            {t("signature")}
          </p>
        </article>

        <div className="no-print mt-8 flex flex-wrap gap-3">
          <PrintButton label={t("print")} />
          <Link href="/dashboard" className={btnGhost}>
            {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}
