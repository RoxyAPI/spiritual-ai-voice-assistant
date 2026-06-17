import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { StarField } from "@/components/StarField";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spiritual Voice Assistant | Astrology, Tarot, Numerology",
  description:
    "Talk to an AI voice assistant for astrology, Vedic, tarot, numerology, human design, and more. Answers grounded in verified calculations via RoxyAPI Remote MCP. Embeddable widget, open source.",
  keywords: [
    "ai voice assistant",
    "astrology voice assistant",
    "spiritual voice assistant",
    "voice astrology app",
    "embeddable voice widget",
    "horoscope voice assistant",
    "tarot voice",
    "numerology voice",
    "vedic astrology",
    "human design",
    "mcp voice agent",
    "remote mcp",
    "vercel ai sdk voice",
    "roxyapi",
  ],
  openGraph: {
    title: "AI Spiritual Voice Assistant | Astrology, Tarot, Numerology",
    description:
      "Open source AI voice assistant. Speak a question, hear a reading grounded in verified astrology, Vedic, tarot, and numerology calculations. Drop the voice widget on any site in one line. Powered by RoxyAPI.",
    type: "website",
    siteName: "AI Spiritual Voice Assistant",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-space antialiased`}>
        <StarField />
        {children}
      </body>
    </html>
  );
}
