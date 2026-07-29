import { ImageResponse } from "next/og";
import { markDataUri } from "@/lib/mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// The drawn AB mark on the ivory ground. Espresso on ivory is ~15.6:1, so the
// glyph survives being scaled to a 16px tab on either a light or a dark chrome —
// the tile carries its own ground rather than relying on the browser's.
// ponytail: vector, so nothing to fetch at build and nothing to keep in sync.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f2eee7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri("#211916")} width={44} height={46} alt="" />
      </div>
    ),
    size,
  );
}
