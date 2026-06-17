import type { Metadata } from "next";
import Script from "next/script";

/**
 * A mock host site that loads the real embed.js, so visitors can try the floating
 * voice widget exactly as it behaves on a third-party page. Kept out of the index
 * since it is a demo surface, not the canonical landing page.
 */
export const metadata: Metadata = {
  title: "Embed Demo",
  robots: { index: false, follow: false },
};

export default function EmbedDemoPage() {
  return (
    <>
      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 py-20 space-y-6">
        <p className="text-sm font-medium uppercase tracking-wider text-roxy">Sample website</p>
        <h1 className="text-4xl font-bold text-zinc-100">Your site, with a voice</h1>
        <p className="text-lg text-zinc-400">
          This page is a stand in for any website. The only addition is a single script tag, which
          puts a tap to talk spiritual assistant in the bottom corner. Tap it and ask about your
          horoscope, a tarot pull, or your birth chart.
        </p>
        <p className="text-sm text-zinc-500">
          The widget runs in an isolated frame and calls back to this deployment, so your API keys
          stay on the server. Look for the launcher in the corner.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/40 p-4">
          <code className="text-xs font-mono text-zinc-300">
            {'<script src="/embed.js" async></script>'}
          </code>
        </div>
      </main>
      <Script src="/embed.js" strategy="afterInteractive" />
    </>
  );
}
