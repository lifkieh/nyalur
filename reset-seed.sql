-- =====================================================================
-- NYALUR — reset seed demo
--
-- Kembalikan database ke kondisi awal brief. Jalankan di Supabase SQL
-- Editor kapan saja: idempotent, semua id dipatok, hapus-lalu-isi-ulang.
--
-- KAPAN: setelah tes, dan sekali lagi TEPAT SEBELUM tampil — bukan
-- sebelum rekam video. Setiap donasi tes menambah baris.
--
-- PERINGATAN: menghapus SELURUH isi lima tabel. Tidak ada data manusia
-- di sini, semuanya seed demo.
--
-- id panti Harapan Bunda dipatok ke 11e3e8fc-... karena lib/session.tsx:21
-- menyimpannya hardcoded. Ganti id itu = POV panti mati (dashboard,
-- katalog, plafon semua kosong). Jangan diubah tanpa mengubah session.tsx.
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
  ('86a858c2-989f-4214-a8bb-160d97bdfa19', 'Beras premium', 'pangan',     'kg',    13000, true),
  ('69941d9c-9894-4641-8165-37d16abd1e12', 'Minyak goreng', 'pangan',     'liter', 17000, true),
  ('3cb78f18-bb50-4ba0-a508-8edf87be2676', 'Telur ayam',    'pangan',     'kg',    28000, true),
  ('455e47be-4ee5-47ac-8fd2-c972ac901594', 'Susu UHT',      'pangan',     'kotak', 18000, true),
  ('f33e546c-9751-42d9-b7ca-1264c7ebe4fd', 'Sabun mandi',   'kebersihan', 'pcs',   12000, true),
  ('89787eb3-6ff5-403f-aa24-3fef087b6a87', 'Buku tulis',    'sekolah',    'pcs',    2500, true);

-- ============ PANTI (5, progress bervariasi sesuai brief) ============
-- plafon_bulanan = jumlah_anak * 500.000
insert into panti (id, nama, alamat, kota, jarak_km, jumlah_anak, plafon_bulanan, plafon_terpakai, status) values
  ('11e3e8fc-a545-4116-bb18-60d2fc404fbc', 'Panti Harapan Bunda',  'Jl. Merpati No. 12',      'Tangerang Selatan', 2.4, 25, 12500000, 4200000, 'terverifikasi'),
  ('4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', 'Panti Kasih Ibu',      'Jl. Kenanga No. 8',       'Ciputat',           4.1, 18,  9000000, 1100000, 'terverifikasi'),
  ('d3a2ba3a-fc9f-480d-89c6-a9e724e83529', 'Rumah Yatim Al-Falah', 'Jl. Cendana Raya No. 30', 'Pamulang',          5.8, 32, 16000000, 9800000, 'terverifikasi'),
  ('e310ddb1-f197-442a-b450-dfd402b35335', 'Panti Bina Sejahtera', 'Jl. Anggrek No. 5',       'Serpong',           7.2, 21, 10500000, 5400000, 'terverifikasi'),
  ('091db2fc-ce2a-4739-8578-266e49cfd6a8', 'Panti Anugerah',       'Jl. Melati No. 44',       'BSD',               8.5, 28, 14000000, 7100000, 'terverifikasi');

-- ============ REQUEST (9) ============
-- Variasi progress WAJIB dipertahankan — etalase harus terlihat hidup.
insert into request (id, panti_id, katalog_id, jumlah_diminta, jumlah_terpenuhi, status, batch_kirim) values
  -- Harapan Bunda — TARGET DEMO UTAMA (beras 7/10 = 70%)
  ('16694b24-7c62-4587-a53d-499d07de28a4', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10,  7, 'aktif',    'Jumat'),
  ('7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20,  5, 'aktif',    'Jumat'),
  -- Kasih Ibu — baru mulai (susu 2/20 = 10%)
  ('9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20,  2, 'aktif',    'Jumat'),
  ('c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15,  4, 'aktif',    'Jumat'),
  -- Al-Falah — hampir penuh, urgensi (minyak 9/10 = 90%)
  ('2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '69941d9c-9894-4641-8165-37d16abd1e12', 10,  9, 'aktif',    'Jumat'),
  ('8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '86a858c2-989f-4214-a8bb-160d97bdfa19', 30, 12, 'aktif',    'Jumat'),
  -- Bina Sejahtera — tengah (telur 6/15 = 40%)
  ('5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'e310ddb1-f197-442a-b450-dfd402b35335', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15,  6, 'aktif',    'Jumat'),
  -- Anugerah — SUMBER BUKTI TERIMA (beras 10/10, sudah diterima)
  ('2359742d-0b8b-484b-9a0a-f1dd496e1f49', '091db2fc-ce2a-4739-8578-266e49cfd6a8', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10, 10, 'diterima', 'Jumat'),
  ('a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', '091db2fc-ce2a-4739-8578-266e49cfd6a8', 'f33e546c-9751-42d9-b7ca-1264c7ebe4fd', 20,  8, 'aktif',    'Jumat');

-- ============ DONASI (1 — milik Anugerah yang sudah diterima) ============
-- 1 kg x 13.000 + ongkir 2.000 + platform 2.000 = 17.000
insert into donasi (id, request_id, donatur_id, donatur_nama, jumlah, harga_barang, ongkir, platform_fee, total, status) values
  ('adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima');

-- ============ BUKTI TERIMA (1) ============
-- diterima_at = Jumat 17 Juli 2026, 14.32 WIB.
-- Sebelumnya 18 Juli — itu hari SABTU, bentrok dengan batch_kirim 'Jumat'.
insert into bukti_terima (id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at) values
  ('59dec3e8-c65a-492e-91b3-a8bd0c91bf23',
   'adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9',
   'NYL-7F3A-2210',
   'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima',
   'Ibu Siti Rohmah',
   'Pengurus, Panti Anugerah',
   -6.3019,
   106.6528,
   '2026-07-17 14:32:00+07');

commit;

-- ============ VERIFIKASI ============
-- Harus: katalog 6, panti 5, request 9, donasi 1, bukti 1.
-- 'lebih dari target' harus 0 — kalau tidak, progress bar tembus 100%.
select 'katalog'      as tabel, count(*) as baris, null as catatan from katalog
union all select 'panti',   count(*), null from panti
union all select 'request', count(*), null from request
union all select 'donasi',  count(*), null from donasi
union all select 'bukti',   count(*), null from bukti_terima
union all select 'lebih dari target', count(*), 'harus 0' from request where jumlah_terpenuhi > jumlah_diminta
union all select 'target demo', count(*), 'beras Harapan Bunda harus 7/10'
  from request where id = '16694b24-7c62-4587-a53d-499d07de28a4' and jumlah_terpenuhi = 7 and jumlah_diminta = 10;
