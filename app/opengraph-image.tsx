import { ImageResponse } from "next/og";

import { APP_NAME } from "@/lib/config";

export const runtime = "edge";

export const alt = `${APP_NAME} — Get into a Korean university with confidence.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Royal-blue paper-plane motif, inlined as a data-URI background so the route
// stays self-contained and edge-safe (no remote fetch, no raw SVG children).
const PAPER_PLANE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M21.5 2.5 2 11l7.5 2.5L12 21l3-7 6.5-11.5Z" fill="#2563eb"/><path d="M9.5 13.5 21.5 2.5 12 14l-2.5-.5Z" fill="#1d4ed8"/></svg>`,
)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#f7faff",
          // Soft royal-blue radial glow on a near-white canvas. Satori only
          // supports the `circle at <pos>` gradient form (no explicit px size).
          backgroundImage:
            "radial-gradient(circle at 80% 12%, rgba(37,99,235,0.18), rgba(247,250,255,0) 55%), radial-gradient(circle at 8% 96%, rgba(37,99,235,0.12), rgba(247,250,255,0) 50%)",
          padding: "96px",
        }}
      >
        {/* Paper-plane motif. next/og renders via satori, not the DOM, so a
            plain <img> is required here (next/image is unavailable). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PAPER_PLANE} width={64} height={64} alt="" />

        <div
          style={{
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 132,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "-0.03em",
            marginTop: 28,
          }}
        >
          WayAbroad
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 46,
            color: "#334155",
            marginTop: 12,
          }}
        >
          Get into a Korean university with confidence.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 28,
            color: "#2563eb",
            fontWeight: 600,
            marginTop: 44,
            letterSpacing: "0.01em",
          }}
        >
          50 universities · 267 programs
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
