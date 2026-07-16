import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { KartuProduk } from '../../components/KartuProduk';
import { SheetAturJumlah } from '../../components/SheetAturJumlah';
import { Chip, Tombol } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { formatRupiah } from '../../lib/format';
import { useSession } from '../../lib/session';
import {
  buatRequest,
  getKatalog,
  getPantiById,
  sisaPlafon,
  type Kategori,
  type Katalog,
  type PantiDenganRequest,
} from '../../lib/queries';

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

  const kembali = () => (router.canGoBack() ? router.back() : router.replace('/dashboard'));

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
    <View style={s.layar}>
      <View style={s.header}>
        <View style={s.headerAtas}>
          <Pressable onPress={kembali} style={s.tombolKembali} hitSlop={8}>
            <Feather name="chevron-left" size={20} color={warna.ink} />
          </Pressable>
          <Text style={[teks.subjudul, s.judul]}>Katalog</Text>
          {!!panti && (
            <View style={s.chipSisa}>
              <Text style={[teks.mikro, s.chipSisaTeks]}>Sisa {formatRupiah(sisa)}</Text>
            </View>
          )}
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
        <View style={s.tengah}>
          <ActivityIndicator color={warna.biru} />
        </View>
      ) : galat ? (
        <View style={s.tengah}>
          <Text style={[teks.body, s.rata]}>{galat}</Text>
          <Tombol label="Coba lagi" varian="sekunder" penuh={false} onPress={ambil} />
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
          {!tampil.length && (
            <Text style={[teks.caption, s.rata]}>
              Belum ada barang di kategori ini.
            </Text>
          )}
        </ScrollView>
      )}

      <SheetAturJumlah
        item={dipilih}
        sisaPlafon={sisa}
        onTutup={() => setDipilih(null)}
        onAjukan={ajukan}
      />
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerAtas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tombolKembali: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  judul: { flex: 1 },
  chipSisa: {
    backgroundColor: warna.skyTint,
    borderRadius: radius.tombol,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipSisaTeks: { color: warna.biru },
  filter: { gap: spacing.sm, marginTop: spacing.md },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  sel: { width: '47.5%', flexGrow: 1 },
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  rata: { textAlign: 'center' },
});
