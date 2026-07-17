import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  Chip,
  Kartu,
  LayarTab,
  FotoPlaceholder,
  SkeletonBaris,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { fotoKatalog } from '../../../lib/gambar';
import { formatJumlah, formatRupiah, formatTanggal, grupWaktu } from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import type { Kunci } from '../../../lib/teks';
import { useSession } from '../../../lib/session';
import { STATUS_DONASI } from '../../../lib/status';
import {
  buktiDari,
  getDonasiByDonatur,
  type DonasiLengkap,
  type StatusDonasi,
} from '../../../lib/queries';

type Filter = 'semua' | StatusDonasi;

// Labelnya kunci kamus, bukan kalimat — diterjemahkan di dalam komponen.
const FILTER: { nilai: Filter; kunci: Kunci }[] = [
  { nilai: 'semua', kunci: 'riwayat.filter.semua' },
  { nilai: 'dikemas', kunci: 'status.dikemas' },
  { nilai: 'dikirim', kunci: 'status.dikirim' },
  { nilai: 'diterima', kunci: 'status.diterima' },
];

/** Daftar rata jadi seksi bertajuk waktu, urutan asli (terbaru dulu) dipertahankan. */
function kelompokkan(donasi: DonasiLengkap[]) {
  const seksi: { tajuk: string; isi: DonasiLengkap[] }[] = [];
  for (const d of donasi) {
    const tajuk = grupWaktu(d.created_at);
    const akhir = seksi[seksi.length - 1];
    if (akhir?.tajuk === tajuk) akhir.isi.push(d);
    else seksi.push({ tajuk, isi: [d] });
  }
  return seksi;
}

export default function Riwayat() {
  const router = useRouter();
  const { akun } = useSession();
  const { t, tn } = useBahasa();
  const [donasi, setDonasi] = useState<DonasiLengkap[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);
  const [filter, setFilter] = useState<Filter>('semua');

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

  // Angka di chip dihitung dari seluruh riwayat, bukan dari hasil filter —
  // kalau ikut tersaring, tiap chip selalu memajang angkanya sendiri saja.
  const hitung = useMemo(() => {
    const n = { semua: donasi.length, dikemas: 0, dikirim: 0, diterima: 0 };
    for (const d of donasi) n[d.status] += 1;
    return n;
  }, [donasi]);

  const tampil = useMemo(
    () => (filter === 'semua' ? donasi : donasi.filter((d) => d.status === filter)),
    [donasi, filter]
  );

  const seksi = useMemo(() => kelompokkan(tampil), [tampil]);

  const total = donasi.reduce((n, d) => n + d.total, 0);
  const adaIsi = !muat && !galat && !!donasi.length;

  return (
    <LayarTab>
      <View style={s.header}>
        <Text style={teks.judulTab}>{t('riwayat.judul')}</Text>
        {adaIsi && (
          <Text style={teks.caption}>
            {tn('riwayat.ringkas', donasi.length, { rp: formatRupiah(total) })}
          </Text>
        )}

        {adaIsi && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filter}
          >
            {FILTER.map((f) => (
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
          <SkeletonBaris />
          <SkeletonBaris />
          <SkeletonBaris />
          <SkeletonBaris />
        </View>
      ) : galat ? (
        <StatusLayar
          ikon="wifi-off"
          judul={t('galat.riwayat')}
          pesan={galat}
          aksiLabel={t('umum.cobaLagi')}
          onAksi={ambil}
        />
      ) : !donasi.length ? (
        <StatusLayar
          ikon="clock"
          judul={t('riwayat.kosongJudul')}
          pesan={t('riwayat.kosongPesan')}
          aksiLabel={t('riwayat.lihatBeranda')}
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
          {/* Riwayat ada isinya, filternya yang kosong — chip tetap terlihat
              supaya jalan keluarnya sekali tap. */}
          {!tampil.length ? (
            <Kartu isian style={s.kosongFilter}>
              <Feather name="filter" size={22} color={warna.biru} />
              <Text style={[teks.caption, s.rata]}>
                {t('riwayat.kosongFilter', {
                  status: (() => {
                    const f = FILTER.find((f) => f.nilai === filter);
                    return f ? t(f.kunci).toLowerCase() : '';
                  })(),
                })}
              </Text>
              <Pressable onPress={() => setFilter('semua')} hitSlop={8}>
                <Text style={s.tautan}>{t('riwayat.tampilkanSemua')}</Text>
              </Pressable>
            </Kartu>
          ) : (
            seksi.map((sek) => (
              <View key={sek.tajuk} style={s.seksi}>
                <Text style={teks.label}>{sek.tajuk}</Text>
                {sek.isi.map((d) => (
                  <KartuRiwayat key={d.id} donasi={d} router={router} />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </LayarTab>
  );
}

function KartuRiwayat({
  donasi: d,
  router,
}: {
  donasi: DonasiLengkap;
  router: ReturnType<typeof useRouter>;
}) {
  const { t, nb, sb } = useBahasa();
  const st = STATUS_DONASI[d.status];
  const { katalog, panti } = d.request;
  const bukti = buktiDari(d);

  return (
    <Kartu onPress={() => router.push(`/lacak/${d.id}`)}>
      <View style={s.baris}>
        <FotoPlaceholder
          sumber={fotoKatalog(katalog)}
          url={katalog.foto_url}
          label={nb(katalog)}
          ukuran={48}
        />

        <View style={s.info}>
          <Text style={teks.bodyMedium} numberOfLines={1}>
            {nb(katalog)} · {formatJumlah(d.jumlah, sb(katalog))}
          </Text>
          <Text style={teks.mikro} numberOfLines={1}>
            {t('umum.kePanti', { panti: panti.nama })}
          </Text>
          <Text style={[teks.mikro, s.kaki]} numberOfLines={1}>
            {formatRupiah(d.total)} · {formatTanggal(d.created_at)}
          </Text>
        </View>

        <View style={s.kanan}>
          <Badge label={t(st.kunci)} varian={st.varian} />
          <Feather name="chevron-right" size={18} color={warna.placeholder} />
        </View>
      </View>

      {/* Klimaks demo dinaikkan ke permukaan: tanpa strip ini, bukti terkubur
          di balik /lacak dan baru muncul setelah gulir. */}
      {!!bukti && (
        <Pressable
          onPress={() => router.push(`/bukti/${d.id}`)}
          style={({ pressed }) => [s.bukti, pressed && s.ditekan]}
        >
          <Feather name="shield" size={15} color={warna.hijau} />
          <Text style={s.buktiLabel}>{t('riwayat.lihatBukti')}</Text>
          <Text style={[teks.mono, s.buktiKode]} numberOfLines={1}>
            {bukti.kode_bukti}
          </Text>
          <Feather name="chevron-right" size={15} color={warna.hijau} />
        </Pressable>
      )}
    </Kartu>
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
  isi: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  seksi: { gap: spacing.md },

  baris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0, gap: 2 },
  kaki: { marginTop: 2 },
  kanan: { alignItems: 'flex-end', gap: 6 },

  bukti: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.tombol,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  ditekan: { opacity: 0.85 },
  buktiLabel: { ...teks.mikro, color: warna.hijau },
  buktiKode: { flex: 1, textAlign: 'right', color: warna.hijau },

  kosongFilter: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  rata: { textAlign: 'center' },
  tautan: { ...teks.caption, color: warna.biru },
});
