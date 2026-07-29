import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Jost, Noto_Naskh_Arabic } from "next/font/google";
import { routing, isRtl, siteUrl } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd, organizationSchema } from "@/lib/seo";
import "../globals.css";

// Two faces and nothing else: an editorial serif for everything oversized, a
// neutral geometric sans for interface text. Cormorant carries the light weight
// the display sizes need without the brittleness of a true Didone. Arabic gets
// a Naskh face that sits with the serif; the script face the previous design
// used for accents is gone, along with its request.
const display = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
});

/** Namespaces read by `"use client"` components. Keep in sync with them. */
const CLIENT_NAMESPACES = [
  "nav", // Header, LocaleSwitcher
  "hero", // Header booking action
  "manifesto", // Manifesto
  "catalog", // CourseSelector
  "method", // MethodStory
  "voices", // Testimonial
  "mentor", // WelcomeVideo
  "success", // BeforeAfter
  "contact", // ContactForm
] as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${t("title")} | ${t("tagline")}`, template: `%s | ${t("title")}` },
    description: t("description"),
    openGraph: {
      title: `${t("title")} | ${t("tagline")}`,
      description: t("description"),
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const org = await getTranslations({ locale, namespace: "meta" });

  /**
   * Only the namespaces client components actually read. Left to itself,
   * NextIntlClientProvider serialises the whole catalogue into the HTML, so
   * every visitor was downloading all 21 lesson titles, the full syllabus and
   * every FAQ answer to render a page that shows none of them.
   *
   * If a client component starts using a new namespace, add it here or it will
   * throw MISSING_MESSAGE at runtime.
   */
  const all = await getMessages();
  const clientMessages = Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in all).map((ns) => [ns, all[ns]]),
  );

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${display.variable} ${body.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="grain font-sans antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          <a
            href="#main"
            className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-espresso focus:px-4 focus:py-3 focus:text-ivory"
          >
            {locale === "ar" ? "تخطي إلى المحتوى" : "Skip to content"}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <JsonLd data={organizationSchema(locale, org("title"), org("description"))} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
