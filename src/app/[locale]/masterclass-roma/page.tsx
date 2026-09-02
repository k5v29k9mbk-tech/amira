import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  CalendarBlank,
  Certificate,
  GraduationCap,
  MapPin,
  SealCheck,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { masterclass, masterclassCopy } from "@/lib/masterclass";
import { brand } from "@/lib/studio";
import { JsonLd } from "@/lib/seo";
import { altLanguages, routing, siteUrl } from "@/i18n/routing";
import { stagger } from "@/lib/motion";
import {
  arrow,
  bodyBase,
  bodyLede,
  btnLine,
  btnSolid,
  btnSolidLight,
  displayChapter,
  displayPage,
  displayQuote,
  displaySection,
  eyebrow,
  eyebrowLight,
  ledeFromTitle,
  linkRule,
  sectionPad,
  sectionPadBottom,
  shell,
} from "@/lib/ui";

const PATH = `/${masterclass.slug}`;

/**
 * The Roma masterclass.
 *
 * ONE DATED EVENT, SO ONE HAND-WRITTEN ROUTE. The six standing programmes are
 * generated from `programs.ts` under `/courses/[slug]`, because they are a set
 * and share a shape. This is not one of them: it is a single intake, on two
 * dates, in a city the academy does not otherwise teach in, and it is meant to
 * be deleted rather than maintained. Its copy is in `lib/masterclass.ts`; the
 * note at the top of that file says what to do the day this becomes a format
 * rather than an event.
 *
 * IT SENDS PEOPLE TO /contact, NOT TO A CHECKOUT. The academy takes bookings in
 * conversation and quotes privately — the same rule `programs.ts` records — so
 * every button here opens that conversation. There is no price on this page and
 * no seat counter, because a counter that is not wired to anything is a
 * pressure tactic rather than information.
 *
 * THE PHOTOGRAPHS ARE THE ACADEMY'S OWN and they carry the claims: a student
 * with her PhiBrows certificate, a treated brow before and after, Amira
 * correcting at the table. Nothing on the page states an outcome the pictures
 * do not show.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = masterclassCopy(locale);
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: altLanguages(PATH, locale),
  };
}

export default async function MasterclassPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = masterclassCopy(locale);

  /* A Course with a dated, on-site instance. Written here rather than through
     `courseSchema` because that helper builds a `/courses/<slug>` url and
     carries no dates: this page is neither at that path nor undated. Still no
     `offers` block, for the reason at the top of `lib/seo.tsx`. */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.meta.title,
    description: c.meta.description,
    url: `${siteUrl}/${locale}${PATH}`,
    provider: { "@id": `${siteUrl}/#organization` },
    inLanguage: "it",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      startDate: masterclass.startDate,
      endDate: masterclass.endDate,
      instructor: { "@type": "Person", name: brand.founder },
      location: {
        "@type": "Place",
        name: masterclass.city,
        address: {
          "@type": "PostalAddress",
          addressLocality: masterclass.city,
          addressCountry: masterclass.country,
        },
      },
    },
  };

  const pillarIcons = [SealCheck, GraduationCap, Certificate, UsersThree];

  const facts = [
    { icon: CalendarBlank, value: c.info.days, note: c.info.daysNote },
    { icon: MapPin, value: c.info.place, note: c.info.placeNote },
    { icon: UsersThree, value: c.info.seats, note: c.info.seatsNote },
  ];

  return (
    <>
      <JsonLd data={schema} />

      {/* ----------------------------------------------------------------
          HERO. Text left, portrait right, which is the shape the rest of
          the site opens on. The date sits above the title rather than in
          the lede: it is the one fact that decides whether the page is
          relevant at all, and a reader who is busy on those two days is
          better served finding that out in the first line than in the
          fourth.
          ---------------------------------------------------------------- */}
      <section className="bg-ivory pt-[7.5rem] pb-16 md:pt-36 md:pb-20 lg:pb-28">
        <div className={`${shell} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-6">
            <p className={eyebrow}>{c.eyebrow}</p>

            <h1 className={`${displayPage} mt-8 max-w-[12ch]`}>
              {c.titleAccent}
              <span className="block text-bronze-ink">{c.title}</span>
            </h1>

            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[17px] leading-relaxed text-espresso">
              <span>{c.when}</span>
              <span aria-hidden className="h-px w-8 bg-bronze/50" />
              <span>{c.where}</span>
            </p>

            <p className={`${ledeFromTitle} max-w-[34ch] ${bodyLede} text-mute`}>{c.lede}</p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/contact" className={btnSolid}>
                {c.ctaPrimary}
              </Link>
              <a href="#programme" className={btnLine}>
                {c.ctaSecondary}
              </a>
            </div>

            <p className="label mt-10 text-mute">{c.badge}</p>
          </div>

          <Reveal className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={masterclass.images.portrait}
                alt={c.altPortrait}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          THE FOUR THINGS THE TWO DAYS ARE. On the dark ground, because it
          is the one band on the page that is a claim rather than a
          description and the site reserves espresso for exactly that.
          ---------------------------------------------------------------- */}
      <section className={`${sectionPad} bg-espresso text-ivory`}>
        <div className={shell}>
          <SectionLabel n={1} tone="light">
            {c.pillarsLabel}
          </SectionLabel>

          <ul className="mt-12 grid gap-x-12 gap-y-12 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
            {c.pillars.map((p, i) => {
              const Icon = pillarIcons[i];
              return (
                <Reveal as="li" key={p.title} delay={i * stagger.base}>
                  <Icon size={28} weight="light" className="text-bronze-hi" />
                  <h3 className="mt-6 text-[18px] leading-snug text-ivory">{p.title}</h3>
                  <p className={`mt-4 max-w-[28ch] ${bodyBase} text-ivory/65`}>{p.body}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          THE PROGRAMME, between the two photographs that evidence it: the
          work on the left, the certificate on the right, the list of what
          is taught between them.
          ---------------------------------------------------------------- */}
      <section id="programme" className={`${sectionPad} bg-ivory scroll-mt-24`}>
        <div className={shell}>
          <SectionLabel n={2}>{c.masterLabel}</SectionLabel>
          <h2 className={`${displaySection} mt-8 max-w-[16ch]`}>{c.masterTitle}</h2>

          <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={masterclass.images.beforeAfter}
                  alt={c.altBeforeAfter}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <ol className="lg:col-span-5">
              {c.masters.map((line, i) => (
                <Reveal
                  as="li"
                  key={line}
                  delay={i * 0.04}
                  className="flex items-baseline gap-5 border-b border-hair py-5 first:border-t first:border-hair"
                >
                  <span className="label shrink-0 font-mono text-bronze-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[16px] leading-relaxed text-espresso">{line}</span>
                </Reveal>
              ))}
            </ol>

            <Reveal className="lg:col-span-3">
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={masterclass.images.certificate}
                  alt={c.altCertificate}
                  fill
                  sizes="(min-width: 1024px) 22vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          WHO TEACHES IT. The photograph is her working, not posing: the
          claim on this page is teaching, so the evidence is a table with a
          student at it.
          ---------------------------------------------------------------- */}
      <section className={`${sectionPadBottom} bg-ivory`}>
        <div className={`${shell} grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={masterclass.images.training}
                alt={c.altTraining}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className={eyebrow}>{c.teacherLabel}</p>
            <h2 className={`${displayChapter} mt-6`}>{brand.founder}</h2>
            <p className={`mt-3 ${bodyBase} text-mute`}>{c.teacherRole}</p>

            <blockquote className={`${displayQuote} mt-10 max-w-[22ch] text-espresso`}>
              {c.quote}
            </blockquote>

            <Link href="/about" className={`${linkRule} mt-10`}>
              {brand.short}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          THE THREE FACTS, then the one thing to do about them.
          ---------------------------------------------------------------- */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={shell}>
          <SectionLabel n={3}>{c.infoLabel}</SectionLabel>

          <dl className="mt-10 grid gap-x-12 gap-y-10 border-t border-hair pt-10 md:grid-cols-3">
            {facts.map(({ icon: Icon, value, note }) => (
              <div key={value}>
                <Icon size={24} weight="light" className="text-bronze-ink" />
                <dt className="mt-5 text-[17px] leading-snug text-espresso">{value}</dt>
                <dd className={`mt-3 max-w-[30ch] ${bodyBase} text-mute`}>{note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${sectionPad} bg-espresso text-ivory`}>
        <div className={`${shell} grid gap-10 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <p className={eyebrowLight}>{c.where}</p>
            <h2 className={`${displaySection} mt-6 max-w-[12ch]`}>{c.closingTitle}</h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className={`max-w-[38ch] ${bodyLede} text-ivory/70`}>{c.closingBody}</p>
            <Link href="/contact" className={`${btnSolidLight} mt-10`}>
              {c.closingCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
