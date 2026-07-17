# Foto Nyalur — spesifikasi & prompt AI

Taruh file di folder ini dengan **nama persis** seperti di bawah, lalu buang tanda
komentar di `lib/gambar.ts`. Tidak ada file lain yang perlu disentuh.

Selama file belum lengkap, app tetap jalan — `FotoPlaceholder` jatuh ke kotak
sky-tint berlabel. Jadi tidak ada yang rusak sambil menunggu.

## Status

| File | Status |
|---|---|
| `telur.jpg` | ✅ aktif — bersih, tanpa merek |
| `beras.jpg` | ✅ aktif — ⚠️ bermerek (Sania) |
| `minyak.jpg` | ✅ aktif — ⚠️ bermerek (Tropical) |
| `susu.jpg` | ✅ aktif — ⚠️ bermerek (Ultra Milk) |
| `sabun.jpg` | ✅ aktif — ⚠️ bermerek (Dettol) |
| `buku.jpg` | ✅ aktif — ⚠️ bermerek (Alfa Campus) + watermark `@superacc` |
| `panti-*.jpg` (×5) | ⛔ **sengaja kotak placeholder** — lihat bagian 2 |
| `serah-terima.jpg` | ⛔ **sengaja kotak placeholder** — lihat bagian 3 |

Keenam katalog sudah aktif di `lib/gambar.ts`. Foto bermerek dipakai **atas
keputusan sadar** — risikonya tercatat di bagian bawah, bukan terlewat.

Prompt di bagian 1 & 2 tetap disimpan: kalau nanti ada waktu mengganti yang
bermerek, tinggal generate, timpa file dengan nama sama, selesai — tidak ada kode
yang berubah.

---

## ⚠️ Risiko yang sedang berjalan — dipilih sadar, bukan terlewat

Enam foto katalog yang aktif sekarang adalah foto produk e-commerce bermerek:
**Sania** (beras), **Tropical** (minyak), **Ultra Milk** (susu), **Dettol**
(sabun), **Alfa Campus** (buku) — yang terakhir membawa watermark reseller
`@superacc` yang terbakar di gambarnya. Hanya `telur.jpg` yang bersih.

Dipakai karena waktu, dan itu keputusan yang sah. Tapi tiga konsekuensinya nyata
dan sebaiknya kamu tahu sebelum berdiri di depan juri:

1. **Watermark & hak cipta.** Itu foto dan merek dagang milik perusahaan lain.
   Tayang di demo dan ikut terekam di video.
2. **Foto membantah teksnya sendiri.** Kartu bertuliskan "Beras premium"; fotonya
   bilang "Sania Beras Premium **5kg**" — padahal app menjual **per kg** dan sheet
   porsi menawarkan "1 kg". Dua klaim berbeda dalam satu kartu.
3. **Menabrak posisi pitch.** Brief §5: *"Nyalur punya gudang sendiri, seperti
   Astro"* — first-party. Memajang merek asli menyiratkan kamu menyetok merek itu,
   dan menyerahkan pertanyaan *"mana perjanjian distribusinya?"* ke juri secara
   cuma-cuma.

Katalog di DB memang sengaja generik: "Beras premium", "Minyak goreng", "Susu
UHT", "Sabun mandi", "Buku tulis". Fotonya harus ikut generik.

**Kalau hasil generate masih memunculkan tulisan atau logo di kemasan, ulangi.**
Model gambar suka menempelkan label. Tambahkan ke negative prompt:
`text, letters, words, logo, brand, label, watermark, signature, packaging design`

---

## Aturan untuk semua

- **JPG**, bukan PNG (foto, bukan grafis).
- **Tanpa teks, tanpa logo, tanpa merek, tanpa watermark, tanpa papan nama.**
- **Tanpa wajah.**
- Patuhi palet brief §9: putih dominan, bersih, lapang. **Bukan estetika kotak
  amal** — ini infrastruktur kepercayaan, mendekati fotografi katalog Astro.

