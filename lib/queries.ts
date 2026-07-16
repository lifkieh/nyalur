import { supabase } from './supabase';

// SEMUA query Supabase ada di file ini. Layar tidak memanggil supabase langsung.

export type Kategori = 'pangan' | 'kebersihan' | 'sekolah' | 'kesehatan';
export type StatusRequest = 'aktif' | 'dikemas' | 'dikirim' | 'diterima';
export type StatusPanti = 'menunggu' | 'terverifikasi';

export type Katalog = {
  id: string;
  nama: string;
  kategori: Kategori;
  satuan: string;
  harga_per_satuan: number;
  foto_url: string | null;
  aktif: boolean;
};

export type Request = {
  id: string;
  panti_id: string;
  katalog_id: string;
  jumlah_diminta: number;
  jumlah_terpenuhi: number;
  status: StatusRequest;
  batch_kirim: string;
  created_at: string;
  katalog: Katalog;
};

export type Panti = {
  id: string;
  nama: string;
  alamat: string;
  kota: string;
  jarak_km: number;
  jumlah_anak: number;
  foto_url: string | null;
  status: StatusPanti;
  plafon_bulanan: number;
  plafon_terpakai: number;
  created_at: string;
};

export type PantiDenganRequest = Panti & { request: Request[] };

const KOLOM_REQUEST =
  'id, panti_id, katalog_id, jumlah_diminta, jumlah_terpenuhi, status, batch_kirim, created_at, katalog(id, nama, kategori, satuan, harga_per_satuan, foto_url, aktif)';

const KOLOM_PANTI =
  'id, nama, alamat, kota, jarak_km, jumlah_anak, foto_url, status, plafon_bulanan, plafon_terpakai, created_at';

/** B1 — etalase. Panti terverifikasi + request-nya, terdekat dulu. */
export async function getDaftarPanti(): Promise<PantiDenganRequest[]> {
  const { data, error } = await supabase
    .from('panti')
    .select(`${KOLOM_PANTI}, request(${KOLOM_REQUEST})`)
    .eq('status', 'terverifikasi')
    .order('jarak_km', { ascending: true })
    .order('created_at', { ascending: true, referencedTable: 'request' });

  if (error) throw new Error(`Gagal memuat daftar panti: ${error.message}`);
  return (data ?? []) as unknown as PantiDenganRequest[];
}

