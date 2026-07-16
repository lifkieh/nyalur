import type { StatusDonasi, StatusRequest } from './queries';

// Label & tampilan status seragam untuk kedua POV — jangan definisikan ulang
// di layar. Hijau tetap hanya milik status diterima; proses lain abu/biru muda.

export const STATUS_REQUEST: Record<
  StatusRequest,
  { label: string; chip: 'netral' | 'tint' | null }
> = {
  aktif: { label: 'Menunggu donatur', chip: 'netral' },
  dikemas: { label: 'Dikemas', chip: 'tint' },
  dikirim: { label: 'Dikirim', chip: 'tint' },
  diterima: { label: 'Diterima', chip: null },
};

export const STATUS_DONASI: Record<
  StatusDonasi,
  { label: string; varian: 'netral' | 'terkirim' }
> = {
  dikemas: { label: 'Dikemas', varian: 'netral' },
  dikirim: { label: 'Dikirim', varian: 'netral' },
  diterima: { label: 'Diterima', varian: 'terkirim' },
};
