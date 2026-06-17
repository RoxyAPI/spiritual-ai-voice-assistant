"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useClientValue } from "./use-client-value";

/**
 * @fileoverview Browser text-to-speech via the Web Speech API.
 *
 * `speechSynthesis` and `SpeechSynthesisUtterance` are standard typed globals, so
 * no ambient declarations are needed here. Voices load asynchronously in some
 * browsers (`onvoiceschanged`), so we cache them and pick the best match for the
 * requested language at speak time. Replies are kept short by the system prompt,
 * which also sidesteps the Chrome long-utterance cutoff.
 */

export interface SpeechSynthesisState {
  supported: boolean;
  speaking: boolean;
  speak: (text: string, lang?: string) => void;
  cancel: () => void;
}

function pickVoice(voices: SpeechSynthesisVoice[], lang?: string): SpeechSynthesisVoice | null {
  if (!voices.length) return null;
  if (lang) {
    const base = lang.toLowerCase().split("-")[0];
    const exact = voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    if (exact) return exact;
    const sameLang = voices.find((v) => v.lang.toLowerCase().startsWith(base));
    if (sameLang) return sameLang;
  }
  return voices.find((v) => v.default) ?? voices[0];
}

export function useSpeechSynthesis(): SpeechSynthesisState {
  const supported = useClientValue(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    false,
  );
  const [speaking, setSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, lang?: string) => {
    if (!supported || !text.trim()) return;
    // Replace any in-flight speech so a new answer never overlaps the previous one.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice(voicesRef.current, lang);
    if (voice) utterance.voice = voice;
    if (lang) utterance.lang = lang;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, cancel };
}
