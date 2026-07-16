# NYALUR — Context Brief

> **Cara pakai:** Paste seluruh isi file ini ke Claude di awal chat baru, lalu tulis tugasmu di bawahnya.
> Contoh: *"[paste brief] — Tolong buatkan komponen React Native untuk kartu etalase kebutuhan panti."*
> Claude akan langsung punya konteks penuh tanpa perlu dijelaskan ulang.

---

## 0. Cara Membaca Dokumen Ini

Dokumen ini adalah **sumber kebenaran tunggal** untuk project Nyalur di hackathon.
Semua keputusan di sini sudah final kecuali ditandai `[BELUM DIPUTUSKAN]`.
Kalau ada konflik antara dokumen ini dan ingatan siapa pun, dokumen ini yang menang.

---

## 1. Konteks Acara

- **Event:** Hackathon 30 jam
- **Tim:** 3 orang
- **Tiga track tersedia:** Health, Safety, Agriculture & Food Systems
- **Track yang dipilih:** **SAFETY**
- **Deliverable:** Mobile app (Expo Go) + pitch deck + demo langsung dari HP

### Pertanyaan challenge yang dijawab

**Utama:**
> *How can we help low-income households build accessible safety nets to withstand sudden economic shocks or emergency expenses?*

**Pendukung:**
> *How can we protect vulnerable people and communities from online fraud, predatory digital lending, and cybersecurity threats that pose a threat to their financial or personal safety?*

**Roadmap (disebut di deck, tidak dibangun):**
> *How might we support emergency response coordination and resource distribution during disasters?*

---

## 2. Produk

**Nama:** NYALUR
**Tagline:** "Bantuan yang nyalur langsung."
**Kata kerja brand:** "Nyalur" dipakai sebagai CTA — tombolnya bertuliskan **"Nyalur 1 kg"**, bukan "Donasi".

### One-liner
> E-commerce terbalik — yang checkout satu orang, yang menerima orang lain.

### Deskripsi singkat
Nyalur adalah aplikasi donasi berbasis barang (in-kind) yang menghubungkan donatur langsung dengan kebutuhan harian panti asuhan terverifikasi. Donatur tidak mengirim uang — donatur **membeli barang** dari katalog, dan barang itu dikirim langsung ke panti dengan bukti serah terima.

---

## 3. Masalah

1. **Krisis kepercayaan.** Indonesia berulang kali masuk peringkat teratas World Giving Index, tapi skandal penyalahgunaan dana filantropi (kasus ACT 2022 paling dikenal) merusak kepercayaan publik. Masalahnya bukan *willingness to give*, tapi *trust to give*.
2. **Donasi terasa abstrak.** Transfer uang ke rekening yayasan tidak memberi rasa keterhubungan. Laporan datang belakangan, dalam bentuk PDF, kalau datang sama sekali.
3. **Kebutuhan tidak terlihat.** Panti tidak butuh "uang" — mereka butuh beras minggu ini, susu bulan depan. Tidak ada kanal yang menyuarakan kebutuhan spesifik secara real-time.
4. **Alokasi tidak efisien.** Donasi barang sering salah sasaran: panti terima 50 karung beras di satu bulan, lalu kosong tiga bulan berikutnya.

---

## 4. Solusi — Tiga Pilar

### Pilar 1 — Item-Level Registry
Kebutuhan dipecah jadi item konkret dari katalog terkurasi, bukan nominal rupiah abstrak.
Panti tidak minta "Rp 50 juta" — panti minta "beras 10 kg, minyak 5 L, susu 20 kotak".
Donatur melihat barang, progress bar, dan sisa kebutuhan.

### Pilar 2 — Donasi Bukan Uang (INI JANTUNGNYA)
Donatur **tidak pernah mentransfer uang ke panti**. Donatur membeli barang dari gudang Nyalur.
Yang berpindah adalah **barang**, bukan dana.

> **Kalimat pitch:** "Di Nyalur, donasi tidak pernah berbentuk uang. Kamu tidak transfer Rp 15.000 — kamu beli 1 kg beras. Yang sampai ke panti adalah beras, bukan rekening. Karena tidak ada kas yang berpindah, tidak ada kas yang bisa hilang."