/** B2 — detail panti. Semua request + data katalog. */
export async function getPantiById(id: string): Promise<PantiDenganRequest | null> {
  const { data, error } = await supabase
    .from('panti')
    .select(`${KOLOM_PANTI}, request(${KOLOM_REQUEST})`)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat panti: ${error.message}`);
  return (data as unknown as PantiDenganRequest) ?? null;
}

export type StatusDonasi = 'dikemas' | 'dikirim' | 'diterima';

export type BuktiTerima = {
  id: string;
  donasi_id: string;
  kode_bukti: string;
  foto_url: string;
  penerima_nama: string;
  penerima_jabatan: string;
  lokasi_lat: number | null;
  lokasi_lng: number | null;
  diterima_at: string;
};

export type DonasiLengkap = {
  id: string;
  donatur_id: string;
  donatur_nama: string;
  jumlah: number;
  harga_barang: number;
  ongkir: number;
  platform_fee: number;
  total: number;
  status: StatusDonasi;
  created_at: string;
  request: {
    id: string;
    batch_kirim: string;
    status: StatusRequest;
    katalog: Katalog;
    panti: Panti;
  };
  /** nested one-to-many — praktiknya 0 atau 1 baris */
  bukti_terima: BuktiTerima[];
};

// ---- donasi ----

/** Ongkir sudah dibagi rata antar donatur di batch — flat untuk demo. */
export const ONGKIR = 2000;
export const PLATFORM_FEE = 2000;

export type RincianBiaya = {
  hargaBarang: number;
  ongkir: number;
  platformFee: number;
  total: number;
};

export function hitungBiaya(jumlah: number, hargaPerSatuan: number): RincianBiaya {
  const hargaBarang = jumlah * hargaPerSatuan;
  return {
    hargaBarang,
    ongkir: ONGKIR,
    platformFee: PLATFORM_FEE,
    total: hargaBarang + ONGKIR + PLATFORM_FEE,
  };
}

/**
 * Donasi masuk. Progress request di-update manual — jumlah_terpenuhi memang
 * denormalized, jadi tidak dihitung ulang dari SUM(donasi) tiap render.
 * Mengembalikan id donasi untuk layar sukses & lacak.
 */
export async function buatDonasi(args: {
  requestId: string;
  jumlah: number;
  katalog: Katalog;
  donatur: { id: string; nama: string };
}): Promise<string> {
  const { requestId, jumlah, katalog, donatur } = args;
  const biaya = hitungBiaya(jumlah, katalog.harga_per_satuan);

  const { data: donasi, error: galatInsert } = await supabase
    .from('donasi')
    .insert({
      request_id: requestId,
      donatur_id: donatur.id, // text, bukan uuid — fake auth
      donatur_nama: donatur.nama,
      jumlah,
      harga_barang: biaya.hargaBarang,
      ongkir: biaya.ongkir,
      platform_fee: biaya.platformFee,
      total: biaya.total,
      status: 'dikemas',
    })
    .select('id')
    .single();

  if (galatInsert) throw new Error(`Gagal mencatat donasi: ${galatInsert.message}`);

  const { data: req, error: galatBaca } = await supabase
    .from('request')
    .select('jumlah_terpenuhi')
    .eq('id', requestId)
    .single();

  if (galatBaca) throw new Error(`Donasi tercatat, gagal membaca progress: ${galatBaca.message}`);

  const { error: galatUpdate } = await supabase
    .from('request')
    .update({ jumlah_terpenuhi: req.jumlah_terpenuhi + jumlah })
    .eq('id', requestId);

  if (galatUpdate) throw new Error(`Donasi tercatat, gagal memperbarui progress: ${galatUpdate.message}`);

  return donasi.id as string;
}

/** B6 + B7 — satu donasi lengkap dengan barang, panti, dan buktinya. */
export async function getDonasiById(id: string): Promise<DonasiLengkap | null> {
  const { data, error } = await supabase
    .from('donasi')
    .select(
      `id, donatur_id, donatur_nama, jumlah, harga_barang, ongkir, platform_fee, total, status, created_at,
       request:request_id ( id, batch_kirim, status,
         katalog:katalog_id ( id, nama, kategori, satuan, harga_per_satuan, foto_url, aktif ),
         panti:panti_id ( ${KOLOM_PANTI} ) ),
       bukti_terima ( id, donasi_id, kode_bukti, foto_url, penerima_nama, penerima_jabatan, lokasi_lat, lokasi_lng, diterima_at )`
    )
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat donasi: ${error.message}`);
  return (data as unknown as DonasiLengkap) ?? null;
}

export const buktiDari = (d: DonasiLengkap): BuktiTerima | null =>
  d.bukti_terima?.[0] ?? null;

// ---- turunan data (dipakai layar, bukan query) ----

export const requestAktif = (p: PantiDenganRequest): Request[] =>
  (p.request ?? []).filter((r) => r.status === 'aktif');

/**
 * Kebutuhan yang ditonjolkan di kartu etalase: yang aktif dan paling dekat
 * penuh — makin dekat target, makin mendesak dilengkapi.
 * Kalau tidak ada yang aktif, pakai yang sudah diterima supaya kartu tetap
 * bercerita (progress hijau, bukan kartu kosong).
 */
export function kebutuhanSorotan(p: PantiDenganRequest): Request | null {
  const aktif = requestAktif(p);
  if (aktif.length) {
    return aktif.reduce((a, b) =>
      b.jumlah_terpenuhi / b.jumlah_diminta > a.jumlah_terpenuhi / a.jumlah_diminta ? b : a
    );
  }
  return (p.request ?? []).find((r) => r.status === 'diterima') ?? null;
}
