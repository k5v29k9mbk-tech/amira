import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Amira Bechini";

// ponytail: generated at build time from the same tokens as the site, so the
// share card never drifts from the brand. No design file to keep in sync.
export default async function Image({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0c",
          color: "#efebe3",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", letterSpacing: 8, fontSize: 24, color: "#6fbf99" }}>
          AMIRA BECHINI
        </div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
          {t("tagline")}
        </div>
        <div style={{ display: "flex", height: 4, width: 160, background: "#4f9e7a" }} />
      </div>
    ),
    size,
  );
}