### Pilar 3 — Proof of Delivery
Setiap pengiriman menghasilkan bukti: foto serah terima dari kurir, timestamp, lokasi.
Donatur dapat notifikasi personal:
> "Beras 1 kg dari kamu sudah sampai di Panti Harapan Bunda, hari ini 14.32."

Ini momen emosional yang bikin donatur kembali.

---

## 5. Model Bisnis — First-Party (PENTING)

Nyalur **bukan marketplace**. Nyalur punya gudang sendiri, seperti **Astro**.
Donatur membeli dari Nyalur, Nyalur mengirim. Tidak ada pihak ketiga.

### Konsekuensi penting
- **TIDAK ADA ESCROW.** Escrow ada untuk menahan dana dari penjual pihak ketiga yang belum tentu mengirim. Nyalur *adalah* penjualnya — jadi escrow tidak relevan. Jangan sebut escrow di pitch fase 1.
- Tracking menampilkan **status barang**, bukan status dana: `Dikemas → Dikirim → Diterima`
- Donatur membayar: harga barang + ongkir + platform fee. **100% nilai barang sampai ke panti.**

### Pertanyaan mematikan dari juri & jawabannya

**Q: "Kalau kamu punya gudang, kenapa tidak sekalian jadi yayasan? Apa bedanya dengan ACT?"**

**A:** Yayasan konvensional menerima **uang tak terikat** dan memutuskan sendiri alokasinya — itu celah ACT. Nyalur menerima **transaksi terikat pada SKU spesifik untuk penerima spesifik**. Setiap rupiah punya nama barang dan nama penerima sejak detik pertama. Tidak ada dana kolektif yang bisa dialihkan, karena tidak ada dana kolektif — yang ada 10.000 transaksi kecil yang masing-masing sudah terikat tujuan.

> **Kalimat pamungkas (HAFALKAN):** "ACT punya kotak uang. Nyalur punya rak barang."

**Q: "Warehouse itu berat modalnya, gimana scale-nya?"**

**A:** First-party adalah **fase awal, bukan selamanya** — persis playbook Astro. Fase 1 kami first-party di satu kota untuk menjamin kualitas dan kecepatan. Fase 2, setelah demand terbukti, kami buka merchant partner — supplier lokal dan UMKM mengisi katalog, kami jadi platform. Di titik itu escrow baru relevan, karena baru ada pihak ketiga.

**Q: "Donasi beras 1 kg Rp 15.000 tapi ongkirnya Rp 20.000, masuk akal?"**

**A: Batching.** Barang tidak dikirim per donasi. Sistem mengakumulasi sampai item terpenuhi penuh atau sampai jadwal kirim mingguan. Ongkir dibagi proporsional. Contoh: 10 donatur × 1 kg = 1 batch. Ongkir Rp 20.000 ÷ 10 = Rp 2.000 per donatur.

**Q: "Bedanya sama Kitabisa apa?"**

**A:** Kitabisa berbasis uang dan campaign, laporannya manual dan belakangan. Nyalur berbasis item-level registry dengan progress real-time per barang, fulfillment terintegrasi, dan bukti terima otomatis.

---

## 6. Guardrail Sistem

| Mekanisme | Fungsi |
|---|---|
| **Verifikasi bertingkat** | Tier 1 Terdaftar (akta yayasan) → Tier 2 Terverifikasi (NIB + SK Kemensos) → Tier 3 Terverifikasi+ (kunjungan lapangan) |
| **Plafon bulanan** | Kuota request dihitung dari jumlah penghuni terverifikasi (contoh: Rp 500rb/anak/bulan). Mencegah over-request. |
| **Katalog kaku** | Panti hanya bisa request dari SKU yang sudah disetujui. Tidak bisa minta uang tunai. Tidak bisa minta di luar kebutuhan dasar. |
| **Transparansi publik** | Riwayat semua request dan penerimaan terbuka untuk siapa pun. |

---

## 7. Impact Berlapis (Tiga Sektor Tersentuh)

