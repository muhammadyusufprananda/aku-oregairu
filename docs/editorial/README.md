# Editorial Volume 1

Status awal: **draft**, belum ditinjau manusia. Publikasi draf diminta pemilik proyek pada 30 Oktober 2026; publikasi bukan pengesahan akurasi hasil AI.

## Mengubah status setelah meninjau

1. Tinjau seluruh teks, ilustrasi, penekanan, dan istilah. Perbaiki isi di `src/content/chapters/volume-1-bab-1.json` tanpa mengganti ID blok yang tidak perlu.
2. Setelah selesai, buka `src/content/chapters/index.json` di GitHub dan cari entri dengan `"id": "volume-1-bab-1"`, lalu ubah hanya `"editorialStatus": "draft"` menjadi `"editorialStatus": "reviewed"` untuk bab ini. Jangan mengubah status Pembuka tanpa meninjaunya juga. Pilihan lain ditolak saat build.
3. Commit ke `main`. GitHub Actions memeriksa dan menerbitkan perubahan. Label katalog, detail, reader, dan halaman tentang mengikuti metadata yang sama.
4. Alternatifnya, beri instruksi melalui chat bahwa Volume 1 Bab 1 sudah selesai ditinjau, lalu minta perubahan status. Agen tidak boleh menganggap pemeriksaan teknis sebagai peninjauan manusia.

Bila revisi bermakna memerlukan peninjauan baru, kembalikan status ke `draft`. Tidak ada dashboard, backend, atau toggle status publik yang bisa dipakai pengunjung.

## Pemetaan sumber dan kelengkapan

- Sumber: EPUB Volume 1 lokal, edisi Inggris Yen Press, terjemahan Jennifer Ward, karya Wataru Watari dengan ilustrasi Ponkan8. Bukan penerjemahan langsung dari bahasa Jepang.
- Batas bab: `chapter001.xhtml`, `_a`, `_d`, `_e`, `_f`, `_g`, mengikuti spine EPUB hingga sebelum `chapter002.xhtml`. Bagian pendahuluan tidak disertakan.
- Sumber memuat 259 paragraf, satu judul, empat ilustrasi, dan tiga ornamen: 267 blok. Semua memiliki ID yang dipetakan ke blok Indonesia. Tiga ornamen diganti pemisah tipografis.
- Ditambahkan 12 blok teks pendamping yang menerjemahkan tulisan pada ilustrasi bentang `Art_P30.jpg`. Gambar sumber tidak dimodifikasi; teks pendamping ditandai sebagai teks dalam ilustrasi.
- `volume-1-bab-1-sources.json` menyimpan referensi, urutan, dan hash sumber, tanpa prosa Inggris. Build memeriksa ID unik, kelengkapan/urutan blok, rentang penekanan, status editorial, dan keberadaan aset.
- `python3 tools/prepare_chapter1.py` membaca ulang EPUB lokal dengan Pillow. Teks Inggris sementara hanya ditulis ke `/tmp/aku-v1-b1-source.json`; jangan menyalinnya ke repository atau `public/`. Script tidak menimpa terjemahan Indonesia.
- Pemetaan lengkap membantu audit, tetapi tidak membuktikan ketepatan terjemahan. Semua keputusan bahasa tetap membutuhkan peninjauan manusia.

## Titik perhatian peninjau

- `chapter001-p011`: ucapan tergagap dalam sumber Inggris memiliki bentuk sengaja keliru; dipindahkan menjadi kegagapan alami dalam bahasa Indonesia.
- `chapter001_d-p013`: rangkaian lelucon guru inspiratif/putus sekolah dipertahankan tanpa menambah judul referensi yang tidak dinyatakan sumber.
- `chapter001_d-p018`: permainan asosiasi “perky” dengan dada tidak memiliki padanan langsung; draf memakai “bergairah”. Perlu peninjauan khusus.
- `chapter001_d-p051`: permainan kata “addled” dan nama permen tidak sepenuhnya tersampaikan oleh “linglung”. Pernyataan mengenai permen dipertahankan; padanan lelucon belum disahkan.
- `chapter001_d-p083`: permainan nama Yukinoshita/Yukino diterjemahkan mengikuti ungkapan edisi Inggris, bukan rekonstruksi kanji yang tidak tersedia.
- `chapter001_f-p016`, `p069`, `p078–079`: teka-teki gagak/meja, bisul, dan “ungently/accidentally” perlu pemeriksaan agar kelucuannya tidak mengubah makna.
- `chapter001_f-p039`: “Bintang Si Burung Malam” adalah padanan kerja untuk judul cerita yang disebut sumber, bukan klaim judul terjemahan resmi.
- Rujukan manga, serial, dan tokoh pada sumber tetap dipertahankan. Jangan menambahkan penjelasan lore sebagai narasi penulis.
- Teks angket pada ilustrasi akhir ditranskripsi secara visual dan diterjemahkan; periksa kembali ejaan serta susunan jawaban.

