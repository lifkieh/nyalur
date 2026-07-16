# NYALUR — Build Guide

Skema database, struktur file Expo, seed data, dan rencana 26 jam.

---

## 1. Prinsip Teknis

**Jangan overengineer.** Ini demo 26 jam, bukan produk. Aturan main:

- **Tanpa RLS.** Row Level Security itu benar untuk produksi, tapi di hackathon dia penyebab bug #1 ("kenapa datanya kosong?!"). Matikan RLS, pakai anon key, semua tabel public. Kalau juri tanya: *"RLS ada di roadmap, untuk demo kami prioritaskan alur."*
- **Tanpa auth Supabase.** Bikin auth beneran = 2 jam hilang. Pakai fake auth: simpan `currentUserId` di context/AsyncStorage. Switch akun = ganti ID. Selesai.
- **Tanpa realtime.** Sudah diputuskan. Refetch on focus.
- **Tanpa payment.** Tombol Bayar → `setTimeout(1500)` → layar sukses.
- **Foto pakai URL statis** di seed data. Jangan sentuh Supabase Storage kecuali sempat.

---

## 2. Skema Database

Lima tabel. Itu saja.

```sql
-- ============ PANTI ============
create table panti (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  alamat text not null,
  kota text not null,
  jarak_km numeric not null,          -- hardcode, jangan hitung GPS
  jumlah_anak int not null,
  foto_url text,
  status text not null default 'terverifikasi',  -- 'menunggu' | 'terverifikasi'
  plafon_bulanan int not null,        -- jumlah_anak * 500000
  plafon_terpakai int not null default 0,
  created_at timestamptz default now()
);

-- ============ KATALOG (SKU kaku) ============
create table katalog (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,             -- 'pangan' | 'kebersihan' | 'sekolah' | 'kesehatan'
  satuan text not null,               -- 'kg' | 'liter' | 'kotak' | 'pcs'
  harga_per_satuan int not null,
  foto_url text,
  aktif boolean default true
);

-- ============ REQUEST (kebutuhan panti) ============
create table request (
  id uuid primary key default gen_random_uuid(),
  panti_id uuid references panti(id) not null,
  katalog_id uuid references katalog(id) not null,
  jumlah_diminta numeric not null,
  jumlah_terpenuhi numeric not null default 0,
  status text not null default 'aktif',   -- 'aktif' | 'dikemas' | 'dikirim' | 'diterima'
  batch_kirim text default 'Jumat',       -- chip batch, cukup text
  created_at timestamptz default now()
);

-- ============ DONASI ============
create table donasi (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references request(id) not null,
  donatur_id uuid not null,           -- fake, tidak ada FK
  donatur_nama text not null,
  jumlah numeric not null,
  harga_barang int not null,
  ongkir int not null,
  platform_fee int not null,
  total int not null,
  status text not null default 'dikemas',  -- 'dikemas' | 'dikirim' | 'diterima'
  created_at timestamptz default now()
);

-- ============ BUKTI TERIMA ============
create table bukti_terima (
  id uuid primary key default gen_random_uuid(),
  donasi_id uuid references donasi(id) not null,
  kode_bukti text not null,           -- 'NYL-7F3A-2210'
  foto_url text not null,
  penerima_nama text not null,        -- 'Ibu Siti Rohmah'
  penerima_jabatan text not null,     -- 'Pengurus, Panti Harapan Bunda'
  lokasi_lat numeric,
  lokasi_lng numeric,
  diterima_at timestamptz not null
);
```

**Catatan desain skema:**
- `jumlah_terpenuhi` di tabel `request` sengaja **denormalized**. Jangan hitung dari SUM(donasi) tiap render — update manual saat donasi masuk. Lebih cepat, lebih gampang.
- `donatur_id` tidak punya FK karena tidak ada tabel users. Fake auth.
- `plafon_terpakai` juga denormalized. Update saat request dibuat.

---

## 3. Seed Data

```sql
-- KATALOG
insert into katalog (nama, kategori, satuan, harga_per_satuan) values
  ('Beras premium', 'pangan', 'kg', 13000),
  ('Minyak goreng', 'pangan', 'liter', 17000),
  ('Telur ayam', 'pangan', 'kg', 28000),
  ('Susu UHT', 'pangan', 'kotak', 18000),
  ('Sabun mandi', 'kebersihan', 'pcs', 12000),
  ('Buku tulis', 'sekolah', 'pcs', 2500);

-- PANTI (5, sesuai brief)
insert into panti (nama, alamat, kota, jarak_km, jumlah_anak, plafon_bulanan, plafon_terpakai, status) values
  ('Panti Harapan Bunda', 'Jl. Merpati No. 12', 'Tangerang Selatan', 2.4, 25, 12500000, 4200000, 'terverifikasi'),
  ('Panti Kasih Ibu', 'Jl. Kenanga No. 8', 'Ciputat', 4.1, 18, 9000000, 1100000, 'terverifikasi'),
  ('Rumah Yatim Al-Falah', 'Jl. Cendana Raya No. 30', 'Pamulang', 5.8, 32, 16000000, 9800000, 'terverifikasi'),
  ('Panti Bina Sejahtera', 'Jl. Anggrek No. 5', 'Serpong', 7.2, 21, 10500000, 5400000, 'terverifikasi'),
  ('Panti Anugerah', 'Jl. Melati No. 44', 'BSD', 8.5, 28, 14000000, 7100000, 'terverifikasi');
```