- **Safety (track utama)** — jaring pengaman sosial + perlindungan struktural dari penyelewengan dana
- **Health** — katalog dikurasi berbasis gizi (paket protein, susu anak, sayur segar) → menjawab *nutritious food choices accessible and affordable*
- **Agriculture** — supply chain dari petani & UMKM lokal → menjawab *bridging rural producers and urban centers*

---

## 8. Roadmap (untuk deck, bukan dibangun)

- **Fase 1 — MVP:** Panti asuhan Jabodetabek, katalog kebutuhan dasar, first-party warehouse
- **Fase 2 — Langganan Kebaikan:** Donatur subscribe kirim 5 kg beras tiap bulan ke panti yang sama. Menyelesaikan retensi + predictability supply.
- **Fase 3 — Merchant Marketplace:** Supplier lokal & UMKM ikut mengisi katalog. Escrow masuk di sini.
- **Fase 4 — Mode Bencana:** Rel yang sama untuk logistik darurat. Posko pengungsian request real-time, publik memenuhi per item.
- **Fase 5 — Ekspansi penerima:** Panti jompo, keluarga prasejahtera, sekolah pelosok, rumah singgah pasien.

---

## 9. Design System

### Palette — White-dominant, blue accent (ala Astro / bank digital)

| Token | Hex | Pemakaian |
|---|---|---|
| Nyalur Blue | `#1B5FE3` | Brand mark, CTA utama, progress bar, badge verified |
| Deep Navy | `#0B2E6F` | Teks di atas tint biru, heading tegas |
| Sky Tint | `#EAF2FE` | Background badge, icon container, chip |
| Terkirim Green | `#00B37E` | **Hanya** untuk status terkirim/sukses |
| Pure White | `#FFFFFF` | Background kartu |
| Page BG | `#F8FAFC` | Background halaman |
| Border | `#E2E8F0` | Garis pemisah, border kartu |
| Ink | `#0F172A` | Teks utama |
| Muted | `#64748B` | Teks sekunder, metadata |

### Prinsip visual (WAJIB DIPATUHI)
- **Putih dominan.** Biru dipakai HEMAT — hanya brand mark, CTA, progress bar, badge verified. Sisanya putih dan abu tipis.
- Yang bikin bank digital terasa mahal bukan banyak warna, tapi banyak **ruang kosong**.
- Green HANYA untuk status terkirim, supaya momen "berhasil" punya warna sendiri.
- Border tipis (0.5–1px), radius 12px untuk kartu, 8px untuk tombol/chip.
- **Bukan estetika kotak amal.** Ini infrastruktur kepercayaan — bersih, terstruktur, seperti fintech.

### Tipografi
Plus Jakarta Sans (buatan Indonesia, gratis di Google Fonts — nilai plus untuk disebut di pitch).
Dua weight saja: 400 regular, 500 medium.

---

## 10. Keputusan Teknis — TERKUNCI

| Aspek | Keputusan | Alasan |
|---|---|---|
| Platform | **Expo Go**, demo langsung dari HP | Cepat, tidak perlu build APK |
| Device demo | **1 HP**, account switcher | Panti & donatur login bergantian |
| Realtime | **TIDAK DIPAKAI** — refetch on focus | Satu device tidak butuh realtime. Websocket berisiko di WiFi venue. |
| Katalog | **Kaku**, SKU tetap | Anti-abuse, cepat dibangun. Custom request masuk roadmap. |
| Verifikasi | **Instan** di demo | Narasikan: "Di produksi masuk antrean 2×24 jam, untuk demo kita percepat." |
| Kurir | **Opsi A** — foto dari seed data | Donatur klik Lacak → status Terkirim + foto dummy. Narasikan: "Di produksi kurir upload dari app mitra." |
| Escrow | **TIDAK ADA** | First-party, kami penjualnya |
| Tracking | Status **barang**: Dikemas → Dikirim → Diterima | Bukan status dana |
| Seed data | **5 panti**, progress bervariasi | Etalase 1 kartu = prototype. 5 kartu = produk. |

