import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { markDataUri } from "@/lib/mark";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Amira Bechini Masterclass";

// ponytail: generated at build time from the same tokens as the site, so the
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
          background: "#f7f1e9",
          color: "#1b1613",
          padding: 76,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri("#7e5f2b")} width={57} height={60} alt="" />
          <div style={{ display: "flex", letterSpacing: 12, fontSize: 22 }}>
            AMIRA BECHINI
          </div>
          <div style={{ display: "flex", letterSpacing: 8, fontSize: 13, color: "#6e6157" }}>
            MASTERCLASS
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08 }}>
          {t("tagline")}
        </div>

        <div style={{ display: "flex", height: 3, width: 180, background: "#b8974f" }} />
      </div>
    ),
    size,
  );
}
