import type { StatusDonasi, StatusRequest } from './queries';
import type { Kunci } from './teks';

// Label & tampilan status seragam untuk kedua POV — jangan definisikan ulang
// di layar. Hijau tetap hanya milik status diterima; proses lain abu/biru muda.
//
// Yang disimpan di sini KUNCI kamus, bukan kalimatnya: layar memanggil
// t(STATUS_DONASI[d.status].kunci) supaya ikut bahasa yang aktif.

export const STATUS_REQUEST: Record<
  StatusRequest,
  { kunci: Kunci; chip: 'netral' | 'tint' | null }
> = {
  aktif: { kunci: 'status.menungguDonatur', chip: 'netral' },
  dikemas: { kunci: 'status.dikemas', chip: 'tint' },
  dikirim: { kunci: 'status.dikirim', chip: 'tint' },
  diterima: { kunci: 'status.diterima', chip: null },
};

export const STATUS_DONASI: Record<
  StatusDonasi,
  { kunci: Kunci; varian: 'netral' | 'terkirim' }
> = {
  dikemas: { kunci: 'status.dikemas', varian: 'netral' },
  dikirim: { kunci: 'status.dikirim', varian: 'netral' },
  diterima: { kunci: 'status.diterima', varian: 'terkirim' },
};
