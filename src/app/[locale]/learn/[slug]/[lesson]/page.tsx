import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, CheckCircle, LockSimple } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { allLessons, getCourse, progressPercent } from "@/lib/courses";
import { getCompletedLessons, isEnrolled } from "@/lib/enrollment";
import { getEnrollments } from "@/lib/enrollment";
import { muxPlaybackToken } from "@/lib/mux";
import { CompleteButton, LessonPlayer } from "@/components/LessonPlayer";
import { EnrollButton } from "@/components/EnrollButton";
import { btnPrimary, shell } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; lesson: string }>;
}) {
  const { locale, slug, lesson: lessonId } = await params;
  setRequestLocale(locale);

  const course = getCourse(slug);
  if (!course) notFound();

  const lessons = allLessons(course);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) notFound();
  const lesson = lessons[index];

  const t = await getTranslations();
  const owned = await isEnrolled(slug);
  const canWatch = owned || Boolean(lesson.free);

  if (!canWatch) {
    return (
      <div className="flex min-h-[100dvh] items-center pt-28 pb-20">
        <div className={`${shell} max-w-2xl`}>
          <LockSimple size={28} weight="light" className="text-accent" />
          <h1 className="mt-6 display text-3xl text-bone md:text-4xl">
            {t("learn.locked")}
          </h1>
          <p className="mt-5 max-w-[48ch] leading-relaxed text-muted">
            {t("learn.lockedBody")}
          </p>
          <EnrollButton slug={slug} className="mt-9" />
          <Link
            href={`/courses/${slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-bone"
          >
            <ArrowLeft size={15} weight="light" className="flip-x" />
            {t("learn.back")}
          </Link>
        </div>
      </div>
    );
  }

  const completed = await getCompletedLessons(slug);
  const done = completed.has(lesson.id);
  const percent = progressPercent(course, completed);
  const prev = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;
  const enrollment = owned
    ? (await getEnrollments()).find((e) => e.course_slug === slug)
    : undefined;

  return (
    <div className="pt-24 pb-20 md:pt-28">
      <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-12`}>
        <div className="lg:col-span-8">
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
          >
            <ArrowLeft size={15} weight="light" className="flip-x" />
            {t(`catalog.${slug}.title`)}
          </Link>

          <div className="mt-5 border border-line bg-black">
            <LessonPlayer
              playbackId={lesson.playbackId}
              token={muxPlaybackToken(lesson.playbackId)}
              title={t(`lessons.${lesson.id}`)}
              poster={course.image}
            />
          </div>

          <h1 className="mt-8 display text-3xl text-bone md:text-4xl">
            {t(`lessons.${lesson.id}`)}
          </h1>
          <p className="mt-3 font-mono text-xs text-muted">
            {t(`modules.${lesson.moduleId}`)} · {lesson.minutes} {t("learn.duration")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            {owned && (
              <CompleteButton
                courseSlug={slug}
                lessonId={lesson.id}
                done={done}
                nextHref={next ? `/learn/${slug}/${next.id}` : null}
              />
            )}
            {prev && (
              <Link
                href={`/learn/${slug}/${prev.id}`}
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-bone"
              >
                <ArrowLeft size={15} weight="light" className="flip-x" />
                {t("learn.prev")}
              </Link>
            )}
            {next && (
              <Link
                href={`/learn/${slug}/${next.id}`}
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-bone"
              >
                {t("learn.next")}
                <ArrowRight size={15} weight="light" className="flip-x" />
              </Link>
            )}
          </div>

          {percent === 100 && enrollment && (
            <div className="mt-10 border border-accent bg-surface p-7">
              <h2 className="display text-xl text-bone">
                {t("learn.finished")}
              </h2>
              <p className="mt-2 text-muted">{t("learn.finishedBody")}</p>
              <Link href={`/certificate/${enrollment.id}`} className={`${btnPrimary} mt-6`}>
                {t("learn.getCertificate")}
              </Link>
            </div>
          )}
        </div>

        {/* Curriculum rail */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-baseline justify-between font-mono text-xs text-muted">
              <span>{t("catalog.curriculum")}</span>
              <span className="text-bone">{percent}%</span>
            </div>
            <div className="mt-2 h-px w-full bg-line">
              <div className="h-px bg-accent" style={{ width: `${percent}%` }} />
            </div>

            <div className="mt-7 max-h-[62vh] overflow-y-auto pe-1">
              {course.modules.map((m) => (
                <div key={m.id} className="mb-7">
                  <h2 className="text-sm text-muted">{t(`modules.${m.id}`)}</h2>
                  <ul className="mt-3 grid gap-1">
                    {m.lessons.map((l) => {
                      const active = l.id === lesson.id;
                      const open = owned || l.free;
                      return (
                        <li key={l.id}>
                          <Link
                            href={open ? `/learn/${slug}/${l.id}` : `/courses/${slug}`}
                            className={`flex items-start gap-3 border-s-2 py-2 ps-3 text-sm transition-colors ${
                              active
                                ? "border-accent text-bone"
                                : "border-transparent text-muted hover:text-bone"
                            }`}
                          >
                            {completed.has(l.id) ? (
                              <CheckCircle
                                size={16}
                                weight="fill"
                                className="mt-0.5 shrink-0 text-accent"
                              />
                            ) : open ? (
                              <span
                                aria-hidden
                                className="mt-2 h-1 w-1 shrink-0 bg-current opacity-50"
                              />
                            ) : (
                              <LockSimple size={15} weight="light" className="mt-0.5 shrink-0" />
                            )}
                            <span className="flex-1">{t(`lessons.${l.id}`)}</span>
                            <span className="font-mono text-[11px] opacity-70">
                              {l.minutes}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
