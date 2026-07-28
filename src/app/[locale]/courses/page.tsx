import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, lessonCount } from "@/lib/courses";
import { Reveal } from "@/components/Reveal";
import { eyebrow, sectionTitle, shell } from "@/lib/ui";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { altLanguages, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata = { alternates: altLanguages("/courses") };

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
            <p className="mt-6 max-w-[52ch] leading-[1.85] text-muted">{t("catalog.sub")}</p>
          </StaggerItem>
        </Stagger>

        <ul className="mt-16 border-t border-line">
          {courses.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.05}>
              <Link
                href={`/courses/${c.slug}`}
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
                    {t(`catalog.${c.slug}.title`)}
                  </h2>
                  <p className="mt-3 max-w-[54ch] leading-relaxed text-muted">
                    {t(`catalog.${c.slug}.tagline`)}
                  </p>
                  <p className="mt-5 font-mono text-xs text-muted">
                    {c.hours} {t("catalog.hours")} · {lessonCount(c)} {t("catalog.lessons")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 md:col-span-2 md:flex-col md:items-end md:justify-center md:gap-3">
                  <span className="font-mono text-xl text-bone">{c.priceEur} EUR</span>
                  <span className="inline-flex items-center gap-2 text-sm text-accent-hi">
                    {t("catalog.view")}
                    <ArrowRight size={15} weight="light" className="flip-x" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </div>
  );
}
