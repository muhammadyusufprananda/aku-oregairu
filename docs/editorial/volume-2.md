# Editorial Volume 2 — draf lengkap

## Status sekarang

Pemilik meminta kelanjutan dari Bab 2 sampai akhir Volume 2. Seluruh sembilan bagian kini tersedia sebagai draf: Pembuka, Prolog, Bab 1–5, Kata Penutup, dan Catatan Penerjemah Edisi Inggris. Tidak ada bagian yang sudah ditinjau manusia. Pertahankan status `draft` sampai pemilik mengonfirmasi tinjauan masing-masing bagian.

## Riwayat paket pertama

Pada paket pertama, pemilik meminta melanjutkan ke Volume 2. Saat itu tersedia **Pembuka, Prolog, dan Bab 1** sebagai draf AI dari EPUB Inggris lokal (Jennifer Ward, Yen Press/Yen On), bukan langsung dari Jepang. Bab 2–5 dan bagian penutup belum tersedia pada paket pertama; kelanjutannya dijelaskan di bawah. Jangan menyebut seluruh Volume 2 selesai.

Semua tiga bagian tetap `draft`. Peninjauan manusia hanya bisa dikonfirmasi pemilik. Ubah status pada entri volume-2 yang benar di `src/content/chapters/index.json`; jangan mengubah status bagian lain. Teks berada dalam `src/content/chapters/volume-2-{pembuka,prolog,bab-1}.json`, dengan ID stabil.

## Kelengkapan dan urutan

- `volume-2-sources.json` menyimpan ID, urutan, referensi dan hash teks sumber, tanpa prosa Inggris.
- Pembuka: tujuh gambar sesuai spine — cover, insert001, insert002, insert003, insert004, titlepage, preface001. Teks daftar isi berwarna, delapan kutipan, serta pengenalan sembilan tokoh diterjemahkan sebagai pendamping. Administrasi copyright diringkas sebagai atribusi; daftar isi sumber tidak membuat tautan ke bagian yang belum tersedia.
- Prolog: seluruh prologue.xhtml sampai prologue_d.xhtml, termasuk 25 paragraf, judul, empat gambar, serta terjemahan profil Saki/Komachi dan formulir Hachiman. Metadata `kind: frontmatter`, `number: null`, `order: 1`; tidak ditampilkan sebagai Bab 0 walaupun sumber menomori prolog dengan angka 0.
- Bab 1: seluruh chapter001.xhtml, chapter001_a.xhtml, chapter001_d.xhtml, dan chapter001_e.xhtml. Ada 239 paragraf, satu judul, tiga ilustrasi, dan dua pemisah: 245 blok sumber. Ditambahkan sembilan blok pendamping percakapan surel.
- Nama kontak berbintang ditampilkan sebagai ☆★ Yui ★☆; nada musik berupa ♪. Keduanya tetap inline, bukan halaman ornamen tersendiri.
- Total 14 gambar ditampilkan utuh. Teks Inggris pada gambar tidak dihapus atau digambar ulang, melainkan diberi pendamping Indonesia. Tulisan judul karya tetap mengikuti judul sumber.

`python3 tools/prepare_volume2.py` sekarang membaca ulang EPUB dan menyiapkan seluruh sembilan bagian secara default. Pilihan `--sections` disediakan untuk pekerjaan editorial lanjutan; jangan menambahkan metadata bagian baru sebelum isinya diterjemahkan. Ekstraksi Inggris hanya di `/tmp/aku-v2-source.json`, tidak di repository atau build. Python/Pillow hanya dipakai persiapan, bukan runtime/CI.

## Metode dan perhatian peninjau

Teks paket ini diterjemahkan dengan AI. Percobaan Google Translate dibatasi layanan, dan uji mesin lokal tidak dipakai sebagai bacaan. Tidak ada ketergantungan mesin terjemahan atau model di repository dan website. Hasil ini belum disahkan peninjau manusia.

- Prolog: pertahankan narator sinis dan tidak andal. Perumpamaan kawanan hewan bukan pernyataan editorial. Kata `retard` dalam respons batin tidak selaras dengan `idiot` pada dialog sumber; draf memakai “bodoh”, perlu keputusan editorial.
- Bab 1: permainan kata `gloss` (mengilap/penjelasan istilah) tidak mempunyai padanan langsung. “Buku penjelasan istilah” dan `gloss` dipakai sebagai padanan kerja, perlu tinjauan khusus.
- `homeroom/home/away`, Hikipedia, `check out` (salah istilah skak), dan `sukoraashippu/sukurappu` dipertahankan sebagai lelucon sumber. Jangan diam-diam memperbaiki kekeliruan narator.
- Dialog kepada guru memakai saya/Ibu; narasi memakai aku. Tinjau konsistensi, sarkasme, ucapan kasar, serta rujukan anime/manga.
- Formulir dan percakapan surel ditranskripsi secara visual. Cap waktu yang tertutup gambar tidak ditebak. Bentuk emotikon menjadi padanan teks; periksa kembali detailnya saat peninjauan.
- Pembuka memuat judul Bab 2–5 sebagai terjemahan daftar isi sumber, bukan klaim bab tersebut sudah tersedia.

Pada paket pertama, navigasi maju/mundur melintasi Pembuka → Prolog → Bab 1. Awal Bab 1 bisa kembali ke akhir Prolog. Progres memakai versi 2 dengan identitas volume dan bagian, sehingga tidak tercampur dengan Volume 1. Header tetap bisa ditoggle dengan ketuk tengah.


