"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/Logo";
import { arrow, bodyLede, btnSolid, displayPage, eyebrow, ledeFromTitle, linkRule, shell, titleFromLabel } from "@/lib/ui";
import { usePageText } from "@/lib/content/client";

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
 *
 * A CLIENT COMPONENT, FOR THE REASON `loading.tsx` IS ONE, and it is the
 * difference between this page rendering and this page never being seen.
 *
 * It was an async server component whose first line was `getTranslations()`.
 * A not-found boundary, exactly like a loading boundary, is handed no params:
 * there is no `locale` to pass and nothing calls `setRequestLocale` on the way
 * in, so that call had no locale to resolve against. Under a segment that is
 * statically generated the render did not fail loudly either. It stalled inside
 * the Suspense boundary `loading.tsx` creates, the server logged
 * `Internal: NoFallbackError`, and what a visitor got was the pulsing logo,
 * indefinitely, under a 200.
 *
 * That was true of every `notFound()` on the site, not only of unmatched URLs:
 * an unknown course slug reached the same dead end. The custom 404 had never
 * rendered anywhere.
 *
 * `NextIntlClientProvider` is mounted in the locale layout, above this
 * boundary, so reading the catalogue on the client costs a hook and needs no
 * locale on the request. The icon import moves off `/dist/ssr` for the same
 * reason: that entry point is the server-only build.
 */
export default function NotFound() {
  const t = usePageText("common");

  return (
    <div className="bg-ivory">
      <div
        className={`${shell} flex min-h-[78dvh] flex-col justify-center pt-[7.5rem] pb-24 md:pt-40`}
      >
        {/* `self-start` because the column is a flex container: a flex item
            stretches on the cross axis by default, and the mark was being
            pulled to the full width of the page as a several-hundred-pixel
            smear across the top of the screen. `w-auto` cannot prevent it,
            since the stretch is the alignment rather than the width. Every
            other child here escapes it only by carrying a max-width. */}
        <Logo
          variant="mark"
          tone="dark"
          className="h-12 w-auto self-start md:h-14"
          sizes="120px"
        />

        <p className={`${eyebrow} mt-12 font-mono`}>404</p>
        <h1 className={`${displayPage} ${titleFromLabel} max-w-[14ch] text-balance`}>
          {t("notFound.title")}
        </h1>
        <p className={`${ledeFromTitle} max-w-[48ch] ${bodyLede} text-mute`}>
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
