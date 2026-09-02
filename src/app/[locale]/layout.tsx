import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Jost, Noto_Naskh_Arabic } from "next/font/google";
import { routing, isRtl, siteUrl, altLanguages } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCta } from "@/components/StickyCta";
import { IntroVideo } from "@/components/IntroVideo";
import { MotionProvider } from "@/components/MotionProvider";
import { INTRO_BOOTSTRAP } from "@/lib/intro";
import { introFilmReady } from "@/lib/intro-film";
import { JsonLd, organizationSchema } from "@/lib/seo";
import { brand } from "@/lib/studio";
import "../globals.css";
import { pageText } from "@/lib/content/server";
import { getContent } from "@/lib/content/get";
import { ContentProvider } from "@/lib/content/client";

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


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The ivory ground, so a phone's status bar and the browser chrome carry the
 * page's colour rather than a default white band above a warm field. Set here
 * rather than per route because every route on the site opens on ivory.
 */
export const viewport: Viewport = {
  themeColor: "#f2eee7",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await pageText("common", "meta", locale);
  const title = `${t("title")} | ${t("tagline")}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${t("title")}` },
    description: t("description"),
    applicationName: brand.short,
    // The pages carry their own; this is the fallback for anything that does
    // not, and it is what stops four language variants of one page reading as
    // four unrelated documents.
    alternates: altLanguages("", locale),
    openGraph: {
      title,
      description: t("description"),
      siteName: brand.full,
      locale,
      type: "website",
    },
    // Same card, stated the way X reads it. Without this the share falls back
    // to a bare link with no image on the one network that will not infer it
    // from the OpenGraph block.
    twitter: {
      card: "summary_large_image",
      title,
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    // An Italian address and a VAT number in the footer are exactly the shapes
    // iOS turns into blue telephone links inside a near-black legal column.
    formatDetection: { telephone: false, address: false, email: false },
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
  const org = await pageText("common", "meta", locale);
  const nav = await pageText("common", "nav", locale);

  /**
   * Only the groups client components actually read.
   *
   * The chrome -- header, locale switcher, sticky call to action, intro
   * overlay, and the 404 body -- reads `common`, and the sticky bar also reads
   * the contact details. Those two groups are serialised into the HTML for the
   * client; the other five never leave the server.
   *
   * This replaces the namespace allowlist that used to feed
   * NextIntlClientProvider, and for the same reason it existed: left to itself
   * that provider shipped the whole catalogue, so every visitor downloaded all
   * 21 lesson titles, the full syllabus and every FAQ answer to render a page
   * that shows none of them.
   */
  const [common, contact] = await Promise.all([
    getContent("common", locale),
    getContent("contact", locale),
  ]);

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${display.variable} ${body.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <body className="grain font-sans antialiased">
        {/*
          Opening sequence, in two halves, and only when there is a film.

          The script runs during HTML parse and decides, before anything
          paints, whether the intro is due: it checks the route, the session
          flag, prefers-reduced-motion and the ?intro=1 override, and marks
          <html data-intro-pending>. The shield below is what that attribute
          shows, so a first visit paints black rather than flashing the
          homepage. IntroVideo mounts on top of it.

          What none of that could check is whether the film exists, which is
          what `introFilmReady` reads off the disk on the server. Without the
          guard the whole apparatus runs against three missing files and the
          site opens on a black screen it then has to recover from. With it,
          nothing about the intro reaches the browser until the film does: no
          script, no shield, no scroll lock, and the hero's entrance is
          released on the first frame rather than waiting for a cue that is
          never coming.
        */}
        {introFilmReady ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
            <div className="intro-shield" aria-hidden />
          </>
        ) : null}

        {/* MotionProvider wraps everything that moves, which is the header, the
            intro overlay, every page and the footer. It carries the site's whole
            reduced-motion policy; see the note in the component. */}
        <NextIntlClientProvider locale={locale}>
          <ContentProvider value={{ common, contact }}>
          <MotionProvider>
          {introFilmReady ? <IntroVideo /> : null}
          {/* Four languages, four skip links. This was English for everyone
              except Arabic, which is the one string on the site a keyboard
              user meets first and the only one that was never translated. */}
          <a
            href="#main"
            className="label sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[70] focus:bg-espresso focus:px-4 focus:py-3 focus:text-ivory"
          >
            {nav("skip")}
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <StickyCta />
          <JsonLd data={organizationSchema(locale, org("title"), org("description"))} />
          </MotionProvider>
          </ContentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
