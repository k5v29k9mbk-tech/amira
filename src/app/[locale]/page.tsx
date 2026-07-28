import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Certificate,
  FacebookLogo,
  HandHeart,
  InstagramLogo,
  Lifebuoy,
  MapPin,
  PaintBrushHousehold,
  SealCheck,
  ShieldCheck,
  Steps,
  TiktokLogo,
  Toolbox,
  Translate,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, resultStills } from "@/lib/courses";
import {
  academy,
  addressLine,
  beforeAfterPairs,
  instagramLink,
  mapsLink,
  studio,
  tiktokLink,
  welcomeVideoId,
  whatsappLink,
} from "@/lib/studio";
import { Reveal } from "@/components/Reveal";
import { Voices } from "@/components/Voices";
import { BeforeAfter } from "@/components/BeforeAfter";
import { Gallery } from "@/components/Gallery";
import { HeroPortrait } from "@/components/HeroPortrait";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { WelcomeVideo } from "@/components/WelcomeVideo";
import { ContactForm } from "@/components/ContactForm";
import {
  btnGhost,
  btnHero,
  btnHeroGhost,
  eyebrow,
  iconRing,
  sectionTitle,
  shell,
} from "@/lib/ui";
import { altLanguages } from "@/i18n/routing";
import { JsonLd, faqSchema } from "@/lib/seo";

export const metadata = { alternates: altLanguages() };

// The four facts the academy states about itself. No invented figures.
const badges = [
  { key: "location", Icon: MapPin },
  { key: "groups", Icon: UsersThree },
  { key: "certificate", Icon: Certificate },
  { key: "support", Icon: Lifebuoy },
] as const;

// The five values the academy publishes, in its own order.
const values = [
  "professionalism",
  "quality",
  "innovation",
  "ethics",
  "growth",
] as const;

// The conditions that apply to every course. Deliberately NOT the four things a
// course includes — those are the method section's four steps, and listing them
// twice in a row read as a stutter.
const reasons = [
  { key: "groups", Icon: UsersThree },
  { key: "levels", Icon: Steps },
  { key: "language", Icon: Translate },
  { key: "kit", Icon: Toolbox },
  { key: "certificate", Icon: Certificate },
  { key: "venue", Icon: MapPin },
] as const;

// How a course runs, in the order the academy states it.
const steps = [
  { key: "theory", Icon: BookOpen },
  { key: "practice", Icon: PaintBrushHousehold },
  { key: "model", Icon: HandHeart },
  { key: "support", Icon: Lifebuoy },
] as const;

// Booking to post-course support, in the order a student meets it.
const journey = [
  { key: "contact", Icon: WhatsappLogo },
  { key: "deposit", Icon: CalendarCheck },
  { key: "training", Icon: PaintBrushHousehold },
  { key: "certificate", Icon: Certificate },
  { key: "support", Icon: Lifebuoy },
] as const;

// Two clips from the academy floor. Both were shot vertically on a phone, so
// they stay portrait rather than being letterboxed into a 16:9 well.
const clips = [
  { key: "mapping", src: "/brand/mapping.mp4", poster: "/brand/mapping-poster.jpg" },
  { key: "pigment", src: "/brand/pigment.mp4", poster: "/brand/pigment-poster.jpg" },
] as const;

