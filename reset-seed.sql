-- =====================================================================
-- NYALUR — reset seed demo
--
-- DIBUAT OLEH GENERATOR. Jangan sunting angka di sini dengan tangan:
-- jumlah_terpenuhi dihitung dari SUM(donasi), bukan diketik. Sunting manual
-- akan memunculkan lagi "angka hantu" — progress tanpa donatur di belakangnya.
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
  ('9a12444b-5389-484b-a279-2b8386f10180', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-06 09:12:00+07'),
  ('2df0fb1a-93e2-4a80-8a34-48f28a2c3ab8', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-3', 'Siti Rahmawati', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 14:40:00+07'),
  ('92527450-701b-4be5-858e-94ca9e4b530a', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 08:05:00+07'),
  ('d912dcd0-771b-4c23-b8da-379e033efc03', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-4', 'Rina Wijaya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-09 19:22:00+07'),
  ('687c6f70-b655-4c13-9cac-72625a4248b5', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-5', 'Agus Prasetyo', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-05 11:30:00+07'),
  ('975ce492-1333-489d-8234-d32b16815b9c', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-1', 'Dara Anindya', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-07 16:18:00+07'),
  ('84e13e98-ca1a-4d98-8818-3926428e0262', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-6', 'Maya Kusuma', 1, 18000, 2000, 2000, 22000, 'diterima', '2026-07-09 10:44:00+07'),
  ('a9cfcdcf-817c-4b86-8b7d-1dcac306c94e', '9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', 'u-donatur-7', 'Hendra Gunawan', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-08 13:05:00+07'),
  ('535bd945-bd61-41e0-ab3e-185c693ae9a7', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-8', 'Lestari Dewi', 3, 84000, 2000, 2000, 88000, 'diterima', '2026-07-06 07:50:00+07'),
  ('357c28fd-a744-47aa-85ff-92cce6dd7434', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-9', 'Fitri Handayani', 1, 28000, 2000, 2000, 32000, 'diterima', '2026-07-09 15:11:00+07'),
  ('d7eb6134-9445-40d2-9573-22d1b3addbbb', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-10', 'Rudi Setiawan', 3, 51000, 2000, 2000, 55000, 'diterima', '2026-07-04 08:30:00+07'),
  ('72bb4941-fa29-4431-a5cc-8ae9abcb6ece', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-11', 'Yuni Astuti', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-05 12:00:00+07'),
  ('bb834b3f-9cd4-4923-b555-543ee8153991', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-12', 'Bambang Wijoyo', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-06 17:45:00+07'),
  ('b4ec9dc0-f81f-4ad0-899b-97836c168ad6', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-1', 'Dara Anindya', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-08 09:25:00+07'),
  ('2dc22167-7794-499a-9e34-85f9a07fff48', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-13', 'Nia Safitri', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-09 20:10:00+07'),
  ('dae7466d-dafd-49e6-9a87-6625c57b2c3a', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-14', 'Eko Purnomo', 5, 65000, 2000, 2000, 69000, 'diterima', '2026-07-03 10:15:00+07'),
  ('c74a08c6-fc68-4c3a-a376-00e36d97f843', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-15', 'Dewi Anggraini', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-06 14:02:00+07'),
  ('6c76849f-b0db-43d2-a124-c997fbfc0298', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-09 08:47:00+07'),
  ('fab7cc90-9623-4930-91f1-14222ede1f01', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-6', 'Maya Kusuma', 4, 112000, 2000, 2000, 116000, 'diterima', '2026-07-05 09:00:00+07'),
  ('deaffb53-7169-43d7-971e-5d4ea37eba09', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-7', 'Hendra Gunawan', 2, 56000, 2000, 2000, 60000, 'diterima', '2026-07-08 11:35:00+07'),
  ('e7a90cdd-a195-4c63-9f86-ad84e7b1b2c9', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-7', 'Hendra Gunawan', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-03 09:20:00+07'),
  ('76ff45c9-3b32-4beb-84b0-f45d261cf568', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-8', 'Lestari Dewi', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-05 13:15:00+07'),
  ('91acff42-d436-47b7-8391-8bc207024f42', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-9', 'Fitri Handayani', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 10:05:00+07'),
  ('adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 16:40:00+07'),
  ('1cdf7659-e2a5-478a-bfa3-ec65617a47db', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-4', 'Rina Wijaya', 5, 60000, 2000, 2000, 64000, 'diterima', '2026-07-04 11:20:00+07'),
  ('ae57b7f0-8dd7-4355-af15-3d16ac4200f4', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-11', 'Yuni Astuti', 2, 24000, 2000, 2000, 28000, 'diterima', '2026-07-07 08:55:00+07'),
  ('ea423b1c-f9c1-4612-ab2f-21bb4480df67', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-14', 'Eko Purnomo', 1, 12000, 2000, 2000, 16000, 'diterima', '2026-07-09 17:30:00+07');

-- ============ BUKTI TERIMA (27) ============
-- Satu bukti per donasi. Batch Jumat 10 Juli 2026.
insert into bukti_terima (id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at) values
  ('c000bbbd-0401-4f6f-9fa1-b506cb9bc5c7', '9a12444b-5389-484b-a279-2b8386f10180', 'NYL-4F3F-1137', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('094c8ad4-92bd-4308-bdec-c97122542422', '2df0fb1a-93e2-4a80-8a34-48f28a2c3ab8', 'NYL-546E-1274', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('9b396ce5-af06-4a19-b0af-d06c93f33b14', '92527450-701b-4be5-858e-94ca9e4b530a', 'NYL-599D-1411', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('82d33381-1a67-4d56-bce8-c5683224bbf1', 'd912dcd0-771b-4c23-b8da-379e033efc03', 'NYL-5ECC-1548', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('80196a13-38ad-440f-a5eb-3646d7569d18', '687c6f70-b655-4c13-9cac-72625a4248b5', 'NYL-63FB-1685', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('c5590bf1-66b3-46a4-940b-3f8728ea914d', '975ce492-1333-489d-8234-d32b16815b9c', 'NYL-692A-1822', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('32a2e99b-8143-40b0-b8d4-2486e31edc42', '84e13e98-ca1a-4d98-8818-3926428e0262', 'NYL-6E59-1959', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('662f919d-6c17-47b8-8328-030f701a4a86', 'a9cfcdcf-817c-4b86-8b7d-1dcac306c94e', 'NYL-7388-2096', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('9b45114b-2694-4725-8ae8-62d80fbaf929', '535bd945-bd61-41e0-ab3e-185c693ae9a7', 'NYL-78B7-2233', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('01f7f1a2-4096-454f-85b8-6db7749a2a14', '357c28fd-a744-47aa-85ff-92cce6dd7434', 'NYL-7DE6-2370', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('4156ff20-d0ae-4a85-ad87-660a07a3c150', 'd7eb6134-9445-40d2-9573-22d1b3addbbb', 'NYL-8315-2507', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('faa1d937-83f0-4554-b94b-a5a025e1bfbf', '72bb4941-fa29-4431-a5cc-8ae9abcb6ece', 'NYL-8844-2644', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('6060f9b7-63d0-4a25-b245-ec7a42d09f31', 'bb834b3f-9cd4-4923-b555-543ee8153991', 'NYL-8D73-2781', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('2cd062ed-2fd6-46f0-84fc-d47bae3c6c2a', 'b4ec9dc0-f81f-4ad0-899b-97836c168ad6', 'NYL-92A2-2918', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('caafaea9-da32-466c-876b-01f57a31aeb9', '2dc22167-7794-499a-9e34-85f9a07fff48', 'NYL-97D1-3055', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('c6e941ef-2c51-4ba9-9c28-117dfab10b41', 'dae7466d-dafd-49e6-9a87-6625c57b2c3a', 'NYL-9D00-3192', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('c7ead3e4-e22f-47ab-9ec4-c974dd06e760', 'c74a08c6-fc68-4c3a-a376-00e36d97f843', 'NYL-A22F-3329', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('a908bcc0-3792-4eab-a0b4-5c7bde5f32c8', '6c76849f-b0db-43d2-a124-c997fbfc0298', 'NYL-A75E-3466', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('7656c0da-da6c-4593-bfed-383c6f4f824e', 'fab7cc90-9623-4930-91f1-14222ede1f01', 'NYL-AC8D-3603', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('6e624549-16a3-4b4d-a39e-10758f3d0f7c', 'deaffb53-7169-43d7-971e-5d4ea37eba09', 'NYL-B1BC-3740', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('e204c11f-9869-4730-9aa6-7b17e5161de0', 'e7a90cdd-a195-4c63-9f86-ad84e7b1b2c9', 'NYL-B6EB-3877', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('4be7d67e-6956-4324-a53c-395329d291db', '76ff45c9-3b32-4beb-84b0-f45d261cf568', 'NYL-BC1A-4014', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('197830f7-a2aa-498e-a7ca-e6c4d9b111cc', '91acff42-d436-47b7-8391-8bc207024f42', 'NYL-C149-4151', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('59dec3e8-c65a-492e-91b3-a8bd0c91bf23', 'adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', 'NYL-7F3A-2210', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('d2f129db-6882-4ac1-b58a-5418ed1c35d0', '1cdf7659-e2a5-478a-bfa3-ec65617a47db', 'NYL-C678-4288', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('a0439e13-e3ca-4e38-b9bc-9602d583d0cb', 'ae57b7f0-8dd7-4355-af15-3d16ac4200f4', 'NYL-CBA7-4425', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('12010f06-161b-47ee-8f1f-b0229e449de2', 'ea423b1c-f9c1-4612-ab2f-21bb4480df67', 'NYL-D0D6-4562', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07');

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
