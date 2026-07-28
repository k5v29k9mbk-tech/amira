"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

const names: Record<string, string> = {
  en: "English",
  it: "Italiano",
  fr: "Français",
  ar: "العربية",
};

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">{t("language")}</span>
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
        // min-h-11 = 44px. WCAG 2.5.8 only asks for 24px, but a 32px select is
        // an awkward tap target on a phone.
        className="min-h-11 cursor-pointer appearance-none border border-line bg-transparent py-2 ps-3 pe-8 text-xs tracking-wide text-bone hover:border-accent focus:outline-none"
      >
        {locales.map((l) => (
          <option key={l} value={l} className="bg-surface text-bone">
            {names[l]}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute end-3 text-[10px] text-muted"
      >
        ▼
      </span>
    </label>
  );
}
