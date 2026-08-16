import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";
import { arrow, btnSolid, displaySection, eyebrow, linkRule, shell } from "@/lib/ui";

/**
 * The page a broken link lands on.
 *
 * It used to be the figure 404 in bronze and a button, on an empty field: the
 * one screen on the site that looked like a framework default. A dead link is
 * usually somebody's first arrival, from a search result that has gone stale or
 * a link copied wrong, so it is worth the same care as any other opening.
 *
 * It is set as a page header rather than as an error: the mark, the number as a
 * small caps filing label, one sentence saying what happened, and the two ways
 * on that the rest of the site is built around. Nothing here is invented, and
 * nothing apologises at length.
 */
export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="bg-ivory">
      <div
        className={`${shell} flex min-h-[78dvh] flex-col justify-center pt-[7.5rem] pb-24 md:pt-40`}
      >
        <Logo variant="mark" tone="dark" className="h-12 w-auto md:h-14" sizes="120px" />

        <p className={`${eyebrow} mt-12 font-mono`}>404</p>
        <h1 className={`${displaySection} mt-6 max-w-[14ch] text-balance`}>
          {t("notFound.title")}
        </h1>
        <p className="mt-8 max-w-[48ch] text-[17px] leading-relaxed text-mute">
          {t("notFound.body")}
        </p>

        <div className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <Link href="/" className={btnSolid}>
            {t("nav.home")}
          </Link>
          <Link href="/courses" className={linkRule}>
            {t("cta.courses")}
            <ArrowRight size={14} weight="light" className={`flip-x ${arrow}`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
