import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuProduk } from '../../../components/KartuProduk';
import { SheetAturJumlah } from '../../../components/SheetAturJumlah';
import { Chip, Skeleton, StatusLayar } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { formatRupiah } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import {
  buatRequest,
  getKatalog,
  getPantiById,
  sisaPlafon,
  type Kategori,
  type Katalog,
  type PantiDenganRequest,
} from '../../../lib/queries';

const KATEGORI: { nilai: Kategori; label: string }[] = [
  { nilai: 'pangan', label: 'Pangan' },
  { nilai: 'kebersihan', label: 'Kebersihan' },
  { nilai: 'sekolah', label: 'Sekolah' },
  { nilai: 'kesehatan', label: 'Kesehatan' },
];

export default function KatalogPanti() {
  const router = useRouter();
  const { akun } = useSession();
  const [katalog, setKatalog] = useState<Katalog[]>([]);
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [kategori, setKategori] = useState<Kategori>('pangan');
  const [dipilih, setDipilih] = useState<Katalog | null>(null);

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setGalat('Akun ini tidak terhubung ke panti mana pun.');
      setMuat(false);
      return;
    }
    try {
      setGalat(null);
      const [k, p] = await Promise.all([getKatalog(), getPantiById(akun.pantiId)]);
      setKatalog(k);
      setPanti(p);
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

  const tampil = useMemo(
    () => katalog.filter((k) => k.kategori === kategori),
    [katalog, kategori]
  );

  const ajukan = async (jumlah: number) => {
    if (!dipilih || !panti || !akun.pantiId) return;
    const requestId = await buatRequest({
      pantiId: akun.pantiId,
      katalogId: dipilih.id,
      jumlah,
      katalog: dipilih,
      panti,
    });
    const item = dipilih;
    setDipilih(null);
    router.push({
      pathname: '/terkirim',
      params: {
        requestId,
        barang: item.nama,
        jumlah: String(jumlah),
        satuan: item.satuan,
        total: String(jumlah * item.harga_per_satuan),
      },
    });
  };

  const sisa = panti ? sisaPlafon(panti) : 0;

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerAtas}>
          <Text style={[teks.judul, s.judul]}>Katalog</Text>
          {!!panti && <Chip label={`Sisa ${formatRupiah(sisa)}`} varian="tint" />}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filter}>
          {KATEGORI.map((k) => (
            <Chip
              key={k.nilai}
              label={k.label}
              varian={kategori === k.nilai ? 'aktif' : 'pasif'}
              onPress={() => setKategori(k.nilai)}
            />
          ))}
        </ScrollView>
      </View>

      {muat ? (
        <View style={s.isi}>
          <View style={s.grid}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[s.sel, s.selSkeleton]}>
                <Skeleton tinggi={96} bulat={0} />
                <View style={s.skeletonBadan}>
                  <Skeleton lebar="80%" tinggi={13} />
                  <Skeleton lebar="50%" tinggi={11} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : galat ? (
        <StatusLayar
          ikon="wifi-off"
          judul="Gagal memuat katalog"
          pesan={galat}
          aksiLabel="Coba lagi"
          onAksi={ambil}
        />
      ) : !tampil.length ? (
        <View style={s.kosong}>
          <View style={s.kosongIkon}>
            <Feather name="package" size={28} color={warna.biru} />
          </View>
          <Text style={[teks.caption, s.rata, s.kosongTeks]}>
            Belum ada barang di kategori ini. Katalog dikurasi bertahap — coba kategori lain.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.isi}>
          <View style={s.grid}>
            {tampil.map((item) => (
              <View key={item.id} style={s.sel}>
                <KartuProduk item={item} onPress={() => setDipilih(item)} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <SheetAturJumlah
        item={dipilih}
        sisaPlafon={sisa}
        onTutup={() => setDipilih(null)}
        onAjukan={ajukan}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerAtas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  judul: { flex: 1 },
  filter: { gap: spacing.sm, marginTop: spacing.md },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  sel: { width: '47.5%', flexGrow: 1 },
  selSkeleton: {
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    overflow: 'hidden',
  },
  skeletonBadan: { padding: spacing.md, gap: spacing.sm },
  kosong: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  kosongIkon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kosongTeks: { maxWidth: 260 },
  rata: { textAlign: 'center' },
});
