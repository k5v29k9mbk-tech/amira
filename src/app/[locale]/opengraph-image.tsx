import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { academy, brand } from "@/lib/studio";
import { isRtl, routing } from "@/i18n/routing";

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

// ponytail: generated at build time from the same assets as the site, so the
// share card never drifts from the brand. No design file to keep in sync.
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  /**
   * The Arabic card carries no sentence, and this is a limitation rather than
   * a decision.
   *
   * `next/og` rasterises with satori, which shapes text with the fonts it is
   * handed and falls back to a bundled Latin face otherwise. Handed the Arabic
   * tagline it fails outright, in the font parser, on a substitution table it
   * does not implement: `lookupType: 5 - substFormat: 3 is not yet supported`.
   * That was already true before this route was prerendered; it simply failed
   * once per crawler instead of once at build, so nobody saw it. Now the build
   * would stop, which is the correct place for it to be visible.
   *
   * What survives is the brand plate and the town, both of which render
   * identically in every language, so an Arabic share is a card rather than an
   * error. To give it the sentence back, add a Naskh font file to the
   * repository and pass it to `ImageResponse` under `fonts`. That is a real
   * asset the academy does not currently ship, and downloading one at build
   * time would make every build depend on a network call.
   */
  const canSetTagline = !isRtl(locale);

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
          fontFamily: "serif",
        }}
      >
        {/* The lockup already sets the name twice. Printing it again beside it
            would be the same words three times on one card. It takes the space
            the sentence would have had when there is no sentence. */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            width={canSetTagline ? 152 : 236}
            height={canSetTagline ? 180 : 280}
            alt=""
          />
        </div>

        {/* Wide-tracked capitals rather than the 58px setting this used to
            carry. satori rasterises with the faces it is handed and this route
            hands it none, so `font-family: serif` resolves to its bundled
            sans: the card was printing the brand's one editorial line in a
            neutral grotesque at headline size, which is the single most
            off-brand surface the site had. At label size, spaced, the same
            fallback face reads as the small caps the rest of the site sets its
            labels in, and the card stops pretending to a serif it has not got.
            Give this route a Cormorant file and the display setting is worth
            restoring. */}
        {canSetTagline ? (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 3.5,
              lineHeight: 1.6,
              textTransform: "uppercase",
              maxWidth: 900,
            }}
          >
            {t("tagline")}
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", height: 3, width: 140, background: "#98715a" }} />
          <div style={{ display: "flex", letterSpacing: 6, fontSize: 15, color: "#6e5d52" }}>
            {`${academy.city.toUpperCase()} (${academy.province})`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
