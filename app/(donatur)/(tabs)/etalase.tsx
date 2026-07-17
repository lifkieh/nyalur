import { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuPanti } from '../../../components/KartuPanti';
import { SheetSwitchAkun } from '../../../components/SheetSwitchAkun';
import { Chip, Skeleton, SkeletonKartuProgress, StatusLayar } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { getDaftarPanti, requestAktif, type Kategori, type PantiDenganRequest } from '../../../lib/queries';

type Filter = 'terdekat' | Kategori;

const FILTER: { nilai: Filter; label: string }[] = [
  { nilai: 'terdekat', label: 'Terdekat' },
  { nilai: 'pangan', label: 'Pangan' },
  { nilai: 'kebersihan', label: 'Kebersihan' },
  { nilai: 'sekolah', label: 'Sekolah' },
  { nilai: 'kesehatan', label: 'Kesehatan' },
];

export default function Etalase() {
  const router = useRouter();
  const [switcher, setSwitcher] = useState(false);
  const [panti, setPanti] = useState<PantiDenganRequest[]>([]);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [segar, setSegar] = useState(false);
  const [cari, setCari] = useState('');
  const [filter, setFilter] = useState<Filter>('terdekat');

  const ambil = useCallback(async () => {
    try {
      setGalat(null);
      setPanti(await getDaftarPanti());
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, []);

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

  const tampil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return panti.filter((p) => {
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
  }, [panti, cari, filter]);

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerAtas}>
          <View>
            <Text style={teks.judul}>Etalase</Text>
            <View style={s.lokasi}>
              <Feather name="map-pin" size={14} color={warna.muted} />
              <Text style={teks.caption}>Tangerang Selatan</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setSwitcher(true)}
            style={({ pressed }) => [s.avatar, pressed && s.avatarDitekan]}
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
            placeholder="Cari panti atau barang"
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
              label={f.label}
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
          judul="Gagal memuat etalase"
          pesan={galat}
          aksiLabel="Coba lagi"
          onAksi={ambil}
        />
      ) : !tampil.length ? (
        <StatusLayar
          ikon="search"
          judul="Tidak ada panti yang cocok"
          pesan="Coba ubah kata kunci atau pilih filter lain."
          aksiLabel="Hapus pencarian"
          onAksi={() => {
            setCari('');
            setFilter('terdekat');
          }}
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
          <Text style={teks.caption}>
            {tampil.length} panti terverifikasi di sekitarmu
          </Text>
          {tampil.map((p) => (
            <KartuPanti
              key={p.id}
              panti={p}
              onPress={() => router.push(`/panti/${p.id}`)}
            />
          ))}
        </ScrollView>
      )}

      <SheetSwitchAkun tampil={switcher} onTutup={() => setSwitcher(false)} />
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
    paddingBottom: spacing.md,
  },
  headerAtas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  lokasi: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDitekan: { opacity: 0.7 },
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
});
