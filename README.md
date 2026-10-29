# Aku Oregairu

Website statis dengan Astro, TypeScript, dan CSS. Membutuhkan Node.js 24 dan npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Buka URL yang ditampilkan, dengan subpath `/aku-oregairu/`.

## Konten

`src/lib/catalog.ts` memisahkan metadata volume, daftar bab demo, dan blok bacaan ber-ID stabil. Saat menambahkan konten editorial yang diizinkan, pertahankan ID blok agar progres tetap bermakna. Nomor halaman dihitung dari layout, bukan metadata. Demo adalah teks orisinal dengan ilustrasi SVG buatan proyek; bukan terjemahan novel. Tidak ada metadata resmi selain nomor inventaris lokal yang diklaim. Folder `raw/` diabaikan Git dan tidak masuk build.

Reader mengukur blok dalam DOM. Paragraf panjang dibagi pada batas kata. Posisi memakai ID blok dan offset teks, disimpan bersama pengaturan dalam localStorage versi 1. Jika pagination gagal (misalnya viewport terlalu pendek), reader beralih ke teks bergulir. Tanpa JavaScript, teks tetap tersedia. Layout prose mendukung heading, paragraf dengan rentang penekanan inline, dan gambar. Penekanan dipertahankan saat teks dipisah antarhalaman.

## Pengujian

```sh
npx playwright install chromium
npm test
```

Tes otomatis memakai Chromium desktop dengan viewport ponsel; bukan pengganti pengujian perangkat fisik. Reload tanpa jaringan hanya bekerja jika resource sudah tersedia dalam cache browser; tidak ada service worker atau jaminan mode offline.

## GitHub Pages

Target: https://muhammadyusufprananda.github.io/aku-oregairu/

Workflow `.github/workflows/deploy.yml` membangun `dist/` pada push ke `main`. Pilih **Settings → Pages → Source → GitHub Actions** di GitHub. Semua tautan internal memakai helper base URL. Untuk custom domain, ubah `site` dan `base` di konfigurasi Astro dan uji ulang aset/deep link. Tidak ada Node.js runtime di hosting.

Font Literata: SIL Open Font License, salinan di `public/assets/Literata-OFL.txt`. Teks dan SVG demo dibuat dengan bantuan AI. Hak Oregairu tetap pada pemegang haknya; teks dan berkas EPUB tidak dipublikasikan. Sampul katalog diambil dari EPUB lokal berdasarkan konfirmasi izin pemilik proyek; ilustrasi Yukino disiapkan dari referensi dengan bantuan AI. Rincian aset ada di `docs/ASSETS.md`.

## Menyiapkan ulang sampul

Dengan koleksi EPUB lokal yang telah diizinkan dan Python + Pillow tersedia, jalankan `python3 tools/prepare_covers.py`. Script hanya mengambil gambar yang ditandai sebagai sampul pada metadata EPUB, menghasilkan WebP ukuran 360/720 piksel, dan memperbarui `docs/cover-sources.json`. Tidak mengekstrak teks bab. Build/CI memakai aset yang sudah disimpan di repo dan tidak membutuhkan `raw/` atau Python.
