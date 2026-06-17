"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messageText } from "@/lib/voice/message-text";

interface TranscriptViewProps {
  messages: UIMessage[];
  /** Live speech-to-text shown as a faint pending user bubble. */
  interim?: string;
}

/**
 * The running transcript of the spoken conversation. Secondary to the voice
 * itself, but it keeps the exchange readable, accessible, and skimmable. The
 * assistant turn renders markdown even though the spoken version is flattened,
 * so the eye gets structure the ear does not.
 */
export function TranscriptView({ messages, interim }: TranscriptViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interim]);

  return (
    <ScrollArea className="h-full px-4 py-4" role="log" aria-live="polite">
      <div className="space-y-4">
        {messages.map((message) => {
          const text = messageText(message);
          if (!text) return null;
          const isUser = message.role === "user";
          return (
            <div key={message.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                  isUser ? "bg-white/10 ring-1 ring-white/10" : "bg-roxy/15 ring-1 ring-roxy/25"
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-roxy" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-roxy-dim/80 text-white rounded-tr-md whitespace-pre-wrap"
                    : "bg-white/5 ring-1 ring-white/8 text-zinc-200 rounded-tl-md"
                }`}
              >
                {isUser ? (
                  text
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
                      em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 last:mb-0 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 last:mb-0 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-zinc-200">{children}</li>,
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-roxy hover:underline">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {interim ? (
          <div className="flex gap-3 flex-row-reverse">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 bg-white/10 ring-1 ring-white/10">
              <User className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="max-w-[80%] rounded-2xl rounded-tr-md px-4 py-2.5 text-sm leading-relaxed bg-roxy-dim/40 text-white/80 italic">
              {interim}
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
