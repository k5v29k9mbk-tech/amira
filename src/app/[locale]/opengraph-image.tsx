import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { academy, brand } from "@/lib/studio";

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
            would be the same words three times on one card. */}
        <div style={{ display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} width={135} height={160} alt="" />
        </div>

        <div style={{ display: "flex", fontSize: 58, lineHeight: 1.1 }}>{t("tagline")}</div>

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
