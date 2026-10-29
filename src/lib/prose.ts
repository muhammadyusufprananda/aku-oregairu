import type { Block } from "./catalog";
export function segmentsFor(block: Block, start = 0, end = block.text.length) {
  const segments: { text: string; style?: "em" | "strong" | "strong-em" }[] =
    [];
  let cursor = start;
  for (const mark of block.emphasis || []) {
    const left = Math.max(start, mark.start),
      right = Math.min(end, mark.end);
    if (right <= left) continue;
    if (left > cursor) segments.push({ text: block.text.slice(cursor, left) });
    segments.push({ text: block.text.slice(left, right), style: mark.style });
    cursor = right;
  }
  if (cursor < end) segments.push({ text: block.text.slice(cursor, end) });
  return segments;
}
