import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const english: { volume: string; slug: string; kind: string }[] = JSON.parse(
  readFileSync("src/content/english/index.json", "utf8"),
);
for (const width of [320, 390, 768]) {
  test(`English edition and independent progress at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("volume/volume-1/?bahasa=en");
    await expect(page.locator('[data-edition="en"]')).toBeVisible();
    await expect(page.locator('[data-edition="id"]')).toBeHidden();
    await page.evaluate(() =>
      localStorage.setItem(
        "oregairu.progress",
        JSON.stringify({
          version: 2,
          volume: "volume-1",
          chapter: "bab-1",
          block: "preserved",
          offset: 0,
        }),
      ),
    );
    await page.locator("[data-english-start]").click();
    await expect(page.locator("#reader")).toHaveAttribute(
      "data-language",
      "en",
    );
    await expect(page.locator("#page")).toHaveAttribute("lang", "en");
    await expect
      .poll(() =>
        page.evaluate(() => localStorage.getItem("oregairu.progress.en")),
      )
      .not.toBeNull();
    expect(
      JSON.parse(
        (await page.evaluate(() => localStorage.getItem("oregairu.progress")))!,
      ),
    ).toMatchObject({ block: "preserved" });
    await page.reload();
    await expect(page.locator("#reader")).toHaveAttribute(
      "data-language",
      "en",
    );
    await page.locator('[data-open="toc"]').click();
    const links = await page
      .locator("#toc a")
      .evaluateAll((nodes) =>
        nodes.map((n) => (n as HTMLAnchorElement).pathname),
      );
    expect(
      links.every((link) => link.includes("/baca/en/volume-1/")),
    ).toBeTruthy();
  });
}
test("all catalog volumes have English opening and chapter content", () => {
  const volumes = new Set(english.map((c) => c.volume));
  expect(volumes.size).toBe(18);
  for (const volume of volumes) {
    expect(
      english.some((c) => c.volume === volume && c.slug === "pembuka"),
    ).toBeTruthy();
    expect(
      english.some((c) => c.volume === volume && c.kind === "chapter"),
    ).toBeTruthy();
  }
});
