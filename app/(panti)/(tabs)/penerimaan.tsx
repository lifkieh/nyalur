import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  Chip,
  Kartu,
  LayarTab,
  ProgressBar,
  FotoPlaceholder,
  SkeletonKartuProgress,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, teks } from '../../../constants/theme';
import { fotoKatalog } from '../../../lib/gambar';
import { labelProgress, rasio, terjemahHari } from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import { useSession } from '../../../lib/session';
import { STATUS_REQUEST } from '../../../lib/status';
import type { Kunci } from '../../../lib/teks';
import {
  getPenerimaanPanti,
  jumlahDonatur,
  type RequestDenganDonasi,
  type StatusRequest,
} from '../../../lib/queries';

type Filter = 'semua' | StatusRequest;

// Urutan mengikuti perjalanan barang, bukan abjad: menunggu donatur -> dikemas
// -> dikirim -> diterima. Labelnya kunci kamus, diterjemahkan di komponen.
const FILTER: { nilai: Filter; kunci: Kunci }[] = [
  { nilai: 'semua', kunci: 'terima.filter.semua' },
  { nilai: 'aktif', kunci: 'status.menungguDonatur' },
  { nilai: 'dikemas', kunci: 'status.dikemas' },
  { nilai: 'dikirim', kunci: 'status.dikirim' },
  { nilai: 'diterima', kunci: 'status.diterima' },
];

export default function Penerimaan() {
  const router = useRouter();
  const { t, tn, nb, sb } = useBahasa();
  const { akun } = useSession();
  const [daftar, setDaftar] = useState<RequestDenganDonasi[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);
  const [filter, setFilter] = useState<Filter>('semua');

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setGalat(t('dash.takTerhubung'));
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

  // Angka di chip dihitung dari seluruh daftar, bukan dari hasil filter — kalau
  // ikut tersaring, tiap chip cuma memajang angkanya sendiri.
  const hitung = useMemo(() => {
    const n: Record<Filter, number> = {
      semua: daftar.length,
      aktif: 0,
      dikemas: 0,
      dikirim: 0,
      diterima: 0,
    };
    for (const r of daftar) n[r.status] += 1;
    return n;
  }, [daftar]);

  // Status tanpa isi disembunyikan. Panti cuma punya 2-3 kebutuhan sekaligus,
  // jadi lima chip yang tiga di antaranya nol cuma jadi baris angka nol.
  const chipTampil = useMemo(
    () => FILTER.filter((f) => f.nilai === 'semua' || hitung[f.nilai] > 0),
    [hitung]
  );

  const tampil = useMemo(
    () => (filter === 'semua' ? daftar : daftar.filter((r) => r.status === filter)),
    [daftar, filter]
  );

  const adaIsi = !muat && !galat && !!daftar.length;

  return (
    <LayarTab>
      <View style={s.header}>
        <Text style={teks.judulTab}>{t('terima.judul')}</Text>
        {adaIsi && (
          <Text style={teks.caption}>
            {t('terima.ringkas', { n: daftar.length, m: totalDonasi })}
          </Text>
        )}

        {adaIsi && chipTampil.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filter}
          >
            {chipTampil.map((f) => (
              <Chip
                key={f.nilai}
                label={`${t(f.kunci)} ${hitung[f.nilai]}`}
                varian={filter === f.nilai ? 'aktif' : 'pasif'}
                onPress={() => setFilter(f.nilai)}
              />
            ))}
          </ScrollView>
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
          judul={t('terima.galat')}
          pesan={galat}
          aksiLabel={t('umum.cobaLagi')}
          onAksi={ambil}
        />
      ) : !daftar.length ? (
        <StatusLayar
          ikon="inbox"
          judul={t('terima.kosongJudul')}
          pesan={t('terima.kosongPesan')}
          aksiLabel={t('dash.fab')}
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
          {/* Daftar ada isinya, filternya yang kosong — chip tetap terlihat
              supaya jalan keluarnya sekali tap. */}
          {!tampil.length && (
            <Kartu isian style={s.kosongFilter}>
              <Feather name="filter" size={22} color={warna.biru} />
              <Text style={[teks.caption, s.rata]}>
                {t('terima.kosongFilter', {
                  status: (() => {
                    const f = FILTER.find((x) => x.nilai === filter);
                    return f ? t(f.kunci).toLowerCase() : '';
                  })(),
                })}
              </Text>
              <Pressable onPress={() => setFilter('semua')} hitSlop={8}>
                <Text style={s.tautan}>{t('terima.tampilkanSemua')}</Text>
              </Pressable>
            </Kartu>
          )}

          {tampil.map((r) => {
            const st = STATUS_REQUEST[r.status];
            const nDonatur = jumlahDonatur(r);
            return (
              <Kartu key={r.id} onPress={() => router.push(`/penerimaan/${r.id}`)}>
                <View style={s.atas}>
                  <FotoPlaceholder
                    sumber={fotoKatalog(r.katalog)}
                    url={r.katalog.foto_url}
                    label={nb(r.katalog)}
                    ukuran={44}
                  />
                  <View style={s.info}>
                    <Text style={teks.bodyMedium} numberOfLines={1}>
                      {nb(r.katalog)}
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

                <View style={s.kaki}>
                  <View style={s.kontributor}>
                    <Feather name="users" size={15} color={warna.biru} />
                    <Text style={[teks.caption, s.kontributorTeks]}>
                      {tn('terima.terkumpul', nDonatur)}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={warna.placeholder} />
                </View>
              </Kartu>
            );
          })}
        </ScrollView>
      )}
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
    paddingBottom: spacing.md,
    gap: 2,
  },
  filter: { gap: spacing.sm, marginTop: spacing.md },
  isi: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  kosongFilter: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  rata: { textAlign: 'center' },
  tautan: { ...teks.caption, color: warna.biru },
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
