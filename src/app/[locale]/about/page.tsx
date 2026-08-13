import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { Stagger, StaggerItem } from "@/components/Stagger";
import { MediaFrame } from "@/components/MediaFrame";
import { Parallax } from "@/components/Parallax";
import { WelcomeVideo } from "@/components/WelcomeVideo";
import { welcomeVideoId } from "@/lib/studio";
import {
  btnLine,
  btnSolid,
  displayItem,
  displayLarge,
  displayQuote,
  displayRow,
  displaySection,
  displayStat,
  eyebrow,
  eyebrowLight,
  pageHeader,
  sectionPad,
  sectionPadBottom,
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
    alternates: altLanguages("/about", locale),
  };
}

/**
 * The founder page.
 *
 * The academy's differentiator is a person: someone who teaches the techniques
 * she performs on paying clients every day, in her own institute. That is the
 * argument this page makes, in the order a first-time visitor needs it. It also
 * holds what the homepage deliberately no longer carries: the academy's stated
 * values, the business curriculum, and the welcome message.
 *
 * The two figures (8+ years, 150+ students) are the only numbers the academy
 * has stated about itself, so they are the only numbers here.
 */
const differences = ["experience", "small", "support"] as const;

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

const values = ["professionalism", "quality", "innovation", "ethics", "growth"] as const;
const visionPoints = ["quality", "professionalism", "innovation", "growth"] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const inst = await getTranslations("instructor");
  const cta = await getTranslations("hero");
  const mentor = await getTranslations("mentor");

  return (
    <>
      <JsonLd data={personSchema(locale, t("story.role"), t("lede"))} />

      <section className={`${pageHeader} bg-ivory`}>
        <div className={`${shell} grid items-end gap-10 lg:grid-cols-12 lg:gap-12`}>
          <Stagger className="lg:col-span-6">
            <StaggerItem>
              <p className={eyebrow}>{t("eyebrow")}</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className={`${displaySection} mt-8 max-w-[14ch] text-balance`}>
                <span className="block">{t("titleA")}</span>
                <span className="block text-mute">{t("titleB")}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-10 max-w-[50ch] text-[17px] leading-relaxed text-mute">
                {t("lede")}
              </p>
            </StaggerItem>
          </Stagger>

          <Parallax distance={10} className="lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[3/4] w-full">
              <MediaFrame
                media={{
                  posterSrc: "/brand/amira-hero-portrait.jpg",
                  alt: t("portrait"),
                  position: "52% 22%",
                }}
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="absolute inset-0 h-full w-full"
                imageClassName="settle"
              />
            </div>
          </Parallax>
        </div>
      </section>

      {/* The two figures the academy states about itself, and where it is. */}
      <section className="bg-ivory pb-16 md:pb-24">
        <div className={shell}>
          <dl className="grid border-t border-hair sm:grid-cols-3">
            {(["years", "students", "reach"] as const).map((k, i) => (
              <Reveal
                key={k}
                delay={i * 0.08}
                className={`border-b border-hair py-8 sm:border-b-0 ${
                  i > 0 ? "sm:border-s sm:ps-8" : ""
                }`}
              >
                <dt className={displayStat}>{t(`facts.${k}.value`)}</dt>
                <dd className="label mt-4 max-w-[24ch] text-mute">{t(`facts.${k}.label`)}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Her story, in her own voice.
          The heading used to travel with the reader down a sticky left column,
          because the section had no photograph and there was nothing else to
          put beside the text. That is the shape of a biography, and a
          biography is what this page most has to avoid being: four paragraphs
          of prose in a bare column, with the only face on the page two screens
          above it.

          The heading now sits over both columns and the column beside the text
          carries the founder portrait, so the story is read against the person
          telling it. The frame is the one photograph the academy has of her at
          the work rather than in front of it, and `story.imageAlt` describes
          exactly what it shows. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={shell}>
          <Reveal className="max-w-[36rem]">
            <p className={eyebrow}>{t("story.eyebrow")}</p>
            <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("story.title")}</h2>
            <p className="label mt-8 max-w-[34ch] text-mute">{t("story.role")}</p>
          </Reveal>

          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-16">
            <Parallax distance={12} className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full">
                <MediaFrame
                  media={{
                    posterSrc: "/brand/amira-founder-portrait.jpg",
                    alt: t("story.imageAlt"),
                    position: "50% 42%",
                  }}
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </Parallax>

            <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
              {(["p1", "p2", "p3", "p4"] as const).map((k, i) => (
                <Reveal key={k} delay={0.06 + i * 0.04}>
                  <p
                    className={`max-w-[62ch] leading-relaxed text-mute ${
                      i === 0 ? "text-[18px] text-espresso" : "mt-6 text-[16px]"
                    }`}
                  >
                    {t(`story.${k}`)}
                  </p>
                </Reveal>
              ))}

              <Reveal delay={0.24}>
                <p className="display mt-12 text-[clamp(1.5rem,2.6vw,2.25rem)] italic">
                  {t("story.signature")}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Amira's welcome message. Click to load, so the page never carries the
          player bundle for a video most visitors will not open.

          On paper, with the story above it: the two sections are one chapter,
          her account of the work and then her own voice over it, and the page
          had them on two different grounds. The alt follows what is actually
          on screen. Until the clip is uploaded this frame is a photograph of
          her institute and nothing else, so describing it as a welcome message
          would be describing something that is not there. */}
      <section className={`${sectionPadBottom} bg-paper`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-7">
            <WelcomeVideo
              playbackId={welcomeVideoId}
              poster="/brand/amira-hero.jpg"
              alt={welcomeVideoId ? mentor("videoAlt") : t("portrait")}
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4 lg:col-start-9 lg:self-center">
            <p className={displayLarge}>{inst("mission")}</p>
            <p className="mt-8 text-[16px] leading-relaxed text-mute">{inst("body")}</p>
            <p className="label mt-8 text-mute">{inst("role")}</p>
          </Reveal>
        </div>
      </section>

      {/* Three claims a visitor can check, and the curriculum under them: one
          chapter on ivory about what the school is, between her story on paper
          and the mission on black. The grounds used to change on every section
          down this page, which is seven switches on the way to the bottom and
          the point at which a change of ground stops reading as a change. */}
      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          <Reveal className="max-w-[22ch]">
            <p className={eyebrow}>{t("different.eyebrow")}</p>
            <h2 className={`${displaySection} mt-8`}>{t("different.title")}</h2>
          </Reveal>

          <ol className="mt-14 border-t border-hair md:mt-20">
            {differences.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={i * 0.06}
                className="grid gap-3 border-b border-hair py-8 md:grid-cols-12 md:gap-10"
              >
                <span className="label font-mono text-bronze-ink md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} md:col-span-4`}>
                  {t(`different.items.${k}.title`)}
                </h3>
                <p className="max-w-[52ch] text-[16px] leading-relaxed text-mute md:col-span-6 md:col-start-7">
                  {t(`different.items.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* The business curriculum. Names only: the academy supplied no syllabus
          for these, and eight invented blurbs would be eight invented claims. */}
      <section className={`${sectionPadBottom} bg-ivory`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <p className={eyebrow}>{t("beyond.eyebrow")}</p>
                <h2 className={`${displaySection} mt-8 max-w-[14ch]`}>{t("beyond.title")}</h2>
                <p className="mt-8 max-w-[44ch] text-[16px] leading-relaxed text-mute">
                  {t("beyond.sub")}
                </p>
              </Reveal>
            </div>
          </div>

          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {beyond.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={(i % 4) * 0.05}
                className="flex items-baseline gap-5 border-b border-hair py-5"
              >
                <span className="label font-mono text-bronze-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={displayItem}>
                  {t(`beyond.items.${k}`)}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission, vision and the values the academy publishes. */}
      <section className={`${sectionPad} bg-night text-ivory`}>
        <div className={shell}>
          {/* The measure belongs on the quote, not on the block around it.
              `ch` resolves against the element's own font size, so a 24ch cap
              set on the wrapper was 24 characters of body text, about 260px,
              and the quote inside it was being set at 72px: eight lines of one
              or two words each down the left edge of an empty section. Moving
              the cap onto the line itself, at the size it is actually set in,
              gives it the three lines it was written for. */}
          <Reveal>
            <p className={eyebrowLight}>{t("mission.eyebrow")}</p>
            <p className={`${displayQuote} mt-10 max-w-[18ch] text-balance`}>
              {t("mission.quote")}
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-12 max-w-[62ch]">
            <p className="text-[17px] leading-relaxed text-mute-dark">{t("mission.body")}</p>
          </Reveal>

          <div className="mt-20 grid gap-10 border-t border-hair-dark pt-14 lg:grid-cols-12 lg:gap-16 md:mt-28">
            <Reveal className="lg:col-span-5">
              <p className={eyebrowLight}>{t("vision.eyebrow")}</p>
              <h2 className={`${displayLarge} mt-8 max-w-[16ch]`}>{t("vision.title")}</h2>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
              <p className="max-w-[58ch] text-[16px] leading-relaxed text-mute-dark">
                {t("vision.body")}
              </p>
              <p className="mt-8 max-w-[58ch] text-[16px] leading-relaxed text-ivory">
                {t("vision.closing")}
              </p>
              <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                {visionPoints.map((k) => (
                  <li key={k} className="label text-mute-dark">
                    {t(`vision.points.${k}`)}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-16 border-t border-hair-dark pt-10">
            <p className={eyebrowLight}>{inst("valuesLabel")}</p>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {values.map((k) => (
                <li key={k} className={displayItem}>
                  {inst(`values.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${sectionPad} bg-ivory`}>
        <div className={shell}>
          <Reveal className="max-w-[20ch]">
            <h2 className={displaySection}>{t("cta.title")}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-[46ch] text-[17px] leading-relaxed text-mute">
              {t("cta.body")}
            </p>
            <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
              <Link href="/contact" className={btnSolid}>
                {cta("secondary")}
              </Link>
              <Link href="/courses" className={btnLine}>
                {cta("primary")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
