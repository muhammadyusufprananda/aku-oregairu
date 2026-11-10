import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
type Section = {
  id: string;
  volume: string;
  slug: string;
  kind: string;
  number: number | null;
  title: string;
};
type Block = {
  id: string;
  kind: string;
  text: string;
  src?: string;
  emphasis?: { start: number; end: number; style: string }[];
};
const sections: Section[] = JSON.parse(
  readFileSync("src/content/chapters/index.json", "utf8"),
).filter((c: Section) => /^volume-[3-6]$/.test(c.volume));
async function ready(page: Page) {
  await expect(page.locator("#page-count")).toHaveText(/\d+ \/ \d+/);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await expect(page.locator(".measurer")).toHaveCount(0);
}
for (const section of sections) {
  const longest = [
    "volume-3-bonus-track",
    "volume-4-bab-7",
    "volume-5-bab-6",
    "volume-6-bab-9",
  ].includes(section.id);
  for (const width of longest ? [320, 768] : [320]) {
    test(`${section.id} preserves all prose and image order at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`baca/${section.volume}/${section.slug}/`);
      await ready(page);
      await expect(page.locator(".reader-editorial")).toHaveText(
        "Draf berbantuan AI—belum ditinjau manusia",
      );
      await expect(page.locator(".reader-top")).not.toContainText("Bab 0");
      const blocks: Block[] = await page
        .locator("#chapter-data")
        .evaluate((el) => JSON.parse(el.textContent!));
      if (section.volume === "volume-6") {
        expect(blocks.some(b => /\bBab 0\b/.test(b.text))).toBeFalsy();
      }
      const total = Number(
        (await page.locator("#page-count").innerText()).split("/")[1],
      );
      let prose = "",
        emphasis = "";
      const images: string[] = [];
      for (let i = 0; i < total; i++) {
        await expect(page.locator("#page-count")).toHaveText(
          `${i + 1} / ${total}`,
        );
        const rendered = await page.locator("#page").evaluate((el) => ({
          text: [...el.querySelectorAll("h1,h2,p")]
            .map((x) => x.textContent)
            .join(""),
          emphasis: [...el.querySelectorAll("em")]
            .map((x) => x.textContent)
            .join(""),
          fits: el.scrollHeight <= el.clientHeight + 2,
          images: [...el.querySelectorAll("img")].map((x) => ({
            src: x.getAttribute("src")!,
            fit: getComputedStyle(x).objectFit,
          })),
        }));
        expect(rendered.fits).toBeTruthy();
        prose += rendered.text;
        emphasis += rendered.emphasis;
        for (const img of rendered.images) {
          expect(img.fit).toBe("contain");
          images.push(img.src);
        }
        if (i < total - 1) await page.locator("#next").click();
      }
      expect(prose).toBe(
        blocks
          .filter((b) => b.kind !== "image")
          .map((b) => b.text)
          .join(""),
      );
      expect(emphasis).toBe(
        blocks
          .flatMap((b) =>
            (b.emphasis || [])
              .filter((m) => m.style === "em" || m.style === "strong-em")
              .map((m) => b.text.slice(m.start, m.end)),
          )
          .join(""),
      );
      expect(images).toEqual(
        blocks
          .filter((b) => b.kind === "image")
          .map((b) =>
            b.src!.startsWith("/") ? b.src : `/aku-oregairu/${b.src}`,
          ),
      );
      const index = sections
        .filter((s) => s.volume === section.volume)
        .findIndex((s) => s.id === section.id);
      const next = sections.filter((s) => s.volume === section.volume)[
        index + 1
      ];
      if (next) {
        await page.locator("#next").click();
        await expect(page).toHaveURL(
          new RegExp(`/baca/${next.volume}/${next.slug}/$`),
        );
        await ready(page);
        await page.locator("#prev").click();
        await expect(page).toHaveURL(
          new RegExp(`/baca/${section.volume}/${section.slug}/$`),
        );
        await expect(page.locator("#page-count")).toHaveText(
          `${total} / ${total}`,
        );
      } else await expect(page.locator("#next")).toBeDisabled();
    });
  }
}
for (const [volume, count, chapters] of [
  ["volume-3", 9, 6],
  ["volume-4", 11, 8],
  ["volume-5", 11, 8],
  ["volume-6", 14, 10],
] as const) {
  test(`${volume} catalog and saved progress remain scoped to its edition`, async ({
    page,
  }) => {
    await page.goto(`volume/${volume}/`);
    await expect(page.locator("[data-edition=id] .chapter-list a")).toHaveCount(
      count,
    );
    expect(
      sections.filter((s) => s.volume === volume && s.kind === "chapter"),
    ).toHaveLength(chapters);
    await page.locator("#start-reading").click();
    await ready(page);
    await expect(page.locator("#reader")).toHaveAttribute(
      "data-volume",
      volume,
    );
    await page.locator("#next").click();
    const progress = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("oregairu.progress")!),
    );
    expect(progress.volume).toBe(volume);
    await page.goto(`volume/${volume}/`);
    await expect(page.locator("#start-reading")).toHaveText(
      "Lanjutkan Membaca →",
    );
    await page.locator("#start-reading").click();
    await ready(page);
    await expect(page.locator("#page-count")).toHaveText(/^2 \/ /);
  });
}
