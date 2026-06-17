"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useClientValue } from "./use-client-value";

/**
 * @fileoverview Browser speech-to-text via the Web Speech API.
 *
 * No SDK, no extra account, no key: recognition runs through the browser. Chrome,
 * Edge, and Safari support it; Firefox does not, so callers must check `supported`
 * and fall back to the text input. We declare the minimal interface we use rather
 * than reach for `lib.dom` (which omits the `webkit` prefixed constructor) so the
 * file stays free of `any`.
 */

interface SpeechAlternative {
  readonly transcript: string;
}
interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechAlternative;
}
interface SpeechResultList {
  readonly length: number;
  readonly [index: number]: SpeechResult;
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechResultList;
}
interface SpeechRecognitionErrorEventLike {
  readonly error: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeechRecognitionOptions {
  /** BCP-47 language tag passed to the recognizer (e.g. "en-US"). */
  lang?: string;
  /** Called once per utterance with the final transcript. */
  onResult: (transcript: string) => void;
}

export interface SpeechRecognitionState {
  supported: boolean;
  listening: boolean;
  /** Live (not yet final) transcript, for showing what the user is saying. */
  interim: string;
  error: string | null;
  start: () => void;
  stop: () => void;
}

export function useSpeechRecognition({
  lang,
  onResult,
}: UseSpeechRecognitionOptions): SpeechRecognitionState {
  const supported = useClientValue(() => getRecognitionConstructor() !== null, false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  // Hold the latest callback in a ref so a single long-lived recognition
  // instance never calls a stale closure after re-renders.
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  });

  useEffect(() => {
    const Ctor = getRecognitionConstructor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(null);
      setListening(true);
    };
    recognition.onend = () => {
      setListening(false);
      setInterim("");
    };
    recognition.onerror = (event) => {
      // "aborted" and "no-speech" are normal user flow, not failures to surface.
      if (event.error !== "aborted" && event.error !== "no-speech") {
        setError(event.error);
      }
      setListening(false);
    };
    recognition.onresult = (event) => {
      let live = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          const finalText = transcript.trim();
          if (finalText) onResultRef.current(finalText);
        } else {
          live += transcript;
        }
      }
      setInterim(live);
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.onstart = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || listening) return;
    if (lang) recognition.lang = lang;
    try {
      recognition.start();
    } catch {
      // start() throws if called while already starting; ignore and let onstart settle.
    }
  }, [lang, listening]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { supported, listening, interim, error, start, stop };
}
