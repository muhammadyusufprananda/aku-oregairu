# Aset Aku Oregairu

- Pemilik proyek mengonfirmasi penggunaan aset koleksi lokal dan meminta penerjemahan serta publikasi Volume 1 Bab 1 sebagai draf dalam percakapan pada 30 Oktober 2026. Ini dasar pemasangan materi, bukan klaim lisensi terbuka atau afiliasi resmi.
- `public/assets/covers/volume-*-{360,720}.webp`: gambar sampul yang ditandai dalam EPUB masing-masing volume, dikonversi tanpa pemotongan. Rincian sumber ada di `cover-sources.json`.
- `public/assets/chapters/volume-1/bab-1/*.webp`: empat ilustrasi dari bagian Bab 1, karya Ponkan8; sumber dan urutannya ada di `editorial/volume-1-bab-1-sources.json`. Gambar tidak digambar ulang. Tulisan dalam ilustrasi bentang diterjemahkan sebagai teks pendamping pada bacaan.
- `public/assets/chapters/volume-1/pembuka/*.webp`: delapan halaman bergambar sebelum Bab 1 dalam urutan spine. Sampul dan sisipan yang serupa tidak digabung. Gambar tidak digambar ulang; tulisan bermakna diberi terjemahan pendamping berstatus draf. Pemetaan ada di `editorial/volume-1-pembuka-sources.json`.
- `public/assets/yukino-{400,800}.webp`: hasil imagegen dari referensi `UI Refrence.png` pengguna, dipakai sebagai hero. Bukan gambar resmi yang diklaim autentik.
- Teks Indonesia Bab 1 adalah draf berbantuan AI dari edisi Inggris terjemahan Jennifer Ward (Yen Press), novel Wataru Watari dengan ilustrasi Ponkan8. Hak karya tetap pada pemegang hak masing-masing. Status editorial dan cara meninjaunya dijelaskan di `editorial/README.md`.
- Font Noto Sans, Literata, dan Nunito menggunakan SIL Open Font License. Salinan: `public/assets/Noto-Sans-OFL.txt`, `Literata-OFL.txt`, dan `Nunito-OFL.txt`. Nunito 900 adalah pendekatan gaya judul sampul, bukan identifikasi font asli.

Berkas EPUB, ekstraksi prosa Inggris, dan gambar referensi antarmuka tidak masuk build publik. Aset SVG serta teks demonstrasi sudah dihapus.

- Kelanjutan Volume 1 dipasang atas permintaan pemilik untuk menyelesaikan volume. `assets/chapters/volume-1/bab-{2..8}/` dan `catatan-penerjemah/` berisi 23 ilustrasi tambahan dari EPUB yang sama, dalam urutan spine. Pemetaan: `editorial/volume-1-remaining-sources.json`. Tujuh profil/angket bergambar diberi teks terjemahan pendamping. Tidak ada gambar yang diunduh dari situs pihak ketiga.
- Metode draf mesin Google Translate dan penyuntingan awal AI dijelaskan terbuka di halaman Tentang serta panduan editorial. Kata penutup dan catatan penerjemah edisi Inggris bukan tulisan editorial asli proyek.
