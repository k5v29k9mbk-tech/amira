"use client";

import { useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

/**
 * Route-level loading state. A blank frame between pages is the cheapest thing
 * a site can look like, so the full logo holds the space on the brand's own
 * ground while the next route streams in. One of the two places the whole plate
 * appears, the opening film being the other.
 *
 * The pulse is the only motion, and it is slow enough to read as breathing
 * rather than as a spinner.
 *
 * A client component, and deliberately. The one word here is announced rather
 * than seen, and it shipped in English on all four language routes. Translating
 * it on the server is not an option: a loading boundary receives no params, so
 * `getTranslations()` would have to read the locale off the request, and that
 * one call turned every page on this site from prerendered HTML into a
 * server-rendered response. The provider is already mounted by the layout above
 * this boundary, so reading the catalogue on the client costs a hook.
 */
export default function Loading() {
  const t = useTranslations("nav");

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70dvh] items-center justify-center bg-ivory px-6"
    >
      <Logo
        variant="lockup"
        tone="dark"
        className="h-32 w-auto animate-pulse md:h-40"
        sizes="180px"
      />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}
