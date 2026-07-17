import type { ImageSourcePropType } from 'react-native';
import type { Katalog, Panti } from './queries';

// =====================================================================
// Foto asli, dibundel lokal — BUKAN URL.
//
// Kenapa require() dan bukan foto_url:
//   Brief §14 menaruh "WiFi venue jelek" sebagai risiko nomor satu, dan brief §3
//   menyebut foto serah terima sebagai aset paling penting di demo. Menariknya
//   lewat jaringan berarti mempertaruhkan layar klimaks pada WiFi venue, persis
//   di detik juri menatap. require() diselesaikan saat bundling: nol permintaan
//   jaringan, muncul instan, tetap hidup walau HP mode pesawat.
//
// Dipetakan lewat id, sama seperti BARANG_EN di lib/teks.ts — id katalog & panti
// sudah dipatok di scripts/gen-seed.mjs, jadi aman dijadikan kunci.
//
// ---------------------------------------------------------------------
// CARA MENGAKTIFKAN
//   1. Taruh 11 file di assets/foto/ dengan nama PERSIS seperti di bawah.
//   2. Buang tanda komentar di tiap baris require().
//   3. Selesai — tidak ada file lain yang perlu disentuh.
//
// Selama masih dikomentari, app tetap jalan: FotoPlaceholder jatuh ke kotak
// sky-tint berlabel, seperti sekarang. Jadi tidak ada yang rusak sambil menunggu
// fotonya jadi. Spesifikasi & prompt: assets/foto/README.md
// =====================================================================

/** Foto barang katalog. Kunci = id katalog (dipatok di gen-seed.mjs). */
export const FOTO_KATALOG: Record<string, ImageSourcePropType> = {
  '86a858c2-989f-4214-a8bb-160d97bdfa19': require('../assets/foto/beras.jpg'),
  '69941d9c-9894-4641-8165-37d16abd1e12': require('../assets/foto/minyak.jpg'),
  '3cb78f18-bb50-4ba0-a508-8edf87be2676': require('../assets/foto/telur.jpg'),
  '455e47be-4ee5-47ac-8fd2-c972ac901594': require('../assets/foto/susu.jpg'),
  'f33e546c-9751-42d9-b7ca-1264c7ebe4fd': require('../assets/foto/sabun.jpg'),
  '89787eb3-6ff5-403f-aa24-3fef087b6a87': require('../assets/foto/buku.jpg'),
};

/** Foto panti. Kunci = id panti. Harapan Bunda dipatok juga di lib/session.tsx. */
export const FOTO_PANTI: Record<string, ImageSourcePropType> = {
  // '11e3e8fc-a545-4116-bb18-60d2fc404fbc': require('../assets/foto/panti-harapan-bunda.jpg'),
  // '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6': require('../assets/foto/panti-kasih-ibu.jpg'),
  // 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529': require('../assets/foto/panti-al-falah.jpg'),
  // 'e310ddb1-f197-442a-b450-dfd402b35335': require('../assets/foto/panti-bina-sejahtera.jpg'),
  // '091db2fc-ce2a-4739-8578-266e49cfd6a8': require('../assets/foto/panti-anugerah.jpg'),
};

/**
 * SEMENTARA — satu foto yang sama dipakai kelima panti selama foto per-panti
 * belum ada. Kotak berlabel bikin etalase terlihat belum jadi; satu foto generik
 * bikin etalase terbaca sebagai etalase.
 *
 * Sadar bahwa ini berbohong sedikit: lima panti berbeda tampil dengan gedung
 * yang sama, dan orang yang menggulir etalase akan menyadarinya. Itu sebabnya
 * foto per-panti di FOTO_PANTI dan foto unggahan pengurus KEDUANYA menang atas
 * yang ini — begitu satu panti punya foto asli, panti itu berhenti memakai ini.
 *
 * Buang baris ini begitu kelima require() di atas hidup.
 */
export const FOTO_PANTI_SEMENTARA: ImageSourcePropType = require('../assets/foto/panti.jpg');

/**
 * Foto serah terima. Sumber tunggal foto di layar bukti (B7) — bukti.foto_url
 * dari seed TIDAK pernah diteruskan ke sana, lihat catatan di
 * app/(donatur)/bukti/[id].tsx:116.
 *
 * Slot ini lama sengaja kosong: foto serah terima palsu yang kelihatan palsu
 * lebih merusak daripada placeholder yang jujur mengaku placeholder. Layar bukti
 * adalah momen juri menatap paling lama (brief §11), dan di situ foto yang
 * meleset sedikit langsung terbaca.
 *
 * Sekarang terisi. Standar itu tidak dicabut, cuma sudah dipenuhi — kalau
 * fotonya diganti dan yang baru terbaca janggal, kembalikan ke undefined.
 * Placeholder tidak berbohong, jadi tidak bisa ketahuan bohong.
 */
export const FOTO_BUKTI: ImageSourcePropType | undefined = require('../assets/foto/kurir.jpg');

export const fotoKatalog = (k: Pick<Katalog, 'id'>): ImageSourcePropType | undefined =>
  FOTO_KATALOG[k.id];

/**
 * Foto galeri panti. Satu-satunya sumber gambar di app ini yang bukan require().
 *
 * Bukan pelanggaran aturan di atas, karena alasan aturan itu tetap dipatuhi:
 * isinya file:// dari galeri HP pengurus (expo-image-picker), jadi rendernya
 * tetap nol permintaan jaringan dan tetap hidup di mode pesawat. Yang hilang
 * cuma portabilitas — URI ini mati kalau DB dibaca dari HP lain, dan di situ
 * FotoPlaceholder jatuh ke kotak berlabel seperti biasa.
 */
export const sumberGaleri = (uri?: string | null): ImageSourcePropType | undefined =>
  uri ? { uri } : undefined;

/**
 * Hero panti. Urutan menang: foto panti itu sendiri, lalu sampul yang dipilih
 * pengurusnya, baru foto sementara yang dipakai bersama.
 *
 * Galeri sengaja TIDAK ikut di sini. Sampul kosong berarti pengurus belum
 * memilih wajah pantinya, dan menebaknya dari galeri[0] menghapus bedanya.
 */
export const fotoPanti = (p: Pick<Panti, 'id' | 'sampul'>): ImageSourcePropType | undefined =>
  FOTO_PANTI[p.id] ?? sumberGaleri(p.sampul) ?? FOTO_PANTI_SEMENTARA;
