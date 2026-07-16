import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol } from '../../components/ui';
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

  return (
    <View style={s.layar}>
      <View style={s.tengah}>
        <View style={s.ikon}>
          <Feather name="check-circle" size={48} color={warna.hijau} />
        </View>

        <Text style={teks.display}>Nyalur berhasil</Text>

        <Text style={[teks.subjudul, s.pesan]}>
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
      </View>

      <View style={s.aksi}>
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
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: 24 },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ikon: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    backgroundColor: warna.hijauTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  pesan: {
    color: warna.muted,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
    lineHeight: 25,
  },
  tebal: { color: warna.ink },
  batch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: warna.skyTint,
    paddingVertical: spacing.sm,
    paddingHorizontal: 14,
    borderRadius: radius.tombol,
    marginTop: 20,
  },
  batchTeks: { color: warna.biru },
  struk: { marginTop: spacing.md },
  aksi: { paddingBottom: 44, gap: spacing.md },
});
