// Generator seed Nyalur. Sumber tunggal untuk reset-seed.sql DAN untuk
// penerapan lewat supabase-js — supaya file dan database tidak bisa berbeda.
//
// Jalankan: npm run seed:gen
//
// Jangan sunting reset-seed.sql dengan tangan — sunting file ini lalu bangkitkan
// ulang. jumlah_terpenuhi dihitung dari SUM(donasi); mengetiknya sendiri
// memunculkan "angka hantu", progress tanpa donatur di belakangnya.
//
// UUID donasi & bukti dibangkitkan ulang tiap kali generator jalan (kecuali
// donasi hero yang dipatok di REQUESTS). Jadi regenerasi tanpa perubahan apa pun
// tetap menghasilkan diff ~27 baris. Itu diterima, bukan bug: id-nya opaque,
// tidak ada yang menunjuk ke sana. Yang dipatok cuma id katalog, panti, request,
// dan donasi hero.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const uuid = () => crypto.randomUUID();

export const KATALOG = {
  beras:  { id: '86a858c2-989f-4214-a8bb-160d97bdfa19', nama: 'Beras premium', kategori: 'pangan',     satuan: 'kg',    harga: 13000 },
  minyak: { id: '69941d9c-9894-4641-8165-37d16abd1e12', nama: 'Minyak goreng', kategori: 'pangan',     satuan: 'liter', harga: 17000 },
  telur:  { id: '3cb78f18-bb50-4ba0-a508-8edf87be2676', nama: 'Telur ayam',    kategori: 'pangan',     satuan: 'kg',    harga: 28000 },
  susu:   { id: '455e47be-4ee5-47ac-8fd2-c972ac901594', nama: 'Susu UHT',      kategori: 'pangan',     satuan: 'kotak', harga: 18000 },
  sabun:  { id: 'f33e546c-9751-42d9-b7ca-1264c7ebe4fd', nama: 'Sabun mandi',   kategori: 'kebersihan', satuan: 'pcs',   harga: 12000 },
  buku:   { id: '89787eb3-6ff5-403f-aa24-3fef087b6a87', nama: 'Buku tulis',    kategori: 'sekolah',    satuan: 'pcs',   harga: 2500 },
};

// id Harapan Bunda DIPATOK — lib/session.tsx:21 menyimpannya hardcoded.
export const PANTI = {
  hb: { id: '11e3e8fc-a545-4116-bb18-60d2fc404fbc', nama: 'Panti Harapan Bunda',  alamat: 'Jl. Merpati No. 12',      kota: 'Tangerang Selatan', jarak: 2.4, anak: 25, plafon: 12500000, terpakai: 4200000,
        penerima: 'Ibu Siti Rohmah',        lat: -6.2886, lng: 106.7100, jam: '10:15' },
  ki: { id: '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', nama: 'Panti Kasih Ibu',      alamat: 'Jl. Kenanga No. 8',       kota: 'Ciputat',           jarak: 4.1, anak: 18, plafon: 9000000,  terpakai: 1100000,
        penerima: 'Ibu Nurhayati',          lat: -6.3103, lng: 106.7519, jam: '11:30' },
  af: { id: 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', nama: 'Rumah Yatim Al-Falah', alamat: 'Jl. Cendana Raya No. 30', kota: 'Pamulang',          jarak: 5.8, anak: 32, plafon: 16000000, terpakai: 9800000,
        penerima: 'Pak Ahmad Fauzi',        lat: -6.3428, lng: 106.7385, jam: '13:05' },
  bs: { id: 'e310ddb1-f197-442a-b450-dfd402b35335', nama: 'Panti Bina Sejahtera', alamat: 'Jl. Anggrek No. 5',       kota: 'Serpong',           jarak: 7.2, anak: 21, plafon: 10500000, terpakai: 5400000,
        penerima: 'Ibu Lestari Wulandari',  lat: -6.3187, lng: 106.6712, jam: '14:00' },
  an: { id: '091db2fc-ce2a-4739-8578-266e49cfd6a8', nama: 'Panti Anugerah',       alamat: 'Jl. Melati No. 44',       kota: 'BSD',               jarak: 8.5, anak: 28, plafon: 14000000, terpakai: 7100000,
        penerima: 'Ibu Maria Sinaga',       lat: -6.3019, lng: 106.6528, jam: '14:32' },
};

