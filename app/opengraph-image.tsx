import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const profile = await getProfile();
  const name = profile?.name ?? "Personal Portfolio";
  const tagline = profile?.taglines?.[0] ?? "Portfolio & CV Digital";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1e1b4b 55%, #0a0a0f 100%)",
          color: "#f5f5f5",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: -1,
            backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#a1a1aa", display: "flex" }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
