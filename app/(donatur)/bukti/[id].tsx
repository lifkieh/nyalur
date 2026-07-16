import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Share,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks, bayangan } from '../../../constants/theme';
import {
  formatJumlah,
  formatKoordinat,
  formatWaktuLengkap,
} from '../../../lib/format';
import { buktiDari, getDonasiById, type DonasiLengkap } from '../../../lib/queries';

export default function BuktiSerahTerima() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [donasi, setDonasi] = useState<DonasiLengkap | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  const ambil = useCallback(async () => {
    if (!id) return;
    try {
      setGalat(null);
      setDonasi(await getDonasiById(id));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      ambil();
    }, [ambil])
  );

  const keEtalase = () => router.replace('/etalase');
  const kembali = () => (router.canGoBack() ? router.back() : keEtalase());

  if (muat) {
    return (
      <View style={s.tengah}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  const bukti = donasi ? buktiDari(donasi) : null;

  if (galat || !donasi || !bukti) {
    return (
      <View style={s.tengah}>
        <Text style={[teks.body, s.rata]}>
          {galat ?? 'Bukti serah terima belum tersedia untuk donasi ini.'}
        </Text>
        <Tombol label="Kembali" varian="sekunder" penuh={false} onPress={kembali} />
      </View>
    );
  }

  const { request } = donasi;
  const porsi = formatJumlah(donasi.jumlah, request.katalog.satuan);
  const koordinat = formatKoordinat(bukti.lokasi_lat, bukti.lokasi_lng);

  const bagikan = () =>
    Share.share({
      message:
        `${request.katalog.nama} ${porsi} dari saya sudah sampai di ${request.panti.nama}. ` +
        `Diterima ${bukti.penerima_nama} — ${formatWaktuLengkap(bukti.diterima_at)}. ` +
        `Bukti: ${bukti.kode_bukti} · Nyalur`,
    }).catch(() => {});

  return (
    <View style={s.layar}>
      <View style={s.bar}>
        <Pressable onPress={kembali} style={s.tombolKembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
        <Text style={teks.subjudul}>Bukti serah terima</Text>
      </View>

      <ScrollView contentContainerStyle={s.isi}>
        <View style={s.sertifikat}>
          <View>
            <FotoPlaceholder
              url={bukti.foto_url}
              label="foto serah terima (kurir)"
              tinggi={300}
              bulat={0}
            />
            <View style={s.gps}>
              <Feather name="map-pin" size={12} color={warna.putih} />
              <Text style={s.gpsTeks}>Lokasi GPS terverifikasi</Text>
            </View>
          </View>

          <View style={s.pilBaris}>
            <View style={s.pil}>
              <Feather name="check" size={18} color={warna.putih} />
              <Text style={s.pilTeks}>Diterima</Text>
            </View>
          </View>

          <View style={s.badan}>
            <Text style={[teks.caption, s.rata]}>{formatWaktuLengkap(bukti.diterima_at)}</Text>

            <Text style={[teks.judul, s.rata, s.kalimat]}>
              {request.katalog.nama} {porsi} dari kamu
            </Text>
            <Text style={[teks.kecil, s.rata, s.sub]}>
              telah sampai di {request.panti.nama}
            </Text>

            <View style={s.putus} />

            <View style={s.penerima}>
              <View style={s.avatar}>
                <Feather name="user" size={22} color={warna.biru} />
              </View>
              <View style={s.penerimaInfo}>
                <Text style={teks.mikro}>Diterima &amp; ditandatangani oleh</Text>
                <Text style={teks.bodyMedium}>{bukti.penerima_nama}</Text>
                <Text style={teks.mikro}>{bukti.penerima_jabatan}</Text>
              </View>
            </View>

            <View style={s.strip}>
              <View style={s.perisai}>
                <Feather name="shield" size={19} color={warna.biru} />
              </View>
              <View style={s.stripInfo}>
                <Text style={[teks.caption, s.stripJudul]}>Diverifikasi oleh Nyalur</Text>
                <Text style={teks.mono}>ID bukti: {bukti.kode_bukti}</Text>
                {!!koordinat && <Text style={teks.mono}>Koordinat: {koordinat}</Text>}
              </View>
            </View>
          </View>
        </View>

        <View style={s.aksi}>
          <Tombol
            label="Bagikan"
            varian="sekunder"
            onPress={bagikan}
            style={s.tombolAksi}
            ikon={<Feather name="share-2" size={17} color={warna.biru} />}
          />
          <Tombol label="Nyalur lagi" varian="primer" onPress={keEtalase} style={s.tombolAksi} />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
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
  isi: { padding: spacing.lg, paddingBottom: 40 },

  sertifikat: {
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    overflow: 'hidden',
  },
  gps: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,23,42,0.6)',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: radius.badge,
  },
  gpsTeks: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: warna.putih },

  pilBaris: { alignItems: 'center', marginTop: -24, paddingHorizontal: 20 },
  pil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: warna.hijau,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    ...bayangan.hijau,
  },
  pilTeks: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: warna.putih },

  badan: { paddingTop: spacing.lg, paddingHorizontal: 22, paddingBottom: spacing.xl },
  rata: { textAlign: 'center' },
  kalimat: { marginTop: 10 },
  sub: { color: warna.muted, marginTop: 4 },
  putus: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: warna.border,
    marginVertical: 20,
  },

  penerima: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.pageBg,
    borderRadius: radius.kartu,
    padding: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  penerimaInfo: { flex: 1, gap: 1 },

  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: 14,
    marginTop: spacing.md,
  },
  perisai: {
    width: 34,
    height: 34,
    borderRadius: radius.tombol,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripInfo: { flex: 1, gap: 1 },
  stripJudul: { fontFamily: 'PlusJakartaSans_500Medium', color: warna.ink },

  aksi: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  tombolAksi: { flex: 1 },

  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: warna.pageBg,
  },
});
