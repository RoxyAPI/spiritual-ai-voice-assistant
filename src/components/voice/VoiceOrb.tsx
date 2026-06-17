"use client";

import { Loader2, Mic, Volume2 } from "lucide-react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking";

interface VoiceOrbProps {
  state: VoiceState;
  onClick: () => void;
  disabled?: boolean;
  /** Diameter in pixels. Larger for the page hero, smaller inside the widget. */
  size?: number;
}

const LABELS: Record<VoiceState, string> = {
  idle: "Tap to speak",
  listening: "Listening, tap to stop",
  thinking: "Thinking",
  speaking: "Speaking, tap to interrupt",
};

/**
 * The single tap target that drives the whole conversation: start listening,
 * stop listening, or interrupt playback. The visual state is derived purely from
 * the `state` prop so the parent stays the source of truth.
 */
export function VoiceOrb({ state, onClick, disabled, size = 132 }: VoiceOrbProps) {
  const active = state === "listening";
  const speaking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={LABELS[state]}
      className="group relative flex items-center justify-center rounded-full transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      style={{ width: size, height: size }}
    >
      {/* Pulsing rings while listening or speaking */}
      {(active || speaking) && (
        <>
          <span className="absolute inset-0 rounded-full bg-roxy/30 animate-ping" />
          <span className="absolute inset-[-12px] rounded-full ring-1 ring-roxy/30 animate-pulse" />
        </>
      )}
      <span
        className={`absolute inset-0 rounded-full transition-colors ${
          active
            ? "bg-roxy/25 ring-2 ring-roxy/60"
            : speaking
              ? "bg-roxy/20 ring-2 ring-roxy/50"
              : "bg-roxy/12 ring-1 ring-roxy/30 group-hover:bg-roxy/18"
        }`}
      />
      <span className="relative text-roxy">
        {thinking ? (
          <Loader2 className="animate-spin" style={{ width: size * 0.3, height: size * 0.3 }} />
        ) : speaking ? (
          <Volume2 style={{ width: size * 0.3, height: size * 0.3 }} />
        ) : (
          <Mic style={{ width: size * 0.3, height: size * 0.3 }} />
        )}
      </span>
    </button>
  );
}
