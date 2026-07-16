// Formatter manual — tidak bergantung Intl, aman di Hermes/Expo Go.

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const dua = (n: number) => String(n).padStart(2, '0');

/** 13000 -> "Rp 13.000" */
export function formatRupiah(nilai: number): string {
  const bulat = Math.round(nilai || 0);
  const tanda = bulat < 0 ? '-' : '';
  const digit = String(Math.abs(bulat));
  const titik = digit.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${tanda}Rp ${titik}`;
}

/** 1.5 -> "1,5"  ·  10 -> "10" */
export function formatAngka(nilai: number): string {
  const n = Number(nilai) || 0;
  return (Number.isInteger(n) ? String(n) : String(n)).replace('.', ',');
}

/** 1.5, 'kg' -> "1,5 kg" */
export function formatJumlah(nilai: number, satuan: string): string {
  return `${formatAngka(nilai)} ${satuan}`;
}

/** "2026-07-18T14:32:00+07:00" -> "Jumat, 18 Juli 2026" */
export function formatTanggal(input: string | Date): string {
  const d = new Date(input);
  return `${HARI[d.getDay()]}, ${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** -> "14.32 WIB" */
export function formatJam(input: string | Date): string {
  const d = new Date(input);
  return `${dua(d.getHours())}.${dua(d.getMinutes())} WIB`;
}

/** -> "Diterima 14.32 WIB · Jumat, 18 Juli 2026" */
export function formatWaktuLengkap(input: string | Date, prefix = 'Diterima'): string {
  return `${prefix} ${formatJam(input)} · ${formatTanggal(input)}`;
}

/** 7, 10 -> 0.7 (selalu 0..1) */
export function rasio(terpenuhi: number, diminta: number): number {
  if (!diminta) return 0;
  return Math.min(1, Math.max(0, (terpenuhi || 0) / diminta));
}

/** 7, 10, 'kg' -> "7 dari 10 kg" */
export function labelProgress(terpenuhi: number, diminta: number, satuan: string): string {
  return `${formatAngka(terpenuhi)} dari ${formatAngka(diminta)} ${satuan}`;
}

/** 7, 10 -> 3 (sisa kebutuhan, tidak pernah negatif) */
export function sisa(terpenuhi: number, diminta: number): number {
  return Math.max(0, (diminta || 0) - (terpenuhi || 0));
}
