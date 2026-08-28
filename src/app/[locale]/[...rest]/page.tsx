import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/**
 * THE ROUTE THAT EXISTS SO THE SITE'S OWN 404 IS THE ONE A VISITOR SEES.
 *
 * `[locale]/not-found.tsx` was written, styled and translated, and it was
 * unreachable. A `not-found` file only answers a `notFound()` thrown from
 * inside its own segment; a URL that matches no route at all never enters that
 * segment, so Next fell all the way back to the framework's root boundary and
 * served the black-on-white "404 This page could not be found" the custom page
 * was written to replace. `/it/qualcosa` rendered a Next.js default: no header,
 * no footer, no brand, and not a word of Italian on it.
 *
 * A catch-all is the fix, and it works because Next resolves the more specific
 * segment first: `/it/about` still matches `about/page.tsx`, `/it/courses/lip-
 * blush` still matches the programme route, and only a path nothing else claims
 * arrives here. Throwing from a page inside `[locale]` starts the boundary
 * search inside the locale segment, which is where the designed page lives, so
 * it renders with the layout, the navigation and the footer around it.
 *
 * `setRequestLocale` BEFORE `notFound()`, AND THAT ORDER IS THE WHOLE FIX.
 * Without it the throw still happened and the boundary was still found, but
 * `not-found.tsx` is an async server component whose first act is
 * `getTranslations()`, and with no locale established for the request that call
 * has nothing to resolve against: the render stalled inside the Suspense
 * boundary `loading.tsx` creates, and what a visitor actually got was the
 * loading state, forever, under a 200. The locale has to be set on the request
 * before the throw unwinds into the page that reads it.
 */
export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
