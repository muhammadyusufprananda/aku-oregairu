import type { Block } from "./catalog";
import { readProgress, readSettings, write } from "./storage";
const root = document.querySelector<HTMLElement>("#reader")!;
const page = document.querySelector<HTMLElement>("#page")!;
const blocks: Block[] = JSON.parse(
  document.querySelector("#chapter-data")!.textContent!,
);
const chapter = Number(root.dataset.chapter);
const settings = readSettings();
type Part = { block: string; start: number; end: number };
let pages: Part[][] = [],
  current = 0,
  generation = 0,
  busy = false;
const previous = document.querySelector<HTMLButtonElement>("#prev")!,
  next = document.querySelector<HTMLButtonElement>("#next")!;
const count = document.querySelector("#page-count")!;
let anchor = { block: blocks[0].id, offset: 0 };
const saved = readProgress();
if (saved?.chapter === chapter && blocks.some((b) => b.id === saved.block))
  anchor = { block: saved.block, offset: saved.offset };
function element(part: Part): HTMLElement {
  const b = blocks.find((b) => b.id === part.block)!;
  if (b.kind === "image") {
    const figure = document.createElement("figure");
    const button = document.createElement("button");
    button.dataset.image = b.src;
    button.setAttribute("aria-label", "Perbesar ilustrasi");
    const img = document.createElement("img");
    img.src = b.src!;
    img.alt = b.text;
    img.loading = "lazy";
    img.decoding = "async";
    button.append(img);
    const caption = document.createElement("figcaption");
    caption.textContent = b.text;
    figure.append(button, caption);
    return figure;
  }
  const el = document.createElement(b.kind === "heading" ? "h1" : "p");
  let cursor = part.start;
  for (const mark of b.emphasis || []) {
    const start = Math.max(part.start, mark.start),
      end = Math.min(part.end, mark.end);
    if (end <= start) continue;
    el.append(document.createTextNode(b.text.slice(cursor, start)));
    const em = document.createElement("em");
    em.textContent = b.text.slice(start, end);
    el.append(em);
    cursor = end;
  }
  el.append(document.createTextNode(b.text.slice(cursor, part.end)));
  return el;
}
function remember() {
  if (!pages[current]?.length) return;
  const first = pages[current][0];
  anchor = { block: first.block, offset: first.start };
  write("oregairu.progress", {
    version: 1,
    volume: "contoh",
    chapter,
    ...anchor,
  });
}
function render(save = true) {
  page.replaceChildren(...pages[current].map(element));
  count.textContent = `${current + 1} / ${pages.length}`;
  previous.disabled = current === 0;
  next.disabled = current === pages.length - 1;
  document.querySelector<HTMLElement>("#next-chapter")!.hidden =
    current !== pages.length - 1;
  page.classList.remove("turning");
  void page.offsetWidth;
  page.classList.add("turning");
  if (save) remember();
}
function fallback() {
  root.classList.add("fallback");
  page.replaceChildren(
    ...blocks.map((b) =>
      element({ block: b.id, start: 0, end: b.text.length }),
    ),
  );
  count.textContent = "Mode baca bergulir · Contoh orisinal";
  previous.disabled = true;
  next.disabled = true;
  busy = false;
}
async function paginate() {
  const token = ++generation;
  busy = true;
  const target = { ...anchor };
  root.classList.remove("fallback");
  const measure = document.createElement("div");
  measure.className = "page-area measurer";
  measure.setAttribute("aria-hidden", "true");
  root.append(measure);
  const result: Part[][] = [];
  let parts: Part[] = [];
  function flush() {
    if (parts.length) result.push(parts);
    parts = [];
    measure.replaceChildren();
  }
  try {
    await document.fonts.ready;
    if (token !== generation) return;
    const height = measure.clientHeight;
    if (height < 70) throw Error("Viewport too short");
    for (const b of blocks) {
      if (token !== generation) return;
      if (b.kind === "image") {
        flush();
        result.push([{ block: b.id, start: 0, end: b.text.length }]);
        continue;
      }
      let start = 0;
      while (start < b.text.length) {
        const full = { block: b.id, start, end: b.text.length };
        const el = element(full);
        measure.append(el);
        if (measure.scrollHeight <= height + 1) {
          parts.push(full);
          start = b.text.length;
          continue;
        }
        el.remove();
        if (b.kind === "heading" && parts.length) {
          flush();
          continue;
        }
        const boundaries = [...b.text.slice(start).matchAll(/\S+\s*/g)].map(
          (m) => start + m.index! + m[0].length,
        );
        let lo = 0,
          hi = boundaries.length,
          best = 0;
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          const candidate = element({
            block: b.id,
            start,
            end: boundaries[mid - 1],
          });
          measure.append(candidate);
          const fits = measure.scrollHeight <= height + 1;
          candidate.remove();
          if (fits) {
            best = mid;
            lo = mid;
          } else hi = mid - 1;
        }
        if (!best) {
          if (parts.length) {
            flush();
            continue;
          }
          throw Error("Block cannot fit");
        }
        const end = boundaries[best - 1];
        const part = { block: b.id, start, end };
        measure.append(element(part));
        parts.push(part);
        start = end;
        flush();
      }
    }
    flush();
    if (token !== generation) return;
    pages = result;
    current = Math.max(
      0,
      pages.findIndex((p) =>
        p.some(
          (x) =>
            x.block === target.block &&
            target.offset >= x.start &&
            (target.offset < x.end ||
              x.end === blocks.find((b) => b.id === x.block)!.text.length),
        ),
      ),
    );
    render(false);
    anchor = target;
    write("oregairu.progress", {
      version: 1,
      volume: "contoh",
      chapter,
      ...anchor,
    });
    busy = false;
  } catch {
    if (token === generation) fallback();
  } finally {
    measure.remove();
  }
}
function applySettings() {
  root.dataset.theme = settings.theme;
  root.style.setProperty("--size", `${settings.size}px`);
  root.style.setProperty("--leading", String(settings.leading));
  document.querySelector<HTMLInputElement>("#font-size")!.value = String(
    settings.size,
  );
  document.querySelector("#size-output")!.textContent = `${settings.size} px`;
  root
    .querySelectorAll<HTMLButtonElement>("[data-theme-value]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(b.dataset.themeValue === settings.theme),
      ),
    );
  root
    .querySelectorAll<HTMLButtonElement>("[data-leading]")
    .forEach((b) =>
      b.setAttribute(
        "aria-pressed",
        String(Number(b.dataset.leading) === settings.leading),
      ),
    );
}
let resizeTimer: ReturnType<typeof setTimeout>;
function schedule() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => void paginate(), 100);
}
applySettings();
void paginate();
new ResizeObserver(schedule).observe(page);
document.fonts.addEventListener("loadingdone", schedule);
window.visualViewport?.addEventListener("resize", schedule);
function turn(delta: number) {
  if (
    busy ||
    root.classList.contains("fallback") ||
    document.querySelector("dialog[open]") ||
    window.getSelection()?.toString()
  )
    return;
  const dest = Math.min(pages.length - 1, Math.max(0, current + delta));
  if (dest !== current) {
    current = dest;
    render();
  }
}
previous.onclick = () => turn(-1);
next.onclick = () => turn(1);
const openers = new Map<HTMLDialogElement, HTMLElement>();
function openDialog(dialog: HTMLDialogElement, opener: HTMLElement) {
  openers.set(dialog, opener);
  dialog.showModal();
}
root
  .querySelectorAll<HTMLButtonElement>("[data-open]")
  .forEach(
    (b) =>
      (b.onclick = () =>
        openDialog(
          document.querySelector<HTMLDialogElement>(`#${b.dataset.open}`)!,
          b,
        )),
  );
