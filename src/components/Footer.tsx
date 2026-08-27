import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import {
  addressLine,
  instagramLink,
  legal,
  studio,
  tiktokLink,
  whatsappLinkWith,
} from "@/lib/studio";
import { shell } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

/**
 * Near black, so the page ends on the same ground the closing frame sits on.
 *
 * Three columns and a line of legal text. The VAT and REA numbers are not
 * decoration: an Italian registered business has to publish them, which is why
 * they are here rather than on a page nobody opens.
 */
export async function Footer() {
  const t = await getTranslations();
  const whatsappHref = whatsappLinkWith(t("contact.whatsappMessage"));
  const year = new Date().getFullYear();
  const link = "text-[15px] text-mute-dark transition-colors duration-300 hover:text-ivory";

  return (
    <footer className="no-print bg-night text-ivory">
      <div
        className={`${shell} grid gap-14 pt-20 pb-[calc(5rem+env(safe-area-inset-bottom))] md:grid-cols-12 md:gap-10 md:pt-24 md:pb-24`}
      >
        <div className="md:col-span-4">
          {/* The monogram here too. The full plate is reserved for the two
              moments that are only the brand: the opening film and the wait
              between routes. */}
          <Logo variant="mark" tone="gold" className="h-14 w-auto" sizes="120px" />
          <p className="mt-8 max-w-[30ch] text-[15px] leading-relaxed text-mute-dark">
            {t("footer.tagline")}
          </p>
        </div>

        <nav aria-label={t("footer.explore")} className="md:col-span-3">
          <h2 className="label text-mute-dark">{t("footer.explore")}</h2>
          <ul className="mt-6 grid gap-3">
            {courses.map((c) => (
              <li key={c.slug}>
                {/* Each discipline's own page, not an anchor on the index.
                    The footer carries all six on every route, so these are the
                    site's most repeated internal links and the ones a crawler
                    follows most often: pointing them at six real pages rather
                    than six fragments of one is most of what makes the new
                    routes findable. */}
                <Link href={`/courses/${c.slug}`} className={link}>
                  {t(`catalog.courses.${c.slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("footer.studio")} className="md:col-span-2">
          <h2 className="label text-mute-dark">{t("footer.studio")}</h2>
          <ul className="mt-6 grid gap-3">
            <li>
              <Link href="/about" className={link}>
                {t("nav.about")}
              </Link>
            </li>
            {/* The results, from every page. The bar has no room for a fifth
                item at 1024px, so this and the phone menu are how a reader who
                is not on the homepage reaches the work. */}
            <li>
              <Link href="/#work" className={link}>
                {t("nav.work")}
              </Link>
            </li>
            <li>
              <Link href="/faq" className={link}>
                {t("nav.faq")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={link}>
                {t("nav.contact")}
              </Link>
            </li>
            {whatsappHref && (
              <li>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className={link}>
                  {t("contact.whatsapp")}
                </a>
              </li>
            )}
            <li>
              <a href={instagramLink} target="_blank" rel="noreferrer" className={link}>
                {t("contact.instagram")}
              </a>
            </li>
            <li>
              <a href={tiktokLink} target="_blank" rel="noreferrer" className={link}>
                {t("contact.tiktok")}
              </a>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="label text-mute-dark">{t("footer.legal")}</h2>
          <ul className="mt-6 grid gap-3 text-[15px] text-mute-dark">
            <li className="text-ivory">{legal.company}</li>
            <li>{addressLine}</li>
            <li>
              {t("footer.vat")} <span dir="ltr">{legal.vat}</span> · REA{" "}
              <span dir="ltr">{legal.rea}</span>
            </li>
            <li>
              <a href={`mailto:${studio.pec}`} className={link}>
                <span dir="ltr">{studio.pec}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`${shell} flex flex-col gap-4 border-t border-hair-dark py-7 text-[13px] text-mute-dark sm:flex-row sm:items-center sm:justify-between`}
      >
        <p>
          {year} {legal.company}. {t("footer.rights")}
        </p>
        <LocaleSwitcher tone="light" />
      </div>
    </footer>
  );
}
