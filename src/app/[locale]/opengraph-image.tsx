import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { markDataUri } from "@/lib/mark";
import { academy, brand } from "@/lib/studio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = brand.full;

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
          background: "#f2eee7",
          color: "#211916",
          padding: 76,
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markDataUri("#98715a")} width={57} height={60} alt="" />
          <div style={{ display: "flex", letterSpacing: 12, fontSize: 22 }}>
            AURA ACADEMY
          </div>
          <div style={{ display: "flex", letterSpacing: 8, fontSize: 13, color: "#6e5d52" }}>
            DI AMIRA BECHINI
          </div>
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
