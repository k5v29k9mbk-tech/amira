import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Noto_Naskh_Arabic } from "next/font/google";
import { adminPage } from "@/lib/admin/ui";
import "../globals.css";

/**
 * The admin's own document.
 *
 * There is no root `app/layout.tsx` on this project: the public site's `<html>`
 * is opened by `app/[locale]/layout.tsx`, which exists to put a language and a
 * direction on the tag. /admin is not localised, so it cannot live under that
 * layout and opens its own document here.
 *
 * `lang="it"` is fixed. The interface is Italian because the academy is; the
 * four languages are the CONTENT being edited, not the language of the tool,
 * and phase 5 puts `dir="rtl"` on the Arabic fields themselves rather than on
 * the page around them.
 */
const display = Cormorant_Garamond({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Loaded here even though no Arabic appears until phase 5's editor, because a
 * font swapping in as somebody switches to the Arabic tab is exactly when a
 * reflow is most disruptive: they are proofreading.
 */
const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Academy — Amministrazione",
  /* A private tool has no business in a search index. */
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable} ${arabic.variable}`}>
      <body className={`${adminPage} font-sans antialiased`}>{children}</body>
    </html>
  );
}