root.querySelectorAll<HTMLDialogElement>("dialog").forEach((d) => {
  d.querySelector<HTMLButtonElement>("[data-close]")!.onclick = () => d.close();
  d.addEventListener("close", () => openers.get(d)?.focus());
});
document.querySelector<HTMLInputElement>("#font-size")!.oninput = (e) => {
  settings.size = Number((e.target as HTMLInputElement).value);
  applySettings();
  write("oregairu.settings", settings);
  schedule();
};
root.querySelectorAll<HTMLButtonElement>("[data-theme-value]").forEach(
  (b) =>
    (b.onclick = () => {
      settings.theme = b.dataset.themeValue as typeof settings.theme;
      applySettings();
      write("oregairu.settings", settings);
    }),
);
root.querySelectorAll<HTMLButtonElement>("[data-leading]").forEach(
  (b) =>
    (b.onclick = () => {
      settings.leading = Number(b.dataset.leading);
      applySettings();
      write("oregairu.settings", settings);
      schedule();
    }),
);
document.addEventListener("keydown", (e) => {
  if (
    document.querySelector("dialog[open]") ||
    e.target instanceof HTMLInputElement
  )
    return;
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    turn(e.key === "ArrowRight" ? 1 : -1);
  }
});
let down: { x: number; y: number; time: number } | null = null,
  suppressClick = false;
