"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

/** Two letters, not a flag and not a boxed control. */
const short: Record<string, string> = { en: "EN", it: "IT", fr: "FR", ar: "AR" };
const full: Record<string, string> = {
  en: "English",
  it: "Italiano",
  fr: "Français",
  ar: "العربية",
};

export function LocaleSwitcher({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t("language")}</span>
      {/*
        A native select rather than a custom menu: keyboard and screen reader
        correct for free, and on a phone it opens the platform picker. The
        visible text is the two-letter code, the options carry the language
        name. min-h-11 keeps it a 44px tap target.
      */}
      <select
        value={locale}
        disabled={pending}
        onChange={(e) =>
          startTransition(() => {
            router.replace(
              // @ts-expect-error dynamic params are passed through unchanged
              { pathname, params },
              { locale: e.target.value },
            );
          })
        }
        className={`label min-h-11 cursor-pointer appearance-none border-0 bg-transparent ps-0 pe-4 transition-opacity duration-300 hover:opacity-100 focus:outline-none ${
          tone === "light" ? "text-ivory opacity-80" : "text-espresso opacity-70"
        }`}
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-ivory text-espresso">
            {short[l]} {full[l]}
          </option>
        ))}
      </select>
      <span aria-hidden className="pointer-events-none absolute end-0 text-[9px] opacity-60">
        ▾
      </span>
    </label>
  );
}
