import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { courses, lessonCount } from "@/lib/courses";
import { Reveal } from "@/components/Reveal";
import { Voices } from "@/components/Voices";
import { ContactForm } from "@/components/ContactForm";
import { btnGhost, btnPrimary, sectionTitle, shell } from "@/lib/ui";

const stats = [
  { value: "2,438", key: "students" },
  { value: "31", key: "countries" },
  { value: "4.87", key: "rating" },
  { value: "9", key: "years" },
] as const;

const steps = ["one", "two", "three"] as const;
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
      {/* Hero: asymmetric split, text left, tall portrait right. */}
      <section className="relative flex min-h-[100dvh] items-center pt-24 pb-16">
        <div className={`${shell} grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8`}>
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal>
              <p className="text-xs tracking-[0.22em] text-accent-hi uppercase">
                {t("hero.eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-5xl leading-[1.05] font-medium tracking-tighter text-bone sm:text-6xl xl:text-7xl">
                {t("hero.titleA")}{" "}
                <em className="inline-block pb-1 leading-[1.1] font-normal text-accent-hi italic">
                  {t("hero.titleB")}
                </em>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">
                {t("hero.sub")}
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/courses" className={btnPrimary}>
                  {t("hero.primary")}
                  <ArrowRight size={16} weight="light" className="flip-x" />
                </Link>
                <Link
                  href={`/learn/${lead.slug}/${lead.modules[0].lessons[0].id}`}
                  className={btnGhost}
                >
                  <PlayCircle size={18} weight="light" />
                  {t("hero.secondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:aspect-[4/5]">
              <Image
                src="https://picsum.photos/seed/amira-bechini-atelier-hero/1400/1750"
                alt={t("hero.portrait")}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Numbers strip. Hairline separated, mono figures, no card boxes. */}
      <section className="border-y border-line">
        <div className={`${shell} grid grid-cols-2 md:grid-cols-4`}>
          {stats.map((s, i) => (
            <Reveal
              key={s.key}
              delay={i * 0.06}
              className={`border-line py-10 md:py-12 ${i % 2 === 1 ? "border-s ps-6" : "md:border-s md:ps-6"} ${i > 1 ? "border-t md:border-t-0" : ""}`}
            >
              <p className="font-mono text-4xl tracking-tighter text-bone md:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-muted">{t(`proof.${s.key}`)}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Instructor: full-bleed portrait beside editorial copy. */}
      <section className="py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="https://picsum.photos/seed/amira-bechini-portrait-studio/1200/1600"
                alt={t("instructor.portrait")}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <Reveal>
              <h2 className={sectionTitle}>{t("instructor.title")}</h2>
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
            {steps.map((k, i) => (
              <Reveal
                key={k}
                delay={i * 0.06}
                className={`py-8 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <h3 className="text-2xl font-medium tracking-tight text-bone md:text-3xl">
                  {t(`method.steps.${k}.title`)}
                </h3>
                <p className="mt-4 max-w-[54ch] leading-relaxed text-muted">
                  {t(`method.steps.${k}.body`)}
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
            <p className="text-xs tracking-[0.22em] text-accent-hi uppercase">
              {t("catalog.eyebrow")}
            </p>
            <h2 className={`${sectionTitle} mt-5`}>{t("catalog.title")}</h2>
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
        </div>
      </section>

      <Voices />

      {/* Questions: native disclosure, no JS needed. */}
      <section id="faq" className="border-t border-line py-24 md:py-32">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <h2 className={`${sectionTitle} lg:col-span-4`}>{t("faq.title")}</h2>
          <div className="lg:col-span-7 lg:col-start-6">
            {faqKeys.map((k, i) => (
              <details
                key={k}
                className={`group py-6 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg tracking-tight text-bone marker:hidden md:text-xl">
                  {t(`faq.items.${k}.q`)}
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[62ch] leading-relaxed text-muted">
                  {t(`faq.items.${k}.a`)}
                </p>
              </details>
            ))}
          </div>
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
          className={`font-medium tracking-tight text-bone ${big ? "text-3xl md:text-4xl" : "text-2xl"}`}
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
