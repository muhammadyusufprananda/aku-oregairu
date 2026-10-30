# Aku Oregairu

Situs statis Astro + TypeScript + CSS untuk GitHub Pages. Membutuhkan Node.js 24 dan npm.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

Buka URL yang ditampilkan dengan subpath `/aku-oregairu/`.

## Konten dan status editorial

Pembuka Volume 1 dan Bab 1 tersedia sebagai **draf berbantuan AI yang belum ditinjau manusia**, diterjemahkan dari EPUB Inggris lokal. Bab lain belum dipublikasikan. Teks/ilustrasi demo telah dihapus; tautan demo lama menampilkan pemberitahuan dan tautan ke Volume 1.

- Metadata dan status setiap bagian: `src/content/chapters/index.json`.
- Terjemahan ber-ID stabil: `src/content/chapters/volume-1-bab-1.json`.
- Cara meninjau, mengubah `draft` menjadi `reviewed`, pemetaan sumber, dan isu bahasa: [panduan editorial](docs/editorial/README.md).
- Nama dan istilah: [glosarium](docs/editorial/GLOSARIUM.md).

Build memeriksa referensi volume, status, isi bab, rentang penekanan, urutan dan kelengkapan pemetaan sumber, serta aset. Pertahankan ID blok ketika memperbaiki terjemahan agar progres tetap bermakna. Pemeriksaan teknis tidak menggantikan peninjauan manusia. Bahasa Inggris sumber dan EPUB tidak ditambahkan sebagai prosa/file publik; `raw/` diabaikan Git.

## Reader

Mulai Membaca membuka `/baca/volume-1/pembuka/` dari sampul bila belum ada progres. Pembuka memuat delapan gambar sesuai spine EPUB dan teks pendamping Indonesia. Daftar isi menyediakan Pembuka serta Bab 1; bab lain yang disebut pada daftar isi sumber belum tersedia sebagai bacaan. Akhir Pembuka terhubung ke Bab 1; mundur dari awal Bab 1 kembali ke akhir Pembuka. Header tetap dapat disembunyikan/ditampilkan dengan ketuk tengah.

Metadata memakai `kind: frontmatter | chapter`, `order`, serta `number: null` untuk Pembuka. Progres versi 2 tetap kompatibel; identitas bab lama tidak berubah. Posisi navigasi browser disimpan juga dalam history state. Permintaan lintas bagian `?pos=akhir` berlaku sekali dan dibersihkan dari URL agar refresh berikutnya memulihkan posisi tersimpan.

Pagination mengukur DOM, membagi paragraf pada batas kata, dan mempertahankan italic/bold. Posisi memakai identitas volume/bab serta ID blok dan offset teks. Nomor halaman adalah hasil layout, bukan metadata tetap. Jika layout terlalu pendek atau pagination gagal, reader menampilkan teks bergulir. Tanpa JavaScript, teks tetap tersedia.

Default: Noto Sans 18 px, spasi 1,8, tema Putih. Pengunjung dapat memilih Sans-serif/Serif (Literata), ukuran, spasi, dan tema Kertas/Putih/Gelap. Judul tetap Nunito 900. Pengaturan versi 1 dimigrasikan ke versi 2 dengan tema, ukuran, dan spasi tetap; font awal Sans-serif. Progres demo versi lama diabaikan, tanpa menghapus pengaturan. Data rusak atau storage yang diblokir tidak menghentikan pembacaan.

## Pengujian

```sh
npx playwright install chromium
npm test
```

Tes Chromium menggunakan enam lebar viewport termasuk ponsel, seluruh pagination Pembuka dan Bab 1, urutan gambar sumber, batas antarbagian, penekanan, ilustrasi bentang, reflow, pergantian font, progres, migrasi penyimpanan, dialog, zoom 200%, dan fallback tanpa JavaScript. Belum menggantikan pengujian perangkat fisik. PWA ditunda: tidak ada manifest, service worker, atau jaminan bacaan offline.

## GitHub Pages

Target: https://muhammadyusufprananda.github.io/aku-oregairu/

Workflow `.github/workflows/deploy.yml` memeriksa, menguji, dan membangun `dist/` pada push ke `main`. Sumber Pages: **GitHub Actions**. Tautan dan aset memakai base URL. Untuk custom domain, ubah `site` dan `base` lalu uji ulang. Tidak ada Node.js runtime, akun, database, atau dashboard editorial di hosting.

## Aset

Lihat [catatan aset](docs/ASSETS.md). Noto Sans, Literata, dan Nunito di-host lokal dengan SIL Open Font License; salinan lisensi ada di `public/assets/`.

Dengan EPUB lokal yang telah diizinkan dan Python + Pillow, `python3 tools/prepare_covers.py` menyiapkan sampul WebP. `python3 tools/prepare_chapter1.py` menyiapkan ilustrasi dan pemetaan Bab 1; `python3 tools/prepare_opening.py` menyiapkan delapan halaman pembuka sesuai spine; teks Inggris sementara hanya berada di `/tmp/`. Build/CI tidak membutuhkan EPUB, Python, atau Pillow.
