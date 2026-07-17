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
-- Cerita seed: DUA batch.
--   Batch 1 — Jumat 10 Juli 2026, sudah sampai. Donasinya dibuat 3-9 Juli.
--     Tiap panti punya jam kunjungan kurir sendiri, jadi bukti satu panti
--     berbagi timestamp — memang satu serah terima.
--   Batch 2 — Jumat 17 Juli 2026, belum sampai. Donasinya dibuat 11-16 Juli:
--     ketinggalan batch 1, menunggu yang berikutnya. Status 'dikemas'/'dikirim',
--     BELUM berbukti. Ini yang mengisi filter status di Riwayat donatur dan
--     memanggil timeline biru "sedang berjalan" di layar Lacak.
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
--
-- galeri sengaja dikosongkan: foto panti datang dari HP pengurus lewat
-- /edit-profil, dan URI-nya cuma hidup di HP itu. Menyeed URI palsu = galeri
-- yang isinya lima kotak gagal muat.
insert into panti (id, nama, alamat, kota, jarak_km, jumlah_anak, plafon_bulanan, plafon_terpakai, status, deskripsi) values
  ('11e3e8fc-a545-4116-bb18-60d2fc404fbc', 'Panti Harapan Bunda', 'Jl. Merpati No. 12', 'Tangerang Selatan', 2.4, 25, 12500000, 4200000, 'terverifikasi', E'Kami berdiri sejak 2011 di gang kecil belakang Pasar Merpati, mengasuh 25 anak usia 4 sampai 17 tahun. Sebagian besar datang setelah orang tuanya meninggal atau tidak lagi sanggup merawat.\n\nPemasukan tetap kami cuma dari 12 donatur bulanan, dan itu habis di listrik, air, serta SPP anak-anak yang sekolah negeri. Yang selalu kurang justru yang paling sederhana: beras dan susu. Dapur kami masak tiga kali sehari untuk 28 orang termasuk pengasuh, jadi 10 kg beras habis dalam dua hari.'),
  ('4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', 'Panti Kasih Ibu', 'Jl. Kenanga No. 8', 'Ciputat', 4.1, 18, 9000000, 1100000, 'terverifikasi', E'Panti Kasih Ibu mengasuh 18 anak perempuan di rumah kontrakan dua lantai di Ciputat. Kami kecil, cuma empat pengasuh, dan sengaja tidak menambah anak sebelum yakin bisa merawat yang sudah ada dengan layak.\n\nMasalah terbesar kami tahun ini adalah gizi. Sembilan anak masuk kategori kurang berat badan waktu pemeriksaan Puskesmas bulan Mei. Dokter menyarankan susu tiap hari, dan itu pos yang paling sering kami potong duluan kalau uang menipis.'),
  ('d3a2ba3a-fc9f-480d-89c6-a9e724e83529', 'Rumah Yatim Al-Falah', 'Jl. Cendana Raya No. 30', 'Pamulang', 5.8, 32, 16000000, 9800000, 'terverifikasi', E'Rumah Yatim Al-Falah adalah yang terbesar di antara panti yang kami kenal di Pamulang: 32 anak, 6 pengasuh, satu dapur. Kami juga menjalankan madrasah sore yang terbuka untuk anak sekitar, jadi tiap hari ada sekitar 50 anak di halaman.\n\nDapur adalah titik paling rapuh kami. Sekali masak berarti 38 porsi, dan minyak goreng 10 liter cuma cukup dua minggu. Awal tahun kami sempat dua kali mengganti lauk jadi tahu tempe rebus karena minyak habis sebelum tanggal kiriman.'),
  ('e310ddb1-f197-442a-b450-dfd402b35335', 'Panti Bina Sejahtera', 'Jl. Anggrek No. 5', 'Serpong', 7.2, 21, 10500000, 5400000, 'terverifikasi', E'Bina Sejahtera menempati bekas rumah keluarga yang diwakafkan pada 2016. Ada 21 anak di sini, 14 di antaranya masih SD. Kami tidak menerima donasi tunai dari perorangan sejak 2019, semua bantuan kami minta dalam bentuk barang supaya bisa dicatat dan diperlihatkan.\n\nYang paling sering kosong adalah protein. Telur jadi andalan karena murah dan anak-anak mau makan, tapi 15 kg untuk 21 anak habis kira-kira sepuluh hari. Selebihnya kami isi dengan apa yang ada.'),
  ('091db2fc-ce2a-4739-8578-266e49cfd6a8', 'Panti Anugerah', 'Jl. Melati No. 44', 'BSD', 8.5, 28, 14000000, 7100000, 'terverifikasi', E'Panti Anugerah mengasuh 28 anak di BSD, dari bayi 8 bulan sampai anak kelas 3 SMA. Kami punya dua kamar bayi dan itu yang membuat kebutuhan kami berbeda dari panti lain di sekitar sini.\n\nKebersihan jadi pengeluaran yang tidak bisa ditawar: sabun, deterjen, popok. Dengan 28 anak di satu rumah, satu anak sakit kulit berarti seminggu kemudian lima anak ikut. Sabun mandi 20 pcs terdengar banyak, di kami habis kurang dari sebulan.');

