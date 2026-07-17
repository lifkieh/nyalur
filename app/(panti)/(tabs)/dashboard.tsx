import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuPlafon } from '../../../components/KartuPlafon';
import {
  Badge,
  Chip,
  Kartu,
  LayarTab,
  ProgressBar,
  FotoPlaceholder,
  Skeleton,
  SkeletonKartuProgress,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks, bayangan } from '../../../constants/theme';
import { fotoKatalog } from '../../../lib/gambar';
import { formatJumlah, labelProgress, rasio, terjemahHari } from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import { useSession } from '../../../lib/session';
import { STATUS_REQUEST } from '../../../lib/status';
import { getPantiById, type PantiDenganRequest } from '../../../lib/queries';

export default function DashboardPanti() {
  const router = useRouter();
  const { t, tn, nb, sb } = useBahasa();
  const { akun } = useSession();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setGalat(t('dash.takTerhubung'));
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
      <LayarTab>
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
      </LayarTab>
    );
  }

  if (galat || !panti) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul={t('dash.galat')}
        pesan={galat ?? t('panti.takAda')}
        aksiLabel={t('umum.cobaLagi')}
        onAksi={ambil}
      />
    );
  }

  const daftar = [...(panti.request ?? [])].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );

  return (
    <LayarTab>
      <View style={s.header}>
        <Text style={teks.judulTab}>{t('dash.judul')}</Text>
        <View style={s.judul}>
          <Text style={[teks.caption, s.nama]} numberOfLines={1}>
            {panti.nama}
          </Text>
          <Badge label={t('umum.terverifikasi')} varian="verified" />
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
          <Text style={teks.label}>{t('dash.diajukan')}</Text>
          <Text style={teks.caption}>{tn('dash.jumlah', daftar.length)}</Text>
        </View>

        <View style={s.daftar}>
          {daftar.map((r) => {
            const st = STATUS_REQUEST[r.status];
            return (
              <Kartu key={r.id}>
                <View style={s.barisAtas}>
                  <FotoPlaceholder
                    sumber={fotoKatalog(r.katalog)}
                    url={r.katalog.foto_url}
                    label={nb(r.katalog)}
                    ukuran={44}
                  />
                  <View style={s.barisInfo}>
                    <Text style={teks.bodyMedium} numberOfLines={1}>
                      {nb(r.katalog)} · {formatJumlah(r.jumlah_diminta, sb(r.katalog))}
                    </Text>
                    <Text style={teks.mikro}>
                      {t('umum.batch', { hari: terjemahHari(r.batch_kirim) })}
                    </Text>
                  </View>
                  {st.chip ? (
                    <Chip label={t(st.kunci)} varian={st.chip} />
                  ) : (
                    <Badge label={t(st.kunci)} varian="terkirim" />
                  )}
                </View>

                <ProgressBar
                  nilai={rasio(r.jumlah_terpenuhi, r.jumlah_diminta)}
                  label={labelProgress(r.jumlah_terpenuhi, r.jumlah_diminta, sb(r.katalog))}
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
              <Text style={[teks.caption, s.rata]}>{t('dash.kosong')}</Text>
            </Kartu>
          )}
        </View>
      </ScrollView>

      {/* Ikon saja. Labelnya tetap ada lewat accessibilityLabel — tanpa teks,
          pembaca layar cuma menemukan tombol tanpa nama. */}
      <Pressable
        onPress={() => router.push('/katalog')}
        accessibilityRole="button"
        accessibilityLabel={t('dash.fab')}
        style={({ pressed }) => [s.fab, pressed && s.fabDitekan]}
      >
        <Feather name="plus" size={24} color={warna.putih} />
      </Pressable>
    </LayarTab>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  judul: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  // shrink, bukan flex:1 — badge menempel nama, tidak terlempar ke tepi kanan.
  nama: { flexShrink: 1 },
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
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    ...bayangan.biru,
  },
  fabDitekan: { opacity: 0.9, transform: [{ scale: 0.96 }] },
  rata: { textAlign: 'center' },
});
