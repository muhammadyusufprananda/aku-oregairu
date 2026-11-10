import { url, type Block, type ReadingSection } from "./catalog";
const files = import.meta.glob<{ default: { blocks: Block[] } }>(
  "../content/english/volume-*.json",
  { eager: true },
);
export function englishBlocksFor(section: ReadingSection): Block[] {
  const blocks = files[`../content/english/${section.id}.json`]?.default.blocks;
  if (
    !blocks?.length ||
    new Set(blocks.map((b) => b.id)).size !== blocks.length
  )
    throw Error(`Invalid English section: ${section.id}`);
  return blocks.map((b) => ({ ...b, ...(b.src ? { src: url(b.src) } : {}) }));
}
