# Volume 3–6 — draf Indonesia

Pemilik meminta penerjemahan Volume 3–6 dari koleksi EPUB Inggris yang disediakan. Seluruh bagian naratif dalam sumber kini memiliki draf Indonesia. Tidak ada bagian yang sudah ditinjau manusia. Status tetap `draft` sampai pemilik mengonfirmasi tinjauan bagian yang bersangkutan.

| Volume | Bagian | Bab bernomor | Blok sumber | Ilustrasi | Blok termasuk pendamping |
| --- | ---: | ---: | ---: | ---: | ---: |
| 3 | 9 | 6 | 2.396 | 28 | 2.442 |
| 4 | 11 | 8 | 1.905 | 34 | 1.961 |
| 5 | 11 | 8 | 1.370 | 31 | 1.430 |
| 6 | 14 | 10 | 2.721 | 34 | 2.771 |

## Susunan sumber

- Volume 3: Pembuka, Bab 1–6, Bonus Track, Catatan Penerjemah Edisi Inggris. `chapter007.xhtml` berjudul `Bonus track! “Like, This Sort of Birthday Song.”`, bukan Bab 7. Sumber ini tidak memiliki afterword terpisah; jangan membuat kata penutup rekaan.
- Volume 4–5: Pembuka, Bab 1–8, Kata Penutup, Catatan Penerjemah Edisi Inggris.
- Volume 6: Pembuka, Prolog, Bab 1–10, Kata Penutup, Catatan Penerjemah Edisi Inggris. `chapter000.xhtml` adalah Prolog, bukan Bab 0.
- Front matter, bonus, dan back matter memiliki `number: null`. Bonus memakai `kind: backmatter`, slug `bonus-track`. Semua bagian mengikuti urutan spine, dan navigasi maju/mundur melintasi batas bagian.
- Newsletter penerbit dan navigasi EPUB duplikat tidak diterbitkan sebagai bagian Indonesia. Halaman administrasi copyright diringkas sebagai atribusi. Daftar isi berwarna memiliki padanan daftar isi teks di Pembuka; judul karya pada sampul tetap mengikuti sumber.
- Semua fragmen `chapterNNN*` tergabung dalam bab masing-masing. `volumes-3-6-sources.json` menyimpan ID, referensi, jenis blok, dan hash sumber tanpa ekstraksi prosa Inggris tambahan. `volumes-3-6-titles.json` menyimpan terjemahan judul yang menjadi acuan metadata dan daftar isi.

## Metode dan batas tinjauan

Draf awal prosa memakai Google Translate (Inggris → Indonesia), lalu mendapat penyuntingan awal serta normalisasi istilah berbantuan AI. Judul, sejumlah idiom/negasi bermasalah, dan teks pendamping ilustrasi diterjemahkan/disunting dengan AI. Ini **belum merupakan peninjauan semantik atau sastra menyeluruh**. Keluaran mesin masih dapat kaku, salah konteks, atau tidak konsisten dalam kata ganti; periksa seluruh paragraf terhadap sumber sebelum menyatakan bagian ditinjau.

Metadata `translation` tiap berkas mencatat metode dan ID blok yang menerima penyuntingan khusus. Normalisasi otomatis istilah, kutip, dan kata ganti narasi bukan pemeriksaan makna. Penekanan inline disimpan sebagai offset UTF-16 dalam hasil Indonesia. Pemeriksaan teknis memvalidasi ID, urutan sumber, rentang penekanan dan keberadaan aset; itu tidak membuktikan ketepatan terjemahan.

Semua layanan terjemahan hanya dipakai saat persiapan lokal. Input, cache, serta skrip layanan sementara ada di `/tmp/`, tidak berjalan pada runtime maupun CI. Tidak ada dependensi atau kunci API penerjemahan pada situs. `python tools/prepare_volumes3_6.py` hanya menyiapkan input editorial dari edisi Inggris yang sudah ada serta menyalin aset WebP; tidak menimpa terjemahan.

## Ilustrasi dan pendamping

Sebanyak 127 ilustrasi tetap utuh, termasuk bentang lebar. Tiga puluh dua ilustrasi bertulisan memiliki 208 blok pendamping: kutipan berwarna, pengenalan tokoh, esai/rancangan cerita, proposal pentas, profil, percakapan, serta surel. Pendamping ditranskripsi dan diterjemahkan dengan AI dari gambar; OCR lokal membantu inspeksi tetapi bukan mesin penerjemahan produksi. `volumes-3-6-illustrations.json` memetakan pendamping ke gambar dan sumbernya.

Panah, angka lingkaran delapan, dan aksara kecil 月/旨/脂 serta 相模/相撲 pada catatan adalah teks di posisi sumbernya, bukan halaman ilustrasi penuh. Gambar sumber tidak digambar ulang. Cap waktu yang tertutup tidak ditebak; beberapa emotikon diberi padanan teks. Periksa ulang pembacaan huruf kecil, urutan balon percakapan, nama, dan angka saat tinjauan manusia.

## Perhatian peninjau

- Seluruh volume: konsistensi aku/kamu untuk narasi serta teman sebaya dan saya/Ibu ketika berbicara dengan guru; panggilan Kak untuk Komachi; jangan membalik hubungan kakak/adik. Sarkasme dan penilaian tokoh bukan pernyataan editorial.
- Volume 3: permainan kata pelayanan, aturan permainan kartu Double Beggar, `nothing less` sebagai pujian/sindiran (bukan ketiadaan harapan), nama ganda/penyamaran, metafora turnamen dan referensi judul. Bonus track memakai format dialog dan tetap bagian terpisah.
- Volume 4: narasi tentang Rumi dan pengucilan; pilihan kata pada rencana penjelajahan malam; `Smile Pretty Cure` dan humor nama tempat. Esai `Kokoro` mencerminkan suara Hachiman. Pendamping perjalanan ke Chiba Village mempertahankan Destiny/Grue-bear sesuai sumber, bukan menggantinya dengan merek nyata.
- Volume 5: humor pesan singkat `long suits/short`, `U/underwear`, serta `brocon`; teks panjang tentang ramen adalah pesan tokoh dalam cerita, bukan rekomendasi perjalanan saat ini. Laporan Komachi memuat permainan kata dan klaim kimia dari sumber; jangan menganggapnya materi pelajaran yang telah diverifikasi.
- Volume 6: istilah kepanitiaan/festival, hubungan Haruno–Yukino, rencana pentas Ebina yang sengaja tidak andal, slang/gaya bicara Sagami, serta simpulan karakter pada bab akhir. Permainan kata fragmen `neighbor live?` di kata penutup perlu tinjauan khusus.
- Catatan penerjemah berasal dari edisi Inggris. Nama karya, jurus, fakta budaya, dan klaim sejarah belum diverifikasi sebagai riset baru oleh proyek ini. Jangan mengubah penjelasan sumber diam-diam; tandai koreksi editorial secara terpisah.

Volume 1–2, edisi Inggris, pengaturan, dan skema progres versi 2 tetap dipertahankan. Volume 6.5 bukan bagian permintaan ini dan belum memiliki terjemahan Indonesia.
