/**
 * Flattens markdown into plain speakable text for the speech synthesizer.
 *
 * The model is told to answer in plain spoken text, but it occasionally slips in
 * emphasis, links, or a stray list. Reading the raw symbols aloud ("asterisk
 * asterisk") sounds broken, so we strip the formatting before handing the string
 * to `speechSynthesis`. This is intentionally lossy: it serves the ear, not the
 * eye (the transcript view still renders the original markdown).
 */
export function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/^\s{0,3}>\s?/gm, "") // blockquotes
    .replace(/^\s*([-*+]|\d+\.)\s+/gm, "") // list markers
    .replace(/^\s*\|.*\|\s*$/gm, " ") // table rows
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italics
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/\s+/g, " ")
    .trim();
}
