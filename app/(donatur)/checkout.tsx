import { View, Text, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, useMuncul, useMunculPegas } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { formatJumlah, formatRupiah } from '../../lib/format';

// B5 — layar sukses. Pembayaran (B4) selesai di /bayar sebelum sampai sini.
export default function DonasiBerhasil() {
  const router = useRouter();
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
          <Text style={teks.display}>Nyalur berhasil</Text>

          <Text style={[teks.body, s.pesan]}>
            {porsi} {barang?.toLowerCase()} kamu akan dikirim ke{' '}
            <Text style={s.tebal}>{panti}</Text> hari <Text style={s.tebal}>{batch}</Text>.
          </Text>

          <View style={s.batch}>
            <Feather name="calendar" size={15} color={warna.biru} />
            <Text style={[teks.caption, s.batchTeks]}>Batch pengiriman {batch}</Text>
          </View>

          {!!Number(total) && (
            <Text style={[teks.mikro, s.struk]}>
              Dibayar {formatRupiah(Number(total))}
              {metode ? ` via ${metode}` : ''}
            </Text>
          )}
        </Animated.View>
      </View>

      <Animated.View style={[s.aksi, aksiMasuk]}>
        <Tombol
          label="Lacak donasi"
          varian="primer"
          ukuran="besar"
          onPress={() => router.replace(`/lacak/${donasiId}`)}
        />
        <Tombol
          label="Kembali ke etalase"
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
