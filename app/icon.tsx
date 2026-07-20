import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/queries";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default async function Icon() {
  const profile = await getProfile();
  const name = profile?.name ?? "Portfolio";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 7,
          fontSize: 18,
          fontWeight: 900,
          letterSpacing: "-0.06em",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
        }}
      >
        {initials(name)}
        <span style={{ color: "#ec4899" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
