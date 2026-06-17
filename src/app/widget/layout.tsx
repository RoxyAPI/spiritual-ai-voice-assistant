import type { Metadata } from "next";

/**
 * The widget is loaded inside an iframe on third-party sites, so it must stay out
 * of search indexes (the canonical surface is the home page). Framing is allowed
 * for this route via the headers in next.config.ts.
 */
export const metadata: Metadata = {
  title: "Voice Widget",
  robots: { index: false, follow: false },
};

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-screen overflow-hidden">{children}</div>;
}