const D = {
  1:  'Dara Anindya',      2:  'Budi Santoso',    3:  'Siti Rahmawati',
  4:  'Rina Wijaya',       5:  'Agus Prasetyo',   6:  'Maya Kusuma',
  7:  'Hendra Gunawan',    8:  'Lestari Dewi',    9:  'Fitri Handayani',
  10: 'Rudi Setiawan',     11: 'Yuni Astuti',     12: 'Bambang Wijoyo',
  13: 'Nia Safitri',       14: 'Eko Purnomo',     15: 'Dewi Anggraini',
};

// Semua donasi seed dikirim dalam SATU batch: Jumat 10 Juli 2026. Kurir keliling,
// tiap panti punya jam kunjungannya sendiri. Donasi dibuat 3-9 Juli, sebelum batch.
const BATCH = '2026-07-10';

// jumlah_terpenuhi TIDAK ditulis tangan — dihitung dari SUM(donasi).
export const REQUESTS = [
  { id: '16694b24-7c62-4587-a53d-499d07de28a4', panti: 'hb', item: 'beras',  diminta: 10, status: 'aktif',
    donasi: [ [2,3,'2026-07-06 09:12'], [3,2,'2026-07-07 14:40'], [1,1,'2026-07-08 08:05'], [4,1,'2026-07-09 19:22'] ] },
  { id: '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', panti: 'hb', item: 'susu',   diminta: 20, status: 'aktif',
    donasi: [ [5,2,'2026-07-05 11:30'], [1,2,'2026-07-07 16:18'], [6,1,'2026-07-09 10:44'] ] },
  { id: '9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', panti: 'ki', item: 'susu',   diminta: 20, status: 'aktif',
    donasi: [ [7,2,'2026-07-08 13:05'] ] },
  { id: 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', panti: 'ki', item: 'telur',  diminta: 15, status: 'aktif',
    donasi: [ [8,3,'2026-07-06 07:50'], [9,1,'2026-07-09 15:11'] ] },
  { id: '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', panti: 'af', item: 'minyak', diminta: 10, status: 'aktif',
    donasi: [ [10,3,'2026-07-04 08:30'], [11,2,'2026-07-05 12:00'], [12,2,'2026-07-06 17:45'], [1,1,'2026-07-08 09:25'], [13,1,'2026-07-09 20:10'] ] },
  { id: '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', panti: 'af', item: 'beras',  diminta: 30, status: 'aktif',
    donasi: [ [14,5,'2026-07-03 10:15'], [15,4,'2026-07-06 14:02'], [2,3,'2026-07-09 08:47'] ] },
  { id: '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', panti: 'bs', item: 'telur',  diminta: 15, status: 'aktif',
    donasi: [ [6,4,'2026-07-05 09:00'], [7,2,'2026-07-08 11:35'] ] },
  // HERO — sumber bukti terima di brief. Donasi Dara mempertahankan id & kode aslinya.
  { id: '2359742d-0b8b-484b-9a0a-f1dd496e1f49', panti: 'an', item: 'beras',  diminta: 10, status: 'diterima',
    donasi: [ [7,4,'2026-07-03 09:20'], [8,3,'2026-07-05 13:15'], [9,2,'2026-07-07 10:05'],
              [1,1,'2026-07-08 16:40', 'adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', '59dec3e8-c65a-492e-91b3-a8bd0c91bf23', 'NYL-7F3A-2210'] ] },
  { id: 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', panti: 'an', item: 'sabun',  diminta: 20, status: 'aktif',
    donasi: [ [4,5,'2026-07-04 11:20'], [11,2,'2026-07-07 08:55'], [14,1,'2026-07-09 17:30'] ] },
];

const ONGKIR = 2000, FEE = 2000;
const FOTO = 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima';

let seedKode = 1;
const kodeBukti = () => {
  const hex = (0x4a10 + seedKode * 1327).toString(16).toUpperCase().slice(-4);
  const num = String(1000 + seedKode * 137).slice(-4);
  seedKode++;
  return `NYL-${hex}-${num}`;
};

// ---- bangun baris ----
export const rows = { donasi: [], bukti: [], request: [] };

