import { View, Text, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, useMuncul, useMunculPegas } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { formatJumlah, formatRupiah, terjemahHari } from '../../lib/format';
import { useBahasa } from '../../lib/i18n';

// B5 — layar sukses. Pembayaran (B4) selesai di /bayar sebelum sampai sini.
export default function DonasiBerhasil() {
  const router = useRouter();
  const { t } = useBahasa();
  const { donasiId, barang, jumlah, satuan, panti, batch, total, metode } =
    useLocalSearchParams<{
      donasiId: string;
      barang: string;
      jumlah: string;
      satuan: string;
      panti: string;
      batch: string;
      total: string;
      metode: string;
    }>();

  const porsi = formatJumlah(Number(jumlah) || 0, satuan ?? '');
  const hari = terjemahHari(batch ?? '');
  const ikonMasuk = useMunculPegas(80);
  const teksMasuk = useMuncul(220);
  const aksiMasuk = useMuncul(340);

  return (
    <View style={s.layar}>
      <View style={s.tengah}>
        <Animated.View style={[s.ikon, ikonMasuk]}>
          <Feather name="check-circle" size={44} color={warna.hijau} />
        </Animated.View>

        <Animated.View style={[s.blokTeks, teksMasuk]}>
          <Text style={teks.display}>{t('sukses.judul')}</Text>

          <Text style={[teks.body, s.pesan]}>
            {t('sukses.pesan', {
              porsi,
              barang: barang?.toLowerCase() ?? '',
              panti: panti ?? '',
              hari,
            })}
          </Text>

          <View style={s.batch}>
            <Feather name="calendar" size={15} color={warna.biru} />
            <Text style={[teks.caption, s.batchTeks]}>{t('sukses.batch', { hari })}</Text>
          </View>

          {!!Number(total) && (
            <Text style={[teks.mikro, s.struk]}>
              {t('sukses.struk', { rp: formatRupiah(Number(total)), metode: metode ?? '' })}
            </Text>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[s.aksi, aksiMasuk]}>
        <Tombol
          label={t('sukses.lacak')}
          varian="primer"
          ukuran="besar"
          onPress={() => router.replace(`/lacak/${donasiId}`)}
        />
        <Tombol
          label={t('umum.kembaliBeranda')}
          varian="sekunder"
          ukuran="besar"
          onPress={() => router.replace('/etalase')}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: spacing.xl },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ikon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: warna.hijauTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  blokTeks: { alignItems: 'center' },
  pesan: {
    color: warna.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 300,
  },
  tebal: { color: warna.ink },
  batch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: warna.skyTint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.tombol,
    marginTop: spacing.lg,
  },
  batchTeks: { color: warna.biru },
  struk: { marginTop: spacing.md },
  aksi: { paddingBottom: 44, gap: spacing.md },
});
