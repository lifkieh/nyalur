import { bahasaAktif, type Bahasa } from './bahasa';

// Formatter manual — tidak bergantung Intl, aman di Hermes/Expo Go.
//
// Kata-kata milik file ini disimpan di sini, bukan di lib/teks.ts: format.ts
// dipakai luas dan harus bisa diuji sendiri tanpa menyeret kamus + provider.
// Tiap fungsi menerima `bahasa` opsional yang defaultnya bahasaAktif(), jadi
// komponen tidak perlu meneruskannya, tapi tes tetap bisa memaksa.

const KATA = {
  hari: {
    id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
  bulan: {
    id: [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    ],
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
  // ID: "Rp 13.000" & "1,5"  ·  EN: "Rp 13,000" & "1.5" — persis terbalik.
  ribuan: { id: '.', en: ',' },
  desimal: { id: ',', en: '.' },
  // WIB tetap "WIB" di EN: itu nama zona waktunya, bukan kata yang diterjemahkan.
  jamPisah: { id: '.', en: ':' },
  dari: { id: 'dari', en: 'of' },
  diterima: { id: 'Diterima', en: 'Received' },
  berangkatHariIni: { id: 'berangkat hari ini', en: 'ships today' },
  besok: { id: 'besok', en: 'tomorrow' },
  hariLagi: { id: '{n} hari lagi', en: 'in {n} days' },
  mingguIni: { id: 'Minggu ini', en: 'This week' },
  bulanIni: { id: 'Bulan ini', en: 'This month' },
} as const;

const dua = (n: number) => String(n).padStart(2, '0');

/**
 * Semua waktu ditampilkan dalam WIB apa pun zona waktu HP-nya. Label di layar
 * bertuliskan "WIB", jadi jamnya tidak boleh ikut berubah kalau HP demo
 * kebetulan diset ke zona lain.
 */
function keWib(input: string | Date): Date {
  const d = new Date(input);
  return new Date(d.getTime() + (7 * 60 + d.getTimezoneOffset()) * 60000);
}

/** 13000 -> "Rp 13.000" (ID) · "Rp 13,000" (EN) */
export function formatRupiah(nilai: number, bahasa: Bahasa = bahasaAktif()): string {
  const bulat = Math.round(nilai || 0);
  const tanda = bulat < 0 ? '-' : '';
  const digit = String(Math.abs(bulat));
  const kelompok = digit.replace(/\B(?=(\d{3})+(?!\d))/g, KATA.ribuan[bahasa]);
  return `${tanda}Rp ${kelompok}`;
}

/** 1.5 -> "1,5" (ID) · "1.5" (EN)  ·  10 -> "10" */
export function formatAngka(nilai: number, bahasa: Bahasa = bahasaAktif()): string {
  const n = Number(nilai) || 0;
  return String(n).replace('.', KATA.desimal[bahasa]);
}

/** 1.5, 'kg' -> "1,5 kg" */
export function formatJumlah(nilai: number, satuan: string, bahasa: Bahasa = bahasaAktif()): string {
  return `${formatAngka(nilai, bahasa)} ${satuan}`;
}

/** -> "Jumat, 18 Juli 2026" (ID) · "Friday, 18 July 2026" (EN) */
export function formatTanggal(input: string | Date, bahasa: Bahasa = bahasaAktif()): string {
  const d = keWib(input);
  return `${KATA.hari[bahasa][d.getDay()]}, ${d.getDate()} ${KATA.bulan[bahasa][d.getMonth()]} ${d.getFullYear()}`;
}

/** -> "14.32 WIB" (ID) · "14:32 WIB" (EN) */
export function formatJam(input: string | Date, bahasa: Bahasa = bahasaAktif()): string {
  const d = keWib(input);
  return `${dua(d.getHours())}${KATA.jamPisah[bahasa]}${dua(d.getMinutes())} WIB`;
}

/** -> "Jumat, 18 Juli" (tanpa tahun) */
export function formatTanggalPendek(input: string | Date, bahasa: Bahasa = bahasaAktif()): string {
  const d = keWib(input);
  return `${KATA.hari[bahasa][d.getDay()]}, ${d.getDate()} ${KATA.bulan[bahasa][d.getMonth()]}`;
}

/** Nama hari saja: "Jumat" / "Friday". Batch disimpan sebagai nama hari Indonesia. */
export function namaHari(indeks: number, bahasa: Bahasa = bahasaAktif()): string {
  return KATA.hari[bahasa][indeks] ?? '';
}

/**
 * batch_kirim di DB menyimpan nama hari dalam Bahasa Indonesia ('Jumat').
 * Di mode EN ia diterjemahkan lewat posisinya di daftar hari — bukan tabel
 * terpisah, supaya tidak ada dua sumber kebenaran untuk nama hari.
 */
export function terjemahHari(hariId: string, bahasa: Bahasa = bahasaAktif()): string {
  const i = KATA.hari.id.indexOf(hariId as (typeof KATA.hari.id)[number]);
  return i < 0 ? hariId : KATA.hari[bahasa][i];
}

/**
 * Batch berangkat tiap Jumat. Kolom batch_kirim cuma menyimpan nama harinya,
 * jadi tanggalnya dihitung, bukan disimpan. Hari Jumat memulangkan hari itu
 * sendiri — batch hari ini masih batch berikutnya sampai ia berangkat.
 */
export function jumatBerikutnya(dari: string | Date = new Date()): Date {
  const maju = (5 - keWib(dari).getDay() + 7) % 7;
  return new Date(new Date(dari).getTime() + maju * 24 * 60 * 60 * 1000);
}

/** -> "Juli 2026" / "July 2026" */
export function formatBulanTahun(
  input: string | Date = new Date(),
  bahasa: Bahasa = bahasaAktif()
): string {
  const d = keWib(input);
  return `${KATA.bulan[bahasa][d.getMonth()]} ${d.getFullYear()}`;
}

const HARI_MS = 24 * 60 * 60 * 1000;

/**
 * Selisih HARI KALENDER WIB menuju target — bukan selisih jam dibagi 24.
 * Batch berangkat pada tanggal, bukan pada jam: Jumat tetap "besok" entah
 * sekarang Kamis pagi atau Kamis tengah malam.
 */
export function hariLagi(target: string | Date, dari: string | Date = new Date()): number {
  const a = keWib(target);
  const b = keWib(dari);
  const ha = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const hb = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ha - hb) / HARI_MS);
}