for (const r of REQUESTS) {
  const kat = KATALOG[r.item];
  const pan = PANTI[r.panti];
  let terpenuhi = 0;

  for (const [donIdx, jumlah, dibuat, idPaksa, buktiIdPaksa, kodePaksa] of r.donasi) {
    const hargaBarang = jumlah * kat.harga;
    const donasiId = idPaksa ?? uuid();
    rows.donasi.push({
      id: donasiId,
      request_id: r.id,
      donatur_id: `u-donatur-${donIdx}`,
      donatur_nama: D[donIdx],
      jumlah,
      harga_barang: hargaBarang,
      ongkir: ONGKIR,
      platform_fee: FEE,
      total: hargaBarang + ONGKIR + FEE,
      status: 'diterima',
      created_at: `${dibuat}:00+07`,
    });
    rows.bukti.push({
      id: buktiIdPaksa ?? uuid(),
      donasi_id: donasiId,
      kode_bukti: kodePaksa ?? kodeBukti(),
      foto_url: FOTO,
      penerima_nama: pan.penerima,
      penerima_jabatan: `Pengurus, ${pan.nama}`,
      lokasi_lat: pan.lat,
      lokasi_lng: pan.lng,
      diterima_at: `${BATCH} ${pan.jam}:00+07`,
    });
    terpenuhi += jumlah;
  }

  rows.request.push({
    id: r.id,
    panti_id: pan.id,
    katalog_id: kat.id,
    jumlah_diminta: r.diminta,
    jumlah_terpenuhi: terpenuhi, // dihitung, bukan diketik
    status: r.status,
    batch_kirim: 'Jumat',
  });
}

// ---- assert: tidak ada angka hantu ----
const galat = [];
for (const req of rows.request) {
  const sum = rows.donasi.filter((d) => d.request_id === req.id).reduce((n, d) => n + d.jumlah, 0);
  if (sum !== req.jumlah_terpenuhi) galat.push(`${req.id}: terpenuhi ${req.jumlah_terpenuhi} != SUM donasi ${sum}`);
  if (req.jumlah_terpenuhi > req.jumlah_diminta) galat.push(`${req.id}: ${req.jumlah_terpenuhi} > diminta ${req.jumlah_diminta}`);
}
for (const d of rows.donasi) {
  const req = rows.request.find((r) => r.id === d.request_id);
  const kat = Object.values(KATALOG).find((k) => k.id === req.katalog_id);
  if (d.harga_barang !== d.jumlah * kat.harga) galat.push(`donasi ${d.id}: harga_barang salah`);
  if (d.total !== d.harga_barang + ONGKIR + FEE) galat.push(`donasi ${d.id}: total salah`);
  const b = rows.bukti.find((x) => x.donasi_id === d.id);
  if (!b) galat.push(`donasi ${d.id}: tanpa bukti`);
  else if (new Date(b.diterima_at) < new Date(d.created_at)) galat.push(`donasi ${d.id}: diterima sebelum dibuat`);
}
const kodes = rows.bukti.map((b) => b.kode_bukti);
if (new Set(kodes).size !== kodes.length) galat.push('kode_bukti kembar');
const ids = [...rows.donasi, ...rows.bukti, ...rows.request].map((x) => x.id);
if (new Set(ids).size !== ids.length) galat.push('UUID kembar');

if (galat.length) {
  console.error('SEED TIDAK VALID:\n' + galat.join('\n'));
  process.exit(1);
}