page.addEventListener("pointerdown", (e) => {
  if (e.isPrimary) down = { x: e.clientX, y: e.clientY, time: Date.now() };
});
page.addEventListener("pointercancel", () => (down = null));
page.addEventListener("pointerup", (e) => {
  if (!down) return;
  const dx = e.clientX - down.x,
    dy = e.clientY - down.y;
  const elapsed = Date.now() - down.time;
  down = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.6 && elapsed < 700) {
    suppressClick = true;
    turn(dx < 0 ? 1 : -1);
    setTimeout(() => (suppressClick = false), 0);
  } else if (Math.abs(dy) > 15 || elapsed > 500) {
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
  }
});
page.addEventListener("click", (e) => {
  if (suppressClick || window.getSelection()?.toString()) return;
  const image = (e.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-image]",
  );
  if (image) {
    showImage(image);
    return;
  }
  if (
    (e.target as HTMLElement).closest("a,button,input") ||
    root.classList.contains("fallback")
  )
    return;
  const x = (e.clientX - page.getBoundingClientRect().left) / page.clientWidth;
  if (x < 0.28) turn(-1);
  else if (x > 0.72) turn(1);
  else root.classList.toggle("controls-hidden");
});
const viewer = document.querySelector<HTMLDialogElement>("#viewer")!,
  viewerImage = document.querySelector<HTMLImageElement>("#viewer-image")!,
  stage = document.querySelector<HTMLElement>(".viewer-stage")!;
let zoom = 1,
  panX = 0,
  panY = 0;
function transform() {
  const maxX = (stage.clientWidth * (zoom - 1)) / 2,
    maxY = (stage.clientHeight * (zoom - 1)) / 2;
  panX = Math.min(maxX, Math.max(-maxX, panX));
  panY = Math.min(maxY, Math.max(-maxY, panY));
  viewerImage.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
  document.querySelector("#zoom-reset")!.textContent =
    `${Math.round(zoom * 100)}%`;
}
function showImage(button: HTMLButtonElement) {
  viewerImage.src = button.dataset.image!;
  viewerImage.alt = button.querySelector("img")?.alt || "Illustration";
  zoom = 1;
  panX = panY = 0;
  openDialog(viewer, button);
  transform();
}
function changeZoom(delta: number) {
  zoom = Math.min(4, Math.max(1, zoom + delta));
  transform();
}
document.querySelector<HTMLButtonElement>("#zoom-in")!.onclick = () =>
  changeZoom(0.5);
document.querySelector<HTMLButtonElement>("#zoom-out")!.onclick = () =>
  changeZoom(-0.5);
document.querySelector<HTMLButtonElement>("#zoom-reset")!.onclick = () => {
  zoom = 1;
  panX = panY = 0;
  transform();
};
const pointers = new Map<number, { x: number; y: number }>();
let distance = 0;
stage.addEventListener("pointerdown", (e) => {
  stage.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    distance = Math.hypot(a.x - b.x, a.y - b.y);
  }
});
stage.addEventListener("pointermove", (e) => {
  const old = pointers.get(e.pointerId);
  if (!old) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance) zoom = Math.min(4, Math.max(1, (zoom * d) / distance));
    distance = d;
  } else if (zoom > 1) {
    panX += e.clientX - old.x;
    panY += e.clientY - old.y;
  }
  transform();
});
for (const name of ["pointerup", "pointercancel"] as const)
  stage.addEventListener(name, (e) => {
    pointers.delete(e.pointerId);
    distance = 0;
  });
stage.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    changeZoom(e.deltaY < 0 ? 0.2 : -0.2);
  },
  { passive: false },
);
viewer.addEventListener("keydown", (e) => {
  if (e.key === "+" || e.key === "=") changeZoom(0.5);
  if (e.key === "-") changeZoom(-0.5);
  if (e.key.startsWith("Arrow")) {
    e.preventDefault();
    panX += e.key === "ArrowLeft" ? 30 : e.key === "ArrowRight" ? -30 : 0;
    panY += e.key === "ArrowUp" ? 30 : e.key === "ArrowDown" ? -30 : 0;
    transform();
  }
});