## Pembuka Volume 1

- Metadata terpisah: `id: volume-1-pembuka`, `slug: pembuka`, `kind: frontmatter`, `number: null`, `order: 0`. Bab 1 tetap `kind: chapter`, `number: 1`, `order: 1`. Tidak ada Bab 0.
- Isi ada di `src/content/chapters/volume-1-pembuka.json`. Status `draft`/`reviewed` ditetapkan independen untuk setiap bagian. Cari ID bagian yang benar saat mengubah status di metadata.
- Delapan gambar mengikuti spine: cover, insert002, insert001, insert003, insert005, titlepage, preface001, preface002. Dua di antaranya berupa bentang. Ilustrasi yang mirip sampul dipertahankan sebagai halaman tersendiri.
- Terjemahan pendamping mencakup daftar isi berwarna, kutipan enam tokoh, pengenalan tokoh, dan esai Hachiman. Judul karya/nama tetap dipertahankan. Halaman hak cipta diringkas menjadi atribusi; ornamen, alamat/promosi penerbit, serta ajakan newsletter dihilangkan. Daftar isi sumber tetap ditampilkan sebagai teks, tanpa tautan ke bab yang belum tersedia.
- `volume-1-pembuka-sources.json` mencatat berkas dan hash sumber; `tools/prepare_opening.py` mengambil gambar dalam urutan spine dan menulis ekstraksi Inggris hanya ke `/tmp/`. Build memeriksa urutan gambar serta sampul sebagai blok pertama Pembuka.
- Judul Bab 2–8 dalam teks pendamping merupakan draf terjemahan judul dari daftar isi sumber, bukan pengumuman bahwa bab-bab itu sudah tersedia.
- Esai dan dialog pada ilustrasi ditranskripsi secara visual dari EPUB. Periksa kembali seluruh kalimat dan nama saat peninjauan, terutama ungkapan bernada sarkastis serta permainan kata.

## Penyelesaian draf Volume 1

Pemilik meminta kelanjutan sampai Volume 1 selesai pada 30 Oktober 2026. Tersedia Pembuka, Bab 1–8, Kata Penutup, dan Catatan Penerjemah Edisi Inggris; semuanya tetap `draft` hingga pemilik mengonfirmasi tinjauan untuk bagian bersangkutan. Jangan menandai keseluruhan volume `reviewed` karena satu bab telah diperiksa.

### Metode dan batas penyuntingan

Draf awal Bab 2–6 serta bagian awal Bab 7 memakai Google Translate (Inggris → Indonesia). Penyuntingan awal AI memperbaiki sebagian idiom, istilah, sapaan, dialog, penekanan, dan kesinambungan. Akhir Bab 7, Bab 8, kata penutup, catatan edisi Inggris, serta teks pendamping ilustrasi diterjemahkan dengan AI. Ini **belum merupakan penyuntingan penuh untuk ketepatan makna dan mutu sastra**. Paragraf berbasis mesin masih bisa terasa kaku atau keliru konteks dan membutuhkan pembandingan menyeluruh oleh manusia. Informasi metode juga ada di halaman Tentang dan metadata akar setiap berkas baru.

Google dipakai hanya selama penyiapan draf, bukan saat website dibuka atau dibangun. Website tidak mengirim bacaan atau data pengunjung ke layanan terjemahan. Ekstraksi dan cache prosa Inggris tetap di `/tmp/`, tidak di Git maupun `public/`. Tidak ada kunci API atau dependensi terjemahan di website.

