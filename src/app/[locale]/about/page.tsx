import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Buildings,
  Lifebuoy,
  SealCheck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { HeroPortrait } from "@/components/HeroPortrait";
import {
  btnHero,
  btnHeroGhost,
  eyebrow,
  iconRing,
  sectionTitle,
  shell,
} from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, personSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altLanguages("/about"),
  };
}

/**
 * The founder page.
 *
 * The academy's whole differentiator is a person: someone who teaches the
 * techniques she performs on paying clients every day, in her own institute.
 * That is the argument this page makes, in the order a first-time visitor
 * needs it — who she is, what she has done, why the school exists, what it
 * teaches beyond the needle, and where it is going.
 *
 * Every claim on this page is a rewrite of the academy's own approved
 * document. The two figures (8+ years, 150+ students) are the only numbers the
 * academy has stated about itself, so they are the only numbers here.
 */
const differences = [
  { key: "experience", Icon: Buildings },
  { key: "small", Icon: UsersThree },
  { key: "support", Icon: Lifebuoy },
] as const;

// The eight non-technical subjects, in the academy's own order. Names only:
// the academy supplied no description for them, so none is invented.
const beyond = [
  "mindset",
  "marketing",
  "clients",
  "consultation",
  "photography",
  "communication",
  "branding",
  "growth",
] as const;

