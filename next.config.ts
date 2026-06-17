import type { NextConfig } from "next";

/**
 * The embeddable widget lives at `/widget` and is loaded cross-origin inside an
 * iframe by `public/embed.js` on any host site. That means it must be frameable,
 * while every other route stays locked to `X-Frame-Options: DENY`.
 *
 * Two header blocks make that work:
 *  1. Global security headers on everything EXCEPT `/widget` (negative lookahead).
 *  2. A `/widget` block that drops `X-Frame-Options` (it conflicts with CSP
 *     frame-ancestors) and sets `frame-ancestors`. Restrict the embed to your
 *     own domains by setting `WIDGET_ALLOWED_ORIGINS` (comma separated); the
 *     default `*` lets the widget be embedded anywhere.
 */
const widgetFrameAncestors = process.env.WIDGET_ALLOWED_ORIGINS
  ? `frame-ancestors 'self' ${process.env.WIDGET_ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean)
      .join(" ")}`
  : "frame-ancestors *";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/((?!widget).*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/widget",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Content-Security-Policy", value: widgetFrameAncestors },
      ],
    },
  ],
};

export default nextConfig;
