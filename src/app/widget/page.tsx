import { VoiceAssistant } from "@/components/voice";
import { getEnvStatus } from "@/lib/env";

export default function WidgetPage() {
  const env = getEnvStatus();

  if (!env.ok) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-400">
          Add{" "}
          <code className="bg-white/10 rounded px-1 text-xs font-mono">ROXYAPI_KEY</code>{" "}
          and an LLM key to{" "}
          <code className="bg-white/10 rounded px-1 text-xs font-mono">.env.local</code>{" "}
          to enable the voice assistant.
        </p>
      </div>
    );
  }

  return <VoiceAssistant variant="widget" />;
}
