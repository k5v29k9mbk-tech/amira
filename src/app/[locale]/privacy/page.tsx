import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { studio } from "@/lib/studio";
import {
  arrow,
  bodyBase,
  bodyLede,
  bodyMeta,
  displayPage,
  eyebrow,
  ledeFromTitle,
  linkRule,
  sectionPadBottom,
  shell,
  titleFromLabel,
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
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: altLanguages("/privacy", locale),
    // A privacy notice should be reachable and indexable, but it is not a page
    // the academy competes for: it carries the company's registry details and
    // nothing a visitor searches for. Indexed, never promoted.
    robots: { index: true, follow: true },
  };
}

/**
 * The privacy notice, and the reason it exists at all.
 *
 * The contact form takes a name, an email address, a course and a message and
 * posts them to a route that forwards them to the academy's inbox. That is the
 * processing of personal data by an Italian registered business, so a notice is
 * owed whether or not anyone asks for one, and until now the site collected all
 * four fields and told a visitor nothing about where they went.
 *
 * Every statement on this page is read off what the code actually does rather
 * than off a template. The site sets one cookie, next-intl's language
 * preference; it loads no analytics, no pixel and no third-party script; the
 * only recipients are the host and the mail provider that carries the message.
 * Nothing here claims a certification, a retention schedule in days or a
 * representative the academy has not appointed, because none of those are
 * facts this repository can support.
 *
 * THE ORDER IS THE ORDER A READER ASKS IN, not the order the Regulation lists:
 * who you are, what you took, why, on what basis, who else sees it, for how
 * long, what you set on my machine, what I can do about it, and how to say so.
 *
 * SET AS A DOCUMENT, NOT AS A PAGE. Two columns from lg, the title and the
 * date held in the left one while the notice runs down the right at a 68
 * character measure. It is the same shape as the FAQ, which is the other page
 * on the site that is read rather than looked at.
 */
const sections = [
  "controller",
  "data",
  "purpose",
  "basis",
  "recipients",
  "retention",
  "cookies",
  "rights",
  "contact",
] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <section className={`${sectionPadBottom} bg-ivory pt-[7.5rem] md:pt-36`}>
      <div className={`${shell} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        {/* THE TITLE TRAVELS WITH THE READER.

            The right column is nine paragraphs and about two and a half screens
            of it; the left is a title, a standfirst and a date. Set as an
            ordinary grid cell that column ends after four hundred pixels and
            the rest of the page is a tall band of empty ivory beside the text,
            which on a document this length is most of what is on screen.

            Sticky from lg only. Below it the columns are stacked, so there is
            nothing to stick to and nothing to stick beside. `top-32` clears the
            fixed bar. */}
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <p className={eyebrow}>{t("privacy.eyebrow")}</p>
          <h1 className={`${displayPage} ${titleFromLabel} max-w-[12ch] text-balance`}>
            {t("privacy.title")}
          </h1>
          <p className={`${ledeFromTitle} max-w-[38ch] ${bodyLede} text-mute`}>
            {t("privacy.lede")}
          </p>
          {/* The date is the one piece of furniture a notice needs and the
              first thing a reader checking one looks for, so it is set as a
              filing label rather than buried under the last paragraph. */}
          <p className={`mt-10 ${bodyMeta} text-mute`}>{t("privacy.updated")}</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <dl className="grid gap-12">
            {sections.map((key) => (
              <div key={key}>
                {/* `dt`/`dd` rather than `h2`/`p`: nine headings each owning
                    exactly one paragraph is a description list, and it gives a
                    screen reader the pairing for free. The heading is still a
                    heading to assistive technology by role, so the page keeps a
                    navigable outline. */}
                <dt
                  role="heading"
                  aria-level={2}
                  className="display text-[1.25rem] md:text-[1.5rem]"
                >
                  {t(`privacy.sections.${key}.title`)}
                </dt>
                <dd className={`mt-4 max-w-[68ch] ${bodyBase} text-mute`}>
                  {t(`privacy.sections.${key}.body`)}
                  {/* The certified mailbox is the address a rights request
                      actually has to go to, so the closing section prints it
                      rather than pointing at the footer. `dir="ltr"` because an
                      email address is left-to-right content on the Arabic
                      route, and the label says what kind of mailbox it is: a
                      PEC is a legal channel, not a customer service inbox. */}
                  {key === "contact" && (
                    <span className="mt-4 block">
                      <a
                        href={`mailto:${studio.pec}`}
                        className="text-espresso underline decoration-bronze/50 underline-offset-4 transition-colors duration-300 hover:decoration-bronze"
                      >
                        <span dir="ltr">{studio.pec}</span>
                      </a>
                      <span className={`mt-1 block ${bodyMeta} text-mute`}>
                        {t("contact.pecLabel")}
                      </span>
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* One way off the page, and it is the conversation rather than the
              home page: a reader who has just checked what happens to her
              details is deciding whether to send them. */}
          <Link href="/contact" className={`${linkRule} mt-14`}>
            {t("cta.info")}
            <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
          </Link>
        </div>
      </div>
    </section>
  );
}
