"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { VoiceOrb, type VoiceState } from "./VoiceOrb";
import { TranscriptView } from "./TranscriptView";
import { useSpeechRecognition } from "@/lib/voice/useSpeechRecognition";
import { useSpeechSynthesis } from "@/lib/voice/useSpeechSynthesis";
import { stripMarkdown } from "@/lib/voice/strip-markdown";
import { messageText } from "@/lib/voice/message-text";
import { useClientValue } from "@/lib/voice/use-client-value";

const SUGGESTIONS = [
  "What does my day look like?",
  "Give me a quick tarot pull",
  "My life path number for August 14 1990",
  "Read my Vedic birth chart",
  "What crystal helps with focus?",
  "I dreamed about the ocean",
];

interface VoiceAssistantProps {
  /** "page" is the full-screen experience; "widget" is the compact iframe build. */
  variant?: "page" | "widget";
}

/**
 * The voice conversation engine, shared by the home page and the embeddable
 * widget. Speech recognition and synthesis run in the browser (no extra key); the
 * transcript is POSTed to /api/chat, where the LLM grounds every answer in RoxyAPI
 * Remote MCP tools and streams it back to be spoken aloud.
 */
export function VoiceAssistant({ variant = "page" }: VoiceAssistantProps) {
  const isWidget = variant === "widget";
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop } = useChat({ transport });

  const lang = useClientValue(() => navigator.language || "en-US", "en-US");
  const [muted, setMuted] = useState(false);
  const [text, setText] = useState("");
  const lastSpokenIdRef = useRef<string | null>(null);

  const synth = useSpeechSynthesis();
  const { speak, cancel: cancelSpeech, speaking, supported: ttsSupported } = synth;
  const recognition = useSpeechRecognition({
    lang,
    onResult: (transcript) => sendMessage({ text: transcript }),
  });

  const thinking = status === "submitted" || status === "streaming";
  const voiceState: VoiceState = recognition.listening
    ? "listening"
    : thinking
      ? "thinking"
      : speaking
        ? "speaking"
        : "idle";

  // Speak each finished assistant reply once. Flatten markdown first so symbols
  // are not read aloud; skip while muted.
  useEffect(() => {
    if (status !== "ready" || muted || !ttsSupported) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || lastSpokenIdRef.current === last.id) return;
    const reply = messageText(last);
    if (!reply) return;
    lastSpokenIdRef.current = last.id;
    speak(stripMarkdown(reply), lang);
  }, [status, messages, muted, ttsSupported, speak, lang]);

  const handleOrbTap = () => {
    if (recognition.listening) {
      recognition.stop();
      return;
    }
    if (speaking) cancelSpeech(); // barge-in: stop playback before listening
    recognition.start();
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value || status !== "ready") return;
    if (speaking) cancelSpeech();
    sendMessage({ text: value });
    setText("");
  };

  const toggleMute = () => {
    setMuted((m) => {
      if (!m) cancelSpeech();
      return !m;
    });
  };

  const closeWidget = () => {
    cancelSpeech();
    recognition.stop();
    if (typeof window !== "undefined") {
      window.parent.postMessage({ type: "roxy-voice:close" }, "*");
    }
  };

  const hint = recognition.error
    ? "Microphone unavailable. Type your question below."
    : status === "error"
      ? "Something went wrong. Try again."
      : recognition.listening
        ? recognition.interim || "Listening..."
        : thinking
          ? "Thinking..."
          : speaking
            ? "Speaking..."
            : recognition.supported
              ? "Tap the orb and ask anything."
              : "Voice input is not supported here. Type your question below.";

  const orbSize = isWidget ? 96 : 132;
  const empty = messages.length === 0;

  return (
    <div className="relative z-10 flex flex-col h-full mx-auto w-full max-w-3xl overflow-hidden">
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-6 py-3 header-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-roxy/15 ring-1 ring-roxy/25">
          <Sparkles className="w-5 h-5 text-roxy" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-semibold text-zinc-100 truncate ${isWidget ? "text-base" : "text-lg"}`}>
            AI Spiritual Voice Assistant
          </p>
          {!isWidget && (
            <p className="text-sm text-zinc-500 truncate">
              Astrology · Vedic · Tarot · Numerology · Human Design · More
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute voice" : "Mute voice"}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-roxy hover:bg-white/5 transition-colors cursor-pointer"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        {isWidget && (
          <button
            type="button"
            onClick={closeWidget}
            aria-label="Close"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      {empty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          {recognition.supported && (
            <VoiceOrb state={voiceState} onClick={handleOrbTap} size={orbSize} />
          )}
          <div>
            <h2 className={`font-bold text-zinc-100 mb-2 ${isWidget ? "text-xl" : "text-2xl"}`}>
              Ask the stars out loud
            </h2>
            <p className="text-zinc-500 max-w-md text-sm">
              {hint}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {SUGGESTIONS.slice(0, isWidget ? 3 : SUGGESTIONS.length).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage({ text: s })}
                className="px-3.5 py-1.5 rounded-full border border-white/10 text-sm text-zinc-300 hover:bg-white/5 hover:border-roxy/30 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <TranscriptView messages={messages} interim={recognition.listening ? recognition.interim : ""} />
        </div>
      )}

      <div className="shrink-0 bottom-panel px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {!empty && recognition.supported && (
            <VoiceOrb state={voiceState} onClick={handleOrbTap} size={52} />
          )}
          <form onSubmit={handleTextSubmit} className="flex flex-1 items-center gap-2">
            <label htmlFor="voice-text" className="sr-only">
              Type your question
            </label>
            <input
              id="voice-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or type your question..."
              autoComplete="off"
              className="flex-1 min-w-0 rounded-xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-roxy/40 focus:border-roxy/30 transition-colors"
            />
            {thinking ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/80 text-white hover:bg-red-500 transition-all shrink-0 cursor-pointer"
              >
                <span className="w-3 h-3 rounded-[2px] bg-white" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={text.trim().length === 0}
                aria-label="Send"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-roxy-dim text-white hover:brightness-110 disabled:bg-white/10 disabled:text-zinc-600 transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
        {!empty && (
          <p className="mt-2 text-center text-xs text-zinc-600 truncate" aria-live="polite">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
