import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  Kartu,
  FotoPlaceholder,
  SkeletonBaris,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, teks } from '../../../constants/theme';
import { formatJumlah, formatRupiah, formatTanggal } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import { STATUS_DONASI } from '../../../lib/status';
import { getDonasiByDonatur, type DonasiLengkap } from '../../../lib/queries';

export default function Riwayat() {
  const router = useRouter();
  const { akun } = useSession();
  const [donasi, setDonasi] = useState<DonasiLengkap[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);

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

  const segarkan = useCallback(async () => {
    setSegar(true);
    await ambil();
    setSegar(false);
  }, [ambil]);

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
        <View style={s.isi}>
          <SkeletonBaris />
          <SkeletonBaris />
          <SkeletonBaris />
          <SkeletonBaris />
        </View>
      ) : galat ? (
        <StatusLayar
          ikon="wifi-off"
          judul="Gagal memuat riwayat"
          pesan={galat}
          aksiLabel="Coba lagi"
          onAksi={ambil}
        />
      ) : !donasi.length ? (
        <StatusLayar
          ikon="clock"
          judul="Belum ada riwayat"
          pesan="Donasi yang sudah kamu salurkan akan tercatat di sini."
          aksiLabel="Lihat etalase"
          onAksi={() => router.replace('/etalase')}
        />
      ) : (
        <ScrollView
          contentContainerStyle={s.isi}
          refreshControl={
            <RefreshControl
              refreshing={segar}
              onRefresh={segarkan}
              tintColor={warna.biru}
              colors={[warna.biru]}
            />
          }
        >
          {donasi.map((d) => {
            const st = STATUS_DONASI[d.status];
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
});
