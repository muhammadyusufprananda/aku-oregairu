import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import config from '../astro.config.mjs';

const base = `/${(config.base || '').replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
const root = new URL('../dist/', import.meta.url);
const manifest = {
  id: base, name: 'Aku Oregairu', short_name: 'Aku Oregairu', lang: 'id',
  description: 'Baca terjemahan penggemar Oregairu dalam Bahasa Indonesia.',
  start_url: base, scope: base, display: 'standalone',
  background_color: '#ffffff', theme_color: '#ffffff',
  icons: [192, 512].map(size => ({ src: `${base}icons/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any maskable' })),
};
await writeFile(new URL('manifest.webmanifest', root), JSON.stringify(manifest, null, 2));
async function walk(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) result.push(...await walk(new URL(`${entry.name}/`, dir), `${path}/`));
    else if (entry.name !== 'sw.js') result.push(path);
  }
  return result.sort();
}
const files = await walk(root);
const hash = createHash('sha256').update(base).update(await readFile(new URL(import.meta.url)));
for (const file of files) hash.update(file).update(await readFile(new URL(file, root)));
const urls = files.map(file => base + file.replace(/index\.html$/, ''));
const prefix = `aku-oregairu:${base}:`;
const cache = prefix + hash.digest('hex').slice(0, 16);
await writeFile(new URL('sw.js', root), `
const CACHE = ${JSON.stringify(cache)};
const PREFIX = ${JSON.stringify(prefix)};
const URLS = ${JSON.stringify(urls)};
const BASE = ${JSON.stringify(base)};
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    try {
      // Small batches avoid flooding mobile connections. Installation is atomic.
      for (let i = 0; i < URLS.length; i += 8) {
        await cache.addAll(URLS.slice(i, i + 8).map(url => new Request(url, {cache: 'reload'})));
      }
    } catch (error) {
      await caches.delete(CACHE);
      throw error;
    }
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Only ignore reader query parameters for static page lookup.
    const key = request.mode === 'navigate' ? url.origin + url.pathname : request;
    const saved = await cache.match(key, { ignoreVary: true });
    if (saved) return saved;
    try { return await fetch(request); }
    catch {
      if (request.mode !== 'navigate') return Response.error();
      return new Response('<!doctype html><html lang="id"><meta name="viewport" content="width=device-width"><title>Belum tersedia offline</title><body><h1>Halaman belum tersedia offline</h1><p>Hubungkan perangkat ke internet untuk membuka halaman ini.</p><a href="' + BASE + '">Kembali ke katalog</a></body></html>', {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8'}});
    }
  })());
});
`);
console.log(`PWA: ${files.length} files, cache ${cache}`);
