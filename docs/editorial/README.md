# Editorial Volume 1 Bab 1

Status awal: **draft**, belum ditinjau manusia. Publikasi draf diminta pemilik proyek pada 30 Oktober 2026; publikasi bukan pengesahan akurasi hasil AI.

## Mengubah status setelah meninjau

1. Tinjau seluruh teks, ilustrasi, penekanan, dan istilah. Perbaiki isi di `src/content/chapters/volume-1-bab-1.json` tanpa mengganti ID blok yang tidak perlu.
2. Setelah selesai, buka `src/content/chapters/index.json` di GitHub dan ubah hanya `"editorialStatus": "draft"` menjadi `"editorialStatus": "reviewed"` untuk bab ini. Pilihan lain ditolak saat build.
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