### Kelengkapan bagian tambahan

`volume-1-remaining-sources.json` memetakan seluruh paragraf, judul, gambar, dan ornamen pada spine mulai `chapter002.xhtml` sampai `appendix001.xhtml`; `newsletterSignup.xhtml` adalah promosi penerbit dan tidak dipasang. Semua `chapter00N*` termasuk dalam bab yang sama.

| Bagian             | Paragraf sumber | Ilustrasi | Blok sumber total |
| ------------------ | --------------: | --------: | ----------------: |
| bab-2              |             161 |         1 |               164 |
| bab-3              |             407 |         5 |               421 |
| bab-4              |             129 |         3 |               134 |
| bab-5              |             228 |         3 |               237 |
| bab-6              |             403 |         4 |               415 |
| bab-7              |             391 |         5 |               403 |
| bab-8              |              68 |         1 |                71 |
| kata-penutup       |              20 |         0 |                22 |
| catatan-penerjemah |              60 |         1 |                62 |

- Total 23 ilustrasi tambahan dipasang tanpa pemotongan. Tujuh halaman profil/angket mendapat terjemahan pendamping setelah gambar. Tulisan pada gambar asli tidak diganti.
- Ornamen berulang mendapat ID berakhiran `-2`, `-3`, dan seterusnya sesuai urutan kemunculannya. Nada musik kecil di dalam paragraf direpresentasikan sebagai `♪`, bukan halaman gambar tersendiri.
- `tools/prepare_volume1.py` dapat mengulang ekstraksi dan optimasi gambar dari EPUB lokal dengan Python + Pillow. Script tidak menimpa terjemahan.
- Metadata bagian penutup memakai `kind: backmatter`, `number: null`, `order: 9/10`, sehingga tidak muncul sebagai Bab 9/10. Pembuka dan Bab 1 mempertahankan ID/rute sebelumnya.
- Judul sumber yang mencakup penekanan tebal disamakan dengan judul dalam metadata; penekanan narasi tetap dipetakan ke offset teks hasil terjemahan. Beberapa tag penekanan bersebelahan di catatan digabung tanpa mengubah jangkauan maknanya.

### Perhatian untuk peninjau lanjutan

- Bab 2: pembedaan orang yang merendahkan orang lain dengan merendahkan diri; kounibyou; sindiran Concrete Road; kata `like` dalam pengakuan Yukino; seruling rekorder.
- Bab 3: permainan kata memasak/asin, karbohidrat/udara, adonan ulang, serta slogan Apron of Love. Padanan lelucon draf belum disahkan.
- Bab 5: dialek Hiroshima/Chiba, sindrom M-2, nama dewa rekaan Zaimokuza, pergantian gaya bahasa kuno, dan pertanyaan mengenai penjiplakan naskah.
- Bab 6–7: permainan kata jammed/jam dan liniment/ligament, sapaan Soiya, penafsiran Totsuka oleh narator, istilah tenis, serta nama serangan sihir. Jangan menambahkan fakta atau membenarkan penalaran narator yang sengaja keliru.
- Bab 8: lima huruf merujuk kata Inggris `youth`, bukan jumlah huruf “masa muda”. Permainan `youth/youse` dipertahankan dalam bentuk Inggris dan perlu dicari padanan editorial.
- Catatan penerjemah adalah materi edisi Inggris, diberi atribusi terpisah. Sumber menyebut “semifinal” untuk Tangan Tuhan Maradona serta memberi definisi bodhisattva yang perlu verifikasi editorial; draf mengikuti sumber dan belum mengesahkan akurasinya.
- Ucapan guru dan murid perlu diperiksa ulang menyeluruh agar saya/Ibu tidak tercampur dengan narasi aku; normalisasi istilah otomatis bukan pemeriksaan konteks.

## Volume 2

Kelanjutan diminta pemilik. Pembuka, Prolog, dan Bab 1 tersedia sebagai draf AI. Lihat [pemetaan dan perhatian peninjau Volume 2](volume-2.md). Status masing-masing tetap independen dari Volume 1.
