import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Kartu, RingkasanStat, Skeleton } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import type { Kunci } from '../lib/teks';
import { getPantiById, sisaPlafon, type PantiDenganRequest } from '../lib/queries';

/**
 * Tier verifikasi brief §6 diturunkan dari kolom status, bukan disimpan:
 * skema cuma punya 'menunggu' | 'terverifikasi', dan definisi Tier 2 di brief
 * memang "NIB + SK Kemensos" — persis dokumen yang diunggah di A2. Tier 3
 * butuh kunjungan lapangan, jadi tidak pernah muncul di demo.
 */
const TIER: Record<string, { nomor: string; nama: Kunci; syarat: Kunci }> = {
  menunggu: { nomor: 'Tier 1', nama: 'dataPanti.tier1', syarat: 'dataPanti.syarat1' },
  terverifikasi: { nomor: 'Tier 2', nama: 'dataPanti.tier2', syarat: 'dataPanti.syarat2' },
};

export function ProfilPanti({ pantiId }: { pantiId?: string }) {
  const { t, tn } = useBahasa();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);

  const ambil = useCallback(async () => {
    if (!pantiId) {
      setMuat(false);
      return;
    }
    try {
      setPanti(await getPantiById(pantiId));
    } catch {
      // pelengkap saja — kalau gagal, kartu menghilang dan menu tetap jalan
    } finally {
      setMuat(false);
    }
  }, [pantiId]);

  useFocusEffect(
    useCallback(() => {
      ambil();
    }, [ambil])
  );

  if (muat) {
    return (
      <Kartu style={s.kartu}>
        <Skeleton lebar={110} tinggi={11} />
        <Skeleton lebar="55%" tinggi={30} />
        <View style={s.skeletonBaris}>
          <Skeleton lebar="28%" tinggi={22} />
          <Skeleton lebar="28%" tinggi={22} />
        </View>
      </Kartu>
    );
  }

  if (!panti) return null;

  const tier = TIER[panti.status] ?? TIER.menunggu;
  const tierNama = t(tier.nama);

  return (
    <Kartu style={s.kartu}>
      <Text style={teks.label}>{t('dataPanti.judul')}</Text>

      <RingkasanStat
        utama={{ nilai: formatRupiah(sisaPlafon(panti)), label: t('dataPanti.sisaPlafon') }}
        sisi={[
          { nilai: String(panti.jumlah_anak), label: tn('dataPanti.anak', panti.jumlah_anak) },
          { nilai: tier.nomor, label: tierNama.toLowerCase() },
        ]}
      />

      <View style={s.alamat}>
        <Feather name="map-pin" size={15} color={warna.muted} style={s.ikonAtas} />
        <Text style={[teks.mikro, s.alamatTeks]}>
          {panti.alamat}, {panti.kota}
        </Text>
      </View>

      <View style={s.tier}>
        <Feather name="shield" size={15} color={warna.biru} style={s.ikonAtas} />
        <Text style={[teks.mikro, s.tierTeks]}>
          {t('dataPanti.tierJelas', {
            tier: tier.nomor,
            nama: tierNama,
            syarat: t(tier.syarat),
          })}
        </Text>
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  kartu: { gap: spacing.md },
  skeletonBaris: { flexDirection: 'row', gap: spacing.md },

  ikonAtas: { marginTop: 1 },
  alamat: { flexDirection: 'row', gap: spacing.sm },
  alamatTeks: { flex: 1, lineHeight: 18 },
  tier: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: warna.skyTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
  },
  tierTeks: { flex: 1, color: warna.biru, lineHeight: 18 },
});
