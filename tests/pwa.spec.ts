import { test, expect } from '@playwright/test';

test('installs a scoped offline cache and reads chapters after offline reload', async ({ page, context }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('');
  const manifest = await page.evaluate(async () => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')!;
    return (await fetch(link.href)).json();
  });
  const favicon = await page.request.get('favicon.ico');
  expect(favicon.ok()).toBe(true);
  expect((await favicon.body()).length).toBeGreaterThan(100);
  expect(manifest.start_url).toBe('/aku-oregairu/');
  expect(manifest.scope).toBe('/aku-oregairu/');
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(['192x192', '512x512']);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.volume-card')).toHaveCount(18);
  await page.goto('baca/volume-1/bab-1/?pos=akhir');
  await expect(page.locator('#page-count')).toHaveText(/\d+ \/ \d+/);
  await page.reload();
  await expect(page.locator('#page-count')).toHaveText(/\d+ \/ \d+/);
  const image = await page.evaluate(async () => {
    const response = await fetch('/aku-oregairu/assets/chapters/volume-2/pembuka/Art_P1.webp');
    return { ok: response.ok, size: (await response.blob()).size };
  });
  expect(image.ok).toBe(true);
  expect(image.size).toBeGreaterThan(1000);
  await page.goto('belum-ada/');
  await expect(page.locator('h1')).toHaveText('Halaman belum tersedia offline');
});
