-- =====================================================================
-- Foto sampul panti — dipisah dari galeri
--
-- Jalankan SEKALI di Supabase SQL Editor, setelah 2026-07-17-profil-panti.sql.
-- Aman diulang.
--
-- Kenapa kolom baru dan bukan galeri[0]:
--   Sampul dan galeri menjawab pertanyaan berbeda. Sampul itu wajah panti di
--   etalase — satu foto, dipilih sadar, dilihat orang yang belum pernah dengar
--   panti ini. Galeri itu bukti kondisi — banyak foto, urutannya tidak penting.
--   Menyatukannya berarti mengganti urutan galeri diam-diam mengganti wajah
--   panti di etalase, dan pengurus tidak punya cara menyatakan "yang ini yang
--   saya mau orang lihat duluan".
--
-- Kenapa kolom baru dan bukan foto_url yang sudah ada:
--   foto_url menjanjikan URL. Isi sampul adalah file:// dari HP pengurus. Kolom
--   yang namanya berbohong lebih mahal daripada kolom baru.
--
-- Isinya URI, bukan URL — alasan lengkap di migrations/2026-07-17-profil-panti.sql
-- =====================================================================

alter table panti
  add column if not exists sampul text;
