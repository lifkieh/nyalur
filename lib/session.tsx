import { createContext, useContext, useState, type ReactNode } from 'react';

// Fake auth. Tidak ada Supabase Auth. Switch akun = ganti index.

export type Peran = 'donatur' | 'panti';

export type Akun = {
  id: string;
  nama: string;
  peran: Peran;
  pantiId?: string;
};

// pantiId diisi setelah seed data jalan.
export const AKUN: Akun[] = [
  { id: 'u-donatur-1', nama: 'Dara Anindya', peran: 'donatur' },
  {
    id: 'u-panti-1',
    nama: 'Panti Harapan Bunda',
    peran: 'panti',
    pantiId: '11e3e8fc-a545-4116-bb18-60d2fc404fbc',
  },
];

type Nilai = {
  akun: Akun;
  switchAkun: (i: number) => void;
  daftarAkun: Akun[];
};

const Ctx = createContext<Nilai>(null!);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [idx, setIdx] = useState(0);
  return (
    <Ctx.Provider value={{ akun: AKUN[idx], switchAkun: setIdx, daftarAkun: AKUN }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSession = () => useContext(Ctx);
