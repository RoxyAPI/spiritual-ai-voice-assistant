"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useClientValue } from "@/lib/voice/use-client-value";

/**
 * Shows the one-line embed snippet for the current deployment and copies it to
 * the clipboard. The origin is read on the client so a fork shows its own URL
 * (e.g. https://your-app.vercel.app/embed.js) with no configuration.
 */
export function EmbedSnippet() {
  const origin = useClientValue(() => window.location.origin, "https://your-app.vercel.app");
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="${origin}/embed.js" async></script>`;

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 p-2 pl-4">
      <code className="flex-1 overflow-x-auto whitespace-nowrap text-xs font-mono text-zinc-300">
        {snippet}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy embed snippet"
        className="flex items-center gap-1.5 rounded-lg bg-roxy-dim px-3 py-2 text-xs font-medium text-white hover:brightness-110 transition-all shrink-0 cursor-pointer"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
