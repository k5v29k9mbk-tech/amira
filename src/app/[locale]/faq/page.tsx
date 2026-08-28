import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Faq } from "@/components/Faq";
import {
  arrow,
  bodyBase,
  btnSolid,
  displayPage,
  ledeFromTitle,
  linkRule,
  sectionPadBottom,
  shell,
} from "@/lib/ui";
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

      {/* The head is `pageHeader`'s, the tail is the site's standard section
          measure. It used to be `pb-24 md:pb-36 lg:pb-52`: 96, 144 and 208
          pixels, against the 64, 80 and 112 every other section on the site
          closes on. 208 is the measure `lib/ui.ts` records as having been tried
          across the whole site and pulled back for reading as the page having
          ended rather than as air, and this page was the one place it was left
          standing. On a phone it put 96px of nothing between the last answer
          and the footer. */}
      <section className={`${sectionPadBottom} bg-ivory pt-[7.5rem] md:pt-36`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-4">
            <h1 className={`${displayPage} max-w-[10ch]`}>{t("faq.title")}</h1>
            <p className={`${ledeFromTitle} max-w-[36ch] ${bodyBase} text-mute`}>
              {t("faq.more")}
            </p>
            <Link href="/contact" className={`${linkRule} mt-8`}>
              {t("cta.info")}
              <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
            </Link>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={allFaq} />

            {/* THE PAGE'S PRIMARY ACTION, AND IT DID NOT HAVE ONE.
                Both ways off this page were the same tertiary text link with
                the same label, one in the left column and one here, so a reader
                who had just read eleven answers and decided was offered the
                quietest shape the system owns and offered it twice. The link
                above stays as it is: it is the in-context offer, beside the
                sentence that makes it, for someone who is not going to read the
                questions at all.

                This one is the button, and it asks for the booking rather than
                for information, because a reader at the foot of the FAQ has had
                her questions answered and the next honest step is the
                conversation. It is the same shape and the same label every
                other page closes on. */}
            <Link href="/contact" className={`${btnSolid} mt-14`}>
              {t("cta.consultation")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
