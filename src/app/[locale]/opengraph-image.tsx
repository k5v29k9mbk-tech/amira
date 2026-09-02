import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { academy, brand } from "@/lib/studio";
import { isRtl, routing } from "@/i18n/routing";
import { pageText } from "@/lib/content/server";

// Without this the card is generated on demand, once per crawler that asks,
// on a route whose entire input is the locale. Four of them, at build time.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = brand.full;

/**
 * The card ground is ivory, so it takes the espresso cut of the logo rather
 * than the gold one. `next/og` cannot fetch a relative path, so the plate is
 * inlined as a data URI, read once per server process.
 */
const LOGO = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/brand/aura-logo-dark.png"),
).toString("base64")}`;

/**
 * The card's two faces, read once per server process like the logo above.
 *
 * satori rasterises with the fonts it is handed and nothing else: without
 * these files the tagline printed in a bundled grotesque, and the Arabic card
 * could carry no sentence at all (the fallback face failed in the font parser
 * before it ever failed to shape). Static instances committed under
 * assets/fonts — variable fonts are the one thing satori's parser still
 * refuses. Both are listed under `fonts` below; satori picks per glyph, so a
 * Latin brand name inside an Arabic sentence takes the Cormorant cut.
 *
 * The Arabic face is Markazi Text, not the site's Noto Naskh, and that is
 * satori again: Noto Naskh Arabic — and Amiri, Lateef and Scheherazade with
 * it — hits the same `lookupType: 5 - substFormat: 3` parser wall the old
 * comment recorded, at every weight. Markazi is the most naskh-flavoured face
 * whose tables satori actually parses (tested against El Messiri, IBM Plex
 * Sans Arabic and Tajawal, which also pass but read geometric). Card only;
 * the site keeps Noto Naskh.
 */
const CORMORANT = readFileSync(
  join(process.cwd(), "assets/fonts/CormorantGaramond-Medium.ttf"),
);
const NASKH = readFileSync(join(process.cwd(), "assets/fonts/MarkaziText-Medium.ttf"));

// ponytail: generated at build time from the same assets as the site, so the
// share card never drifts from the brand. No design file to keep in sync.
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await pageText("common", "meta", locale);
  const rtl = isRtl(locale);

  /**
   * Arabic takes no-break spaces, and it is a satori workaround rather than
   * typography: satori lays RTL words out with grossly stretched gaps (a
   * known quirk of its word segmentation), and joining the words with U+00A0
   * is the one input that makes it set the line at natural spacing. The cost
   * is that an NBSP line cannot wrap, so the Arabic tagline must stay short
   * enough for one line at this size — at 54px the current sentence uses
   * about 780 of the 1048px the padding leaves. If a longer tagline ever
   * lands, drop the size rather than restoring the spaces.
   */
  const tagline = rtl ? t("tagline").replaceAll(" ", " ") : t("tagline");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f2eee7",
          color: "#211916",
          padding: 76,
          fontFamily: "'Cormorant Garamond', 'Markazi Text'",
        }}
      >
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={152} height={180} alt="" />
        </div>

        {/* The display setting, restored now the route has real faces: the
            brand's one editorial line at headline size in the site's own
            serif, or in Naskh on the ar card, where the tighter leading the
            Latin line takes would clip the ascenders — the same split the
            stylesheet makes for `[lang="ar"] .display`. The sentence keeps
            the text direction of its language, and on the ar card it starts
            from the right edge, where an Arabic reader starts. */}
        {/* The Arabic line is right-anchored the hard way, and every part of
            this is a satori finding rather than a preference. A text box in
            the column above stretches to the card's width and satori draws a
            shaped RTL run from the box's LEFT edge regardless of direction,
            textAlign, justifyContent, alignSelf or a flex-grow sibling — all
            five were tried against the rendered PNG. The one thing that moves
            it is the box itself: an explicit width small enough to shrink it,
            pushed right by an auto margin. The 790 must stay at or above the
            line's rendered width (~760px at 54px for the current tagline, and
            an NBSP line cannot wrap) — if the Arabic tagline is ever edited,
            re-render /ar/opengraph-image and re-measure before shipping. */}
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              fontSize: rtl ? 54 : 58,
              lineHeight: rtl ? 1.45 : 1.15,
              ...(rtl ? { marginLeft: "auto", width: 790 } : { maxWidth: 980 }),
              direction: rtl ? "rtl" : "ltr",
              textAlign: rtl ? "right" : "left",
            }}
          >
            {tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", height: 3, width: 140, background: "#98715a" }} />
          <div style={{ display: "flex", letterSpacing: 6, fontSize: 15, color: "#6e5d52" }}>
            {`${academy.city.toUpperCase()} (${academy.province})`}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: CORMORANT, weight: 500, style: "normal" },
        { name: "Markazi Text", data: NASKH, weight: 500, style: "normal" },
      ],
    },
  );
}
