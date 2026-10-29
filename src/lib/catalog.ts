import chapterRecords from "../content/chapters/index.json";
export const url = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export type Chapter = {
  id: string;
  volume: string;
  slug: string;
  number: number;
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
export const chapters: Chapter[] = chapterRecords.map((c) => {
  if (
    !volumes.some((v) => v.slug === c.volume) ||
    !c.title ||
    !c.slug ||
    !Number.isInteger(c.number) ||
    c.number < 1 ||
    !["draft", "reviewed"].includes(c.editorialStatus)
  )
    throw Error("Metadata bab tidak valid");
  return {
    ...c,
    editorialStatus: c.editorialStatus as Chapter["editorialStatus"],
  };
});
if (
  new Set(chapters.map((c) => c.id)).size !== chapters.length ||
  new Set(chapters.map((c) => `${c.volume}/${c.slug}`)).size !== chapters.length
)
  throw Error("ID atau rute bab berulang");
export const getChapter = (volume: string, slug: string) =>
  chapters.find((c) => c.volume === volume && c.slug === slug);
export const chaptersFor = (volume: string) =>
  chapters
    .filter((c) => c.volume === volume)
    .sort((a, b) => a.number - b.number);
export const chapterUrl = (c: Chapter) => url(`baca/${c.volume}/${c.slug}/`);
export const editorialLabel = (c: Chapter) =>
  c.editorialStatus === "draft"
    ? "Draf berbantuan AI—belum ditinjau manusia"
    : "Sudah ditinjau";
