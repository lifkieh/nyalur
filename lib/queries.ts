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
