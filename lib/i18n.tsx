import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { bahasaAktif, setBahasaAktif, type Bahasa } from './bahasa';
import { BARANG_EN, KAMUS, type Kunci } from './teks';
import type { Katalog } from './queries';

// Mesin dwibahasa. Sengaja tanpa dependency: brief §1 "jangan overengineer",
// dan pola provider-nya mengikuti SessionProvider yang sudah ada.
//
// Pilihan bahasa TIDAK disimpan ke AsyncStorage — sama seperti fake auth, sesi
// mulai bersih tiap app dibuka. Demo memang selalu mulai dari nol.

type Sisip = Record<string, string | number>;

const isi = (pola: string, sisip?: Sisip) => {
  if (!sisip) return pola;
  let s = pola;
  for (const k of Object.keys(sisip)) s = s.split(`{${k}}`).join(String(sisip[k]));
  return s;
};

/** Terjemahan satu kunci. */
export function terjemah(kunci: Kunci, sisip?: Sisip, bahasa: Bahasa = bahasaAktif()): string {
  return isi(KAMUS[kunci][bahasa], sisip);
}

/**
 * Terjemahan yang sadar jamak. Inggris membedakan "1 donation" dan "3
 * donations"; Indonesia tidak. Jadi bentuk tunggal cuma ada di `en1`, dan cuma
 * dipakai saat bahasa EN dan n tepat 1. {n} disisipkan otomatis.
 */
export function terjemahN(
  kunci: Kunci,
  n: number,
  sisip?: Sisip,
  bahasa: Bahasa = bahasaAktif()
): string {
  const e = KAMUS[kunci] as { id: string; en: string; en1?: string };
  const pola = bahasa === 'en' && n === 1 && e.en1 ? e.en1 : e[bahasa];
  return isi(pola, { n, ...sisip });
}

/** Nama barang. Datang dari DB, jadi EN dipetakan lewat id katalog yang dipatok. */
export function namaBarang(
  k: Pick<Katalog, 'id' | 'nama'>,
  bahasa: Bahasa = bahasaAktif()
): string {
  return (bahasa === 'en' && BARANG_EN[k.id]?.nama) || k.nama;
}

/** Satuan barang — 'kotak' -> 'boxes', 'liter' -> 'L'. Sumbernya sama dengan nama. */
export function satuanBarang(
  k: Pick<Katalog, 'id' | 'satuan'>,
  bahasa: Bahasa = bahasaAktif()
): string {
  return (bahasa === 'en' && BARANG_EN[k.id]?.satuan) || k.satuan;
}

type Nilai = {
  bahasa: Bahasa;
  setBahasa: (b: Bahasa) => void;
  t: (kunci: Kunci, sisip?: Sisip) => string;
  tn: (kunci: Kunci, n: number, sisip?: Sisip) => string;
  /** nama barang terlokalisasi */
  nb: (k: Pick<Katalog, 'id' | 'nama'>) => string;
  /** satuan barang terlokalisasi */
  sb: (k: Pick<Katalog, 'id' | 'satuan'>) => string;
};

const Ctx = createContext<Nilai>(null!);

export function BahasaProvider({ children }: { children: ReactNode }) {
  const [bahasa, setBahasa] = useState<Bahasa>('id');

  // Ditulis saat render, SEBELUM anak-anak render — supaya formatRupiah dkk yang
  // membaca bahasaAktif() di render yang sama sudah dapat nilai baru. Idempoten,
  // jadi aman terhadap render ganda StrictMode. Yang memicu render ulang tetap
  // context di bawah, bukan variabel modul ini.
  setBahasaAktif(bahasa);

  const nilai = useMemo<Nilai>(
    () => ({
      bahasa,
      setBahasa,
      t: (kunci, sisip) => terjemah(kunci, sisip, bahasa),
      tn: (kunci, n, sisip) => terjemahN(kunci, n, sisip, bahasa),
      nb: (k) => namaBarang(k, bahasa),
      sb: (k) => satuanBarang(k, bahasa),
    }),
    [bahasa]
  );

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export const useBahasa = () => useContext(Ctx);
