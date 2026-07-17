import { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  Chip,
  Kartu,
  ProgressBar,
  FotoPlaceholder,
  SkeletonKartuProgress,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, teks } from '../../../constants/theme';
import { labelProgress, rasio } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import { STATUS_REQUEST } from '../../../lib/status';
import {
  getPenerimaanPanti,
  jumlahDonatur,
  type RequestDenganDonasi,
} from '../../../lib/queries';

export default function Penerimaan() {
  const router = useRouter();
  const { akun } = useSession();
  const [daftar, setDaftar] = useState<RequestDenganDonasi[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setGalat('Akun ini tidak terhubung ke panti mana pun.');
      setMuat(false);
      return;
    }
    try {
      setGalat(null);
      setDaftar(await getPenerimaanPanti(akun.pantiId));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [akun.pantiId]);

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

  const totalDonasi = daftar.reduce((n, r) => n + (r.donasi?.length ?? 0), 0);

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Text style={teks.judul}>Penerimaan</Text>
        {!muat && !galat && !!daftar.length && (
          <Text style={teks.caption}>
            {daftar.length} kebutuhan · {totalDonasi} donasi masuk
          </Text>
        )}
      </View>

      {muat ? (
        <View style={s.isi}>
          <SkeletonKartuProgress />
          <SkeletonKartuProgress />
          <SkeletonKartuProgress />
        </View>
      ) : galat ? (
        <StatusLayar
          ikon="wifi-off"
          judul="Gagal memuat penerimaan"
          pesan={galat}
          aksiLabel="Coba lagi"
          onAksi={ambil}
        />
      ) : !daftar.length ? (
        <StatusLayar
          ikon="inbox"
          judul="Belum ada penerimaan"
          pesan="Barang yang disalurkan donatur ke panti ini akan tercatat di sini."
          aksiLabel="Ajukan kebutuhan"
          onAksi={() => router.replace('/katalog')}
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
          {daftar.map((r) => {
            const st = STATUS_REQUEST[r.status];
            const nDonatur = jumlahDonatur(r);
            return (
              <Kartu key={r.id} onPress={() => router.push(`/penerimaan/${r.id}`)}>
                <View style={s.atas}>
                  <FotoPlaceholder url={r.katalog.foto_url} label={r.katalog.nama} ukuran={44} />
                  <View style={s.info}>
                    <Text style={teks.bodyMedium} numberOfLines={1}>
                      {r.katalog.nama}
                    </Text>
                    <Text style={teks.mikro}>Batch {r.batch_kirim}</Text>
                  </View>
                  {st.chip ? (
                    <Chip label={st.label} varian={st.chip} />
                  ) : (
                    <Badge label={st.label} varian="terkirim" />
                  )}
                </View>

                <ProgressBar
                  nilai={rasio(r.jumlah_terpenuhi, r.jumlah_diminta)}
                  label={labelProgress(r.jumlah_terpenuhi, r.jumlah_diminta, r.katalog.satuan)}
                  keterangan={`${Math.round(rasio(r.jumlah_terpenuhi, r.jumlah_diminta) * 100)}%`}
                  selesai={r.status === 'diterima'}
                  style={s.progress}
                />

                <View style={s.kaki}>
                  <View style={s.kontributor}>
                    <Feather name="users" size={15} color={warna.biru} />
                    <Text style={[teks.caption, s.kontributorTeks]}>
                      Terkumpul dari {nDonatur} donatur
                    </Text>
                  </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: 2,
  },
  isi: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  atas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  progress: { marginTop: spacing.md },
  kaki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: warna.border,
  },
  kontributor: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kontributorTeks: { color: warna.biru },
});
