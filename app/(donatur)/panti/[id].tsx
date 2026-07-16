import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BarisKebutuhan } from '../../../components/BarisKebutuhan';
import { SheetPilihPorsi } from '../../../components/SheetPilihPorsi';
import { Badge, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { formatAngka } from '../../../lib/format';
import { useSession } from '../../../lib/session';
import {
  buatDonasi,
  getPantiById,
  requestAktif,
  type PantiDenganRequest,
  type Request,
} from '../../../lib/queries';

export default function DetailPanti() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { akun } = useSession();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [dipilih, setDipilih] = useState<Request | null>(null);

  const ambil = useCallback(async () => {
    if (!id) return;
    try {
      setGalat(null);
      setPanti(await getPantiById(id));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [id]);

  // Pengganti realtime: progress ikut terbarui saat kembali dari donasi.
  useFocusEffect(
    useCallback(() => {
      ambil();
    }, [ambil])
  );

  const kembali = () => (router.canGoBack() ? router.back() : router.replace('/etalase'));

  const nyalur = async (jumlah: number) => {
    if (!dipilih || !panti) return;
    const donasiId = await buatDonasi({
      requestId: dipilih.id,
      jumlah,
      katalog: dipilih.katalog,
      donatur: { id: akun.id, nama: akun.nama },
      panti: { nama: panti.nama },
    });
    setDipilih(null);
    router.push({
      pathname: '/checkout',
      params: {
        donasiId,
        barang: dipilih.katalog.nama,
        jumlah: String(jumlah),
        satuan: dipilih.katalog.satuan,
        panti: panti.nama,
        batch: dipilih.batch_kirim,
      },
    });
  };

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
        <Text style={[teks.body, s.pesan]}>{galat ?? 'Panti tidak ditemukan.'}</Text>
        <Tombol label="Kembali ke etalase" varian="sekunder" penuh={false} onPress={kembali} />
      </View>
    );
  }

  const aktif = requestAktif(panti);
  const batch = aktif[0]?.batch_kirim;

  return (
    <ScrollView style={s.layar} contentContainerStyle={s.isiLayar}>
      <View style={s.hero}>
        <FotoPlaceholder url={panti.foto_url} label="foto panti (hero)" tinggi={220} bulat={0} />
        <Pressable onPress={kembali} style={s.kembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
      </View>

      <View style={s.header}>
        <View style={s.judul}>
          <Text style={teks.title} numberOfLines={2}>
            {panti.nama}
          </Text>
          <Badge label="Terverifikasi" varian="verified" />
        </View>
        <Text style={teks.kecil}>
          {panti.jumlah_anak} anak · {panti.kota} · {formatAngka(panti.jarak_km)} km
        </Text>
        {!!batch && (
          <View style={s.batch}>
            <Feather name="calendar" size={15} color={warna.biru} />
            <Text style={[teks.caption, s.batchTeks]}>
              Pengiriman berikutnya: batch {batch}
            </Text>
          </View>
        )}
      </View>

      <View style={s.daftar}>
        <Text style={teks.label}>Kebutuhan aktif</Text>
        {aktif.map((r) => (
          <BarisKebutuhan key={r.id} kebutuhan={r} onNyalur={() => setDipilih(r)} />
        ))}
        {!aktif.length && (
          <Text style={[teks.caption, s.pesan]}>
            Tidak ada kebutuhan aktif. Semua sudah terpenuhi.
          </Text>
        )}
      </View>

      <SheetPilihPorsi
        kebutuhan={dipilih}
        namaPanti={panti.nama}
        onTutup={() => setDipilih(null)}
        onNyalur={nyalur}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isiLayar: { paddingBottom: 40 },
  hero: { position: 'relative' },
  kembali: {
    position: 'absolute',
    top: 52,
    left: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  judul: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  batch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: warna.skyTint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.tombol,
    alignSelf: 'flex-start',
  },
  batchTeks: { color: warna.biru },
  daftar: { padding: spacing.lg, gap: 14 },
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: warna.pageBg,
  },
  pesan: { textAlign: 'center' },
});