const visionPoints = ["quality", "professionalism", "innovation", "growth"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  // The two actions are the same two the hero offers, with the same labels.
  const cta = await getTranslations("hero");

  return (
    <>
      {/* Amira as a search entity in her own right, tied to the organisation
          payload the layout already emits. */}
      <JsonLd data={personSchema(locale, t("story.role"), t("lede"))} />

      {/* Opening statement. Same lockup and entrance as the homepage hero, so
          arriving here reads as the same house rather than a subpage. */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
        <span
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-48 -z-10 h-[42rem] w-[42rem] bg-[radial-gradient(circle,var(--glow),transparent_66%)]"
        />
        <div className={`${shell} grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-10`}>
          <Stagger className="order-2 lg:order-1 lg:col-span-6">
            <StaggerItem>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("eyebrow")}
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-10">
                <span className="display block text-[2.5rem] leading-[1.08] tracking-[-0.02em] text-balance text-bone sm:text-[3.25rem] xl:text-[4rem]">
                  {t("titleA")}
                </span>
                <span className="script mt-1 block pb-2 text-[1.75rem] leading-[1.35] text-balance text-accent-hi sm:text-[2.125rem] xl:text-[2.5rem]">
                  {t("titleB")}
                </span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <span aria-hidden className="mt-6 flex items-center gap-3">
                <span className="h-px w-16 bg-accent/70" />
                <span className="text-[8px] text-accent">◆</span>
                <span className="h-px w-6 bg-accent/40" />
              </span>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 max-w-[52ch] text-base leading-[1.9] text-muted md:text-[1.0625rem]">
                {t("lede")}
              </p>
            </StaggerItem>
          </Stagger>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <HeroPortrait src="/brand/amira-studio.jpg" alt={t("portrait")} />
          </div>
        </div>
      </section>

      <div id="sticky-cta-after" aria-hidden />

      {/* The two figures the academy states about itself, plus where it is.
          The site's first honest numbers: they belong high, where a visitor is
          still deciding whether this is a real school. */}
      <section className="seam py-14 md:py-16">
        <div className={shell}>
          <dl className="grid gap-10 border-y border-line py-10 sm:grid-cols-3 sm:gap-6">
            {(["years", "students", "reach"] as const).map((k, i) => (
              <Reveal key={k} delay={i * 0.08} className="sm:text-center">
                <dt className="display text-[2.25rem] leading-none text-bone md:text-[2.75rem]">
                  {t(`facts.${k}.value`)}
                </dt>
                <dd className="mt-3 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">
                  {t(`facts.${k}.label`)}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Her story, in her own voice. First person is the point: this is the
          one place on the site where the founder speaks directly. */}
      <section className="py-20 md:py-28">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src="/brand/at-work.jpg"
                  alt={t("story.imageAlt")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-6 text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                {t("story.role")}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("story.eyebrow")}
              </p>
              <h2 className={`${sectionTitle} mt-6`}>{t("story.title")}</h2>
            </Reveal>

            {/* Four movements: who she is, what she has built, how she keeps
                learning, and why the academy exists. */}
            {(["p1", "p2", "p3", "p4"] as const).map((k, i) => (
              <Reveal key={k} delay={0.06 + i * 0.04}>
                <p
                  className={`max-w-[62ch] leading-[1.9] text-muted ${
                    i === 0
                      ? "mt-8 text-[1.0625rem] text-bone md:text-[1.125rem]"
                      : "mt-6"
                  }`}
                >
                  {t(`story.${k}`)}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.24}>
              <p className="script mt-10 text-4xl leading-none text-accent-hi md:text-5xl">
                {t("story.signature")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The differentiator, as three claims a visitor can check. */}
      <section className="bg-surface-2/40 py-24 md:py-32">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("different.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("different.title")}</h2>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">
              {t("different.sub")}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {differences.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-[2px] border border-line bg-surface p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_color-mix(in_srgb,var(--accent)_18%,transparent)] md:p-10">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,var(--glow),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className={iconRing}>
                    <Icon size={20} weight="light" />
                  </span>
                  <h3 className="display mt-6 text-2xl text-bone">
                    {t(`different.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">
                    {t(`different.items.${key}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The business curriculum. This is what a student is really buying, so
          it gets a section rather than a bullet under the method. */}
      <section className="seam py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className={eyebrow}>
                  <span aria-hidden className="h-px w-8 bg-accent" />
                  {t("beyond.eyebrow")}
                </p>
                <h2 className={`${sectionTitle} mt-6`}>{t("beyond.title")}</h2>
                <p className="mt-6 max-w-[46ch] leading-relaxed text-muted">
                  {t("beyond.sub")}
                </p>
              </Reveal>
            </div>
          </div>

          {/* Names only, set as an index. The academy supplied no syllabus for
              these, and eight invented blurbs would be eight invented claims. */}
          <ol className="lg:col-span-6 lg:col-start-7">
            {beyond.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={(i % 4) * 0.05}
                className={`flex items-baseline gap-6 py-5 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display text-xl text-bone md:text-2xl">
                  {t(`beyond.items.${k}`)}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission, as the one sentence it is. */}
      <section className="seam py-24 md:py-32">
        <div className={`${shell} mx-auto max-w-3xl text-center`}>
          <Reveal>
            <p className={`${eyebrow} justify-center`}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("mission.eyebrow")}
            </p>
            <p className="display mt-8 text-[1.75rem] leading-[1.3] text-balance text-bone md:text-[2.5rem]">
              {t("mission.quote")}
            </p>
            <span aria-hidden className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-16 bg-accent/70" />
              <span className="text-[8px] text-accent">◆</span>
              <span className="h-px w-16 bg-accent/70" />
            </span>
            <p className="mt-8 leading-[1.9] text-muted">{t("mission.body")}</p>
          </Reveal>
        </div>
      </section>

      {/* Vision. Quieter than the mission: it is where the academy is going,
          not what it sells today. */}
      <section className="bg-surface-2/40 py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-6">
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("vision.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("vision.title")}</h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-6 lg:self-center">
            <p className="max-w-[58ch] leading-[1.9] text-muted">{t("vision.body")}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {visionPoints.map((k) => (
                <li
                  key={k}
                  className="inline-flex items-center gap-2 rounded-[2px] border border-accent/40 px-3.5 py-2 text-[12px] tracking-[0.06em] text-bone"
                >
                  <SealCheck size={14} weight="light" className="text-accent" />
                  {t(`vision.points.${k}`)}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[58ch] leading-[1.9] text-bone">
              {t("vision.closing")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* One action, at the end of the argument. */}
      <section className="seam py-24 md:py-32">
        <div className={`${shell} mx-auto max-w-2xl text-center`}>
          <Reveal>
            <h2 className={sectionTitle}>{t("cta.title")}</h2>
            <p className="mt-6 leading-relaxed text-muted">{t("cta.body")}</p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link href="/#contact" className={btnHero}>
                {cta("secondary")}
                <ArrowRight
                  size={16}
                  weight="light"
                  className="flip-x transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1.5"
                />
              </Link>
              <Link href="/courses" className={btnHeroGhost}>
                {cta("primary")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