// ---- tulis SQL ----
const q = (v) => (v === null ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const baris = (o, kolom) => `  (${kolom.map((k) => q(o[k])).join(', ')})`;

const sql = `-- =====================================================================
-- NYALUR — reset seed demo
--
-- DIBUAT OLEH scripts/gen-seed.mjs — jangan sunting file ini dengan tangan.
-- Sunting generatornya, lalu: npm run seed:gen
-- jumlah_terpenuhi dihitung dari SUM(donasi), bukan diketik. Sunting manual
-- akan memunculkan lagi "angka hantu" — progress tanpa donatur di belakangnya.
--
-- UUID donasi & bukti dibangkitkan ulang tiap generator jalan, jadi regenerasi
-- tanpa perubahan semantik tetap memberi diff ~27 baris. Itu diterima, bukan
-- bug — id-nya opaque, tidak ada yang menunjuk ke sana.
--
-- Jalankan di Supabase SQL Editor kapan saja: idempotent, semua id dipatok,
-- hapus-lalu-isi-ulang.
--
-- KAPAN: setelah tes, dan sekali lagi TEPAT SEBELUM tampil — bukan sebelum
-- rekam video. Setiap donasi tes menambah baris.
--
-- PERINGATAN: menghapus SELURUH isi lima tabel. Semuanya seed demo.
--
-- id panti Harapan Bunda dipatok ke 11e3e8fc-... karena lib/session.tsx:21
-- menyimpannya hardcoded. Ganti id itu = POV panti mati.
--
-- Cerita seed: donasi dibuat 3-9 Juli 2026, semuanya terkirim dalam satu batch
-- Jumat 10 Juli. Tiap panti punya jam kunjungan kurir sendiri, jadi bukti satu
-- panti berbagi timestamp — memang satu serah terima.
-- =====================================================================

begin;

-- Urutan hapus mengikuti foreign key: anak dulu, induk belakangan.
delete from bukti_terima;
delete from donasi;
delete from request;
delete from panti;
delete from katalog;

-- ============ KATALOG (SKU kaku) ============
insert into katalog (id, nama, kategori, satuan, harga_per_satuan, aktif) values
${Object.values(KATALOG).map((k) => `  (${q(k.id)}, ${q(k.nama)}, ${q(k.kategori)}, ${q(k.satuan)}, ${k.harga}, true)`).join(',\n')};

-- ============ PANTI (5) ============
-- plafon_bulanan = jumlah_anak * 500.000
insert into panti (id, nama, alamat, kota, jarak_km, jumlah_anak, plafon_bulanan, plafon_terpakai, status) values
${Object.values(PANTI).map((p) => `  (${q(p.id)}, ${q(p.nama)}, ${q(p.alamat)}, ${q(p.kota)}, ${p.jarak}, ${p.anak}, ${p.plafon}, ${p.terpakai}, 'terverifikasi')`).join(',\n')};

-- ============ REQUEST (${rows.request.length}) ============
-- jumlah_terpenuhi di bawah SELALU sama dengan SUM(donasi) terkait.
insert into request (id, panti_id, katalog_id, jumlah_diminta, jumlah_terpenuhi, status, batch_kirim) values
${rows.request.map((r) => baris(r, ['id', 'panti_id', 'katalog_id', 'jumlah_diminta', 'jumlah_terpenuhi', 'status', 'batch_kirim'])).join(',\n')};

-- ============ DONASI (${rows.donasi.length}) ============
-- Setiap kg progress punya donatur di belakangnya.
insert into donasi (id, request_id, donatur_id, donatur_nama, jumlah, harga_barang, ongkir, platform_fee, total, status, created_at) values
${rows.donasi.map((d) => baris(d, ['id', 'request_id', 'donatur_id', 'donatur_nama', 'jumlah', 'harga_barang', 'ongkir', 'platform_fee', 'total', 'status', 'created_at'])).join(',\n')};

-- ============ BUKTI TERIMA (${rows.bukti.length}) ============
-- Satu bukti per donasi. Batch Jumat 10 Juli 2026.
insert into bukti_terima (id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at) values
${rows.bukti.map((b) => baris(b, ['id', 'donasi_id', 'kode_bukti', 'foto_url', 'penerima_nama', 'penerima_jabatan', 'lokasi_lat', 'lokasi_lng', 'diterima_at'])).join(',\n')};

commit;

-- ============ VERIFIKASI ============
-- Semua baris 'harus 0' wajib nol. 'angka hantu' = progress tanpa donasi.
select 'katalog' as cek, count(*)::text as nilai, '6' as harus from katalog
union all select 'panti',   count(*)::text, '5'  from panti
union all select 'request', count(*)::text, '${rows.request.length}'  from request
union all select 'donasi',  count(*)::text, '${rows.donasi.length}' from donasi
union all select 'bukti',   count(*)::text, '${rows.bukti.length}' from bukti_terima
union all select 'lebih dari target', count(*)::text, '0' from request where jumlah_terpenuhi > jumlah_diminta
union all select 'donasi tanpa bukti', count(*)::text, '0'
  from donasi d left join bukti_terima b on b.donasi_id = d.id where b.id is null
union all select 'angka hantu', count(*)::text, '0' from (
  select r.id from request r left join donasi d on d.request_id = r.id
  group by r.id, r.jumlah_terpenuhi
  having r.jumlah_terpenuhi <> coalesce(sum(d.jumlah), 0)
) x
union all select 'donatur beras Harapan Bunda', count(distinct donatur_id)::text, '4'
  from donasi where request_id = '16694b24-7c62-4587-a53d-499d07de28a4';
`;

const keluaran = path.join(AKAR, 'reset-seed.sql');
fs.writeFileSync(keluaran, sql);
console.log(`seed valid — request ${rows.request.length}, donasi ${rows.donasi.length}, bukti ${rows.bukti.length}`);
console.log(`donatur unik: ${new Set(rows.donasi.map((d) => d.donatur_id)).size}`);
console.log(`${path.relative(AKAR, keluaran)} ditulis`);
