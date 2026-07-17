import { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuPanti } from '../../../components/KartuPanti';
import { BannerBatch } from '../../../components/BannerBatch';
import { KartuMendesak } from '../../../components/KartuMendesak';
import { SheetSwitchAkun } from '../../../components/SheetSwitchAkun';
import { SheetPilihArea, AREA_SEMUA, useLabelArea } from '../../../components/SheetPilihArea';
import { Chip, LayarTab, Skeleton, SkeletonKartuProgress, StatusLayar } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { useBahasa } from '../../../lib/i18n';
import type { Kunci } from '../../../lib/teks';
import { useSession } from '../../../lib/session';
import {
  belumSampai,
  getDaftarPanti,
  getDonasiByDonatur,
  kebutuhanMendesak,
  requestAktif,
  type DonasiLengkap,
  type Kategori,
  type PantiDenganRequest,
} from '../../../lib/queries';

type Filter = 'terdekat' | Kategori;

const FILTER: { nilai: Filter; kunci: Kunci }[] = [
  { nilai: 'terdekat', kunci: 'beranda.filter.terdekat' },
  { nilai: 'pangan', kunci: 'beranda.filter.pangan' },
  { nilai: 'kebersihan', kunci: 'beranda.filter.kebersihan' },
  { nilai: 'sekolah', kunci: 'beranda.filter.sekolah' },
  { nilai: 'kesehatan', kunci: 'beranda.filter.kesehatan' },
];

