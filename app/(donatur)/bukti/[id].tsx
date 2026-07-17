import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  Share,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Tombol,
  FotoPlaceholder,
  BarKembali,
  Skeleton,
  StatusLayar,
  useMuncul,
  useMunculPegas,
} from '../../../components/ui';
import { warna, spacing, radius, teks, bayangan, font } from '../../../constants/theme';
import { FOTO_BUKTI } from '../../../lib/gambar';
import {
  formatJumlah,
  formatKoordinat,
  formatWaktuLengkap,
} from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import { buktiDari, getDonasiById, type DonasiLengkap } from '../../../lib/queries';
import { useSession } from '../../../lib/session';

export default function BuktiSerahTerima() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { akun } = useSession();
  const { t, nb, sb } = useBahasa();
  const [donasi, setDonasi] = useState<DonasiLengkap | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  // Momen pamungkas demo — sertifikat naik pelan, pil "Diterima" mengunci dengan pegas.
  const sertifikatMasuk = useMuncul(60);
  const pilMasuk = useMunculPegas(320);
  const aksiMasuk = useMuncul(420);

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
      <View style={s.layar}>
        <BarKembali judul={t('bukti.judul')} onKembali={kembali} />
        <View style={s.isi}>
          <Skeleton tinggi={300} bulat={12} />
          <Skeleton tinggi={120} bulat={12} style={s.jarakSkeleton} />
        </View>
      </View>
    );
  }

  const bukti = donasi ? buktiDari(donasi) : null;

  if (galat || !donasi || !bukti) {
    return (
      <StatusLayar
        ikon="file-text"
        judul={t('bukti.belumAda')}
        pesan={galat ?? t('bukti.belumAdaPesan')}
        aksiLabel={t('umum.kembali')}
        onAksi={kembali}
      />
    );
  }

  const { request } = donasi;
  const porsi = formatJumlah(donasi.jumlah, sb(request.katalog));
  const koordinat = formatKoordinat(bukti.lokasi_lat, bukti.lokasi_lng);

  const bagikan = () =>
    Share.share({
      message: t('bukti.pesanBagikan', {
        barang: nb(request.katalog),
        porsi,
        panti: request.panti.nama,
        penerima: bukti.penerima_nama,
        waktu: formatWaktuLengkap(bukti.diterima_at, ''),
        kode: bukti.kode_bukti,
      }),
    }).catch(() => {});

  return (
    <View style={s.layar}>
      <BarKembali judul={t('bukti.judul')} onKembali={kembali} />

      <ScrollView contentContainerStyle={s.isi}>
        <Animated.View style={[s.sertifikat, sertifikatMasuk]}>
          <View>
            {/* url sengaja TIDAK diteruskan. bukti.foto_url di seed berisi URL
                placehold.co — menariknya berarti layar klimaks ini menempel WiFi
                venue (brief §14: risiko nomor satu), dan kalau meleset juri
                melihat ikon gambar rusak tepat di detik paling menentukan.
                FOTO_BUKTI adalah satu-satunya sumber foto layar ini; selama ia
                kosong, yang tampil kotak placeholder lokal — nol jaringan. */}
            <FotoPlaceholder
              sumber={FOTO_BUKTI}
              label={t('umum.fotoBukti')}
              tinggi={300}
              bulat={0}
            />
            <View style={s.gps}>
              <Feather name="map-pin" size={12} color={warna.putih} />
              <Text style={s.gpsTeks}>{t('bukti.gps')}</Text>
            </View>
          </View>

          <View style={s.pilBaris}>
            <Animated.View style={[s.pil, pilMasuk]}>
              <Feather name="check" size={18} color={warna.putih} />
              <Text style={s.pilTeks}>{t('bukti.pil')}</Text>
            </Animated.View>
          </View>

          <View style={s.badan}>
            <Text style={[teks.caption, s.rata]}>{formatWaktuLengkap(bukti.diterima_at)}</Text>

            <Text style={[teks.judul, s.rata, s.kalimat]}>
              {t('bukti.kalimat', { barang: nb(request.katalog), porsi })}
            </Text>
            <Text style={[teks.kecil, s.rata, s.sub]}>
              {t('bukti.sub', { panti: request.panti.nama })}
            </Text>

            <View style={s.putus} />

            <View style={s.penerima}>
              <View style={s.avatar}>
                <Feather name="user" size={22} color={warna.biru} />
              </View>
              <View style={s.penerimaInfo}>
                <Text style={teks.mikro}>{t('bukti.ditandatangani')}</Text>
                <Text style={teks.bodyMedium}>{bukti.penerima_nama}</Text>
                <Text style={teks.mikro}>{bukti.penerima_jabatan}</Text>
              </View>
            </View>

            <View style={s.strip}>
              <View style={s.perisai}>
                <Feather name="shield" size={18} color={warna.biru} />
              </View>
              <View style={s.stripInfo}>
                <Text style={[teks.caption, s.stripJudul]}>{t('bukti.diverifikasi')}</Text>
                <Text style={teks.mono}>{t('bukti.id', { kode: bukti.kode_bukti })}</Text>
                {!!koordinat && (
                  <Text style={teks.mono}>{t('bukti.koordinat', { nilai: koordinat })}</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Layar bukti dipakai kedua POV — panti membukanya dari penerimaan.
            Keduanya CTA donatur: "Bagikan" berbunyi "dari saya", dan "Nyalur
            lagi" melempar pengurus panti ke etalase donasi. */}
        {akun.peran === 'donatur' && (
          <Animated.View style={[s.aksi, aksiMasuk]}>
            <Tombol
              label={t('bukti.bagikan')}
              varian="sekunder"
              onPress={bagikan}
              style={s.tombolAksi}
              ikon={<Feather name="share-2" size={17} color={warna.biru} />}
            />
            <Tombol
              label={t('bukti.nyalurLagi')}
              varian="primer"
              onPress={keEtalase}
              style={s.tombolAksi}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  jarakSkeleton: { marginTop: spacing.lg },

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
    gap: 6,
    backgroundColor: warna.fotoScrim,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.badge,
  },
  gpsTeks: { ...teks.mikro, color: warna.putih },

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
  pilTeks: { ...teks.bodyMedium, color: warna.putih },

  badan: { paddingTop: spacing.lg, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  rata: { textAlign: 'center' },
  kalimat: { marginTop: spacing.sm },
  sub: { color: warna.muted, marginTop: 4 },
  putus: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: warna.border,
    marginVertical: spacing.lg,
  },

  penerima: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.pageBg,
    borderRadius: radius.kartu,
    padding: spacing.lg,
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
    gap: spacing.md,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  perisai: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripInfo: { flex: 1, gap: 1 },
  stripJudul: { fontFamily: font.medium, color: warna.ink },

  aksi: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  tombolAksi: { flex: 1 },
});