---

## 1. Katalog — 5 file tersisa

**Ukuran:** persegi, **600–800 px** · **≤150 KB** masing-masing

`telur.jpg` yang sudah masuk berukuran 360×360 dan itu cukup — dipakai maksimal
96 px, jadi 3× pun masih tajam. Tidak perlu diulang.

Dipakai persegi (44–60 px) dan melebar (±160 × 96 px di grid katalog), keduanya
`cover`. **Objek harus di tengah** supaya kedua potongan sama-sama utuh.

Kelimanya harus terlihat **satu set** dengan `telur.jpg`: latar putih, cahaya
lembut merata, objek di tengah, bayangan tipis. Kalau salah satu beda gaya, grid
katalog langsung terasa tempelan.

**Prompt dasar** — ganti `[OBJEK]`:

```
Product photography of [OBJEK], centered on a pure white seamless
background, soft even studio lighting from the top left, subtle soft contact
shadow beneath the object, slight three-quarter angle from above, sharp focus,
clean minimal e-commerce catalogue style, no text, no logos, no branding, no
packaging labels, no props, no hands, square composition with generous empty
margin around the object, photorealistic, high detail
```

Negative prompt: `text, letters, words, logo, brand, label, watermark, signature, packaging design, price tag`

| File | `[OBJEK]` |
|---|---|
| `beras.jpg` | `a transparent plastic bag of premium white rice grains, standing upright, completely blank unlabeled clear bag, no printing whatsoever` |
| `minyak.jpg` | `a clear plastic bottle of golden cooking oil, completely blank bottle with no label and no printing, plain yellow cap` |
| `susu.jpg` | `three plain white UHT milk cartons stacked neatly, completely blank white cartons, no printing, no label` |
| `sabun.jpg` | `four bars of plain cream-colored bath soap stacked, unwrapped, smooth surface, no embossing, no lettering` |
| `buku.jpg` | `a neat stack of five school exercise notebooks, plain solid-color covers, completely blank, no writing, no cover design` |

---

## 2. Panti — SENGAJA tetap kotak placeholder

Kartu panti memakai kotak sky-tint berlabel, dan itu keputusan sadar.

Satu-satunya kandidat yang ada (`panti.jpg` di Desktop) ternyata poster acara
milik organisasi lain — ilustrasi kartun dua tangan berjabat, menyebut **Panti
Nurul Huda Azzuhdi**, membawa logo **Jasamarga** dan **Gemstone**. Bukan
bangunan, jadi di hero 220 px ia cuma menampilkan potongan tangan raksasa; dan
karena cuma satu, kelima kartu etalase akan jadi poster identik.

Kotak placeholder yang seragam di kelima kartu terbaca lebih rapi daripada satu
gambar salah yang diulang lima kali — dan tidak mengklaim apa pun yang tidak
benar. Katalog sudah berfoto, jadi layar tidak terasa kosong.

Kalau nanti ada lima foto bangunan sungguhan, spesifikasi & prompt-nya ada di
bawah — tinggal taruh dan buang komentar lima baris di `lib/gambar.ts`.

**Ukuran:** 1600 × 900 px (16:9) · **≤250 KB** masing-masing

Dipakai sebagai hero melebar (±390 × 220 px) **dan** thumbnail persegi 64 px.
Potongan persegi mengambil bagian tengah — **bangunannya harus di tengah bingkai**,
jangan di tepi. Foto potret akan terpotong parah; pakai 16:9.

Kelimanya harus **jelas berbeda**. Brief §10: *"5 kartu = produk, 1 kartu =
prototype"*. Kalau mirip-mirip, etalase justru terbaca copy-paste.

**Prompt dasar** — ganti `[BANGUNAN]`:

```
Documentary architectural photograph of [BANGUNAN], Indonesian suburban
residential neighborhood, bright overcast midday daylight, soft natural shadows,
eye-level view from across the street, building centered in frame, tropical
plants and trees around, no people, no faces, no signage, no text, no lettering,
no logos, realistic, clean, well-maintained, photorealistic, high detail,
16:9 aspect ratio
```

Negative prompt: `text, signage, letters, banner, poster, logo, watermark, people, faces, illustration, cartoon`

| File | `[BANGUNAN]` |
|---|---|
| `panti-harapan-bunda.jpg` | `a modest two-story white and light-blue painted care home building with a small paved front courtyard and low fence` |
| `panti-kasih-ibu.jpg` | `a single-story care home with a terracotta tiled roof, cream walls, and a small front garden with potted plants` |
| `panti-al-falah.jpg` | `a larger two-story cream-colored care home with arched windows and a small dome, adjoining a modest prayer hall` |
| `panti-bina-sejahtera.jpg` | `a modern minimalist two-story care home, white walls, flat roof, black metal gate, neat lawn` |
| `panti-anugerah.jpg` | `a simple single-story care home with pale green walls, wide covered veranda, large mango tree beside it` |

> Nama panti **tidak** ditulis di foto — nama diambil dari database dan sudah
> tampil sebagai teks di kartu. Foto berisi tulisan apa pun (termasuk poster atau
> spanduk) akan bertabrakan dengan nama yang tercetak di sebelahnya.

---

## 3. Serah terima — SENGAJA tetap placeholder

Tidak ada file untuk ini, dan itu keputusan sadar — bukan pekerjaan tertinggal.

Layar bukti (`bukti/[id]`) adalah momen juri menatap paling lama; brief §11
menyuruh kamu diam sebentar di situ. Justru karena itu, foto palsu paling
berbahaya di layar ini: yang ditatap lama, diperiksa lama. Begitu satu foto
ketahuan dikarang, seluruh klaim "kami punya bukti" ikut goyah.

Placeholder tidak berbohong, jadi tidak bisa ketahuan berbohong. Narasikan:
*"Di produksi, kurir mengunggah foto dari app mitra."* — persis Opsi A brief §10,
yang memang sudah jadi keputusan terkunci.

Kalau nanti ada foto **asli** (susun sendiri: karung beras + kardus di lantai
keramik dekat pintu, potret pakai HP — sepuluh menit, tanpa model, tanpa panti):
taruh `serah-terima.jpg` di sini, lalu tukar satu baris `FOTO_BUKTI` di
`lib/gambar.ts`. Call site-nya sudah menunggu.

---

## Setelah file masuk

1. Buang komentar di `lib/gambar.ts` — 11 baris `require()`.
2. `npx tsc --noEmit` harus bersih.
3. Jalankan app: Beranda → detail panti → sheet porsi → bayar → lacak → bukti.
4. **Aktifkan mode pesawat, ulangi.** Foto panti & katalog harus tetap tampil.
   Kalau ada yang kosong, ia masih menempel jaringan.

### Soal kolom `bukti_terima.foto_url`

Kolomnya masih berisi `https://placehold.co/...`, dan itu **dibiarkan dengan
sengaja** — skema mendefinisikan `foto_url text not null` (brief §2), jadi
mengosongkannya butuh migrasi, dan tidak ada gunanya bermigrasi untuk kolom yang
sudah tidak dibaca.

Yang diubah adalah sisi app: `app/(donatur)/bukti/[id].tsx` **tidak lagi
meneruskan `url`** ke `FotoPlaceholder`. Layar bukti sekarang hanya mengenal satu
sumber foto — `FOTO_BUKTI` di `lib/gambar.ts`. Selama ia kosong, yang tampil kotak
placeholder lokal: **nol permintaan jaringan di layar klimaks**.

Jadi kolom itu tetap ada supaya skema utuh dan insert tetap sah, tapi tidak
pernah menggambar apa pun.