/** 0 -> "berangkat hari ini" · 1 -> "besok" · 3 -> "3 hari lagi" */
export function labelHariLagi(n: number, bahasa: Bahasa = bahasaAktif()): string {
  if (n <= 0) return KATA.berangkatHariIni[bahasa];
  if (n === 1) return KATA.besok[bahasa];
  return KATA.hariLagi[bahasa].replace('{n}', String(n));
}

/**
 * Tajuk seksi riwayat: "Minggu ini" / "Bulan ini" / "Juni 2026".
 *
 * Relatif dulu, absolut belakangan — yang baru saja terjadi lebih gampang
 * dikenali lewat "minggu ini" daripada lewat tanggalnya. Yang lampau kebalikannya.
 */
export function grupWaktu(
  input: string | Date,
  sekarang: string | Date = new Date(),
  bahasa: Bahasa = bahasaAktif()
): string {
  const d = keWib(input);
  const kini = keWib(sekarang);
  if (kini.getTime() - d.getTime() <= 7 * HARI_MS) return KATA.mingguIni[bahasa];
  if (d.getFullYear() === kini.getFullYear() && d.getMonth() === kini.getMonth())
    return KATA.bulanIni[bahasa];
  return formatBulanTahun(input, bahasa);
}

/** -> "Jumat, 18 Juli 2026 · 14.32 WIB" */
export function formatTanggalJam(input: string | Date, bahasa: Bahasa = bahasaAktif()): string {
  return `${formatTanggal(input, bahasa)} · ${formatJam(input, bahasa)}`;
}

/** -6.3019, 106.6528 -> "-6.3019, 106.6528" */
export function formatKoordinat(lat: number | null, lng: number | null): string | null {
  if (lat == null || lng == null) return null;
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}

/** -> "Diterima 14.32 WIB · Jumat, 18 Juli 2026". prefix '' untuk waktunya saja. */
export function formatWaktuLengkap(
  input: string | Date,
  prefix?: string,
  bahasa: Bahasa = bahasaAktif()
): string {
  const awal = prefix ?? KATA.diterima[bahasa];
  const waktu = `${formatJam(input, bahasa)} · ${formatTanggal(input, bahasa)}`;
  return awal ? `${awal} ${waktu}` : waktu;
}

/** 7, 10 -> 0.7 (selalu 0..1) */
export function rasio(terpenuhi: number, diminta: number): number {
  if (!diminta) return 0;
  return Math.min(1, Math.max(0, (terpenuhi || 0) / diminta));
}

/** 7, 10, 'kg' -> "7 dari 10 kg" · "7 of 10 kg" */
export function labelProgress(
  terpenuhi: number,
  diminta: number,
  satuan: string,
  bahasa: Bahasa = bahasaAktif()
): string {
  return `${formatAngka(terpenuhi, bahasa)} ${KATA.dari[bahasa]} ${formatAngka(diminta, bahasa)} ${satuan}`;
}

/** 7, 10 -> 3 (sisa kebutuhan, tidak pernah negatif) */
export function sisa(terpenuhi: number, diminta: number): number {
  return Math.max(0, (diminta || 0) - (terpenuhi || 0));
}
