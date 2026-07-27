import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { courses } from "@/lib/courses";
import { shell } from "@/lib/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-line bg-surface">
      <div className={`${shell} grid gap-12 py-16 md:grid-cols-12 md:py-20`}>
        <div className="md:col-span-5">
          <p className="text-sm font-medium tracking-[0.2em] text-bone uppercase">
            Amira Bechini
          </p>
          <p className="mt-4 max-w-[34ch] text-lg leading-snug tracking-tight text-muted">
            {t("footer.tagline")}
          </p>
        </div>

        <nav className="md:col-span-3">
          <h2 className="text-xs tracking-wide text-muted">{t("footer.explore")}</h2>
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
          <h2 className="text-xs tracking-wide text-muted">{t("footer.studio")}</h2>
          <ul className="mt-4 grid gap-2.5 text-sm text-bone">
            <li>
              <a href="mailto:studio@amirabechini.com" className="hover:text-accent-hi">
                studio@amirabechini.com
              </a>
            </li>
            <li className="text-muted">{t("footer.address")}</li>
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
