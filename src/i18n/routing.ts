import { defineRouting } from "next-intl/routing";

export const locales = ["en", "it", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
});

export const isRtl = (locale: string) => locale === "ar";
