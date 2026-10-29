export type Settings = {
  version: 1;
  theme: "kertas" | "putih" | "gelap";
  size: number;
  leading: number;
};
export type Progress = {
  version: 1;
  volume: "contoh";
  chapter: number;
  block: string;
  offset: number;
};
export const defaults: Settings = {
  version: 1,
  theme: "kertas",
  size: 18,
  leading: 1.8,
};
function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Reader remains usable when storage is unavailable. */
  }
}
export function readSettings(): Settings {
  const s = read("oregairu.settings") as Partial<Settings> | null;
  return s?.version === 1
    ? {
        version: 1,
        theme: ["kertas", "putih", "gelap"].includes(s.theme || "")
          ? s.theme!
          : defaults.theme,
        size:
          typeof s.size === "number" && Number.isFinite(s.size)
            ? Math.min(28, Math.max(16, s.size))
            : 18,
        leading: [1.5, 1.8, 2].includes(s.leading || 0) ? s.leading! : 1.8,
      }
    : { ...defaults };
}
export function readProgress(): Progress | null {
  const p = read("oregairu.progress") as Partial<Progress> | null;
  return p?.version === 1 &&
    p.volume === "contoh" &&
    Number.isInteger(p.chapter) &&
    p.chapter! >= 0 &&
    p.chapter! < 2 &&
    typeof p.block === "string" &&
    typeof p.offset === "number" &&
    Number.isFinite(p.offset) &&
    p.offset >= 0
    ? (p as Progress)
    : null;
}
