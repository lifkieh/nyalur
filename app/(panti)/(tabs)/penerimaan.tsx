import { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Badge, Chip, Kartu, ProgressBar, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { labelProgress, rasio } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import {
  getPenerimaanPanti,
  jumlahDonatur,
  type RequestDenganDonasi,
  type StatusRequest,
} from '../../../lib/queries';

const STATUS: Record<StatusRequest, { label: string; chip: 'netral' | 'tint' | null }> = {
  aktif: { label: 'Menunggu donatur', chip: 'netral' },
  dikemas: { label: 'Dikemas', chip: 'tint' },
  dikirim: { label: 'Dikirim', chip: 'tint' },
  diterima: { label: 'Diterima', chip: null },
};

export default function Penerimaan() {
  const router = useRouter();
  const { akun } = useSession();
  const [daftar, setDaftar] = useState<RequestDenganDonasi[]>([]);
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
        <View style={s.tengah}>
          <ActivityIndicator color={warna.biru} />
        </View>
      ) : galat ? (
        <View style={s.tengah}>
          <Text style={[teks.body, s.rata]}>{galat}</Text>
          <Tombol label="Coba lagi" varian="sekunder" penuh={false} onPress={ambil} />
        </View>
      ) : !daftar.length ? (
        <View style={s.tengah}>
          <View style={s.ikonKosong}>
            <Feather name="inbox" size={28} color={warna.biru} />
          </View>
          <Text style={[teks.subjudul, s.rata]}>Belum ada penerimaan</Text>
          <Text style={[teks.caption, s.rata, s.subKosong]}>
            Barang yang disalurkan donatur ke panti ini akan tercatat di sini.
          </Text>
          <Tombol
            label="Ajukan kebutuhan"
            varian="sekunder"
            penuh={false}
            onPress={() => router.replace('/katalog')}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.isi}>
          {daftar.map((r) => {
            const st = STATUS[r.status];
            const nDonatur = jumlahDonatur(r);
            return (
              <Kartu key={r.id} onPress={() => router.push(`/penerimaan/${r.id}`)}>
                <View style={s.atas}>
                  <FotoPlaceholder
                    url={r.katalog.foto_url}
                    label={r.katalog.nama}
                    ukuran={44}
                    bulat={9}
                  />
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
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: 2,
  },
  isi: { padding: spacing.lg, gap: 10, paddingBottom: spacing.xl },
  atas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  progress: { marginTop: 14 },
  kaki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: warna.border,
  },
  kontributor: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  kontributorTeks: { color: warna.biru },
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
  subKosong: { maxWidth: 270, marginTop: -spacing.sm },
});
