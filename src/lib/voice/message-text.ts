import type { UIMessage } from "ai";

/** Concatenates the text parts of a UIMessage (ignores tool-call/step parts). */
export function messageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("");
}
