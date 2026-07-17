-- =====================================================================
-- Profil panti: deskripsi + galeri foto
--
-- Jalankan SEKALI di Supabase SQL Editor, sebelum reset-seed.sql berikutnya.
-- Aman diulang (if not exists) dan tidak menyentuh baris yang sudah ada.
--
-- deskripsi — cerita & permasalahan panti, ditulis pengurus di /edit-profil.
--             null berarti belum diisi; layar donatur menampilkan kosong yang
--             jujur, bukan lorem.
--
-- galeri    — daftar URI foto, BUKAN URL. Isinya file:// dari galeri HP pengurus
--             (expo-image-picker). Nol permintaan jaringan saat dirender, sama
--             alasannya dengan require() di lib/gambar.ts: WiFi venue itu risiko
--             nomor satu. Konsekuensinya: URI cuma hidup di HP yang memotretnya.
--             Dibaca dari HP lain, FotoPlaceholder jatuh ke kotak berlabel.
--             Itu diterima untuk demo satu device.
-- =====================================================================

alter table panti
  add column if not exists deskripsi text,
  add column if not exists galeri text[] not null default '{}'::text[];
