import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Camera,
  Certificate,
  CurrencyEur,
  Diamond,
  Megaphone,
  Storefront,
  ChartLineUp,
  Crown,
  EnvelopeSimple,
  Eye,
  HandHeart,
  InstagramLogo,
  Lifebuoy,
  MapPin,
  PaintBrushHousehold,
  Phone,
  Sparkle,
  UsersThree,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, lessonCount, resultStills } from "@/lib/courses";
import {
  beforeAfterPairs,
  cities,
  instagramLink,
  mapsLink,
  studio,
  welcomeVideoId,
  whatsappLink,
} from "@/lib/studio";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { Voices } from "@/components/Voices";
import { BeforeAfter } from "@/components/BeforeAfter";
import { WelcomeVideo } from "@/components/WelcomeVideo";
import { ContactForm } from "@/components/ContactForm";
import { btnGhost, btnPrimary, eyebrow, iconRing, label, sectionTitle, shell } from "@/lib/ui";
import { altLanguages } from "@/i18n/routing";

export const metadata = { alternates: altLanguages() };

// Claims the studio's own marketing already makes. No invented figures.
const badges = ["academy", "certification", "groups", "support"] as const;

// Enrollment to certification, in the order a student actually meets it.
const journey = [
  { key: "book", Icon: CalendarCheck },
  { key: "welcome", Icon: EnvelopeSimple },
  { key: "theory", Icon: BookOpen },
  { key: "demo", Icon: Eye },
  { key: "practice", Icon: HandHeart },
  { key: "certify", Icon: Certificate },
] as const;

// The half of the training that is not technique.
const brandPillars = [
  { key: "identity", Icon: Diamond },
  { key: "pricing", Icon: CurrencyEur },
  { key: "social", Icon: Megaphone },
  { key: "photography", Icon: Camera },
  { key: "clients", Icon: UsersThree },
  { key: "systems", Icon: Storefront },
] as const;

const steps = [
  { key: "one", Icon: Eye },
  { key: "two", Icon: PaintBrushHousehold },
  { key: "three", Icon: Sparkle },
] as const;

// Two clips from the studio floor. Both were shot vertically on a phone, so
// they stay portrait rather than being letterboxed into a 16:9 well.
const clips = [
  { key: "mapping", src: "/brand/mapping.mp4", poster: "/brand/mapping-poster.jpg" },
  { key: "pigment", src: "/brand/pigment.mp4", poster: "/brand/pigment-poster.jpg" },
] as const;

const reasons = [
  { key: "luxury", Icon: Crown },
  { key: "groups", Icon: UsersThree },
  { key: "mentoring", Icon: HandHeart },
  { key: "certification", Icon: Certificate },
  { key: "business", Icon: ChartLineUp },
  { key: "support", Icon: Lifebuoy },
] as const;

// The syllabus as the studio lists it on its own material.
const syllabus = [
  "lipBlush",
  "darkLips",
  "powderBrows",
  "browMapping",
  "colourTheory",
  "pigment",
  "machine",
  "liveDemo",
  "latex",
  "model",
  "branding",
  "packaging",
  "business",
  "social",
  "consultation",
  "aftercare",
  "certification",
] as const;

// TODO(studio): `students` is the figure from the brief and still needs
// confirming. The other three are verifiable from the studio's own material.
const stats = [
  { key: "years", to: 9, suffix: "+" },
  { key: "students", to: 500, suffix: "+" },
  { key: "locations", to: 3, suffix: "" },
  { key: "practice", to: 100, suffix: "%" },
] as const;