-- ============ REQUEST (9) ============
-- jumlah_terpenuhi di bawah SELALU sama dengan SUM(donasi) terkait.
insert into request (id, panti_id, katalog_id, jumlah_diminta, jumlah_terpenuhi, status, batch_kirim) values
  ('16694b24-7c62-4587-a53d-499d07de28a4', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10, 7, 'aktif', 'Jumat'),
  ('7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', '11e3e8fc-a545-4116-bb18-60d2fc404fbc', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20, 7, 'aktif', 'Jumat'),
  ('9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '455e47be-4ee5-47ac-8fd2-c972ac901594', 20, 2, 'aktif', 'Jumat'),
  ('c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', '4c74301a-5cd1-49cd-a1a6-75cc4862f5a6', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15, 6, 'aktif', 'Jumat'),
  ('2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '69941d9c-9894-4641-8165-37d16abd1e12', 10, 9, 'aktif', 'Jumat'),
  ('8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'd3a2ba3a-fc9f-480d-89c6-a9e724e83529', '86a858c2-989f-4214-a8bb-160d97bdfa19', 30, 16, 'aktif', 'Jumat'),
  ('5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'e310ddb1-f197-442a-b450-dfd402b35335', '3cb78f18-bb50-4ba0-a508-8edf87be2676', 15, 6, 'aktif', 'Jumat'),
  ('2359742d-0b8b-484b-9a0a-f1dd496e1f49', '091db2fc-ce2a-4739-8578-266e49cfd6a8', '86a858c2-989f-4214-a8bb-160d97bdfa19', 10, 10, 'diterima', 'Jumat'),
  ('a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', '091db2fc-ce2a-4739-8578-266e49cfd6a8', 'f33e546c-9751-42d9-b7ca-1264c7ebe4fd', 20, 11, 'aktif', 'Jumat');

-- ============ DONASI (31) ============
-- Setiap kg progress punya donatur di belakangnya.
insert into donasi (id, request_id, donatur_id, donatur_nama, jumlah, harga_barang, ongkir, platform_fee, total, status, created_at) values
  ('4aac45cd-3ddc-4528-928c-575ac49d12f2', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-06 09:12:00+07'),
  ('8d84d168-f0f5-4d95-8043-32a0d40d4e75', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-3', 'Siti Rahmawati', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 14:40:00+07'),
  ('8edb6d21-a15b-4b69-b57c-96f39c04096d', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 08:05:00+07'),
  ('6cef323f-78a9-4980-8658-a199498ac07d', '16694b24-7c62-4587-a53d-499d07de28a4', 'u-donatur-4', 'Rina Wijaya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-09 19:22:00+07'),
  ('a4a60b84-d276-43f7-8f82-1517be04b70b', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-5', 'Agus Prasetyo', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-05 11:30:00+07'),
  ('4e9d9ed6-36ef-4ee8-b863-46ed9f3d15ef', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-1', 'Dara Anindya', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-07 16:18:00+07'),
  ('f24ab281-906f-45cc-8876-7dfce5db3988', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-6', 'Maya Kusuma', 1, 18000, 2000, 2000, 22000, 'diterima', '2026-07-09 10:44:00+07'),
  ('571fd135-ff12-457b-b9d5-c5c8528f70a9', '7b1c4d21-3f8a-4c62-9d15-2a6e8b4f0c93', 'u-donatur-6', 'Maya Kusuma', 2, 36000, 2000, 2000, 40000, 'dikemas', '2026-07-16 16:45:00+07'),
  ('2b6e5741-9513-4fb7-932e-7a20791bfcbe', '9d2e6a70-8c14-4b93-a726-5f1d3e9c8b42', 'u-donatur-7', 'Hendra Gunawan', 2, 36000, 2000, 2000, 40000, 'diterima', '2026-07-08 13:05:00+07'),
  ('442cba55-ed84-416b-b2cd-a6078640351e', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-8', 'Lestari Dewi', 3, 84000, 2000, 2000, 88000, 'diterima', '2026-07-06 07:50:00+07'),
  ('502bbaaf-d571-4456-acd0-f756e7a2f415', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-9', 'Fitri Handayani', 1, 28000, 2000, 2000, 32000, 'diterima', '2026-07-09 15:11:00+07'),
  ('687ceb46-3716-49e6-ac82-b63b8ecc8c7e', 'c4f8b3e1-6d29-4a57-8e03-1b7c5a9f2d64', 'u-donatur-1', 'Dara Anindya', 2, 56000, 2000, 2000, 60000, 'dikirim', '2026-07-13 09:30:00+07'),
  ('09b4347b-f9a8-4e1c-a7a4-cd9f0c2e7b4d', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-10', 'Rudi Setiawan', 3, 51000, 2000, 2000, 55000, 'diterima', '2026-07-04 08:30:00+07'),
  ('cdd8e7cf-db55-4cad-8410-15d6dd57776a', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-11', 'Yuni Astuti', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-05 12:00:00+07'),
  ('131c168b-fb4f-4778-a6dd-e5f38a3192c9', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-12', 'Bambang Wijoyo', 2, 34000, 2000, 2000, 38000, 'diterima', '2026-07-06 17:45:00+07'),
  ('42b0f2da-6b4a-4847-bd84-f3737d4a2d43', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-1', 'Dara Anindya', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-08 09:25:00+07'),
  ('68a78249-84dc-42fc-a4b8-4bccec03bd2e', '2a5d9c83-7e41-4f60-b8a2-3c6e1d4b7f95', 'u-donatur-13', 'Nia Safitri', 1, 17000, 2000, 2000, 21000, 'diterima', '2026-07-09 20:10:00+07'),
  ('4a26a193-df0e-493e-9469-f6352673e07f', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-14', 'Eko Purnomo', 5, 65000, 2000, 2000, 69000, 'diterima', '2026-07-03 10:15:00+07'),
  ('f3168d88-c4f6-4bfb-9486-f4d04ecaec9a', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-15', 'Dewi Anggraini', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-06 14:02:00+07'),
  ('ff46a298-506a-4340-986d-5e2435de05df', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-2', 'Budi Santoso', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-09 08:47:00+07'),
  ('1eb4a0e6-1579-4551-b8b5-18386bf955e9', '8e3b1f47-5a92-4d68-9c74-6f2a8d3e5b01', 'u-donatur-2', 'Budi Santoso', 4, 52000, 2000, 2000, 56000, 'dikirim', '2026-07-14 08:20:00+07'),
  ('4a0a3128-e681-4635-a558-3570d32ac2c8', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-6', 'Maya Kusuma', 4, 112000, 2000, 2000, 116000, 'diterima', '2026-07-05 09:00:00+07'),
  ('ffa1e626-4955-4a1b-95a2-ff94493a3dee', '5c7a2e94-1b63-4f85-a039-8d4e6c1b9f27', 'u-donatur-7', 'Hendra Gunawan', 2, 56000, 2000, 2000, 60000, 'diterima', '2026-07-08 11:35:00+07'),
  ('c81e6e68-14b5-45fd-99da-3a295297ce15', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-7', 'Hendra Gunawan', 4, 52000, 2000, 2000, 56000, 'diterima', '2026-07-03 09:20:00+07'),
  ('5415c2a7-7f8a-45e1-aa4c-469adaefbfec', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-8', 'Lestari Dewi', 3, 39000, 2000, 2000, 43000, 'diterima', '2026-07-05 13:15:00+07'),
  ('7f72bc0b-5351-4185-a3d3-cfdb33e13e89', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-9', 'Fitri Handayani', 2, 26000, 2000, 2000, 30000, 'diterima', '2026-07-07 10:05:00+07'),
  ('adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', '2359742d-0b8b-484b-9a0a-f1dd496e1f49', 'u-donatur-1', 'Dara Anindya', 1, 13000, 2000, 2000, 17000, 'diterima', '2026-07-08 16:40:00+07'),
  ('07ac09e4-d363-46ae-af16-db4ce8a0c26d', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-4', 'Rina Wijaya', 5, 60000, 2000, 2000, 64000, 'diterima', '2026-07-04 11:20:00+07'),
  ('ea542ec4-838a-46ae-bf13-7d5b977cd93a', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-11', 'Yuni Astuti', 2, 24000, 2000, 2000, 28000, 'diterima', '2026-07-07 08:55:00+07'),
  ('5eee51f8-b065-4d1f-bd40-8c61fb524a22', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-14', 'Eko Purnomo', 1, 12000, 2000, 2000, 16000, 'diterima', '2026-07-09 17:30:00+07'),
  ('5e9f4436-81af-4022-8d9e-a97335d9f756', 'a1e5d8c2-4f76-4b39-8207-9c3b5e7a1d68', 'u-donatur-1', 'Dara Anindya', 3, 36000, 2000, 2000, 40000, 'dikemas', '2026-07-15 19:10:00+07');

-- ============ BUKTI TERIMA (27) ============
-- Satu bukti per donasi. Batch Jumat 10 Juli 2026.
insert into bukti_terima (id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at) values
  ('ea74c248-b2dd-4abf-996f-872306be905c', '4aac45cd-3ddc-4528-928c-575ac49d12f2', 'NYL-4F3F-1137', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('e8d7a853-f9b4-4b15-a0c8-9a5848a0d6fd', '8d84d168-f0f5-4d95-8043-32a0d40d4e75', 'NYL-546E-1274', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('c0c5fc2c-166c-4dd8-b5eb-7e45eff3db4f', '8edb6d21-a15b-4b69-b57c-96f39c04096d', 'NYL-599D-1411', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('74d49eeb-ea55-4131-9dce-83c1ff939cd4', '6cef323f-78a9-4980-8658-a199498ac07d', 'NYL-5ECC-1548', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('d4a9c56b-e235-4419-9edf-e70fb15941af', 'a4a60b84-d276-43f7-8f82-1517be04b70b', 'NYL-63FB-1685', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('b4aac02f-3fcb-4ad0-b208-c374bba73012', '4e9d9ed6-36ef-4ee8-b863-46ed9f3d15ef', 'NYL-692A-1822', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('4b34a825-d1f6-4eb2-81f3-f3b8b73c4900', 'f24ab281-906f-45cc-8876-7dfce5db3988', 'NYL-6E59-1959', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Siti Rohmah', 'Pengurus, Panti Harapan Bunda', -6.2886, 106.71, '2026-07-10 10:15:00+07'),
  ('02d1a068-4434-4df3-bb52-89ab491c26be', '2b6e5741-9513-4fb7-932e-7a20791bfcbe', 'NYL-7388-2096', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('9f4be0d0-7a89-49e0-ab21-432abb86e914', '442cba55-ed84-416b-b2cd-a6078640351e', 'NYL-78B7-2233', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('90be63df-8fff-45fa-bcbf-7c40b612abfe', '502bbaaf-d571-4456-acd0-f756e7a2f415', 'NYL-7DE6-2370', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Nurhayati', 'Pengurus, Panti Kasih Ibu', -6.3103, 106.7519, '2026-07-10 11:30:00+07'),
  ('dbb65472-b916-40be-999a-a7906cd23e59', '09b4347b-f9a8-4e1c-a7a4-cd9f0c2e7b4d', 'NYL-8315-2507', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('eb8dc968-07cc-468e-9c5c-2ff1d51af69e', 'cdd8e7cf-db55-4cad-8410-15d6dd57776a', 'NYL-8844-2644', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('19a55e5c-d2c4-4ee5-9cb2-8bf3a10f7dcd', '131c168b-fb4f-4778-a6dd-e5f38a3192c9', 'NYL-8D73-2781', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('50f7f2e9-23a0-4b14-a65c-765940e34f8e', '42b0f2da-6b4a-4847-bd84-f3737d4a2d43', 'NYL-92A2-2918', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('fab71511-5675-4516-9510-96a207166d52', '68a78249-84dc-42fc-a4b8-4bccec03bd2e', 'NYL-97D1-3055', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('fba5516d-7758-4a85-b730-8593c0c38bb7', '4a26a193-df0e-493e-9469-f6352673e07f', 'NYL-9D00-3192', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('dfde5efd-55f7-4702-874e-c38ed5cfef8f', 'f3168d88-c4f6-4bfb-9486-f4d04ecaec9a', 'NYL-A22F-3329', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('129b621e-2c4e-4db6-813c-48ba47cb7a60', 'ff46a298-506a-4340-986d-5e2435de05df', 'NYL-A75E-3466', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Pak Ahmad Fauzi', 'Pengurus, Rumah Yatim Al-Falah', -6.3428, 106.7385, '2026-07-10 13:05:00+07'),
  ('9a785b04-7b84-4e53-b21c-e552e5b03d9b', '4a0a3128-e681-4635-a558-3570d32ac2c8', 'NYL-AC8D-3603', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('baa0938e-6e75-4928-97ba-b1d0fd1383cc', 'ffa1e626-4955-4a1b-95a2-ff94493a3dee', 'NYL-B1BC-3740', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Lestari Wulandari', 'Pengurus, Panti Bina Sejahtera', -6.3187, 106.6712, '2026-07-10 14:00:00+07'),
  ('d738530f-2844-4990-917e-aa60eaaa4e51', 'c81e6e68-14b5-45fd-99da-3a295297ce15', 'NYL-B6EB-3877', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('28176a6b-b401-4259-abf2-3b84c41e4d0b', '5415c2a7-7f8a-45e1-aa4c-469adaefbfec', 'NYL-BC1A-4014', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('91815c19-3c4c-4ad6-ab86-932688fc8a7c', '7f72bc0b-5351-4185-a3d3-cfdb33e13e89', 'NYL-C149-4151', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('59dec3e8-c65a-492e-91b3-a8bd0c91bf23', 'adcdcfd7-257c-4d3a-9bad-4ac4ebf4f8a9', 'NYL-7F3A-2210', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('234fa46e-e55e-4269-b7db-1350d5470724', '07ac09e4-d363-46ae-af16-db4ce8a0c26d', 'NYL-C678-4288', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('c08eff4f-e350-43e5-8e81-c999a0555aeb', 'ea542ec4-838a-46ae-bf13-7d5b977cd93a', 'NYL-CBA7-4425', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07'),
  ('3ab05926-7404-4f5f-adf1-38fb17ff22b5', '5eee51f8-b065-4d1f-bd40-8c61fb524a22', 'NYL-D0D6-4562', 'https://placehold.co/800x600/EAF2FE/1B5FE3?text=Bukti+Serah+Terima', 'Ibu Maria Sinaga', 'Pengurus, Panti Anugerah', -6.3019, 106.6528, '2026-07-10 14:32:00+07');

commit;

-- ============ VERIFIKASI ============
-- Semua baris 'harus 0' wajib nol. 'angka hantu' = progress tanpa donasi.
select 'katalog' as cek, count(*)::text as nilai, '6' as harus from katalog
union all select 'panti',   count(*)::text, '5'  from panti
union all select 'request', count(*)::text, '9'  from request
union all select 'donasi',  count(*)::text, '31' from donasi
union all select 'bukti',   count(*)::text, '27' from bukti_terima
union all select 'panti tanpa deskripsi', count(*)::text, '0' from panti where deskripsi is null or deskripsi = ''
union all select 'lebih dari target', count(*)::text, '0' from request where jumlah_terpenuhi > jumlah_diminta
union all select 'donasi diterima tanpa bukti', count(*)::text, '0'
  from donasi d left join bukti_terima b on b.donasi_id = d.id
  where b.id is null and d.status = 'diterima'
union all select 'bukti di donasi belum sampai', count(*)::text, '0'
  from donasi d join bukti_terima b on b.donasi_id = d.id where d.status <> 'diterima'
union all select 'donasi dikemas', count(*)::text, '2' from donasi where status = 'dikemas'
union all select 'donasi dikirim', count(*)::text, '2' from donasi where status = 'dikirim'
union all select 'donasi diterima', count(*)::text, '27' from donasi where status = 'diterima'
union all select 'angka hantu', count(*)::text, '0' from (
  select r.id from request r left join donasi d on d.request_id = r.id
  group by r.id, r.jumlah_terpenuhi
  having r.jumlah_terpenuhi <> coalesce(sum(d.jumlah), 0)
) x
union all select 'donatur beras Harapan Bunda', count(distinct donatur_id)::text, '4'
  from donasi where request_id = '16694b24-7c62-4587-a53d-499d07de28a4';
