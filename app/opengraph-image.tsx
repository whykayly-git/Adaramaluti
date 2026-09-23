import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import path from "path";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoBuffer = readFileSync(path.join(process.cwd(), "public/images/logo.png"));
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          background: "#FFFFFF",
        }}
      >
        {/* next/og's ImageResponse renders via Satori, not next/image, so a plain img is required here */}
        <img
          src={logoBase64}
          alt=""
          width={220}
          height={220}
          style={{ borderRadius: "50%", boxShadow: "0 10px 30px rgba(10,42,102,0.15)" }}
        />
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "#0A2A66",
            textAlign: "center",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 12, fontSize: 28, color: "#1E5EFF" }}>{siteConfig.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
