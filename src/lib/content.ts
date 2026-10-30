import { existsSync } from "node:fs";
import { resolve } from "node:path";
import content from "../content/chapters/volume-1-bab-1.json";
import opening from "../content/chapters/volume-1-pembuka.json";
import openingProvenance from "../../docs/editorial/volume-1-pembuka-sources.json";
import provenance from "../../docs/editorial/volume-1-bab-1-sources.json";
import { sections, url, type Block, type ReadingSection } from "./catalog";
const data: Record<string, unknown> = {
  "volume-1-bab-1": content,
  "volume-1-pembuka": opening,
};
export function blocksFor(chapter: ReadingSection): Block[] {
  const record = data[chapter.id] as { blocks?: Block[] } | undefined;
  if (!record?.blocks?.length)
    throw Error(`Isi bab tidak tersedia: ${chapter.id}`);
  const ids = new Set<string>();
  for (const block of record.blocks) {
    if (
      !block.id ||
      ids.has(block.id) ||
      !block.text ||
      !block.source ||
      !["heading", "text", "image", "separator"].includes(block.kind)
    )
      throw Error(`Blok tidak valid: ${block.id}`);
    ids.add(block.id);
    if (
      block.kind === "image" &&
      (!block.src ||
        !block.src.startsWith("assets/chapters/") ||
        !existsSync(resolve("public", block.src)) ||
        !block.width ||
        !block.height)
    )
      throw Error(`Ilustrasi tidak tersedia: ${block.id}`);
    let end = 0;
    for (const mark of block.emphasis || []) {
      if (
        !Number.isInteger(mark.start) ||
        !Number.isInteger(mark.end) ||
        mark.start < end ||
        mark.end <= mark.start ||
        mark.end > block.text.length ||
        !["em", "strong", "strong-em"].includes(mark.style)
      )
        throw Error(`Penekanan tidak valid: ${block.id}`);
      end = mark.end;
    }
  }
  if (chapter.id === "volume-1-bab-1") {
    const expected = provenance.blocks.map((b) => b.id);
    const sourceIds = new Set(expected);
    const actual = record.blocks
      .filter((b) => sourceIds.has(b.id))
      .map((b) => b.id);
    if (JSON.stringify(actual) !== JSON.stringify(expected))
      throw Error("Pemetaan sumber Bab 1 belum lengkap atau urutannya berubah");
  }
  if (chapter.kind === "frontmatter") {
    const expected = openingProvenance.files.flatMap((f) =>
      f.images.map((i) => i.id),
    );
    const actual = record.blocks
      .filter((b) => b.kind === "image")
      .map((b) => b.id);
    if (
      JSON.stringify(actual) !== JSON.stringify(expected) ||
      record.blocks[0].id !== "v1-opening-cover"
    )
      throw Error("Urutan ilustrasi pembuka berbeda dari spine sumber");
  }
  if (chapter.kind === "chapter" && record.blocks[0].text !== chapter.title)
    throw Error("Judul isi bab dan metadata berbeda");
  return record.blocks.map((b) => ({
    ...b,
    ...(b.src ? { src: url(b.src) } : {}),
  }));
}
for (const chapter of sections) blocksFor(chapter);
