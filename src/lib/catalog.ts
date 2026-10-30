import chapterRecords from "../content/chapters/index.json";
export const url = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export type ReadingSection = {
  id: string;
  volume: string;
  slug: string;
  number: number | null;
  kind: "frontmatter" | "chapter" | "backmatter";
  order: number;
  title: string;
  editorialStatus: "draft" | "reviewed";
};
export type Block = {
  id: string;
  kind: "heading" | "text" | "image" | "separator";
  text: string;
  source: string;
  src?: string;
  width?: number;
  height?: number;
  headingLevel?: 2;
  emphasis?: {
    start: number;
    end: number;
    style: "em" | "strong" | "strong-em";
  }[];
};
export const volumes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "9",
  "10",
  "10.5",
  "11",
  "12",
  "13",
  "14",
  "14.5",
].map((number) => ({
  slug: `volume-${number.replace(".", "-")}`,
  number: number.padStart(2, "0"),
  cover: url(`assets/covers/volume-${number.replace(".", "-")}-720.webp`),
  coverSmall: url(`assets/covers/volume-${number.replace(".", "-")}-360.webp`),
}));
export const sections: ReadingSection[] = chapterRecords.map((c) => {
  if (
    !volumes.some((v) => v.slug === c.volume) ||
    !c.title ||
    !c.slug ||
    !["frontmatter", "chapter", "backmatter"].includes(c.kind) ||
    !Number.isInteger(c.order) ||
    c.order < 0 ||
    (c.kind === "chapter"
      ? !Number.isInteger(c.number) || c.number === null || c.number < 1
      : c.number !== null) ||
    !["draft", "reviewed"].includes(c.editorialStatus)
  )
    throw Error("Metadata bab tidak valid");
  return {
    ...c,
    kind: c.kind as ReadingSection["kind"],
    editorialStatus: c.editorialStatus as ReadingSection["editorialStatus"],
  };
});
if (
  new Set(sections.map((c) => c.id)).size !== sections.length ||
  new Set(sections.map((c) => `${c.volume}/${c.slug}`)).size !== sections.length
)
  throw Error("ID atau rute bab berulang");
export const getSection = (volume: string, slug: string) =>
  sections.find((c) => c.volume === volume && c.slug === slug);
export const sectionsFor = (volume: string) =>
  sections.filter((c) => c.volume === volume).sort((a, b) => a.order - b.order);
export const chaptersFor = (volume: string) =>
  sectionsFor(volume).filter((c) => c.kind === "chapter");
export const sectionIdentity = (c: ReadingSection) =>
  c.kind === "frontmatter"
    ? `Pembuka Volume ${Number(volumes.find((v) => v.slug === c.volume)!.number)}`
    : c.kind === "backmatter"
      ? `Volume ${Number(volumes.find((v) => v.slug === c.volume)!.number)} · ${c.title}`
      : `Volume ${volumes.find((v) => v.slug === c.volume)!.number} · Bab ${c.number}`;
export const sectionName = (c: ReadingSection) =>
  c.kind === "chapter"
    ? `Bab ${c.number}`
    : c.kind === "frontmatter"
      ? "Pembuka"
      : c.title;
export const sectionUrl = (c: ReadingSection) =>
  url(`baca/${c.volume}/${c.slug}/`);
export const editorialLabel = (c: ReadingSection) =>
  c.editorialStatus === "draft"
    ? "Draf berbantuan AI—belum ditinjau manusia"
    : "Sudah ditinjau";

if (
  new Set(sections.map((c) => `${c.volume}/${c.order}`)).size !==
  sections.length
)
  throw Error("Urutan bagian berulang");
