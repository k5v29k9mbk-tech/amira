import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The AB monogram, set in the same Didone as the site lockup so the tab icon and
// the wordmark are one mark. Generated at build time — no binary to keep in sync.
// ponytail: font pulled from Google at build like next/font does; falls back to
// the bundled face if the fetch fails so a build never dies over a favicon.
async function didone() {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    if (!url) return [];
    const data = await fetch(url).then((r) => r.arrayBuffer());
    return [{ name: "Didone", data, weight: 500 as const, style: "normal" as const }];
  } catch {
    return [];
  }
}

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f1e9",
          color: "#1b1613",
          fontFamily: "Didone, serif",
          fontSize: 52,
          letterSpacing: -11,
          paddingRight: 9,
        }}
      >
        AB
      </div>
    ),
    { ...size, fonts: await didone() },
  );
}
