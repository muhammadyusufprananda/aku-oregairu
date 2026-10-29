export const url = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
export const volumes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "9",
  "10",
  "10.5",
  "11",
  "12",
  "13",
  "14",
  "14.5",
].map((number) => ({
  slug: `volume-${number.replace(".", "-")}`,
  number: number.padStart(2, "0"),
  cover: url(`assets/covers/volume-${number.replace(".", "-")}-720.webp`),
  coverSmall: url(`assets/covers/volume-${number.replace(".", "-")}-360.webp`),
}));
export type Block = {
  id: string;
  kind: "heading" | "text" | "image";
  text: string;
  src?: string;
  emphasis?: { start: number; end: number }[];
};
const paragraphs = [
  "Pagi itu, meja di dekat jendela masih kosong. Sebuah buku catatan terletak di atasnya, terbuka pada halaman yang belum ditulisi. Cahaya perlahan bergeser melewati tepi kertas.",
  "Aku datang untuk mengembalikan pensil. Setidaknya, itulah alasan yang sudah kusiapkan sepanjang perjalanan. Kadang-kadang alasan yang kecil terasa lebih mudah dibawa daripada pertanyaan yang panjang.",
  "Di luar, seseorang sedang menyapu halaman. Suaranya berhenti setiap kali angin lewat, lalu dimulai lagi. Aku menarik kursi dan memutuskan untuk menunggu sebentar.",
  "“Kamu bisa meninggalkannya di sana,” kata penjaga ruang baca. Ia menunjuk sebuah kotak kayu kecil, kemudian kembali merapikan buku. Tidak ada yang menanyakan mengapa aku belum juga pergi.",
  "Ada banyak hal yang baru terdengar ketika kita berhenti berusaha mengisi kesunyian. Detik jam. Kertas yang berbalik. Langkah di lorong yang ternyata menuju ruangan lain.",
  "Aku membuka buku catatanku sendiri. Di halaman pertama, kutulis satu kalimat sederhana: hari ini aku punya waktu. Kalimat itu terasa aneh, tetapi aku membiarkannya tetap di sana.",
  "Menjelang siang, bayangan jendela berpindah ke lantai. Aku menutup buku, mengembalikan kursi, lalu meletakkan pensil di dalam kotak. Tidak semua perjalanan pulang membutuhkan jawaban.",
];
export const chapters = [
  { slug: "ruang-yang-tenang", title: "Ruang yang tenang" },
  { slug: "catatan-di-jendela", title: "Catatan di jendela" },
];
export function blocksFor(index: number): Block[] {
  if (!chapters[index]) throw new Error("Bab tidak ditemukan");
  const blocks: Block[] = [
    { id: "judul", kind: "heading", text: chapters[index].title },
    ...Array.from({ length: 4 }, (_, round) =>
      paragraphs.map((text, i): Block => ({
        id: `p-${round}-${i}`,
        kind: "text",
        text,
        emphasis: i === 0 ? [{ start: 0, end: 8 }] : undefined,
      })),
    ).flatMap((items, round) =>
      round === 1
        ? [
            ...items,
            {
              id: "ilustrasi",
              kind: "image" as const,
              text:
                index === 0
                  ? "Ilustrasi orisinal: jendela dan buku di ruang baca"
                  : "Ilustrasi bentang orisinal: perbukitan dan matahari",
              src: url(`assets/${index === 0 ? "window" : "landscape"}.svg`),
            },
          ]
        : items,
    ),
  ];
  const ids = new Set<string>();
  for (const block of blocks) {
    if (
      !block.id ||
      ids.has(block.id) ||
      !block.text ||
      (block.kind === "image" && !block.src)
    )
      throw new Error("Blok bab tidak valid");
    ids.add(block.id);
    let end = 0;
    for (const mark of block.emphasis || []) {
      if (
        !Number.isInteger(mark.start) ||
        !Number.isInteger(mark.end) ||
        mark.start < end ||
        mark.end <= mark.start ||
        mark.end > block.text.length
      )
        throw new Error("Rentang penekanan tidak valid");
      end = mark.end;
    }
  }
  return blocks;
}
