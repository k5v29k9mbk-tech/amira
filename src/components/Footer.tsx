import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { instagramLink, studio, whatsappLink } from "@/lib/studio";
import { label, shell } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Wordmark } from "./Wordmark";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className={`${shell} grid gap-12 py-16 md:grid-cols-12 md:py-20`}>
        <div className="md:col-span-5">
          <Wordmark />
          <p className="display mt-7 max-w-[30ch] text-2xl leading-snug text-bone">
            {t("footer.tagline")}
          </p>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium tracking-[0.2em] text-accent-hi uppercase">
            {t("footer.locations")}
          </p>
        </div>

        <nav className="md:col-span-3">
          <h2 className={label}>{t("footer.explore")}</h2>
          <ul className="mt-4 grid gap-2.5">
            {courses.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/courses/${c.slug}`}
                  className="text-sm text-bone transition-colors hover:text-accent-hi"
                >
                  {t(`catalog.${c.slug}.title` as never)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className={label}>{t("footer.studio")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-bone">
            <li>
              <a href={`mailto:${studio.email}`} className="hover:text-accent-hi">
                {studio.email}
              </a>
            </li>
            <li>
              <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="hover:text-accent-hi">
                <span dir="ltr">{studio.phone}</span>
              </a>
            </li>
            <li className="flex flex-wrap gap-x-4 gap-y-1">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-hi"
              >
                {t("contact.whatsapp")}
              </a>
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-hi"
              >
                {t("contact.instagram")}
              </a>
            </li>
            <li className="text-muted">{t("footer.locations")}</li>
            <li>
              <Link href="/#faq" className="hover:text-accent-hi">
                {t("nav.faq")}
              </Link>
            </li>
          </ul>
          <LocaleSwitcher className="mt-6" />
        </div>
      </div>

      <div className={`${shell} flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between`}>
        <p>
          {year} Amira Bechini. {t("footer.rights")}
        </p>
        <p>{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
