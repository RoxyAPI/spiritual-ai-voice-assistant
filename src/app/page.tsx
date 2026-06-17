import { VoiceAssistant } from "@/components/voice";
import { SetupRequired } from "@/components/SetupRequired";
import { EmbedSnippet } from "@/components/EmbedSnippet";
import { getEnvStatus } from "@/lib/env";

const DOMAINS = [
  "Western Astrology",
  "Vedic Astrology",
  "Numerology",
  "Tarot",
  "Human Design",
  "Forecast",
  "Biorhythm",
  "I Ching",
  "Crystals",
  "Dreams",
  "Angel Numbers",
];

const STEPS: { title: string; body: string }[] = [
  {
    title: "You speak",
    body: "Tap the orb and ask anything: your day ahead, a tarot pull, your birth chart, a dream you had.",
  },
  {
    title: "It calls verified tools",
    body: "The assistant picks the right RoxyAPI Remote MCP tool and computes a real result, not a guess.",
  },
  {
    title: "It speaks back",
    body: "The reading is interpreted in your language and read aloud, with a transcript you can scroll.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is the AI Spiritual Voice Assistant?",
    a: "It is a voice assistant you talk to that answers with real astrology, Vedic, tarot, numerology, human design, and more. Every reply is grounded in verified calculations through RoxyAPI Remote MCP, not made up by the language model.",
  },
  {
    q: "How accurate are the readings?",
    a: "Every chart, horoscope, and number is computed from verified astronomical and mathematical engines, verified against NASA JPL Horizons, then interpreted and spoken back by the assistant. The math is real before a single word is said.",
  },
  {
    q: "Can I embed the voice widget on my own website?",
    a: "Yes. Add one script tag and a tap to talk button appears in the corner of any site. The widget loads in an isolated frame and your API keys stay on your own server, never in the browser.",
  },
  {
    q: "Which languages does it understand?",
    a: "It detects the language you speak and replies in the same one, using your browser built in voice. Domain terms like planet and nakshatra names are kept in their original form.",
  },
  {
    q: "Do I need a paid voice service?",
    a: "No. Speech recognition and playback run natively in the browser, so there is no extra voice account or per minute fee. You only need a RoxyAPI key and one LLM key, and Gemini has a free tier.",
  },
  {
    q: "Is it open source and free to build on?",
    a: "The template is MIT licensed. Clone it, rebrand it, and ship it as your own product. You bring a RoxyAPI key and an LLM provider key.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "AI Spiritual Voice Assistant",
      url: "https://github.com/RoxyAPI/spiritual-ai-voice-assistant",
      description:
        "Open source AI voice assistant for astrology, Vedic astrology, tarot, numerology, human design, forecast, biorhythm, I Ching, crystals, dreams, and angel numbers. Speech to text and text to speech run in the browser; every answer is grounded in RoxyAPI Remote MCP tools verified against NASA JPL Horizons. Ships an embeddable bottom corner voice widget for any website.",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      creator: { "@type": "Organization", name: "RoxyAPI", url: "https://roxyapi.com" },
      featureList: [
        "Hands free voice readings across 11 spiritual domains",
        "Embeddable bottom corner voice widget for any website",
        "Answers grounded in verified calculations, not hallucinations",
        "Speaks and understands the user language",
        "Browser native speech, no extra voice account required",
        "Bring your own LLM: Gemini, Claude, or GPT",
      ],
      keywords:
        "ai voice assistant, astrology voice assistant, spiritual voice assistant, embeddable voice widget, horoscope voice, tarot voice, numerology, vedic astrology, human design, remote mcp",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  const env = getEnvStatus();
  if (!env.ok) return <SetupRequired status={env} />;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10 space-y-16">
        <section className="text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100">
            AI Spiritual Voice Assistant
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Talk out loud and hear a reading grounded in real astrology, Vedic, tarot, numerology,
            human design, and more. Verified calculations, not guesses. Powered by RoxyAPI Remote MCP.
          </p>
          <div className="mx-auto h-[560px] max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <VoiceAssistant />
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-center text-2xl font-bold text-zinc-100">How does the voice assistant work?</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-roxy/15 ring-1 ring-roxy/25 text-roxy text-sm font-semibold mb-3">
                  {i + 1}
                </span>
                <h3 className="text-base font-semibold text-zinc-100 mb-1">{s.title}</h3>
                <p className="text-sm text-zinc-400">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-100">One key. Eleven spiritual domains.</h2>
          <p className="mx-auto max-w-2xl text-sm text-zinc-400">
            The assistant reaches every RoxyAPI domain through a single Remote MCP connection, plus
            location geocoding so a spoken birthplace becomes a chart ready coordinate automatically.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {DOMAINS.map((d) => (
              <span
                key={d}
                className="px-3.5 py-1.5 rounded-full border border-white/10 text-sm text-zinc-300"
              >
                {d}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-100">Embed the voice widget in one line</h2>
            <p className="mx-auto max-w-2xl text-sm text-zinc-400">
              Drop this script on any site and a tap to talk button appears in the corner. Your keys
              stay on your server; the widget loads in its own isolated frame.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <EmbedSnippet />
          </div>
          <p className="text-center text-sm">
            <a
              href="/embed-demo"
              title="See the embeddable spiritual voice widget running on a sample site"
              className="text-roxy hover:underline"
            >
              See the widget on a sample site
            </a>
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Built on RoxyAPI</h2>
          <p className="max-w-3xl text-sm text-zinc-400">
            RoxyAPI is the multi domain spiritual intelligence API: one key, Remote MCP for AI agents,
            typed SDKs, drop in UI, free Templates, and flat all inclusive pricing. Calculations are
            verified against NASA JPL Horizons.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="https://roxyapi.com/pricing" target="_blank" rel="noopener" title="Get a RoxyAPI key and pricing" className="text-roxy hover:underline">Get an API key</a>
            <a href="https://roxyapi.com/docs/mcp" target="_blank" rel="noopener" title="RoxyAPI Remote MCP documentation for AI agents" className="text-roxy hover:underline">Remote MCP docs</a>
            <a href="https://roxyapi.com/methodology" target="_blank" rel="noopener" title="How RoxyAPI verifies accuracy against NASA JPL Horizons" className="text-roxy hover:underline">Methodology</a>
            <a href="https://roxyapi.com/api-reference" target="_blank" rel="noopener" title="Try the RoxyAPI endpoints live in the browser" className="text-roxy hover:underline">Live API reference</a>
            <a href="https://roxyapi.com/starters" target="_blank" rel="noopener" title="More free RoxyAPI templates to clone and ship" className="text-roxy hover:underline">More Templates</a>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-zinc-100">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <summary className="cursor-pointer text-base font-semibold text-zinc-100 list-none">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-center text-xs text-zinc-500 space-y-1">
          <p>
            Powered by{" "}
            <a href="https://roxyapi.com" target="_blank" rel="noopener" className="text-roxy/80 hover:text-roxy">
              RoxyAPI
            </a>
            {" · "}
            <a
              href="https://github.com/RoxyAPI/spiritual-ai-voice-assistant"
              target="_blank"
              rel="noopener"
              className="hover:text-zinc-300"
            >
              Clone this Template
            </a>
          </p>
          <p className="text-zinc-600">Verified calculations, not AI hallucinations.</p>
        </footer>
      </main>
    </>
  );
}