### Seed data — variasi progress WAJIB
Bikin 5 panti dengan kondisi berbeda supaya etalase terlihat hidup:
- 1 panti dengan item hampir penuh (90%)
- 1 panti baru mulai (10%)
- 1 panti dengan item sudah **Terkirim** (untuk demo bukti terima)
- 2 panti di tengah-tengah (40–60%)

---

## 11. Alur Demo (POV Ganda)

Urutan demo yang disepakati — **momen switch akun adalah kuncinya**:

1. **POV PANTI** — daftar panti → upload dokumen → verified instan → buka katalog → request beras 10 kg
2. **SWITCH AKUN** ← momen ini yang bikin juri paham closed-loop
3. **POV DONATUR** — lihat etalase 5 panti → request beras tadi muncul → pilih porsi 1 kg → checkout (mock payment)
4. **TRACKING** — status barang berjalan: Dikemas → Dikirim → Diterima
5. **BUKTI TERIMA** ← **momen pamungkas**. Foto serah terima, timestamp. Diam sebentar di sini.

### Naskah pembuka pitch
> Indonesia adalah salah satu negara paling dermawan di dunia. Tapi tahun 2022, kepercayaan itu retak.
>
> Masalahnya bukan orang Indonesia berhenti ingin memberi. Masalahnya, mereka tidak lagi yakin donasinya sampai.
>
> Nyalur mengembalikan keyakinan itu — dengan membuat setiap rupiah terlihat berubah menjadi barang nyata, di tangan yang tepat, dengan bukti.

---

## 12. Scope — Yang Dibangun vs Yang Cukup di Slide

### WAJIB JALAN (P0)
1. Auth + account switcher (panti / donatur)
2. POV Panti: daftar → verified → pilih dari katalog → submit request
3. POV Donatur: etalase 5 panti dengan progress bar per item
4. Flow donasi mikro: pilih item → pilih porsi → checkout mock
5. Halaman tracking: status barang berjalan
6. Halaman bukti terima: foto + timestamp (seed data)

### KALAU SEMPAT (P1)
- Layar kurir dengan kamera live (`expo-image-picker` + Supabase Storage) — upgrade dari Opsi A ke B
- Animasi progress bar
- Halaman riwayat donasi

### CUKUP DI SLIDE, JANGAN DIBANGUN
- Dashboard verifikasi admin
- Payment gateway asli
- Integrasi logistik asli
- Anomali detection
- Langganan Kebaikan
- Mode Bencana

---

## 13. Pembagian Tim

| Peran | Tanggung jawab |
|---|---|
| **Frontend** | UI etalase, flow donasi, halaman tracking, bukti terima |
| **Backend + Data** | Skema Supabase, auth, seed data realistis, logika progress |
| **Deck + Design + Riset** | Pitch deck, aset visual, angka pendukung, latihan demo, **screen recording fallback** |

---

## 14. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| **WiFi venue jelek → Expo Go gagal load bundle** | Tethering dari HP sendiri sebagai backup |
| **Live demo crash saat presentasi** | **SCREEN RECORDING WAJIB.** Rekam demo lengkap sebelum tampil. Ini bukan opsional. |
| Juri tanya soal warehouse/modal | Jawaban fase 1 vs fase 2 (lihat §5) |
| Juri tanya bedanya dengan ACT | "ACT punya kotak uang. Nyalur punya rak barang." (lihat §5) |
| Juri tanya soal ongkir | Batching (lihat §5) |
| Scope creep | Bangun P0 dulu sampai jalan. Baru sentuh P1. Jangan gambling dari awal. |

---

## 15. Prinsip Kerja Selama 30 Jam

1. **P0 dulu sampai jalan mulus, baru P1.** Demo yang sempit tapi mulus mengalahkan demo luas yang crash.
2. **Satu use case dalam > lima use case dangkal.** Panti asuhan saja. Sisanya roadmap.
3. **Seed data yang kaya itu murah tapi efeknya besar.** Etalase penuh terlihat seperti produk jadi.
4. **Screen recording sebelum tidur/sebelum tampil.** Bukan opsional.
5. **Hafalkan tiga jawaban di §5.** Yang menang di hackathon sering bukan kode terbaik, tapi tim yang paling siap ditanya.