**REQUEST — variasi progress WAJIB dipertahankan:**

| Panti | Item | Progress | Status | Alasan ada |
|---|---|---|---|---|
| Harapan Bunda | Beras premium | 7/10 kg | aktif | **Target demo utama** |
| Kasih Ibu | Susu UHT | 2/20 kotak | aktif | Baru mulai |
| Al-Falah | Minyak goreng | 9/10 liter | aktif | Hampir penuh, urgensi |
| Bina Sejahtera | Telur ayam | 6/15 kg | aktif | Tengah |
| Anugerah | Beras premium | 10/10 kg | **diterima** | **Sumber bukti terima** |

Tambahkan 1–2 request kedua per panti supaya B2 Detail panti tidak cuma isi satu baris.

**BUKTI TERIMA seed** — untuk request Panti Anugerah yang sudah diterima:
```
kode_bukti: 'NYL-7F3A-2210'
penerima_nama: 'Ibu Siti Rohmah'
penerima_jabatan: 'Pengurus, Panti Anugerah'
diterima_at: '2026-07-18 14:32:00+07'
foto_url: <URL foto placeholder>
```

⚠️ **Foto bukti terima adalah aset paling penting di demo.** Jangan pakai gambar abstrak Unsplash. Cari/buat foto yang terlihat seperti serah-terima barang beneran. Ini yang akan dilihat juri di detik paling menentukan.

---

## 4. Struktur File Expo

```
nyalur/
├── app/
│   ├── _layout.tsx              # root, bungkus SessionProvider
│   ├── index.tsx                # A1 Onboarding / pilih peran
│   │
│   ├── (donatur)/
│   │   ├── _layout.tsx          # C2 bottom nav donatur
│   │   ├── etalase.tsx          # B1
│   │   ├── panti/[id].tsx       # B2 detail panti
│   │   ├── checkout.tsx         # B4 + B5 (digabung)
│   │   ├── lacak/[id].tsx       # B6
│   │   ├── bukti/[id].tsx       # B7  ← KLIMAKS
│   │   └── profil.tsx
│   │
│   └── (panti)/
│       ├── _layout.tsx          # C2 bottom nav panti
│       ├── daftar.tsx           # A2 + A3
│       ├── dashboard.tsx        # A4
│       ├── katalog.tsx          # A5
│       └── profil.tsx
│
├── components/
│   ├── KartuPanti.tsx           # B1
│   ├── BarisKebutuhan.tsx       # progress bar + chip + tombol Nyalur
│   ├── SheetPilihPorsi.tsx      # B3
│   ├── SheetAturJumlah.tsx      # A6
│   ├── SheetSwitchAkun.tsx      # C1
│   ├── KartuPlafon.tsx          # A4
│   ├── KartuProduk.tsx          # A5 grid
│   └── ui/                      # Tombol, Chip, Badge, ProgressBar
│
├── lib/
│   ├── supabase.ts
│   ├── session.tsx              # fake auth context
│   ├── queries.ts               # SEMUA query di sini
│   └── format.ts                # formatRupiah, formatTanggal
│
└── constants/
    └── theme.ts                 # ← WARNA & SPACING DIKUNCI DI SINI
```

**`constants/theme.ts` — kunci nilainya, jangan hardcode di komponen:**

```typescript
export const warna = {
  biru: '#1B5FE3',
  navy: '#0B2E6F',
  skyTint: '#EAF2FE',
  hijau: '#00B37E',
  putih: '#FFFFFF',
  pageBg: '#F8FAFC',
  border: '#E2E8F0',
  ink: '#0F172A',
  muted: '#64748B',
} as const;

export const radius = { kartu: 12, tombol: 8, sheet: 20 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
```

---

## 5. Fake Auth — Copy Paste

```typescript
// lib/session.tsx
import { createContext, useContext, useState } from 'react';

type Peran = 'donatur' | 'panti';
type Akun = {
  id: string;
  nama: string;
  peran: Peran;
  pantiId?: string;
};

const AKUN: Akun[] = [
  { id: 'u-donatur-1', nama: 'Dara Anindya', peran: 'donatur' },
  { id: 'u-panti-1', nama: 'Panti Harapan Bunda', peran: 'panti', pantiId: '<uuid-harapan-bunda>' },
];

const Ctx = createContext<{ akun: Akun; switchAkun: (i: number) => void; daftarAkun: Akun[] }>(null!);

export function SessionProvider({ children }) {
  const [idx, setIdx] = useState(0);
  return (
    <Ctx.Provider value={{ akun: AKUN[idx], switchAkun: setIdx, daftarAkun: AKUN }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSession = () => useContext(Ctx);
```

