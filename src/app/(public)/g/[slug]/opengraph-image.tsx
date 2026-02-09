import { ImageResponse } from "next/og";
import db from "@/lib/db";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const greeting = await db.greeting.findUnique({
    where: { slug },
    select: {
      title: true,
      senderNameDefault: true,
      messageDefault: true,
      template: {
        select: { componentSlug: true },
      },
    },
  });

  if (!greeting) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "#1a1a1a",
            color: "#fff",
            fontSize: 48,
          }}
        >
          Greeting Not Found
        </div>
      ),
      { ...size },
    );
  }

  // Template-specific color scheme
  const slug_ = greeting.template?.componentSlug;
  let bg: string;
  let titleColor: string;
  let subColor: string;
  let accentColor: string;
  let emoji1: string;
  let emoji2: string;

  switch (slug_) {
    case "gold-n-shiny":
      bg = "linear-gradient(135deg, #0a0a0a, #1a1a2e)";
      titleColor = "#FFD700";
      subColor = "#DAA520";
      accentColor = "rgba(255,215,0,0.15)";
      emoji1 = "✨";
      emoji2 = "🌟";
      break;
    case "crimson-bloom":
      bg = "linear-gradient(135deg, #8B0000, #DC143C)";
      titleColor = "#FFFFFF";
      subColor = "#FFD1D1";
      accentColor = "rgba(255,255,255,0.1)";
      emoji1 = "🌸";
      emoji2 = "🏮";
      break;
    case "jade-prosperity":
      bg = "linear-gradient(135deg, #064e3b, #059669)";
      titleColor = "#6ee7b7";
      subColor = "#a7f3d0";
      accentColor = "rgba(110,231,183,0.1)";
      emoji1 = "🧧";
      emoji2 = "🎋";
      break;
    default:
      bg = "linear-gradient(135deg, #8B0000, #DC143C)";
      titleColor = "#FFD700";
      subColor = "#FFE4B5";
      accentColor = "rgba(255,215,0,0.1)";
      emoji1 = "🧧";
      emoji2 = "🏮";
  }

  const title = greeting.title || "Happy New Year";
  const sender = greeting.senderNameDefault || "Someone Special";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: bg,
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative corner emojis */}
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 40,
            fontSize: 56,
            opacity: 0.6,
          }}
        >
          {emoji1}
        </div>
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 40,
            fontSize: 56,
            opacity: 0.6,
          }}
        >
          {emoji2}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: 40,
            fontSize: 56,
            opacity: 0.6,
          }}
        >
          {emoji2}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            right: 40,
            fontSize: 56,
            opacity: 0.6,
          }}
        >
          {emoji1}
        </div>

        {/* Card container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: accentColor,
            borderRadius: 24,
            padding: "48px 64px",
            maxWidth: 900,
            textAlign: "center",
            border: `2px solid ${titleColor}33`,
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: titleColor,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {title.length > 50 ? title.slice(0, 50) + "..." : title}
          </div>

          {/* Sender */}
          <div
            style={{
              fontSize: 28,
              color: subColor,
              fontWeight: 500,
            }}
          >
            From {sender}
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 16,
            color: subColor,
            opacity: 0.5,
            fontWeight: 500,
            letterSpacing: 2,
          }}
        >
          BIZAPPS.ID
        </div>
      </div>
    ),
    { ...size },
  );
}
