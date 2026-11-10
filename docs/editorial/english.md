# Edisi Inggris

Pemilik meminta dan mengizinkan publikasi edisi Inggris dari seluruh 18 EPUB yang disediakan dalam `raw/`. Berkas EPUB tidak disalin ke situs.

Jalankan `python tools/prepare_english.py` (Pillow diperlukan) untuk mengekstrak teks dan penekanan inline, mengoptimalkan ilustrasi ke WebP, serta mengelompokkan fragmen spine menjadi bagian naratif melalui `tools/group_english.py`. Berkas hasil disimpan di `src/content/english/` dan `public/assets/english/`. Judul berasal dari sumber. Edisi ini tidak diberi label terjemahan AI atau hasil tinjauan manusia; label reader adalah “Edisi Inggris · teks sumber”.

Pilihan bahasa ada di halaman volume dan pengaturan reader. Bahasa antarmuka tetap Indonesia. Rute Inggris memiliki awalan `baca/en/`; progres Inggris menggunakan `oregairu.progress.en`, sementara progres Indonesia dan pengaturan versi 2 tetap dipertahankan. Pilihan bahasa membuka daftar bagian volume agar tidak mengasumsikan kesetaraan anchor antarbahasa.

PWA memasukkan halaman dan ilustrasi Inggris ke cache saat dibuka. Membuka satu bagian tidak otomatis mengunduh bagian Inggris lainnya; ilustrasi yang belum dimuat belum tersedia offline.
