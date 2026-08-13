import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  FacebookLogo,
  InstagramLogo,
  ShieldCheck,
  TiktokLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import {
  academy,
  addressLine,
  instagramLink,
  mapsLink,
  studio,
  tiktokLink,
  whatsappLinkWith,
} from "@/lib/studio";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import {
  displayRow,
  displaySection,
  eyebrow,
  pageHeader,
  sectionPad,
  shell,
} from "@/lib/ui";
import { altLanguages, routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altLanguages("/contact"),
  };
}

/**
 * The enquiry journey: the form, the two channels the academy actually
 * publishes, where it is, and what happens after you write. The booking
 * sequence lives here rather than on the homepage because it only matters once
 * someone has decided to get in touch.
 */
const journey = ["contact", "deposit", "training", "certificate", "support"] as const;

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));
  const row = "flex items-center gap-4 text-[16px] transition-colors hover:text-bronze-ink";

  return (
    <>
      <section className={`${pageHeader} bg-ivory`}>
        <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-5">
            <h1 className={`${displaySection} max-w-[12ch]`}>{t("contact.title")}</h1>
            <p className="mt-8 max-w-[40ch] text-[17px] leading-relaxed text-mute">
              {t("contact.sub")}
            </p>

            <div className="mt-14 border-t border-hair pt-8">
              <p className="label text-mute">{t("contact.venue")}</p>
              <a href={mapsLink} target="_blank" rel="noreferrer" className="group mt-5 block">
                <span className="display block text-[clamp(1.25rem,2vw,1.75rem)]">
                  {academy.street}
                </span>
                <span className="mt-2 block text-[16px] text-mute">
                  {academy.postcode} {academy.city} ({academy.province})
                </span>
                <span className="label mt-4 block text-bronze-ink">{t("contact.map")}</span>
              </a>
              <p className="sr-only">{addressLine}</p>
            </div>

            <div className="mt-10 border-t border-hair pt-8">
              <p className="label text-mute">{t("contact.channels")}</p>
              <ul className="mt-5 grid gap-4">
                {/* Rendered only when the academy has supplied a number, so the
                    site never links to a guessed one. */}
                {whatsappHref && (
                  <li>
                    <a href={whatsappHref} target="_blank" rel="noreferrer" className={row}>
                      <WhatsappLogo size={18} weight="light" className="text-bronze" />
                      {t("contact.whatsapp")}
                    </a>
                  </li>
                )}
                <li>
                  <a href={instagramLink} target="_blank" rel="noreferrer" className={row}>
                    <InstagramLogo size={18} weight="light" className="text-bronze" />
                    <span dir="ltr">@{studio.instagram}</span>
                  </a>
                </li>
                <li>
                  <a href={tiktokLink} target="_blank" rel="noreferrer" className={row}>
                    <TiktokLogo size={18} weight="light" className="text-bronze" />
                    <span dir="ltr">@{studio.tiktok}</span>
                  </a>
                </li>
                {/* Text, not a link: the academy gave a page name, not a URL. */}
                <li className={row}>
                  <FacebookLogo size={18} weight="light" className="text-bronze" />
                  {studio.facebook}
                </li>
                <li>
                  <a href={`mailto:${studio.pec}`} className={row}>
                    <ShieldCheck size={18} weight="light" className="text-bronze" />
                    <span dir="ltr">{studio.pec}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* What happens after you write, in the order it happens. */}
      <section className={`${sectionPad} bg-paper`}>
        <div className={shell}>
          <Reveal className="max-w-[20ch]">
            <p className={eyebrow}>{t("journey.eyebrow")}</p>
            <h2 className={`${displaySection} mt-8`}>{t("journey.title")}</h2>
            <p className="mt-8 max-w-[44ch] text-[16px] leading-relaxed text-mute">
              {t("journey.sub")}
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-px border-t border-hair md:mt-20">
            {journey.map((k, i) => (
              <Reveal
                as="li"
                key={k}
                delay={(i % 3) * 0.06}
                className="grid gap-3 border-b border-hair py-8 md:grid-cols-12 md:gap-10"
              >
                <span className="label font-mono text-bronze-ink md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${displayRow} md:col-span-4`}>
                  {t(`journey.steps.${k}.title`)}
                </h3>
                <p className="max-w-[52ch] text-[16px] leading-relaxed text-mute md:col-span-6 md:col-start-7">
                  {t(`journey.steps.${k}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>

          <p className="mt-10 text-[15px] text-mute">{t("catalog.payments")}</p>
        </div>
      </section>
    </>
  );
}
