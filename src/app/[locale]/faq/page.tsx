import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Faq } from "@/components/Faq";
import { arrow, displaySection, linkRule, shell } from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";
import { JsonLd, faqSchema } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altLanguages("/faq", locale),
  };
}

/**
 * Every question the academy answers, in the order a visitor meets them. The
 * homepage carries six of these; this page carries all of them, which is also
 * why the full FAQ structured data lives here rather than there.
 */
const allFaq = [
  "courses",
  "beginners",
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

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <JsonLd
        data={faqSchema(
          allFaq.map((k) => ({ q: t(`faq.items.${k}.q`), a: t(`faq.items.${k}.a`) })),
        )}
      />

      <section className="bg-ivory pt-[7.5rem] pb-24 md:pt-40 md:pb-36 lg:pb-52">
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <h1 className={`${displaySection} max-w-[10ch]`}>{t("faq.title")}</h1>
            <p className="mt-8 max-w-[36ch] text-[16px] leading-relaxed text-mute">
              {t("faq.more")}
            </p>
            <Link href="/contact" className={`${linkRule} mt-8`}>
              {t("cta.availability")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={allFaq} />

            {/* The way on, at the bottom of the column the reader is actually
                in. The same offer sits in the left column, which is a screen
                and a half above by the eleventh question and has scrolled out
                of the page long before anyone gets there. */}
            <Link href="/contact" className={`${linkRule} mt-12`}>
              {t("cta.availability")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