const faqKeys = [
  "courses",
  "duration",
  "price",
  "includes",
  "kit",
  "students",
  "certificate",
  "language",
  "booking",
  "location",
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
      {/* Feeds the FAQ dropdowns that appear under the search listing. */}
      <JsonLd
        data={faqSchema(
          faqKeys.map((k) => ({ q: t(`faq.items.${k}.q`), a: t(`faq.items.${k}.a`) })),
        )}
      />

      {/* Hero.
          The full-bleed photograph with a scrim over its left third is the shape
          every template ships. This is editorial instead: the portrait is a
          framed object with air around it, the type holds its own column, and
          the whitespace between them does the work the scrim used to.
          Phones lead with the portrait, then the copy beneath it. */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-32 lg:flex lg:min-h-[88dvh] lg:items-center lg:pt-32 lg:pb-24">
        {/* Barely-there warmth in the upper corner, so the ground is lit rather
            than flat. Decorative, never behind text at strength. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-48 -z-10 h-[42rem] w-[42rem] bg-[radial-gradient(circle,var(--glow),transparent_66%)]"
        />
        <div
          className={`${shell} grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16`}
        >
          {/* Cinematic entrance: the block plays as one sequence on load rather
              than six independently timed reveals. Each beat lifts, fades and
              resolves out of a 6px blur. */}
          <Stagger className="order-2 lg:order-1 lg:col-span-6 xl:col-span-5 xl:col-start-1">
            <StaggerItem>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("hero.eyebrow")}
              </p>
            </StaggerItem>
            {/* Two registers, the academy's own lockup: the serif carries the
                statement, the script accents it. The Arabic rule in globals.css
                strips the tracking, where it would be wrong. */}
            <StaggerItem>
              <h1 className="mt-10">
                <span className="display block text-[2.75rem] leading-[1.06] tracking-[-0.02em] text-bone sm:text-[3.5rem] xl:text-[4.5rem]">
                  {t("hero.titleA")}
                </span>
                {/* Sized for the longest translation, which wraps to two lines.
                    text-balance keeps that break even rather than leaving one
                    word stranded. */}
                <span className="script mt-1 block pb-2 text-[1.875rem] leading-[1.35] text-balance text-accent-hi sm:text-[2.25rem] xl:text-[2.75rem]">
                  {t("hero.titleB")}
                </span>
              </h1>
            </StaggerItem>
            {/* Gold rule with the poster's diamond. */}
            <StaggerItem>
              <span aria-hidden className="mt-6 flex items-center gap-3">
                <span className="h-px w-16 bg-accent/70" />
                <span className="text-[8px] text-accent">◆</span>
                <span className="h-px w-6 bg-accent/40" />
              </span>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 max-w-[44ch] text-base leading-[1.9] text-muted md:text-[1.0625rem]">
                {t("hero.sub")}
              </p>
            </StaggerItem>
            <StaggerItem>
              {/* Booking leads. Browsing the catalogue is the lower-intent
                  action, so it takes the outline. Both go full width on phones
                  so neither is a small target. */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <Link href="/#contact" className={btnHero}>
                  {t("hero.secondary")}
                  <ArrowRight
                    size={16}
                    weight="light"
                    className="flip-x transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-1.5"
                  />
                </Link>
                <Link href="/courses" className={btnHeroGhost}>
                  {t("hero.primary")}
                </Link>
              </div>
            </StaggerItem>

            {/* Trust row. Four facts the academy states about itself: where it
                is, how many students it takes, that it certifies, and that
                support continues afterwards. Nothing here is inferred. */}
            <StaggerItem>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
                {badges.map(({ key, Icon }) => (
                  <li key={key} className="flex items-center gap-2.5">
                    <Icon size={15} weight="light" className="shrink-0 text-accent" />
                    <span className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                      {t(`proof.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          </Stagger>

          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <HeroPortrait src="/brand/amira-hero-portrait.jpg" alt={t("hero.portrait")} />
          </div>
        </div>
      </section>

      {/* Everything below this point gets the floating booking button. */}
      <div id="sticky-cta-after" aria-hidden />

      {/* About: portrait, founder, mission, values, welcome message. */}
      <section id="about" className="py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/brand/amira-studio.jpg"
                alt={t("instructor.portrait")}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <Reveal>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("instructor.eyebrow")}
              </p>
              <h2 className={`${sectionTitle} mt-6`}>{t("instructor.title")}</h2>
              <p className="mt-3 text-sm text-accent-hi">{t("instructor.role")}</p>
            </Reveal>
            <Reveal delay={0.08}>
              {/* The mission, set as the statement it is rather than as body
                  copy: it is the one sentence the academy leads with. */}
              <p className="display mt-8 max-w-[34ch] text-2xl leading-[1.35] text-bone md:text-[1.75rem]">
                {t("instructor.mission")}
              </p>
              <p className="mt-6 max-w-[62ch] leading-relaxed text-muted">
                {t("instructor.body")}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-10 text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                {t("instructor.valuesLabel")}
              </p>
              <ul className="mt-5 flex flex-wrap gap-3 border-t border-line pt-6">
                {values.map((k) => (
                  <li
                    key={k}
                    className="inline-flex items-center gap-2 rounded-[2px] border border-accent/40 px-3.5 py-2 text-[12px] tracking-[0.06em] text-bone"
                  >
                    <SealCheck size={14} weight="light" className="text-accent" />
                    {t(`instructor.values.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Welcome message. Click to load, so the homepage never carries the
            player bundle for a video most visitors will not open. */}
        <div className={`${shell} mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-7">
            <div className="overflow-hidden border border-line">
              <WelcomeVideo
                playbackId={welcomeVideoId}
                poster="/brand/amira-hero.jpg"
                alt={t("mentor.videoAlt")}
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5 lg:self-center">
            <p className="script text-4xl leading-[1.25] text-accent-hi md:text-5xl">
              {t("footer.tagline")}
            </p>
            <p className="mt-6 text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
              {t("instructor.role")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* What every course includes. */}
      <section id="why" className="bg-surface-2/40 py-28 md:py-36">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("why.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("why.title")}</h2>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{t("why.sub")}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={(i % 3) * 0.06}>
                <article className="group relative h-full overflow-hidden rounded-[2px] border border-line bg-surface p-8 transition-all duration-500 hover:-translate-y-1 hover:border-accent hover:shadow-[0_18px_50px_color-mix(in_srgb,var(--accent)_18%,transparent)] md:p-10">
                  {/* Gold wash that warms on hover. Decorative, behind content. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-24 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,var(--glow),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <span className={iconRing}>
                    <Icon size={20} weight="light" />
                  </span>
                  <h3 className="display mt-6 text-2xl text-bone">
                    {t(`why.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 max-w-[38ch] leading-relaxed text-muted">
                    {t(`why.items.${key}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Method: sticky heading, hairline-separated movements. */}
      <section id="method" className="seam py-28 md:py-36">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <h2 className={sectionTitle}>{t("method.title")}</h2>
              <p className="mt-6 max-w-[42ch] leading-relaxed text-muted">
                {t("method.sub")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {steps.map(({ key, Icon }, i) => (
              <Reveal
                key={key}
                delay={i * 0.06}
                className={`flex gap-6 py-9 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <span className={iconRing}>
                  <Icon size={20} weight="light" />
                </span>
                <div>
                  <h3 className="display text-2xl text-bone md:text-3xl">
                    {t(`method.steps.${key}.title`)}
                  </h3>
                  <p className="mt-4 max-w-[54ch] leading-relaxed text-muted">
                    {t(`method.steps.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* The academy floor. Native <video> with controls: no player bundle,
            and preload="none" keeps all 5 MB off the wire until someone
            actually presses play. */}
        <div className={`${shell} mt-16 lg:mt-20`}>
          <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
            {clips.map(({ key, src, poster }, i) => (
              <Reveal key={key} delay={i * 0.08}>
                <figure className="border border-line">
                  <video
                    src={src}
                    poster={poster}
                    controls
                    playsInline
                    preload="none"
                    aria-label={t(`method.clips.${key}`)}
                    className="aspect-[5/7] w-full bg-ink object-cover"
                  />
                  <figcaption className="px-5 py-4 text-sm leading-relaxed text-muted">
                    {t(`method.clips.${key}`)}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue: the six courses, names only. The academy supplied no
          per-course description, so the shared conditions are stated once on
          the courses page rather than invented six times over. */}
      <section id="courses" className="seam py-28 md:py-36">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("catalog.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("catalog.title")}</h2>
            <p className="mt-5 max-w-[58ch] leading-relaxed text-muted">{t("catalog.sub")}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 0.06}>
                <Link
                  href="/courses"
                  className="group flex h-full flex-col rounded-[2px] border border-line bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent hover:shadow-[0_22px_60px_color-mix(in_srgb,var(--accent)_20%,transparent)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                      className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    {/* Warm veil, in the ground colour rather than black. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[var(--ink)] opacity-0 transition-opacity duration-500 group-hover:opacity-10"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4 p-7 md:p-8">
                    <h3 className="display text-2xl text-bone">
                      {t(`catalog.courses.${c.slug}`)}
                    </h3>
                    <ArrowRight
                      size={17}
                      weight="light"
                      className="flip-x shrink-0 text-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                    />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-8">
            <p className="text-sm text-accent-hi">{t("catalog.priceOnRequest")}</p>
            <p className="text-sm text-muted">{t("catalog.payments")}</p>
            <Link href="/courses" className={`${btnGhost} sm:ms-auto`}>
              {t("hero.primary")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* How to book: contact to post-course support. Horizontal rail on
          desktop with a continuous gold spine, vertical spine on phones. */}
      <section id="journey" className="seam py-28 md:py-36">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("journey.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("journey.title")}</h2>
            <p className="mt-5 max-w-[54ch] leading-relaxed text-muted">{t("journey.sub")}</p>
          </Reveal>

          <ol className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6">
            {/* The spine. Vertical behind the nodes on phones, horizontal on lg. */}
            <span
              aria-hidden
              className="absolute inset-y-0 start-6 w-px bg-line lg:inset-y-auto lg:top-6 lg:inset-x-0 lg:h-px lg:w-auto"
            />
            {journey.map(({ key, Icon }, i) => (
              <Reveal
                as="li"
                key={key}
                delay={i * 0.07}
                className="relative flex gap-6 lg:flex-col lg:gap-0"
              >
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent bg-ink text-accent-hi">
                  <Icon size={19} weight="light" />
                </span>
                <div className="lg:mt-7 lg:pe-4">
                  <p className="font-mono text-xs text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mt-2 text-xl text-bone">
                    {t(`journey.steps.${key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-muted">
                    {t(`journey.steps.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery: the academy's own stills, edge to edge, no captions or badges. */}
      <section id="gallery" className="seam py-28 md:py-36">
        <div className={shell}>
          <Reveal>
            <h2 className={sectionTitle}>{t("results.title")}</h2>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{t("results.sub")}</p>
          </Reveal>
        </div>

        {/* Masonry, so each still keeps its own proportions instead of being
            cropped into a uniform square. Click opens the lightbox. */}
        <Reveal className="mt-14 px-5 md:px-10">
          <Gallery images={resultStills} />
        </Reveal>
      </section>

      {/* Students: training moments. students-certificates.jpg stays out until
          the academy has written consent from the people in it. */}
      <section id="students" className="seam py-28 md:py-36">
        <div className={shell}>
          <Reveal>
            <h2 className={sectionTitle}>{t("students.title")}</h2>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{t("students.sub")}</p>
          </Reveal>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {["/brand/group-training.jpg", "/brand/live-demo.jpg", "/brand/practice-latex.jpg"].map(
              (src, i) => (
                <Reveal key={src} delay={i * 0.06}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* The work speaks. Title and the comparison, nothing else: no eyebrow,
          no explanatory paragraph, no caption invented on the academy's behalf.
          A single pair is centred rather than stranded in a grid column; from
          two it becomes a grid. */}
      {beforeAfterPairs.length > 0 && (
        <section id="success" className="seam py-28 md:py-36">
          <div className={shell}>
            <Reveal>
              <h2 className={`${sectionTitle} text-center`}>{t("success.title")}</h2>
            </Reveal>

            <div
              className={`mt-14 grid gap-8 ${
                beforeAfterPairs.length === 1
                  ? "mx-auto max-w-3xl"
                  : "sm:grid-cols-2 lg:grid-cols-3"
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

      {/* Renders only once real, consented student quotes exist. */}
      <Voices />

      {/* Questions: native disclosure, no JS. Each row is its own panel so the
          open state reads as a card lifting out of the page. */}
      <section id="faq" className="bg-surface-2/40 py-28 md:py-36">
        <div className={shell}>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className={`${eyebrow} justify-center`}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("faq.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("faq.title")}</h2>
          </Reveal>

          <div className="mx-auto mt-14 grid max-w-3xl gap-3">
            {faqKeys.map((k, i) => (
              <Reveal key={k} delay={(i % 3) * 0.05}>
                <details className="group rounded-[2px] border border-line bg-surface px-7 py-5 transition-colors duration-300 open:border-accent hover:border-accent md:px-9 md:py-6">
                  <summary className="display flex cursor-pointer list-none items-start justify-between gap-6 text-lg text-bone marker:hidden md:text-xl">
                    {t(`faq.items.${k}.q`)}
                    <span
                      aria-hidden
                      className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/50 text-accent transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">
                    {t(`faq.items.${k}.a`)}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <p className="text-muted">{t("faq.more")}</p>
            <Link href="/#contact" className={`${btnGhost} mt-6`}>
              {t("hero.secondary")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="seam py-28 md:py-36">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <h2 className={sectionTitle}>{t("contact.title")}</h2>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">
              {t("contact.sub")}
            </p>

            <div className="mt-10 border-t border-line pt-8">
              <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                {t("contact.venue")}
              </p>
              <a
                href={mapsLink}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 flex items-start gap-4"
              >
                <MapPin size={18} weight="light" className="mt-1.5 shrink-0 text-accent" />
                <span>
                  <span className="display block text-xl leading-snug text-bone transition-colors group-hover:text-accent-hi">
                    {academy.street}
                  </span>
                  <span className="mt-1 block text-sm text-bone">
                    {academy.postcode} {academy.city} ({academy.province})
                  </span>
                  <span className="mt-2 block text-sm text-accent-hi">{t("contact.map")}</span>
                </span>
              </a>
            </div>

            <div className="mt-8 border-t border-line pt-8">
              <p className="text-[11px] font-medium tracking-[0.18em] text-muted uppercase">
                {t("contact.channels")}
              </p>
              <ul className="mt-4 grid gap-3 text-sm">
                {/* Rendered only when the academy has supplied a number, so the
                    site never links to a guessed one. */}
                {whatsappLink && (
                  <li>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                    >
                      <WhatsappLogo size={18} weight="light" className="text-accent" />
                      {t("contact.whatsapp")}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                  >
                    <InstagramLogo size={18} weight="light" className="text-accent" />
                    <span dir="ltr">@{studio.instagram}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={tiktokLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                  >
                    <TiktokLogo size={18} weight="light" className="text-accent" />
                    <span dir="ltr">@{studio.tiktok}</span>
                  </a>
                </li>
                {/* Text, not a link: the academy gave a page name, not a URL. */}
                <li className="inline-flex items-center gap-3 text-bone">
                  <FacebookLogo size={18} weight="light" className="text-accent" />
                  {studio.facebook}
                </li>
                <li>
                  <a
                    href={`mailto:${studio.pec}`}
                    className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                  >
                    <ShieldCheck size={18} weight="light" className="text-accent" />
                    <span dir="ltr">{studio.pec}</span>
                  </a>
                </li>
              </ul>
              <p className="sr-only">{addressLine}</p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
