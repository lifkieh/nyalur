-- =====================================================================
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
  ('86a858c2-989f-4214-a8bb-160d97bdfa19', 'Beras premium', 'pangan', 'kg', 13000, true),
  ('69941d9c-9894-4641-8165-37d16abd1e12', 'Minyak goreng', 'pangan', 'liter', 17000, true),
  ('3cb78f18-bb50-4ba0-a508-8edf87be2676', 'Telur ayam', 'pangan', 'kg', 28000, true),
  ('455e47be-4ee5-47ac-8fd2-c972ac901594', 'Susu UHT', 'pangan', 'kotak', 18000, true),
  ('f33e546c-9751-42d9-b7ca-1264c7ebe4fd', 'Sabun mandi', 'kebersihan', 'pcs', 12000, true),
  ('89787eb3-6ff5-403f-aa24-3fef087b6a87', 'Buku tulis', 'sekolah', 'pcs', 2500, true);

-- ============ PANTI (5) ============
-- plafon_bulanan = jumlah_anak * 500.000
insert into panti (id, nama, alamat, kota, jarak_km, jumlah_anak, plafon_bulanan, plafon_terpakai, status) values
  ('11e3e8fc-a545-4116-bb18-60d2fc404fbc', 'Panti Harapan Bunda', 'Jl. Merpati No. 12', 'Tangerang Selatan', 2.4, 25, 12500000, 4200000, 'terverifikasi'),
  ('4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', 'Panti Kasih Ibu', 'Jl. Kenanga No. 8', 'Ciputat', 4.1, 18, 9000000, 1100000, 'terverifikasi'),
  ('d3a2ba3a-fc9f-480d-89c6-a9e724e83529', 'Rumah Yatim Al-Falah', 'Jl. Cendana Raya No. 30', 'Pamulang', 5.8, 32, 16000000, 9800000, 'terverifikasi'),
  ('e310ddb1-f197-442a-b450-dfd402b35335', 'Panti Bina Sejahtera', 'Jl. Anggrek No. 5', 'Serpong', 7.2, 21, 10500000, 5400000, 'terverifikasi'),
  ('091db2fc-ce2a-4739-8578-266e49cfd6a8', 'Panti Anugerah', 'Jl. Melati No. 44', 'BSD', 8.5, 28, 14000000, 7100000, 'terverifikasi');

