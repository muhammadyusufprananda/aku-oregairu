import { test, expect, type Page } from "@playwright/test";
const reader = "baca/volume-1/bab-1/";
async function ready(page: Page) {
  await expect(page.locator("#page-count")).toHaveText(/1 \/ \d+/);
  await page.waitForTimeout(200);
}
async function stored(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("oregairu.progress")!),
  );
}
for (const width of [320, 360, 390, 430, 768, 1280])
  test(`catalog and complete translated chapter at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("");
    await expect(page.locator(".volume-card")).toHaveCount(18);
    await expect(page.locator(".hero-credits")).toContainText("Wataru Watari");
    await expect(page.locator(".hero-credits")).toContainText("Ponkan8");
    await expect(page.locator(".demo-banner")).toHaveCount(0);
    expect(
      await page
        .locator(".hero-copy")
        .evaluate(
          (el) =>
            el.getBoundingClientRect().bottom <=
            document.querySelector(".series-hero")!.getBoundingClientRect()
              .bottom,
        ),
    ).toBeTruthy();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await expect(page.locator(".volume-card").first()).toContainText(
      "Bab 1 tersedia · Draf",
    );
    await page.locator(".volume-card a").first().click();
    await expect(
      page.getByRole("heading", { name: "Daftar bab" }),
    ).toBeVisible();
    await expect(
      page
        .getByText("Draf berbantuan AI—belum ditinjau manusia", {
          exact: false,
        })
        .first(),
    ).toBeVisible();
    await expect(page.locator("#start-reading")).toHaveAttribute(
      "href",
      /baca\/volume-1\/pembuka\//,
    );
    await page.locator('.chapter-list a[href$="/bab-1/"]').click();
    await ready(page);
    await expect(page).toHaveURL(/baca\/volume-1\/bab-1\//);
    await expect(page.locator(".reader-editorial")).toHaveText(
      "Draf berbantuan AI—belum ditinjau manusia",
    );
    expect(
      await page
        .locator("#page")
        .evaluate((el) => getComputedStyle(el).fontFamily),
    ).toContain("Noto Sans");
    const blocks = await page
      .locator("#chapter-data")
      .evaluate((el) => JSON.parse(el.textContent!));
    let text = "",
      emphasis = "",
      illustrations = 0;
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
          [...el.querySelectorAll("h1,h2,p")]
            .map((x) => x.textContent)
            .join(""),
        );
      emphasis += await page
        .locator("#page")
        .evaluate((el) =>
          [...el.querySelectorAll("em")].map((x) => x.textContent).join(""),
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
    expect(emphasis).toBe(
      blocks
        .flatMap((b: any) =>
          (b.emphasis || [])
            .filter((m: any) => m.style === "em" || m.style === "strong-em")
            .map((m: any) => b.text.slice(m.start, m.end)),
        )
        .join(""),
    );
    expect(illustrations).toBe(4);
    await expect(page.locator("#next-chapter")).toHaveText(
      "Kembali ke daftar bab →",
    );
    await page.locator("#next-chapter").click();
    await expect(page).toHaveURL(/volume\/volume-1\//);
  });
test("font, theme and logical progress survive reflow, refresh and history", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(reader);
  await ready(page);
  for (let i = 0; i < 8; i++) await page.keyboard.press("ArrowRight");
  const before = await stored(page);
  expect(before.version).toBe(2);
  expect(before.volume).toBe("volume-1");
  expect(before.chapter).toBe("bab-1");
  await page.getByRole("button", { name: "Pengaturan baca" }).click();
  await page.getByRole("button", { name: "Serif", exact: true }).click();
  await page.locator("#font-size").fill("24");
  await page.getByRole("button", { name: "Gelap", exact: true }).click();
  await page.getByRole("button", { name: "2.0×" }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(350);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(350);
  expect(await stored(page)).toEqual(before);
  await page.reload();
  await expect(page.locator("#page-count")).toContainText("/");
  expect(await stored(page)).toEqual(before);
  await expect(page.locator("#reader")).toHaveAttribute("data-theme", "gelap");
  await expect(page.locator("#reader")).toHaveAttribute("data-font", "serif");
  expect(
    await page
      .locator("#page")
      .evaluate((el) => getComputedStyle(el).fontFamily),
  ).toContain("Literata");
  await page.goto("");
  await expect(page.locator("#resume")).toBeVisible();
  await page.locator("#resume").click();
  await page.goBack();
  await expect(page.locator("#resume")).toBeVisible();
});
test("illustrations, spread viewer, zoom, focus, tap and swipe", async ({
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
  for (let i = 0; i < 200 && !(await page.locator("#page img").count()); i++)
    await page.locator("#next").click();
  await page
    .getByRole("button", { name: "Perbesar ilustrasi", exact: true })
    .click();
  await expect(page.locator("#viewer")).toBeVisible();
  await page.locator("#zoom-in").click();
  await expect(page.locator("#zoom-reset")).toHaveText("150%");
  await page.keyboard.press("Escape");
  await expect(page.locator("#page [data-image]")).toBeFocused();
  await page.evaluate(() =>
    localStorage.setItem(
      "oregairu.progress",
      JSON.stringify({
        version: 2,
        volume: "volume-1",
        chapter: "bab-1",
        block: "v1-b1-chapter001_g-Art_P30",
        offset: 0,
      }),
    ),
  );
  await page.reload();
  await expect(page.locator("#page img")).toHaveAttribute(
    "src",
    /Art_P30.webp/,
  );
  expect(
    await page
      .locator("#page img")
      .evaluate((el) => getComputedStyle(el).objectFit),
  ).toBe("contain");
  await page
    .getByRole("button", { name: "Perbesar ilustrasi", exact: true })
    .click();
  await expect(page.locator("#viewer-image")).toHaveAttribute(
    "src",
    /Art_P30.webp/,
  );
});
test("old settings migrate; demo progress is ignored", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "oregairu.settings",
      JSON.stringify({ version: 1, theme: "kertas", size: 22, leading: 2 }),
    );
    localStorage.setItem(
      "oregairu.progress",
      JSON.stringify({
        version: 1,
        volume: "contoh",
        chapter: 0,
        block: "p-0-1",
        offset: 0,
      }),
    );
  });
  await page.goto("");
  await expect(page.locator("#resume")).toBeHidden();
  await page.goto(reader);
  await ready(page);
  await expect(page.locator("#reader")).toHaveAttribute("data-theme", "kertas");
  await expect(page.locator("#reader")).toHaveAttribute("data-font", "sans");
  expect(
    await page.locator("#page").evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("22px");
  const s = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("oregairu.settings")!),
  );
  expect(s).toEqual({
    version: 2,
    theme: "kertas",
    font: "sans",
    size: 22,
    leading: 2,
  });
});
test("invalid and unavailable storage do not break reading", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem("oregairu.progress", "{bad");
    localStorage.setItem(
      "oregairu.settings",
      '{"version":2,"size":"oops","font":"unknown"}',
    );
  });
  await page.goto(reader);
  await ready(page);
  await expect(page.locator("#reader")).toHaveAttribute("data-font", "sans");
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
test("readable and marked as draft without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/aku-oregairu/" + reader);
  await expect(page.locator("#reader")).toHaveClass(/fallback/);
  await expect(page.locator("#reader")).toHaveAttribute("data-font", "sans");
  await expect(page.locator(".reader-editorial")).toContainText(
    "belum ditinjau manusia",
  );
  expect(await page.locator("#page p").count()).toBeGreaterThan(259);
  await expect(page.locator("#page img")).toHaveCount(4);
  await context.close();
});
test("selection, controls, reduced motion and 200 percent zoom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(reader);
  await ready(page);
  await page.locator("#page").evaluate((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    window.getSelection()!.addRange(r);
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
test("short viewport uses scroll fallback", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 200 });
  await page.goto(reader);
  await expect(page.locator("#reader")).toHaveClass(/fallback/);
  await expect(page.locator("#page img")).toHaveCount(4);
  expect(await page.locator("#page p").count()).toBeGreaterThan(259);
});
test("white default and reader palettes", async ({ page }) => {
  await page.goto(reader);
  await ready(page);
  await expect(page.locator("#reader")).toHaveAttribute("data-theme", "putih");
  await page.getByRole("button", { name: "Pengaturan baca" }).click();
  for (const [name, color] of [
    ["Kertas", "rgb(247, 243, 235)"],
    ["Gelap", "rgb(34, 37, 33)"],
    ["Putih", "rgb(255, 255, 255)"],
  ]) {
    await page.getByRole("button", { name, exact: true }).click();
    expect(
      await page
        .locator("#reader")
        .evaluate((el) => getComputedStyle(el).backgroundColor),
    ).toBe(color);
  }
});
test("hero credits remain within hero at 200 percent zoom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("");
  await page.evaluate(() => (document.documentElement.style.zoom = "2"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  expect(
    await page
      .locator(".hero-copy")
      .evaluate(
        (el) =>
          el.getBoundingClientRect().bottom <=
          document.querySelector(".series-hero")!.getBoundingClientRect()
            .bottom,
      ),
  ).toBeTruthy();
});
for (const route of [
  "volume/contoh/",
  "baca/contoh/ruang-yang-tenang/",
  "baca/contoh/catatan-di-jendela/",
])
  test(`old demo link ${route} offers actual chapter`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("#reader")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Bacaan telah diperbarui" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Buka Volume 1 →" }).click();
    await expect(page.locator("#start-reading")).toHaveAttribute(
      "href",
      /baca\/volume-1\/pembuka/,
    );
  });

const opening = "baca/volume-1/pembuka/";
for (const width of [320, 360, 390, 430, 768, 1280])
  test(`complete opening in source order at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("volume/volume-1/");
    await page.locator("#start-reading").click();
    await expect(page).toHaveURL(/pembuka\//);
    await ready(page);
    await expect(page.locator("#page img")).toHaveAttribute(
      "src",
      /pembuka\/cover.webp/,
    );
    await expect(page.locator(".reader-top")).toContainText("Pembuka Volume 1");
    await expect(page.locator(".reader-top")).not.toContainText("Bab 0");
    const blocks = await page
      .locator("#chapter-data")
      .evaluate((el) => JSON.parse(el.textContent!));
    let text = "";
    const images: string[] = [];
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
          [...el.querySelectorAll("h1,h2,p")]
            .map((e) => e.textContent)
            .join(""),
        );
      if (await page.locator("#page img").count()) {
        const img = page.locator("#page img");
        await img.evaluate((el: HTMLImageElement) => el.decode());
        expect(await img.evaluate((el) => getComputedStyle(el).objectFit)).toBe(
          "contain",
        );
        images.push((await img.getAttribute("src"))!.split("/").pop()!);
      }
      if (i < total - 1) await page.locator("#next").click();
    }
    expect(images).toEqual([
      "cover.webp",
      "insert002.webp",
      "insert001.webp",
      "insert003.webp",
      "insert005.webp",
      "titlepage.webp",
      "preface001.webp",
      "preface002.webp",
    ]);
    expect(text).toBe(
      blocks
        .filter((b: any) => b.kind !== "image")
        .map((b: any) => b.text)
        .join(""),
    );
    await expect(page.locator("#next-chapter")).toHaveText("Lanjut ke Bab 1 →");
    await page.locator("#next").click();
    await expect(page).toHaveURL(/bab-1\//);
    await ready(page);
  });

