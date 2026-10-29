import { test, expect } from "@playwright/test";
const reader = "baca/contoh/ruang-yang-tenang/";
async function ready(page: any) {
  await expect(page.locator("#page-count")).toHaveText(/1 \/ \d+/);
  await page.waitForTimeout(250);
}
for (const width of [320, 360, 390, 430, 768, 1280])
  test(`catalog and complete pagination at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("");
    await expect(page.locator(".volume-card")).toHaveCount(18);
    await expect(page.locator(".wordmark")).toContainText("Aku Oregairu");
    await expect(page.locator(".yukino-portrait")).toBeVisible();
    await page.locator(".volume-card img").evaluateAll(async (images) => {
      await Promise.all(
        images.map(async (image) => {
          const img = image as HTMLImageElement;
          img.loading = "eager";
          await img.decode();
          if (!img.naturalWidth) throw new Error("Sampul gagal dimuat");
        }),
      );
    });
    await expect(page.getByText("SAMPUL PENGGANTI")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.locator(".volume-card a").first().click();
    await expect(
      page.getByText("Konten belum tersedia.", { exact: false }).last(),
    ).toBeVisible();
    await expect(page.locator(".detail-intro img")).toHaveAttribute(
      "alt",
      "Sampul Oregairu Volume 01",
    );
    await page.goto(reader);
    await ready(page);
    const blocks = await page
      .locator("#chapter-data")
      .evaluate((el) => JSON.parse(el.textContent!));
    let text = "";
    let illustrations = 0;
    const total = Number(
      (await page.locator("#page-count").innerText()).split("/")[1],
    );
    for (let i = 0; i < total; i++) {
      expect(
        await page
          .locator("#page")
          .evaluate((el) => el.scrollHeight <= el.clientHeight + 2),
      ).toBeTruthy();
      text += await page
        .locator("#page")
        .evaluate((el) =>
          [...el.querySelectorAll("h1,p")].map((x) => x.textContent).join(""),
        );
      illustrations += await page.locator("#page img").count();
      if (i < total - 1) await page.locator("#next").click();
    }
    expect(text).toBe(
      blocks
        .filter((b: any) => b.kind !== "image")
        .map((b: any) => b.text)
        .join(""),
    );
    expect(illustrations).toBe(1);
    await expect(page.locator("#next-chapter")).toBeVisible();
    await page.locator("#next-chapter").click();
    await expect(page).toHaveURL(/catatan-di-jendela/);
  });
test("progress survives settings, resize, refresh and history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(reader);
  await ready(page);
  for (let i = 0; i < 4; i++) await page.keyboard.press("ArrowRight");
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("oregairu.progress")!),
  );
  await page.getByRole("button", { name: "Pengaturan baca" }).click();
  await page.locator("#font-size").fill("24");
  await page.getByRole("button", { name: "Gelap", exact: true }).click();
  await page.getByRole("button", { name: "2.0×" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(350);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("oregairu.progress")!),
    ),
  ).toEqual(before);
  await page.reload();
  await page.waitForTimeout(400);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("oregairu.progress")!),
    ),
  ).toEqual(before);
  await expect(page.locator("#reader")).toHaveAttribute("data-theme", "gelap");
  await page.goto("");
  await expect(page.locator("#resume")).toBeVisible();
  await page.locator("#resume").click();
  await page.goBack();
  await expect(page.locator("#resume")).toBeVisible();
});
test("illustration viewer zoom, close and focus; tap and swipe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(reader);
  await ready(page);
  await page.locator("#page").click({ position: { x: 300, y: 150 } });
  await expect(page.locator("#page-count")).toHaveText(/^2 \/ /);
  await page.locator("#page").dispatchEvent("pointerdown", {
    pointerId: 1,
    isPrimary: true,
    clientX: 300,
    clientY: 200,
  });
  await page.locator("#page").dispatchEvent("pointerup", {
    pointerId: 1,
    isPrimary: true,
    clientX: 100,
    clientY: 205,
  });
  await expect(page.locator("#page-count")).toHaveText(/^3 \/ /);
  for (let i = 0; i < 40 && !(await page.locator("#page img").count()); i++)
    await page.locator("#next").click();
  await page
    .getByRole("button", { name: "Perbesar ilustrasi", exact: true })
    .click();
  await expect(page.locator("#viewer")).toBeVisible();
  await page.locator("#zoom-in").click();
  await expect(page.locator("#zoom-reset")).toHaveText("150%");
  await page.keyboard.press("Escape");
  await expect(page.locator("#viewer")).not.toBeVisible();
  await expect(page.locator("#page [data-image]")).toBeFocused();
});
test("malformed or unavailable storage does not break reading", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("oregairu.progress", "{bad");
    localStorage.setItem("oregairu.settings", '{"version":1,"size":"oops"}');
  });
  await page.goto(reader);
  await ready(page);
  await page.reload();
  await expect(page.locator("#page-count")).toContainText("/");
});
test("storage denied", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw Error("denied");
    };
    Storage.prototype.setItem = () => {
      throw Error("denied");
    };
  });
  await page.goto(reader);
  await ready(page);
  await page.locator("#next").click();
  await expect(page.locator("#page-count")).toHaveText(/^2 \/ /);
});
test("readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/aku-oregairu/" + reader);
  await expect(page.locator("#page p")).toHaveCount(28);
  await expect(page.locator("#reader")).toHaveClass(/fallback/);
  await context.close();
});

test("selection, center controls, reduced motion and large type", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(reader);
  await ready(page);
  await expect(page.locator("#next-chapter")).toBeHidden();
  await expect(page.locator("#page em").first()).toHaveText("Pagi itu");
  await page.locator("#page").evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el.querySelector("p")!);
    window.getSelection()!.addRange(range);
  });
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#page-count")).toHaveText(/^1 \/ /);
  await page.evaluate(() => window.getSelection()!.removeAllRanges());
  await page.locator("#page").click({ position: { x: 138, y: 50 } });
  await expect(page.locator(".reader-top")).toBeHidden();
  await page.locator("#page").click({ position: { x: 138, y: 50 } });
  await expect(page.locator(".reader-top")).toBeVisible();
  await page.getByRole("button", { name: "Pengaturan baca" }).click();
  await page.locator("#font-size").fill("28");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  expect(
    await page
      .locator("#page")
      .evaluate((el) => el.scrollHeight <= el.clientHeight + 2),
  ).toBeTruthy();
  expect(
    await page
      .locator("#page")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  await page.waitForTimeout(300);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Pengaturan baca" }).click();
  expect(
    await page
      .locator("#settings")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBeTruthy();
});

test("spread image and short viewport fallback", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("baca/contoh/catatan-di-jendela/");
  await ready(page);
  for (let i = 0; i < 80 && !(await page.locator("#page img").count()); i++)
    await page.locator("#next").click();
  await expect(page.locator("#page img")).toHaveAttribute(
    "src",
    /landscape.svg/,
  );
  expect(
    await page
      .locator("#page img")
      .evaluate((el) => getComputedStyle(el).objectFit),
  ).toBe("contain");
  await page.setViewportSize({ width: 390, height: 200 });
  await page.waitForTimeout(400);
  await expect(page.locator("#reader")).toHaveClass(/fallback/);
  await expect(page.locator("#page p")).toHaveCount(28);
});