-- ============ REQUEST (9) ============
-- jumlah_terpenuhi di bawah SELALU sama dengan SUM(donasi) terkait.
insert into request (id, panti_id, katalog_id, jumlah_diminta, jumlah_terpenuhi, status, batch_kirim) values
  ('16694b24-7c62-4587-a53d-499d07de28a4', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10, 7, 'aktif', 'Jumat'),
  ('7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20, 5, 'aktif', 'Jumat'),
  ('9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20, 2, 'aktif', 'Jumat'),
  ('c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15, 4, 'aktif', 'Jumat'),
  ('2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '69941d9c-9894-4641-8165-37d16abd1e12', 10, 9, 'aktif', 'Jumat'),
  ('8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '86a858c2-989f-4214-a8bb-160d97bdfa19', 30, 12, 'aktif', 'Jumat'),
  ('5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'e310ddb1-f197-442a-b450-dfd402b35335', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15, 6, 'aktif', 'Jumat'),
  ('2359742d-0b8b-484b-9a0a-f1dd496e1f49', '091db2fc-ce2a-4739-8578-266e49cfd6a8', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10, 10, 'diterima', 'Jumat'),
  ('a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', '091db2fc-ce2a-4739-8578-266e49cfd6a8', 'f33e546c-9751-42d9-b7ca-1264c7ebe4fd', 20, 8, 'aktif', 'Jumat');

-- ============ DONASI (27) ============
-- Setiap kg progress punya donatur di belakangnya.
insert into donasi (id, request_id, donatur_id, donatur_nama, jumlah, harga_barang, ongkir, platform_fee, total, status, created_at) values
  ('9587167b-58e1-4c95-a1bd-dd2ef9db5dc0', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-06 09:12:00+07'),
  ('abe1e3c7-d2b6-47b7-9a7f-89f0845ecd4a', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-3', 'Siti Rahmawati', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 14:40:00+07'),
  ('db0871a7-fa1c-45e6-a9e8-2a6248e0adf3', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 08:05:00+07'),
  ('c2c5d9f2-0ae3-4a9a-901d-f207f0145258', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-4', 'Rina Wijaya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-09 19:22:00+07'),
  ('c2b1a1e5-fbdd-46fa-9f25-d4933e9e8e27', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-5', 'Agus Prasetyo', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-05 11:30:00+07'),
  ('33764b7b-d319-4636-9feb-54d7c99dbea6', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-1', 'Dara Anindya', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-07 16:18:00+07'),
  ('9b5a505f-e728-4f1e-bb19-b05c77082867', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-6', 'Maya Kusuma', 1, 18000, 2000, 2000, 22000, 'diterima', '2026-07-09 10:44:00+07'),
  ('eef571a7-e9e2-4223-a493-32a651f0ba94', '9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', 'u-donatur-7', 'Hendra Gunawan', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-08 13:05:00+07'),
  ('0a1670b6-28e8-431e-a360-37f4e57755fe', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-8', 'Lestari Dewi', 3, 84000, 2000, 2000, 88000, 'diterima', '2026-07-06 07:50:00+07'),
  ('730b4cfe-e67e-422d-af36-03efb29617ed', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-9', 'Fitri Handayani', 1, 28000, 2000, 2000, 32000, 'diterima', '2026-07-09 15:11:00+07'),
  ('44431d29-821c-4e5e-8836-b30da7e2cbfe', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-10', 'Rudi Setiawan', 3, 51000, 2000, 2000, 55000, 'diterima', '2026-07-04 08:30:00+07'),
  ('e8c56508-b703-49b8-85e5-bd869656a30f', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-11', 'Yuni Astuti', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-05 12:00:00+07'),
  ('61e8e3b1-728d-4590-a2f9-e98d879d97c2', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-12', 'Bambang Wijoyo', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-06 17:45:00+07'),
  ('1aea878a-77ae-4cce-9abb-2acc4ff27676', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-1', 'Dara Anindya', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-08 09:25:00+07'),
  ('399082e9-d10e-4444-99b7-827f04bf5356', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-13', 'Nia Safitri', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-09 20:10:00+07'),
  ('2537728e-5cdb-44c8-bb38-6a2c8fd54a52', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-14', 'Eko Purnomo', 5, 65000, 2000, 2000, 69000, 'diterima', '2026-07-03 10:15:00+07'),
  ('71751a87-59f4-4930-8e05-850ec852f607', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-15', 'Dewi Anggraini', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-06 14:02:00+07'),
  ('03ae48e3-7d46-404f-9ddf-056679ee5bd6', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-09 08:47:00+07'),
  ('7c2a56cd-fd55-4296-b6af-4532469496c3', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-6', 'Maya Kusuma', 4, 112000, 2000, 2000, 116000, 'diterima', '2026-07-05 09:00:00+07'),
  ('c1d683f9-22f6-43d4-9b75-bd185da26e9c', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-7', 'Hendra Gunawan', 2, 56000, 2000, 2000, 60000, 'diterima', '2026-07-08 11:35:00+07'),
  ('dcf5bdcd-e8f7-43bd-a088-dc55b155248e', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-7', 'Hendra Gunawan', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-03 09:20:00+07'),
  ('5a04d458-3839-477b-8845-c75016ea3526', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-8', 'Lestari Dewi', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-05 13:15:00+07'),
  ('64771214-33e4-4b2e-b026-0849f47fe203', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-9', 'Fitri Handayani', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 10:05:00+07'),
  ('adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 16:40:00+07'),
  ('39e51e72-1810-47b8-a7c4-dbba4d632d80', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-4', 'Rina Wijaya', 5, 60000, 2000, 2000, 64000, 'diterima', '2026-07-04 11:20:00+07'),
  ('58d85c38-6a3a-4aaa-b086-9a2d7fb88e7c', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-11', 'Yuni Astuti', 2, 24000, 2000, 2000, 28000, 'diterima', '2026-07-07 08:55:00+07'),
  ('400b8394-24ec-4d15-b00e-73faee958538', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-14', 'Eko Purnomo', 1, 12000, 2000, 2000, 16000, 'diterima', '2026-07-09 17:30:00+07');

-- ============ BUKTI TERIMA (27) ============
-- Satu bukti per donasi. Batch Jumat 10 Juli 2026.
insert into bukti_terima (id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at) values
  ('e78c1be7-8ec7-4a83-8d8a-0256d278d4a5', '9587167b-58e1-4c95-a1bd-dd2ef9db5dc0', 'NYL-4F3F-1137', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('0ca6a121-670f-4620-b82c-c521cdac323a', 'abe1e3c7-d2b6-47b7-9a7f-89f0845ecd4a', 'NYL-546E-1274', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('02e76de0-2643-49ea-9029-18e923c1bb99', 'db0871a7-fa1c-45e6-a9e8-2a6248e0adf3', 'NYL-599D-1411', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('d36eb8fa-ce42-446b-92a7-a3613c1bc684', 'c2c5d9f2-0ae3-4a9a-901d-f207f0145258', 'NYL-5ECC-1548', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('71ce3b32-6f28-4ade-95e4-07abe75727b8', 'c2b1a1e5-fbdd-46fa-9f25-d4933e9e8e27', 'NYL-63FB-1685', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('fc000087-db9d-4400-bdad-d49f86e3d575', '33764b7b-d319-4636-9feb-54d7c99dbea6', 'NYL-692A-1822', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('a95a9618-71f7-43f4-b1c9-634335089ca6', '9b5a505f-e728-4f1e-bb19-b05c77082867', 'NYL-6E59-1959', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('badd883c-baba-4973-8c57-cec9a874e532', 'eef571a7-e9e2-4223-a493-32a651f0ba94', 'NYL-7388-2096', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('4d83f3b8-f2e1-424f-95b9-430476f728f5', '0a1670b6-28e8-431e-a360-37f4e57755fe', 'NYL-78B7-2233', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('116000e9-18ca-44b8-8e4a-d546013591c3', '730b4cfe-e67e-422d-af36-03efb29617ed', 'NYL-7DE6-2370', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('962b2dba-fe13-41f3-96e6-66bd7cc4517b', '44431d29-821c-4e5e-8836-b30da7e2cbfe', 'NYL-8315-2507', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('66ddf838-17b7-4bb4-bff7-92539a465464', 'e8c56508-b703-49b8-85e5-bd869656a30f', 'NYL-8844-2644', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('70ddd07a-b4a8-4efb-90fa-06b8d66d7015', '61e8e3b1-728d-4590-a2f9-e98d879d97c2', 'NYL-8D73-2781', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('762b9ee8-529e-4a2a-8ce5-a15db41a7a36', '1aea878a-77ae-4cce-9abb-2acc4ff27676', 'NYL-92A2-2918', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('0092d889-4a1c-4580-8b82-3a5357984dce', '399082e9-d10e-4444-99b7-827f04bf5356', 'NYL-97D1-3055', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('2e11e125-e1fe-4699-858b-6dfc8e248458', '2537728e-5cdb-44c8-bb38-6a2c8fd54a52', 'NYL-9D00-3192', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('312dff81-0462-4dbc-baaa-3afa7d02889e', '71751a87-59f4-4930-8e05-850ec852f607', 'NYL-A22F-3329', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('6880b50f-4e4f-479a-a590-1e5506fb5538', '03ae48e3-7d46-404f-9ddf-056679ee5bd6', 'NYL-A75E-3466', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('5821353c-c862-41ce-ad78-b0fd09537044', '7c2a56cd-fd55-4296-b6af-4532469496c3', 'NYL-AC8D-3603', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('edd6af56-cda3-4458-a82e-c7051d5194fb', 'c1d683f9-22f6-43d4-9b75-bd185da26e9c', 'NYL-B1BC-3740', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('882651e3-d8d3-490b-aa73-a878d4627739', 'dcf5bdcd-e8f7-43bd-a088-dc55b155248e', 'NYL-B6EB-3877', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('4f2c2c2d-b89c-4b41-9e5d-abf994612267', '5a04d458-3839-477b-8845-c75016ea3526', 'NYL-BC1A-4014', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('c832c41d-d81c-425f-8a85-84f6328dfb58', '64771214-33e4-4b2e-b026-0849f47fe203', 'NYL-C149-4151', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('59dec3e8-c65a-492e-91b3-a8bd0c91bf23', 'adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', 'NYL-7F3A-2210', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('875e83af-25e2-4ca1-ae2d-98d9f6964406', '39e51e72-1810-47b8-a7c4-dbba4d632d80', 'NYL-C678-4288', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('77c5ba37-c18b-4984-abed-2de80d6054ee', '58d85c38-6a3a-4aaa-b086-9a2d7fb88e7c', 'NYL-CBA7-4425', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('e1e32488-f365-40b7-b4c2-e516762b3350', '400b8394-24ec-4d15-b00e-73faee958538', 'NYL-D0D6-4562', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07');

commit;

-- ============ VERIFIKASI ============
-- Semua baris 'harus 0' wajib nol. 'angka hantu' = progress tanpa donasi.
select 'katalog' as cek, count(*)::text as nilai, '6' as harus from katalog
union all select 'panti',   count(*)::text, '5'  from panti
union all select 'request', count(*)::text, '9'  from request
union all select 'donasi',  count(*)::text, '27' from donasi
union all select 'bukti',   count(*)::text, '27' from bukti_terima
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