export default function Beranda() {
  const router = useRouter();
  const { akun } = useSession();
  const { t, tn } = useBahasa();
  const labelArea = useLabelArea();
  const [switcher, setSwitcher] = useState(false);
  const [pilihArea, setPilihArea] = useState(false);
  const [panti, setPanti] = useState<PantiDenganRequest[]>([]);
  const [batch, setBatch] = useState<DonasiLengkap[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);
  const [cari, setCari] = useState('');
  const [filter, setFilter] = useState<Filter>('terdekat');
  const [area, setArea] = useState(AREA_SEMUA);

  // "Lihat semua" melompat ke daftar panti di layar yang sama — tidak ada layar
  // baru yang dijanjikan.
  const gulir = useRef<ScrollView>(null);
  const yDaftar = useRef(0);

  const ambil = useCallback(async () => {
    try {
      setGalat(null);
      const [daftar, donasi] = await Promise.all([
        getDaftarPanti(),
        getDonasiByDonatur(akun.id),
      ]);
      setPanti(daftar);
      setBatch(belumSampai(donasi));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [akun.id]);

  // Pengganti realtime: muat ulang tiap layar difokuskan.
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

  // Area diturunkan dari data, bukan daftar tetap — panti baru di kota baru
  // langsung bisa dipilih tanpa menyentuh kode.
  const daftarKota = useMemo(() => [...new Set(panti.map((p) => p.kota))].sort(), [panti]);

  const tampil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    const cocok = panti.filter((p) => {
      const aktif = requestAktif(p);

      const cocokFilter =
        filter === 'terdekat' || aktif.some((r) => r.katalog.kategori === filter);

      const cocokCari =
        !kata ||
        p.nama.toLowerCase().includes(kata) ||
        p.kota.toLowerCase().includes(kata) ||
        aktif.some((r) => r.katalog.nama.toLowerCase().includes(kata));

      return cocokFilter && cocokCari;
    });

    // Memilih area TIDAK menyaring panti — gudang Nyalur mengirim ke semuanya,
    // dan 5 kartu yang hidup memang inti etalase (brief §10). Yang berubah cuma
    // urutan: panti sekota naik ke atas. sort() stabil, jadi urutan jarak dari
    // query tetap terjaga di dalam tiap kelompok.
    if (area === AREA_SEMUA) return cocok;
    return [...cocok].sort((a, b) => Number(b.kota === area) - Number(a.kota === area));
  }, [panti, cari, filter, area]);

  // Satu kartu per panti, terdekat dulu — getDaftarPanti sudah urut jarak.
  const mendesak = useMemo(
    () =>
      tampil
        .map((p) => ({ panti: p, kebutuhan: kebutuhanMendesak(p) }))
        .filter((x): x is { panti: PantiDenganRequest; kebutuhan: NonNullable<typeof x.kebutuhan> } =>
          Boolean(x.kebutuhan)
        ),
    [tampil]
  );

  const diTangsel = area === AREA_SEMUA;

  return (
    <LayarTab>
      <View style={s.header}>
        <View style={s.headerAtas}>
          <View style={s.headerKiri}>
            <Text style={teks.judulTab}>{t('beranda.judul')}</Text>
            <Pressable
              onPress={() => setPilihArea(true)}
              style={({ pressed }) => [s.lokasi, pressed && s.ditekan]}
              hitSlop={8}
            >
              <Feather name="map-pin" size={14} color={warna.muted} />
              <Text style={[teks.caption, s.lokasiTeks]} numberOfLines={1}>
                {labelArea(area)}
              </Text>
              <Feather name="chevron-down" size={14} color={warna.biru} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => setSwitcher(true)}
            style={({ pressed }) => [s.avatar, pressed && s.ditekan]}
            hitSlop={8}
          >
            <Feather name="user" size={20} color={warna.biru} />
          </Pressable>
        </View>

        <View style={s.cari}>
          <Feather name="search" size={18} color={warna.muted} />
          <TextInput
            value={cari}
            onChangeText={setCari}
            placeholder={t('beranda.cari')}
            placeholderTextColor={warna.muted}
            style={s.cariInput}
            returnKeyType="search"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filter}
        >
          {FILTER.map((f) => (
            <Chip
              key={f.nilai}
              label={t(f.kunci)}
              varian={filter === f.nilai ? 'aktif' : 'pasif'}
              onPress={() => setFilter(f.nilai)}
            />
          ))}
        </ScrollView>
      </View>

      {muat ? (
        <View style={s.isi}>
          <Skeleton lebar={190} tinggi={13} />
          <SkeletonKartuProgress />
          <SkeletonKartuProgress />
          <SkeletonKartuProgress />
        </View>
      ) : galat ? (
        <StatusLayar
          ikon="wifi-off"
          judul={t('beranda.galat')}
          pesan={galat}
          aksiLabel={t('umum.cobaLagi')}
          onAksi={ambil}
        />
      ) : !tampil.length ? (
        <StatusLayar
          ikon="search"
          judul={t('beranda.kosongJudul')}
          pesan={t('beranda.kosongPesan')}
          aksiLabel={t('beranda.hapusCari')}
          onAksi={() => {
            setCari('');
            setFilter('terdekat');
          }}
        />
      ) : (
        <ScrollView
          ref={gulir}
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
          <BannerBatch batch={batch} />

          {!!mendesak.length && (
            <>
              <View style={s.tajukRail}>
                <Text style={teks.subjudul}>{t('beranda.mendesak')}</Text>
                <Pressable
                  onPress={() => gulir.current?.scrollTo({ y: yDaftar.current, animated: true })}
                  hitSlop={8}
                >
                  <Text style={s.lihatSemua}>{t('beranda.lihatSemua')}</Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.rail}
                style={s.railLuar}
              >
                {mendesak.map(({ panti: p, kebutuhan }) => (
                  <KartuMendesak
                    key={kebutuhan.id}
                    kebutuhan={kebutuhan}
                    namaPanti={p.nama}
                    onPress={() => router.push(`/panti/${p.id}`)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          <View onLayout={(e) => (yDaftar.current = e.nativeEvent.layout.y)}>
            <Text style={teks.subjudul}>{t('beranda.daftarJudul')}</Text>
          </View>
          <Text style={s.kaptenDaftar}>
            {diTangsel
              ? tn('beranda.daftarKaption', tampil.length)
              : t('beranda.daftarKaptionArea', { n: tampil.length, area })}
          </Text>
          {tampil.map((p) => (
            <KartuPanti
              key={p.id}
              panti={p}
              tampilkanJarak={diTangsel}
              onPress={() => router.push(`/panti/${p.id}`)}
            />
          ))}
        </ScrollView>
      )}

      <SheetSwitchAkun tampil={switcher} onTutup={() => setSwitcher(false)} />
      <SheetPilihArea
        tampil={pilihArea}
        area={area}
        daftarKota={daftarKota}
        onPilih={setArea}
        onTutup={() => setPilihArea(false)}
      />
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
  },
  headerAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerKiri: { flex: 1, minWidth: 0 },
  lokasi: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  lokasiTeks: { flexShrink: 1 },
  ditekan: { opacity: 0.7 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cari: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.tombol,
    paddingHorizontal: spacing.md,
    backgroundColor: warna.pageBg,
  },
  cariInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...teks.kecil,
  },
  filter: { gap: spacing.sm, marginTop: spacing.md },
  isi: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  tajukRail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lihatSemua: { ...teks.caption, color: warna.biru },
  // rail menembus gutter layar supaya kartu terakhir tidak terpotong rata tepi
  railLuar: { marginHorizontal: -spacing.lg },
  rail: { gap: spacing.md, paddingHorizontal: spacing.lg },
  kaptenDaftar: { ...teks.caption, marginTop: -spacing.sm },
});
