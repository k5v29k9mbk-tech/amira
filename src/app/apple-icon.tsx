import { ImageResponse } from "next/og";
import { markDataUri } from "@/lib/mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS masks the corners and never composites transparency, so the tile needs its
// own opaque ivory ground and ~20% breathing room inside the mask.
export default function AppleIcon() {
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
        <img src={markDataUri("#211916")} width={105} height={110} alt="" />
      </div>
    ),
    size,
  );
}