test("section boundary arrows, keyboard, browser history and last-page refresh", async ({
  page,
}) => {
  await page.goto(opening + "?pos=akhir");
  await expect(page.locator("#next-chapter")).toBeVisible();
  await expect(page).toHaveURL(/pembuka\/$/);
  const end = await page.locator("#page-count").innerText();
  expect(end.split("/").map((n) => Number(n.trim()))[0]).toBe(
    Number(end.split("/")[1]),
  );
  await page.reload();
  await expect(page.locator("#page-count")).toHaveText(end);
  await page.locator("#next").click();
  await expect(page).toHaveURL(/bab-1\//);
  await ready(page);
  await page.locator("#prev").click();
  await expect(page).toHaveURL(/pembuka\/$/);
  await expect(page.locator("#page-count")).toHaveText(end);
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/bab-1\//);
  await ready(page);
  await page.goBack();
  await expect(page).toHaveURL(/pembuka\/$/);
  await expect(page.locator("#page-count")).toHaveText(end);
  await page.goForward();
  await expect(page).toHaveURL(/bab-1\//);
  await expect(page.locator("#page-count")).toHaveText(/^1 \/ /);
  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/pembuka\/$/);
  await expect(page.locator("#page-count")).toHaveText(end);
});

test("opening progress resumes and existing chapter progress remains valid", async ({
  page,
}) => {
  await page.goto(opening);
  await ready(page);
  await page.locator("#next").click();
  const before = await stored(page);
  expect(before.chapter).toBe("pembuka");
  await page.goto("");
  await expect(page.locator("#resume")).toContainText("Pembuka Volume 1");
  await page.locator("#resume").click();
  expect(await stored(page)).toEqual(before);
  await page.evaluate(() =>
    localStorage.setItem(
      "oregairu.progress",
      JSON.stringify({
        version: 2,
        volume: "volume-1",
        chapter: "bab-1",
        block: "v1-b1-chapter001_d-p061",
        offset: 0,
      }),
    ),
  );
  await page.goto("volume/volume-1/");
  await expect(page.locator("#start-reading")).toHaveText(
    "Lanjutkan Membaca →",
  );
  await expect(page.locator("#start-reading")).toHaveAttribute("href", /bab-1/);
  await page.locator("#start-reading").click();
  await expect(page.locator("#page")).toContainText("Tenang, Yukinoshita");
});

test("opening cover controls still toggle; TOC lists only available sections", async ({
  page,
}) => {
  await page.goto(opening);
  await ready(page);
  await page.locator("#page").click({ position: { x: 300, y: 100 } });
  await expect(page.locator("#viewer")).toBeVisible();
  await page.locator("#zoom-in").click();
  await expect(page.locator("#zoom-reset")).toHaveText("150%");
  await page.keyboard.press("Escape");
  await expect(page.locator("#page [data-image]")).toBeFocused();
  await page.locator("#next").click();
  await page.locator("#next").click();
  await expect(page.locator("#page img")).toHaveCount(0);
  await page.locator("#page").click({
    position: {
      x: Math.floor((await page.locator("#page").boundingBox())!.width / 2),
      y: 30,
    },
  });
  await expect(page.locator(".reader-top")).toBeHidden();
  await page.locator("#page").click({
    position: {
      x: Math.floor((await page.locator("#page").boundingBox())!.width / 2),
      y: 30,
    },
  });
  await expect(page.locator(".reader-top")).toBeVisible();
  await page.getByRole("button", { name: "Daftar bab", exact: true }).click();
  await expect(page.locator("#toc a")).toHaveCount(2);
  await expect(page.locator("#toc a").first()).toHaveAttribute(
    "href",
    /pembuka/,
  );
  await expect(page.locator("#toc a").last()).toHaveAttribute("href", /bab-1/);
});

test("opening is readable without JavaScript and links to chapter one", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://localhost:4321/aku-oregairu/" + opening);
  await expect(page.locator("#page img")).toHaveCount(8);
  await expect(page.locator(".reader-section-links")).toBeVisible();
  await expect(page.locator("#page")).toContainText(
    "Masa muda adalah kebohongan",
  );
  await page
    .getByRole("link", { name: "Lanjut ke Bab 1 →", exact: true })
    .click();
  await expect(page.locator("#page h1")).toContainText("Bagaimanapun");
  await context.close();
});
