import { getSection } from "./catalog";
export type Settings = {
  version: 2;
  theme: "kertas" | "putih" | "gelap";
  font: "sans" | "serif";
  size: number;
  leading: number;
};
export type Progress = {
  version: 2;
  volume: string;
  chapter: string;
  block: string;
  offset: number;
};
export const defaults: Settings = {
  version: 2,
  theme: "putih",
  font: "sans",
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
    /* Reading still works when browser storage is unavailable. */
  }
}
export function readSettings(): Settings {
  const value = read("oregairu.settings");
  if (!value || typeof value !== "object") return { ...defaults };
  const s = value as Record<string, unknown>;
  if (s.version !== 1 && s.version !== 2) return { ...defaults };
  const settings: Settings = {
    version: 2,
    theme: ["kertas", "putih", "gelap"].includes(String(s.theme))
      ? (s.theme as Settings["theme"])
      : defaults.theme,
    font: s.version === 2 && s.font === "serif" ? "serif" : "sans",
    size:
      typeof s.size === "number" && Number.isFinite(s.size)
        ? Math.min(28, Math.max(16, s.size))
        : 18,
    leading:
      [1.5, 1.8, 2].includes(Number(s.leading)) && typeof s.leading === "number"
        ? s.leading
        : 1.8,
  };
  if (s.version === 1) write("oregairu.settings", settings);
  return settings;
}
export function readProgress(): Progress | null {
  const value = read("oregairu.progress");
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  return p.version === 2 &&
    typeof p.volume === "string" &&
    typeof p.chapter === "string" &&
    getSection(p.volume, p.chapter) &&
    typeof p.block === "string" &&
    p.block.length > 0 &&
    typeof p.offset === "number" &&
    Number.isSafeInteger(p.offset) &&
    p.offset >= 0
    ? (p as Progress)
    : null;
}
