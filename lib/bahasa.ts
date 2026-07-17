export type Bahasa = 'id' | 'en';

export const BAHASA: { kode: Bahasa; nama: string; bendera: string }[] = [
  { kode: 'id', nama: 'Bahasa Indonesia', bendera: '🇮🇩' },
  { kode: 'en', nama: 'English', bendera: '🇬🇧' },
];

/**
 * Bahasa yang sedang aktif, disimpan di level modul.
 *
 * Kenapa bukan lewat context saja: formatRupiah/formatTanggal/labelProgress
 * dipanggil dari ~30 tempat, dan sebagian di luar komponen. Menyalurkan bahasa
 * lewat parameter ke semuanya berarti menyentuh tiap pemanggil cuma untuk
 * meneruskan satu nilai yang tidak pernah beda.
 *
 * BahasaProvider menulis ke sini saat render, sebelum anak-anaknya render —
 * jadi saat komponen memanggil format, nilainya sudah yang terbaru. Yang memicu
 * render ulang tetap context, bukan variabel ini.
 *
 * Tiap fungsi format tetap menerima parameter bahasa opsional supaya bisa diuji
 * tanpa menyentuh state global.
 */
let aktif: Bahasa = 'id';

export const setBahasaAktif = (b: Bahasa) => {
  aktif = b;
};

export const bahasaAktif = (): Bahasa => aktif;