const faqKeys = ["one", "two", "three", "four", "five", "six"] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [lead, ...rest] = courses;

  return (
    <>
      {/* Hero. Phones stack: photograph, then copy on solid ground — overlaying
          a viewport-tall crop left the eyebrow stranded on her face. From lg the
          banner goes full-bleed and the copy sits over its empty left third. */}
      <section className="relative flex flex-col overflow-hidden lg:min-h-[100dvh] lg:items-center lg:pt-24 lg:pb-16">
        {/* No colour grading: the frame is already lit to the nude palette, and
            the empty wall on its left is where the headline sits. Focal point
            follows her face so she survives the crop at every ratio. The frame
            is 4:3, so a square well on phones only trims the sides. */}
        <div className="relative aspect-square w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <Image
            src="/brand/amira-hero.jpg"
            alt={t("hero.portrait")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_28%]"
          />
        </div>
        {/* Scrim in the page's own ground colour, so the copy stays legible
            without tinting the photograph. A hard seam, not a feather: the wash
            bleeding across her read as a blur. */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 hidden bg-[linear-gradient(to_right,var(--ink)_0,var(--ink)_46%,transparent_46%)] lg:block"
        />
        <div
          className={`${shell} grid w-full items-center gap-12 py-14 lg:grid-cols-12 lg:gap-8 lg:py-0`}
        >
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("hero.eyebrow")}
              </p>
            </Reveal>
            {/* Two registers, the studio's own lockup: a light, widely tracked
                line, then the script word carrying the emotion. The Arabic rule
                in globals.css strips the tracking, where it would be wrong. */}
            <Reveal delay={0.08}>
              <h1 className="mt-8">
                <span className="display block text-xl leading-[1.35] font-light tracking-[0.26em] text-bone uppercase sm:text-2xl xl:text-[1.75rem]">
                  {t("hero.titleA")}
                </span>
                {/* Sized for the longest translation, "Construisez votre
                    marque.", which wraps to two lines. text-balance keeps that
                    break even rather than leaving one word stranded. */}
                <span className="script mt-2 block pb-3 text-[2.75rem] leading-[1.2] text-balance text-accent-hi sm:text-[3.5rem] xl:text-[4.25rem]">
                  {t("hero.titleB")}
                </span>
              </h1>
            </Reveal>
            {/* Gold rule with the poster's diamond. */}
            <Reveal delay={0.14}>
              <span aria-hidden className="mt-2 flex items-center gap-3">
                <span className="h-px w-16 bg-accent/70" />
                <span className="text-[8px] text-accent">◆</span>
                <span className="h-px w-6 bg-accent/40" />
              </span>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[46ch] text-base leading-[1.85] text-muted md:text-lg">
                {t("hero.sub")}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/courses" className={btnPrimary}>
                  {t("hero.primary")}
                  <ArrowRight size={16} weight="light" className="flip-x" />
                </Link>
                <Link href="/#contact" className={btnGhost}>
                  <CalendarCheck size={18} weight="light" />
                  {t("hero.secondary")}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Credential strip. Hairline separated, no card boxes. */}
      <section className="border-y border-line">
        <div className={`${shell} grid grid-cols-2 md:grid-cols-4`}>
          {badges.map((key, i) => (
            <Reveal
              key={key}
              delay={i * 0.06}
              className={`border-line py-10 md:py-12 ${i % 2 === 1 ? "border-s ps-6" : "md:border-s md:ps-6"} ${i > 1 ? "border-t md:border-t-0" : ""}`}
            >
              <p className="display text-xl leading-snug text-bone md:text-2xl">
                {t(`proof.${key}.title`)}
              </p>
              <p className="mt-2 text-[11px] font-medium tracking-[0.16em] text-accent-hi uppercase">
                {t(`proof.${key}.sub`)}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Everything below this point gets the floating seat button. */}
      <div id="sticky-cta-after" aria-hidden />

      {/* Meet your mentor: portrait, biography, welcome message. */}
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
                {t("mentor.eyebrow")}
              </p>
              <h2 className={`${sectionTitle} mt-6`}>{t("instructor.title")}</h2>
              <p className="mt-3 text-sm text-accent-hi">{t("instructor.role")}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-8 max-w-[62ch] leading-relaxed text-muted">
                {t("instructor.body1")}
              </p>
              <p className="mt-5 max-w-[62ch] leading-relaxed text-muted">
                {t("instructor.body2")}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <ul className="mt-10 grid gap-4 border-t border-line pt-8">
                {(["one", "two", "three"] as const).map((k) => (
                  <li key={k} className="flex gap-4 text-sm leading-relaxed text-bone">
                    <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-accent" />
                    {t(`instructor.credentials.${k}`)}
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
              {t("mentor.quote")}
            </p>
            <p className="mt-6 text-[11px] font-medium tracking-[0.2em] text-muted uppercase">
              {t("instructor.role")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why choose the academy: six reasons as raised cards. */}
      <section id="why" className="border-t border-line bg-surface-2/40 py-24 md:py-32">
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
      <section id="method" className="border-t border-line py-24 md:py-32">
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

        {/* The three movements, on the studio floor. Native <video> with
            controls: no player bundle, and preload="none" keeps all 5 MB off
            the wire until someone actually presses play. Each clip runs to a
            finished brow, so they play once rather than looping. */}
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

      {/* What you'll learn: the full syllabus, set as one list. */}
      <section id="syllabus" className="border-t border-line py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <h2 className={sectionTitle}>{t("syllabus.title")}</h2>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">{t("syllabus.sub")}</p>
          </div>
          <ul className="grid gap-x-10 border-t border-line pt-2 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {syllabus.map((key, i) => (
              <Reveal
                key={key}
                as="li"
                delay={(i % 6) * 0.04}
                className="flex items-baseline gap-4 border-b border-line py-4 text-bone"
              >
                <span aria-hidden className="h-px w-5 shrink-0 bg-accent" />
                {t(`syllabus.items.${key}`)}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Journey: enrollment to certification. Horizontal rail on desktop with a
          continuous gold spine behind the nodes, vertical spine on phones. */}
      <section id="journey" className="border-t border-line py-24 md:py-32">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("journey.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("journey.title")}</h2>
            <p className="mt-5 max-w-[54ch] leading-relaxed text-muted">{t("journey.sub")}</p>
          </Reveal>

          <ol className="relative mt-16 grid gap-10 lg:grid-cols-6 lg:gap-6">
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

      {/* Build your beauty brand: the half of the training that is not technique. */}
      <section id="brand" className="border-t border-line bg-surface-2/40 py-24 md:py-32">
        <div className={shell}>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className={`${eyebrow} justify-center`}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("brand.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("brand.title")}</h2>
            <p className="mt-6 leading-relaxed text-muted">{t("brand.sub")}</p>
          </Reveal>

          <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {brandPillars.map(({ key, Icon }, i) => (
              <Reveal key={key} delay={(i % 3) * 0.06} className="text-center">
                <span className={`${iconRing} mx-auto`}>
                  <Icon size={20} weight="light" />
                </span>
                <h3 className="display mt-5 text-xl text-bone">
                  {t(`brand.items.${key}.title`)}
                </h3>
                <p className="mx-auto mt-2 max-w-[32ch] text-sm leading-relaxed text-muted">
                  {t(`brand.items.${key}.body`)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue: bento, exactly four cells for four courses. */}
      <section id="courses" className="border-t border-line py-24 md:py-32">
        <div className={shell}>
          <Reveal>
            <p className={eyebrow}>
              <span aria-hidden className="h-px w-8 bg-accent" />
              {t("catalog.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-6`}>{t("catalog.title")}</h2>
            <p className="mt-5 max-w-[52ch] leading-relaxed text-muted">{t("catalog.sub")}</p>
          </Reveal>

          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7 lg:row-span-2">
              <CourseTile slug={lead.slug} image={lead.image} big />
            </Reveal>
            {rest.map((c, i) => (
              <Reveal key={c.slug} delay={0.06 * (i + 1)} className="lg:col-span-5">
                <CourseTile slug={c.slug} image={c.image} />
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted">{t("catalog.payments")}</p>
        </div>
      </section>

      {/* Figures. Counters run once, on scroll into view. */}
      <section className="border-t border-line py-20 md:py-24">
        <div className={`${shell} grid grid-cols-2 gap-y-12 lg:grid-cols-4`}>
          {stats.map(({ key, to, suffix }, i) => (
            <Reveal key={key} delay={i * 0.06} className="text-center">
              <p className="display text-5xl text-accent-hi md:text-6xl">
                <Counter to={to} suffix={suffix} />
              </p>
              <p className={`${label} mt-4`}>{t(`stats.${key}`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gallery: the studio's own stills, edge to edge, no captions or badges. */}
      <section id="gallery" className="border-t border-line py-24 md:py-32">
        <div className={shell}>
          <Reveal>
            <h2 className={sectionTitle}>{t("results.title")}</h2>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{t("results.sub")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 px-5 md:grid-cols-3 md:gap-4 md:px-10">
          {resultStills.map((src, i) => (
            <Reveal
              key={src}
              delay={(i % 3) * 0.06}
              className={i === 0 ? "col-span-2 md:col-span-2 md:row-span-2" : ""}
            >
              <div
                className={`relative w-full overflow-hidden ${i === 0 ? "aspect-[16/10] md:aspect-[4/3]" : "aspect-square"}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Students: training moments. students-certificates.jpg stays out until
          the studio has written consent from the people in it. */}
      <section id="students" className="border-t border-line py-24 md:py-32">
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

      {/* Success stories. Renders the wipes only once matched pairs exist, and
          the quotes only once real consented ones are added. */}
      {beforeAfterPairs.length > 0 && (
        <section id="success" className="border-t border-line py-24 md:py-32">
          <div className={shell}>
            <Reveal>
              <p className={eyebrow}>
                <span aria-hidden className="h-px w-8 bg-accent" />
                {t("success.eyebrow")}
              </p>
              <h2 className={`${sectionTitle} mt-6`}>{t("success.title")}</h2>
              <p className="mt-5 max-w-[50ch] leading-relaxed text-muted">{t("success.sub")}</p>
            </Reveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beforeAfterPairs.map((pair, i) => (
                <Reveal key={pair.label} delay={(i % 3) * 0.06}>
                  <BeforeAfter pair={pair} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Voices />

      {/* Questions: native disclosure, no JS. Each row is its own panel so the
          open state reads as a card lifting out of the page. */}
      <section id="faq" className="border-t border-line bg-surface-2/40 py-24 md:py-32">
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
      <section id="contact" className="border-t border-line py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <h2 className={sectionTitle}>{t("contact.title")}</h2>
            <p className="mt-6 max-w-[38ch] leading-relaxed text-muted">
              {t("contact.sub")}
            </p>

            <ul className="mt-10 grid gap-5 border-t border-line pt-8">
              {cities.map((c) => (
                <li key={c.id}>
                  <a
                    href={mapsLink(c.maps)}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-4"
                  >
                    <MapPin size={18} weight="light" className="mt-1 shrink-0 text-accent" />
                    <span>
                      <span className="display block text-xl text-bone transition-colors group-hover:text-accent-hi">
                        {t(`contact.cities.${c.id}.name`)}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {t("contact.map")}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <ul className="mt-8 grid gap-3 border-t border-line pt-8 text-sm">
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
              <li>
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                >
                  <InstagramLogo size={18} weight="light" className="text-accent" />@
                  {studio.instagram}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${studio.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                >
                  <Phone size={18} weight="light" className="text-accent" />
                  <span dir="ltr">{studio.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${studio.email}`}
                  className="inline-flex items-center gap-3 text-bone hover:text-accent-hi"
                >
                  <EnvelopeSimple size={18} weight="light" className="text-accent" />
                  {studio.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

async function CourseTile({
  slug,
  image,
  big = false,
}: {
  slug: string;
  image: string;
  big?: boolean;
}) {
  const t = await getTranslations();
  const course = courses.find((c) => c.slug === slug)!;

  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex h-full flex-col border border-line bg-surface transition-colors hover:border-accent"
    >
      <div className={`relative w-full overflow-hidden ${big ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <Image
          src={image}
          alt=""
          fill
          sizes={big ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 40vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-7 md:p-9">
        <h3
          className={`display text-bone ${big ? "text-3xl md:text-[2.5rem]" : "text-2xl"}`}
        >
          {t(`catalog.${slug}.title`)}
        </h3>
        <p className="mt-3 max-w-[48ch] leading-relaxed text-muted">
          {t(`catalog.${slug}.tagline`)}
        </p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-8 font-mono text-xs text-muted">
          <span>
            {course.hours} {t("catalog.hours")} · {lessonCount(course)} {t("catalog.lessons")}
          </span>
          <span className="text-bone transition-colors group-hover:text-accent-hi">
            {course.priceEur} EUR
          </span>
        </div>
      </div>
    </Link>
  );
}
