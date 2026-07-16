import { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Badge, Kartu, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { formatJumlah, formatRupiah, formatTanggal } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import { getDonasiByDonatur, type DonasiLengkap, type StatusDonasi } from '../../../lib/queries';

// Hijau hanya untuk yang sudah sampai — sisanya abu.
const STATUS: Record<StatusDonasi, { label: string; varian: 'netral' | 'terkirim' }> = {
  dikemas: { label: 'Dikemas', varian: 'netral' },
  dikirim: { label: 'Dikirim', varian: 'netral' },
  diterima: { label: 'Diterima', varian: 'terkirim' },
};

export default function Riwayat() {
  const router = useRouter();
  const { akun } = useSession();
  const [donasi, setDonasi] = useState<DonasiLengkap[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  const ambil = useCallback(async () => {
    try {
      setGalat(null);
      setDonasi(await getDonasiByDonatur(akun.id));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [akun.id]);

  useFocusEffect(
    useCallback(() => {
      ambil();
    }, [ambil])
  );

  const total = donasi.reduce((n, d) => n + d.total, 0);

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Text style={teks.judul}>Riwayat</Text>
        {!muat && !galat && !!donasi.length && (
          <Text style={teks.caption}>
            {donasi.length} donasi · {formatRupiah(total)} tersalurkan
          </Text>
        )}
      </View>

      {muat ? (
        <View style={s.tengah}>
          <ActivityIndicator color={warna.biru} />
        </View>
      ) : galat ? (
        <View style={s.tengah}>
          <Text style={[teks.body, s.rata]}>{galat}</Text>
          <Tombol label="Coba lagi" varian="sekunder" penuh={false} onPress={ambil} />
        </View>
      ) : !donasi.length ? (
        <View style={s.tengah}>
          <View style={s.ikonKosong}>
            <Feather name="clock" size={28} color={warna.biru} />
          </View>
          <Text style={[teks.subjudul, s.rata]}>Belum ada riwayat</Text>
          <Text style={[teks.caption, s.rata, s.subKosong]}>
            Donasi yang sudah kamu salurkan akan tercatat di sini.
          </Text>
          <Tombol
            label="Lihat etalase"
            varian="sekunder"
            penuh={false}
            onPress={() => router.replace('/etalase')}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.isi}>
          {donasi.map((d) => {
            const st = STATUS[d.status];
            const { katalog, panti } = d.request;
            return (
              <Kartu key={d.id} onPress={() => router.push(`/lacak/${d.id}`)} style={s.baris}>
                <FotoPlaceholder url={katalog.foto_url} label={katalog.nama} ukuran={48} bulat={10} />

                <View style={s.info}>
                  <Text style={teks.bodyMedium} numberOfLines={1}>
                    {katalog.nama} · {formatJumlah(d.jumlah, katalog.satuan)}
                  </Text>
                  <Text style={teks.mikro} numberOfLines={1}>
                    ke {panti.nama}
                  </Text>
                  <Text style={[teks.mikro, s.kaki]} numberOfLines={1}>
                    {formatRupiah(d.total)} · {formatTanggal(d.created_at)}
                  </Text>
                </View>

                <View style={s.kanan}>
                  <Badge label={st.label} varian={st.varian} />
                  <Feather name="chevron-right" size={18} color={warna.placeholder} />
                </View>
              </Kartu>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: 2,
  },
  isi: { padding: spacing.lg, gap: 10, paddingBottom: spacing.xl },
  baris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 14 },
  info: { flex: 1, minWidth: 0, gap: 1 },
  kaki: { marginTop: 3 },
  kanan: { alignItems: 'flex-end', gap: 6 },
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  ikonKosong: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rata: { textAlign: 'center' },
  subKosong: { maxWidth: 260, marginTop: -spacing.sm },
});
