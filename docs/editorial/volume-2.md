# Editorial Volume 2 — paket pertama

Pemilik meminta melanjutkan ke Volume 2. Tersedia **Pembuka, Prolog, dan Bab 1** sebagai draf AI dari EPUB Inggris lokal (Jennifer Ward, Yen Press/Yen On), bukan langsung dari Jepang. Bab 2–5, Kata Penutup, dan Catatan Penerjemah belum diterbitkan. Jangan menyebut seluruh Volume 2 selesai.

Semua tiga bagian tetap `draft`. Peninjauan manusia hanya bisa dikonfirmasi pemilik. Ubah status pada entri volume-2 yang benar di `src/content/chapters/index.json`; jangan mengubah status bagian lain. Teks berada dalam `src/content/chapters/volume-2-{pembuka,prolog,bab-1}.json`, dengan ID stabil.

## Kelengkapan dan urutan

- `volume-2-sources.json` menyimpan ID, urutan, referensi dan hash teks sumber, tanpa prosa Inggris.
- Pembuka: tujuh gambar sesuai spine — cover, insert001, insert002, insert003, insert004, titlepage, preface001. Teks daftar isi berwarna, delapan kutipan, serta pengenalan sembilan tokoh diterjemahkan sebagai pendamping. Administrasi copyright diringkas sebagai atribusi; daftar isi sumber tidak membuat tautan ke bagian yang belum tersedia.
- Prolog: seluruh prologue.xhtml sampai prologue_d.xhtml, termasuk 25 paragraf, judul, empat gambar, serta terjemahan profil Saki/Komachi dan formulir Hachiman. Metadata `kind: frontmatter`, `number: null`, `order: 1`; tidak ditampilkan sebagai Bab 0 walaupun sumber menomori prolog dengan angka 0.
- Bab 1: seluruh chapter001.xhtml, chapter001_a.xhtml, chapter001_d.xhtml, dan chapter001_e.xhtml. Ada 239 paragraf, satu judul, tiga ilustrasi, dan dua pemisah: 245 blok sumber. Ditambahkan sembilan blok pendamping percakapan surel.
- Nama kontak berbintang ditampilkan sebagai ☆★ Yui ★☆; nada musik berupa ♪. Keduanya tetap inline, bukan halaman ornamen tersendiri.
- Total 14 gambar ditampilkan utuh. Teks Inggris pada gambar tidak dihapus atau digambar ulang, melainkan diberi pendamping Indonesia. Tulisan judul karya tetap mengikuti judul sumber.

`python3 tools/prepare_volume2.py` membaca ulang EPUB dan menyiapkan hanya tiga bagian ini secara default. Pilihan `--sections` disediakan untuk pekerjaan editorial lanjutan; jangan menambahkan metadata bagian baru sebelum isinya diterjemahkan. Ekstraksi Inggris hanya di `/tmp/aku-v2-source.json`, tidak di repository atau build. Python/Pillow hanya dipakai persiapan, bukan runtime/CI.

## Metode dan perhatian peninjau

Teks paket ini diterjemahkan dengan AI. Percobaan Google Translate dibatasi layanan, dan uji mesin lokal tidak dipakai sebagai bacaan. Tidak ada ketergantungan mesin terjemahan atau model di repository dan website. Hasil ini belum disahkan peninjau manusia.

- Prolog: pertahankan narator sinis dan tidak andal. Perumpamaan kawanan hewan bukan pernyataan editorial. Kata `retard` dalam respons batin tidak selaras dengan `idiot` pada dialog sumber; draf memakai “bodoh”, perlu keputusan editorial.
- Bab 1: permainan kata `gloss` (mengilap/penjelasan istilah) tidak mempunyai padanan langsung. “Buku penjelasan istilah” dan `gloss` dipakai sebagai padanan kerja, perlu tinjauan khusus.
- `homeroom/home/away`, Hikipedia, `check out` (salah istilah skak), dan `sukoraashippu/sukurappu` dipertahankan sebagai lelucon sumber. Jangan diam-diam memperbaiki kekeliruan narator.
- Dialog kepada guru memakai saya/Ibu; narasi memakai aku. Tinjau konsistensi, sarkasme, ucapan kasar, serta rujukan anime/manga.
- Formulir dan percakapan surel ditranskripsi secara visual. Cap waktu yang tertutup gambar tidak ditebak. Bentuk emotikon menjadi padanan teks; periksa kembali detailnya saat peninjauan.
- Pembuka memuat judul Bab 2–5 sebagai terjemahan daftar isi sumber, bukan klaim bab tersebut sudah tersedia.

Navigasi maju/mundur melintasi Pembuka → Prolog → Bab 1. Awal Bab 1 bisa kembali ke akhir Prolog. Progres memakai versi 2 dengan identitas volume dan bagian, sehingga tidak tercampur dengan Volume 1. Header tetap bisa ditoggle dengan ketuk tengah.
