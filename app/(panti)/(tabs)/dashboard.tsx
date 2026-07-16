import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuPlafon } from '../../../components/KartuPlafon';
import { Badge, Chip, Kartu, ProgressBar, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks, bayangan, font } from '../../../constants/theme';
import { formatJumlah, labelProgress, rasio } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import { getPantiById, type PantiDenganRequest, type StatusRequest } from '../../../lib/queries';

// Hijau tetap hanya milik status terkirim — sisanya chip abu / biru muda.
const STATUS: Record<StatusRequest, { label: string; chip: 'netral' | 'tint' | null }> = {
  aktif: { label: 'Menunggu donatur', chip: 'netral' },
  dikemas: { label: 'Dikemas', chip: 'tint' },
  dikirim: { label: 'Dikirim', chip: 'tint' },
  diterima: { label: 'Diterima', chip: null },
};

export default function DashboardPanti() {
  const router = useRouter();
  const { akun } = useSession();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

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

  if (muat) {
    return (
      <View style={s.tengah}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  if (galat || !panti) {
    return (
      <View style={s.tengah}>
        <Text style={[teks.body, s.rata]}>{galat ?? 'Panti tidak ditemukan.'}</Text>
        <Tombol label="Coba lagi" varian="sekunder" penuh={false} onPress={ambil} />
      </View>
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

      <ScrollView contentContainerStyle={s.isi}>
        <KartuPlafon panti={panti} />

        <View style={s.tajukDaftar}>
          <Text style={teks.bodyMedium}>Kebutuhan diajukan</Text>
          <Text style={teks.caption}>{daftar.length} kebutuhan</Text>
        </View>

        <View style={s.daftar}>
          {daftar.map((r) => {
            const st = STATUS[r.status];
            return (
              <Kartu key={r.id} style={s.baris}>
                <View style={s.barisAtas}>
                  <FotoPlaceholder
                    url={r.katalog.foto_url}
                    label={r.katalog.nama}
                    ukuran={42}
                    bulat={9}
                  />
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
            <Text style={[teks.caption, s.rata]}>
              Belum ada kebutuhan diajukan. Mulai dari katalog.
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  judul: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 2 },
  isi: { padding: spacing.lg, paddingBottom: 110 },
  tajukDaftar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: spacing.md,
  },
  daftar: { gap: 10 },
  baris: { paddingVertical: 14 },
  barisAtas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  barisInfo: { flex: 1, minWidth: 0 },
  progress: { marginTop: spacing.md },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    ...bayangan.biru,
  },
  fabDitekan: { opacity: 0.9 },
  fabTeks: { fontFamily: font.medium, fontSize: 15, color: warna.putih },
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: warna.pageBg,
  },
  rata: { textAlign: 'center' },
});
