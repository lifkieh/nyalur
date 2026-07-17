import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Kartu, RingkasanStat, Skeleton } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import { getDonasiByDonatur, type DonasiLengkap } from '../lib/queries';

/**
 * Ringkasan dampak donatur. Semua angka dihitung dari baris donasi miliknya —
 * tidak ada yang ditulis tangan. Profil yang menjual transparansi tidak boleh
 * memajang angka karangan.
 */
export function ProfilDonatur({ donaturId }: { donaturId: string }) {
  const { t, tn } = useBahasa();
  const [donasi, setDonasi] = useState<DonasiLengkap[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState(false);

  const ambil = useCallback(async () => {
    try {
      setGalat(false);
      setDonasi(await getDonasiByDonatur(donaturId));
    } catch {
      setGalat(true);
    } finally {
      setMuat(false);
    }
  }, [donaturId]);

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

  // Kartu ini pelengkap, bukan isi utama profil — kalau gagal dimuat, dia
  // menghilang saja. Ganti akun & keluar tetap jalan tanpa angka ini.
  if (galat) return null;

  const total = donasi.reduce((n, d) => n + d.total, 0);
  const panti = new Set(donasi.map((d) => d.request.panti.id)).size;
  const sampai = donasi.filter((d) => d.status === 'diterima').length;

  if (!donasi.length) {
    return (
      <Kartu style={s.kosong}>
        <View style={s.kosongIkon}>
          <Feather name="package" size={20} color={warna.biru} />
        </View>
        <Text style={[teks.caption, s.kosongTeks]}>{t('dampak.kosong')}</Text>
      </Kartu>
    );
  }

  return (
    <Kartu style={s.kartu}>
      <Text style={teks.label}>{t('dampak.judul')}</Text>

      <RingkasanStat
        utama={{ nilai: formatRupiah(total), label: t('dampak.tersalurkan') }}
        sisi={[
          { nilai: String(donasi.length), label: tn('dampak.donasi', donasi.length) },
          { nilai: String(panti), label: tn('dampak.panti', panti) },
        ]}
      />

      {/* Satu-satunya hijau di layar ini — dan cuma muncul kalau memang ada
          barang yang sudah sampai. */}
      {!!sampai && (
        <View style={s.sampai}>
          <Feather name="check-circle" size={15} color={warna.hijau} />
          <Text style={[teks.mikro, s.sampaiTeks]}>
            {t('dampak.sampai', { n: sampai, total: donasi.length })}
          </Text>
        </View>
      )}
    </Kartu>
  );
}

const s = StyleSheet.create({
  kartu: { gap: spacing.md },
  skeletonBaris: { flexDirection: 'row', gap: spacing.md },

  sampai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
  },
  sampaiTeks: { flex: 1, color: warna.hijau },

  kosong: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  kosongIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kosongTeks: { flex: 1 },
});
