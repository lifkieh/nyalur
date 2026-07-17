import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuPlafon } from '../../../components/KartuPlafon';
import {
  Badge,
  Chip,
  Kartu,
  ProgressBar,
  FotoPlaceholder,
  Skeleton,
  SkeletonKartuProgress,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks, bayangan } from '../../../constants/theme';
import { formatJumlah, labelProgress, rasio } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import { STATUS_REQUEST } from '../../../lib/status';
import { getPantiById, type PantiDenganRequest } from '../../../lib/queries';

export default function DashboardPanti() {
  const router = useRouter();
  const { akun } = useSession();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
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
      setPanti(await getPantiById(akun.pantiId));
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

  if (muat) {
    return (
      <SafeAreaView style={s.layar} edges={['top']}>
        <View style={s.header}>
          <Skeleton lebar={140} tinggi={12} />
          <Skeleton lebar={200} tinggi={20} style={s.headerSkeleton} />
        </View>
        <View style={s.isi}>
          <Skeleton tinggi={190} bulat={12} />
          <View style={s.daftarSkeleton}>
            <SkeletonKartuProgress />
            <SkeletonKartuProgress />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (galat || !panti) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul="Gagal memuat dashboard"
        pesan={galat ?? 'Panti tidak ditemukan.'}
        aksiLabel="Coba lagi"
        onAksi={ambil}
      />
    );
  }

  const daftar = [...(panti.request ?? [])].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Text style={teks.caption}>{panti.nama}</Text>
        <View style={s.judul}>
          <Text style={teks.judul}>Dashboard</Text>
          <Badge label="Terverifikasi" varian="verified" />
        </View>
      </View>

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
        <KartuPlafon panti={panti} />

        <View style={s.tajukDaftar}>
          <Text style={teks.label}>Kebutuhan diajukan</Text>
          <Text style={teks.caption}>{daftar.length} kebutuhan</Text>
        </View>

        <View style={s.daftar}>
          {daftar.map((r) => {
            const st = STATUS_REQUEST[r.status];
            return (
              <Kartu key={r.id}>
                <View style={s.barisAtas}>
                  <FotoPlaceholder url={r.katalog.foto_url} label={r.katalog.nama} ukuran={44} />
                  <View style={s.barisInfo}>
                    <Text style={teks.bodyMedium} numberOfLines={1}>
                      {r.katalog.nama} · {formatJumlah(r.jumlah_diminta, r.katalog.satuan)}
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
              </Kartu>
            );
          })}
          {!daftar.length && (
            <Kartu isian style={s.kosong}>
              <Feather name="clipboard" size={22} color={warna.biru} />
              <Text style={[teks.caption, s.rata]}>
                Belum ada kebutuhan diajukan. Mulai dari katalog — plafonmu masih tersedia.
              </Text>
            </Kartu>
          )}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push('/katalog')}
        style={({ pressed }) => [s.fab, pressed && s.fabDitekan]}
      >
        <Feather name="plus" size={20} color={warna.putih} />
        <Text style={s.fabTeks}>Ajukan kebutuhan</Text>
      </Pressable>
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
  },
  judul: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  headerSkeleton: { marginTop: spacing.sm },
  daftarSkeleton: { gap: spacing.md, marginTop: spacing.xl },
  kosong: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  isi: { padding: spacing.lg, paddingBottom: 110 },
  tajukDaftar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  daftar: { gap: spacing.md },
  barisAtas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  barisInfo: { flex: 1, minWidth: 0 },
  progress: { marginTop: spacing.md },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    ...bayangan.biru,
  },
  fabDitekan: { opacity: 0.9 },
  fabTeks: { ...teks.bodyMedium, color: warna.putih },
  rata: { textAlign: 'center' },
});
