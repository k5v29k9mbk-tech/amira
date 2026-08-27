import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
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
  "cta", // Header + StickyCta booking action, CourseSelector course link
  "intro", // IntroVideo skip control
  "manifesto", // Manifesto
  "method", // MethodStory
  "voices", // Testimonial
  "mentor", // WelcomeVideo
  "success", // BeforeAfter
  "work", // WorkGallery
  "contact", // ContactForm
  /**
   * ContactForm, for the subject line only.
   *
   * A visitor who presses "request a seat" on a programme page arrives at
   * /contact with `?course=<slug>`, and the form fills its subject with that
   * discipline's name in the language she is reading. The name is a
   * translation, so the namespace has to reach the client for the form to know
   * it.
   *
   * THE COST, STATED HONESTLY, because this list is the one place on the site
   * where adding a line has a weight. `catalog` is the largest namespace here:
   * six course names, six blurbs, the family headings and the shared
   * conditions, on the order of two kilobytes of JSON per language before
   * compression, and it now ships on every route rather than none. That is
   * paid for one input on one page.
   *
   * It is still the right trade, and the alternatives are worse. Passing the
   * localised name through the query string means reflecting arbitrary text
   * from a URL into a field that is posted to a real inbox, which is exactly
   * the thing the slug is validated to prevent. Reading the parameter on the
   * server makes /contact dynamic at request time, so a static page becomes a
   * render on every visit to save a kilobyte. And splitting the namespace to
   * ship only `catalog.courses` would be a fork of the catalogue maintained by
   * hand.
   *
   * If this list ever needs trimming, this is the first line to look at: the
   * feature it pays for is a convenience, not a function.
   */
  "catalog", // ContactForm subject prefill
] as const;

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
  const t = await getTranslations({ locale, namespace: "meta" });
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
  const org = await getTranslations({ locale, namespace: "meta" });
  const nav = await getTranslations({ locale, namespace: "nav" });

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
        <NextIntlClientProvider messages={clientMessages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
