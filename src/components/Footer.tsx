import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import {
  academy,
  addressLine,
  instagramLink,
  legal,
  studio,
  tiktokLink,
  whatsappLink,
} from "@/lib/studio";
import { label, shell } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Wordmark } from "./Wordmark";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className={`${shell} grid gap-12 py-16 md:grid-cols-12 md:py-20`}>
        <div className="md:col-span-4">
          <Wordmark />
          <p className="display mt-7 max-w-[32ch] text-2xl leading-snug text-bone">
            {t("footer.tagline")}
          </p>
          <p className="mt-6 text-[11px] font-medium tracking-[0.2em] text-accent-hi uppercase">
            {academy.city} ({academy.province}) · Italia
          </p>
        </div>

        <nav className="md:col-span-3">
          <h2 className={label}>{t("footer.explore")}</h2>
          <ul className="mt-4 grid gap-2.5">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/courses#${c.slug}`}
                  className="text-sm text-bone transition-colors hover:text-accent-hi"
                >
                  {t(`catalog.courses.${c.slug}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className={label}>{t("footer.studio")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-bone">
            <li className="text-muted">{addressLine}</li>
            {whatsappLink && (
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-hi"
                >
                  {t("contact.whatsapp")}
                </a>
              </li>
            )}
            <li>
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-hi"
              >
                {t("contact.instagram")}
              </a>
            </li>
            <li>
              <a
                href={tiktokLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-hi"
              >
                {t("contact.tiktok")}
              </a>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-accent-hi">
                {t("nav.faq")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Company details. Italian law requires VAT number and REA on the site
            of a registered business; they belong here rather than in a page
            nobody opens. */}
        <div className="md:col-span-3">
          <h2 className={label}>{t("footer.legal")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-muted">
            <li className="text-bone">{legal.company}</li>
            <li>{t("footer.activity")}</li>
            <li>
              {t("footer.vat")} <span dir="ltr">{legal.vat}</span>
            </li>
            <li>
              {t("footer.rea")} <span dir="ltr">{legal.rea}</span>
            </li>
            <li>
              <a href={`mailto:${studio.pec}`} className="hover:text-accent-hi">
                <span dir="ltr">{studio.pec}</span>
              </a>
            </li>
          </ul>
          <LocaleSwitcher className="mt-6" />
        </div>
      </div>

      <div
        className={`${shell} flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between`}
      >
        <p>
          {year} {legal.company}. {t("footer.rights")}
        </p>
        <p dir="ltr">
          {t("footer.vat")} {legal.vat} · REA {legal.rea}
        </p>
      </div>
    </footer>
  );
}