## Penyelesaian Volume 2

Urutan akhir: Pembuka → Prolog → Bab 1 → Bab 2 → Bab 3 → Bab 4 → Bab 5 → Kata Penutup → Catatan Penerjemah Edisi Inggris. Bagian penutup memakai `kind: backmatter`, `number: null`, order 7/8; bukan Bab 6/7. ID dan isi Pembuka, Prolog, serta Bab 1 tidak berubah. Edisi Inggris dan reader bersama tetap dipertahankan.

| Bagian | Blok sumber | Ilustrasi | Blok termasuk pendamping |
| --- | ---: | ---: | ---: |
| Bab 2 | 58 | 2 | 65 |
| Bab 3 | 373 | 4 | 381 |
| Bab 4 | 810 | 8 | 815 |
| Bab 5 | 55 | 1 | 55 |
| Kata Penutup | 21 | 0 | 21 |
| Catatan Penerjemah | 84 | 1 | 84 |

Pemetaan `volume-2-sources.json` mencakup semua fragmen `chapter002*` sampai `chapter005*`, `afterword.xhtml`, dan `appendix001.xhtml` sesuai spine. Promosi newsletter bukan bagian terjemahan Indonesia. Keenam bagian baru mempertahankan seluruh 1.401 blok sumber, termasuk ornamen berulang dengan ID unik. Tiga bentang percakapan surel (Art_P48, Art_P88, Art_P170) mendapat 20 blok pendamping; gambar sumber tidak diubah. Total gambar Volume 2 sekarang 30. Teks kecil “(says me)” pada ilustrasi judul Bab 2 diterjemahkan pada keterangan gambar. Jam surel yang terlihat ditranskripsi, dan emotikon tertentu diberi padanan teks; periksa kembali saat tinjauan manusia.

### Metode kelanjutan

- Bab 2, Bab 5, dan Kata Penutup diterjemahkan dengan AI dari sumber Inggris. Teks pendamping tiga ilustrasi ditranskripsi dan diterjemahkan dengan AI.
- Bab 3–4 dan Catatan Penerjemah memakai draf awal Google Translate dengan penyuntingan awal AI. Penyuntingan memperbaiki sejumlah idiom, negasi, hubungan kakak/adik, sapaan kepada guru, istilah, judul referensi, penekanan, dan keluaran yang kehilangan kalimat. Ini **belum merupakan tinjauan semantik atau sastra menyeluruh**. Jangan menganggap tersedianya seluruh blok atau kelulusan tes sebagai bukti ketepatan bahasa.
- Metadata `translation` di setiap berkas mencatat metode dan ID blok yang diterjemahkan/disunting secara khusus oleh AI. Normalisasi istilah dan kata ganti otomatis bukan tinjauan makna.
- Layanan terjemahan hanya dipakai saat persiapan lokal. Cache dan proses penerjemahan sementara tetap di `/tmp/`; tidak ada panggilan layanan, kunci API, atau dependensi penerjemahan pada runtime maupun CI.
- Penekanan disimpan sebagai offset UTF-16 dalam teks Indonesia, sesuai pemotongan string JavaScript. Build memeriksa rentang, urutan, sumber, dan aset.

### Perhatian peninjau kelanjutan

- Bab 2: `clubbian` menjadi “insan klub”, padanan kerja istilah rekaan yang membutuhkan tinjauan; ajaran Shinran dan penggambaran keluarga berada dalam suara narator. Permainan Doppler/Grappler dipertahankan lewat akhiran `ppler`.
- Bab 3: negasi pembuka (`nothing less relaxing`) perlu dipertahankan; lelucon nama depan, meteran rasa suka, Fearow/Mirror Move, kata `bite` sebagai menyambut percakapan, serta pengorbanan Hayama perlu pembandingan khusus. Rujukan karya dan serangan gim tidak boleh diterjemahkan menjadi nama rekaan.
- Bab 4: sapaan guru saya/Ibu; hubungan Saki–Taishi dan Hachiman–Komachi; bimbingan belajar dibanding kuliah; permainan nama Perrier/Perry/Harris, `smexy`, `approval`, serta istilah pelayan kafe perlu peninjauan. Tuduhan narator dan ucapan tokoh bukan penilaian editorial. Angka kerja malam dan pernyataan hukum berasal dari narasi sumber, bukan panduan hukum situs.
- Bab 5: `play` (kelonggaran mesin/bermain) adalah permainan kata sumber. Kesimpulan tentang kebaikan dan kebohongan adalah sudut pandang Hachiman yang tidak andal; jangan diperhalus menjadi nasihat situs. Adegan akhir masih memerlukan peninjauan nuansa emosional.
- Kata Penutup: hiperbola terlambat 1.100 kali serta lelucon Yui-nique/Yui-nik mengikuti sumber, bukan fakta yang diverifikasi editorial.
- Catatan Penerjemah adalah materi edisi Inggris, bukan riset penerjemah Indonesia. Penjelasan `AT (Active Terror)`, jenis Fearow, serta klaim sejarah dan budaya dipertahankan sebagai klaim sumber dan perlu verifikasi dalam tinjauan terpisah. `rape blossom` berarti bunga kanola, bukan kekerasan seksual; `biannual` berarti dua kali setahun. Nama karya dan jurus tetap mengikuti edisi sumber.