Itu seluruh sistem auth kalian. **15 baris.** Jangan bikin lebih rumit.

---

## 6. Logika Inti — Yang Harus Benar

### Donasi masuk (paling penting)
```typescript
async function buatDonasi({ requestId, jumlah, katalog, donatur }) {
  const hargaBarang = jumlah * katalog.harga_per_satuan;
  const ongkir = 2000;        // sudah dibagi batching — flat untuk demo
  const platformFee = 2000;

  await supabase.from('donasi').insert({
    request_id: requestId,
    donatur_id: donatur.id,
    donatur_nama: donatur.nama,
    jumlah,
    harga_barang: hargaBarang,
    ongkir,
    platform_fee: platformFee,
    total: hargaBarang + ongkir + platformFee,
    status: 'dikemas',
  });

  // update progress — denormalized, manual
  const { data: req } = await supabase
    .from('request').select('jumlah_terpenuhi').eq('id', requestId).single();

  await supabase.from('request')
    .update({ jumlah_terpenuhi: req.jumlah_terpenuhi + jumlah })
    .eq('id', requestId);
}
```

### Request panti dibuat
```typescript
async function buatRequest({ pantiId, katalogId, jumlah, katalog, panti }) {
  const nilai = jumlah * katalog.harga_per_satuan;

  // guardrail plafon — INI YANG DILIHAT JURI TRACK SAFETY
  if (panti.plafon_terpakai + nilai > panti.plafon_bulanan) {
    throw new Error('Melebihi plafon bulanan');
  }

  await supabase.from('request').insert({
    panti_id: pantiId,
    katalog_id: katalogId,
    jumlah_diminta: jumlah,
    status: 'aktif',
    batch_kirim: 'Jumat',
  });

  await supabase.from('panti')
    .update({ plafon_terpakai: panti.plafon_terpakai + nilai })
    .eq('id', pantiId);
}
```

**Tampilkan error plafon di UI dengan jelas.** Itu bukan error handling biasa — itu bukti visual guardrail anti-abuse kalian bekerja. Kalau sempat, demokan: coba request melebihi plafon, tunjukkan sistem menolak.

### Refetch on focus (pengganti realtime)
```typescript
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

useFocusEffect(useCallback(() => { fetchData(); }, []));
```

---

## 7. Rencana 26 Jam

| Jam | Target | Siapa |
|---|---|---|
| 0–2 | Setup Expo + Supabase, jalankan skema, seed data, theme.ts, session.tsx | Backend |
| 0–2 | Komponen UI dasar: Tombol, Chip, Badge, ProgressBar, KartuPanti | Frontend |
| 2–6 | **B1 Etalase + B2 Detail panti** jalan dengan data asli | Frontend + Backend |
| 6–9 | **B3 Pilih porsi + donasi masuk + progress update** | Frontend |
| 9–12 | **B6 Lacak + B7 Bukti terima** ← klimaks, kerjakan selagi masih segar | Frontend |
| 12–16 | **POV Panti: A4 Dashboard + A5 Katalog + A6 + guardrail plafon** | Backend |
| 16–18 | **C1 Account switcher + C2 Bottom nav** | Siapa pun |
| 18–20 | A1 + A2 + A3 (onboarding & daftar — paling gampang, taruh belakang) | Siapa pun |
| **20** | 🔴 **FREEZE FITUR. Tidak ada kode baru.** | Semua |
| 20–22 | **REKAM SCREEN RECORDING DEMO LENGKAP** | Deck |
| 22–24 | Latihan demo 5× dengan timer. Poles seed data. | Semua |
| 24–26 | Buffer, tidur, finalisasi deck | Semua |

**Jam 20 itu bukan saran, itu batas.** Setiap tim hackathon yang gagal punya cerita yang sama: "kita nambah satu fitur lagi jam 3 pagi terus semuanya rusak."

Kalau ketinggalan jadwal, **potong POV panti sampai A4+A5 saja**, skip A1–A3. Narasikan: *"Pendaftaran panti sudah selesai, ini dashboard setelah terverifikasi."* Juri tidak akan protes.

---

## 8. Checklist Sebelum Presentasi

- [ ] Screen recording demo lengkap sudah ada di HP **dan** laptop
- [ ] Tethering HP sudah dites (jangan andalkan WiFi venue)
- [ ] Expo bundle sudah pernah jalan di HP demo, bukan cuma di simulator
- [ ] Baterai HP >80%, brightness maksimal, **mode Do Not Disturb**
- [ ] Seed data sudah di-reset ke kondisi awal (progress 7/10, bukan 9/10 karena tes)
- [ ] Satu orang hafal jawaban "ACT punya kotak uang, Nyalur punya rak barang"
- [ ] Demo sudah dilatih 5× dengan timer, muat di slot waktu
- [ ] Ada rencana B kalau HP mati: video

**Reset seed data** itu sering terlupa. Kalian akan tes donasi puluhan kali; kalau tidak di-reset, juri melihat "Beras 47/10 kg". Bikin satu script SQL reset dan jalankan sebelum tampil.
