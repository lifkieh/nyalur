import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Kartu,
  FotoPlaceholder,
  BarKembali,
  Skeleton,
  SkeletonBaris,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { fotoKatalog } from '../../../lib/gambar';
import { formatJumlah, formatRupiah, formatTanggalJam, terjemahHari } from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import {
  buktiDari,
  getDonasiById,
  type DonasiLengkap,
  type StatusDonasi,
} from '../../../lib/queries';

const URUTAN: StatusDonasi[] = ['dikemas', 'dikirim', 'diterima'];

export default function LacakDonasi() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, nb, sb } = useBahasa();
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

  const kembali = () => (router.canGoBack() ? router.back() : router.replace('/etalase'));

  if (muat) {
    return (
      <View style={s.layar}>
        <BarKembali judul={t('lacak.judul')} onKembali={kembali} />
        <View style={s.isi}>
          <SkeletonBaris />
          <Skeleton tinggi={230} bulat={12} style={s.jarakSkeleton} />
          <Skeleton tinggi={160} bulat={12} style={s.jarakSkeleton} />
        </View>
      </View>
    );
  }

  if (galat || !donasi) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul={t('lacak.galat')}
        pesan={galat ?? t('lacak.takAda')}
        aksiLabel={t('umum.kembaliBeranda')}
        onAksi={kembali}
      />
    );
  }

  const { request } = donasi;
  const bukti = buktiDari(donasi);
  const kini = URUTAN.indexOf(donasi.status);

  // Skema hanya menyimpan waktu donasi dibuat dan waktu serah terima. Langkah
  // "dikirim" tidak punya timestamp, jadi setelah lewat ia cuma menyebut apa
  // yang terjadi — bukan jam karangan, dan bukan jadwal batch yang sudah usang
  // begitu barangnya jalan.
  const langkah = [
    {
      kunci: 'dikemas' as const,
      judul: t('status.dikemas'),
      ikon: 'package' as const,
      selesaiTeks: formatTanggalJam(donasi.created_at),
      nantiTeks: t('lacak.dikemas.nanti'),
    },
    {
      kunci: 'dikirim' as const,
      judul: t('status.dikirim'),
      ikon: 'truck' as const,
      selesaiTeks: t('lacak.dikirim.selesai'),
      aktifTeks: t('lacak.dikirim.aktif'),
      nantiTeks: t('lacak.dikirim.nanti', { hari: terjemahHari(request.batch_kirim) }),
    },
    {
      kunci: 'diterima' as const,
      judul: t('status.diterima'),
      ikon: 'check' as const,
      selesaiTeks: bukti ? formatTanggalJam(bukti.diterima_at) : t('lacak.diterima.selesai'),
      nantiTeks: t('lacak.diterima.nanti'),
    },
  ];

  return (
    <View style={s.layar}>
      <BarKembali judul={t('lacak.judul')} onKembali={kembali} />

      <ScrollView contentContainerStyle={s.isi}>
        <Kartu style={s.ringkas}>
          <FotoPlaceholder
            sumber={fotoKatalog(request.katalog)}
            url={request.katalog.foto_url}
            label={nb(request.katalog)}
            ukuran={48}
          />
          <View style={s.ringkasInfo}>
            <Text style={teks.bodyMedium} numberOfLines={1}>
              {nb(request.katalog)} · {formatJumlah(donasi.jumlah, sb(request.katalog))}
            </Text>
            <Text style={[teks.mikro, s.ringkasSub]} numberOfLines={1}>
              {t('umum.kePanti', { panti: request.panti.nama })}
            </Text>
          </View>
        </Kartu>

        <Kartu style={s.kartuTimeline}>
          <Text style={[teks.label, s.tajuk]}>{t('lacak.statusBarang')}</Text>

          {langkah.map((l, i) => {
            // Langkah terakhir tidak pernah "sedang berjalan" — begitu barang
            // diterima, seluruh perjalanan selesai dan berhak warna hijau.
            const selesai = i < kini || (i === kini && l.kunci === 'diterima');
            const aktif = i === kini && !selesai;
            const akhir = i === langkah.length - 1;

            const warnaBulat = selesai ? warna.hijau : aktif ? warna.biru : warna.putih;
            const warnaIkon = selesai || aktif ? warna.putih : warna.placeholder;
            const warnaGaris = i < kini ? warna.hijau : aktif ? warna.biru : warna.border;
            const warnaJudul = aktif ? warna.biru : selesai ? warna.ink : warna.placeholder;

            const teksBawah = selesai
              ? l.selesaiTeks
              : aktif
                ? ('aktifTeks' in l && l.aktifTeks) || l.selesaiTeks
                : l.nantiTeks;

            return (
              <View key={l.kunci} style={s.langkah}>
                <View style={s.rel}>
                  <View
                    style={[
                      s.bulat,
                      { backgroundColor: warnaBulat },
                      !selesai && !aktif && s.bulatNanti,
                      aktif && s.bulatAktif,
                    ]}
                  >
                    <Feather
                      name={selesai ? 'check' : l.ikon}
                      size={selesai ? 15 : 14}
                      color={warnaIkon}
                    />
                  </View>
                  {!akhir && <View style={[s.garis, { backgroundColor: warnaGaris }]} />}
                </View>

                <View style={[s.langkahIsi, !akhir && s.langkahJarak]}>
                  <Text style={[teks.bodyMedium, { color: warnaJudul }]}>{l.judul}</Text>
                  <Text
                    style={[teks.mikro, s.langkahWaktu, !selesai && !aktif && s.teksNanti]}
                  >
                    {teksBawah}
                  </Text>
                </View>
              </View>
            );
          })}
        </Kartu>

        <Kartu style={s.rincian}>
          <Text style={[teks.label, s.tajukRincian]}>{t('lacak.rincian')}</Text>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>
              {t('biaya.hargaBarang', {
                porsi: formatJumlah(donasi.jumlah, sb(request.katalog)),
              })}
            </Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.harga_barang)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>{t('biaya.ongkir')}</Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.ongkir)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>{t('biaya.platform')}</Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.platform_fee)}</Text>
          </View>
          <View style={s.pisah} />
          <View style={s.barisRincian}>
            <Text style={teks.bodyMedium}>{t('biaya.total')}</Text>
            <Text style={teks.bodyMedium}>{formatRupiah(donasi.total)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.mikro, s.labelRedup]}>{t('lacak.disalurkan')}</Text>
            <Text style={teks.mikro}>{formatTanggalJam(donasi.created_at)}</Text>
          </View>
        </Kartu>

        <View style={s.catatan}>
          <Feather name="info" size={15} color={warna.biru} style={s.catatanIkon} />
          <Text style={[teks.mikro, s.catatanTeks]}>{t('lacak.catatan')}</Text>
        </View>

        {/* Gerbang menuju momen klimaks — kartu hijau, satu-satunya di layar ini. */}
        {!!bukti && (
          <Pressable
            onPress={() => router.push(`/bukti/${donasi.id}`)}
            style={({ pressed }) => [s.buktiCta, pressed && s.buktiCtaDitekan]}
          >
            <View style={s.buktiIkon}>
              <Feather name="shield" size={18} color={warna.hijau} />
            </View>
            <View style={s.buktiInfo}>
              <Text style={[teks.bodyMedium, s.buktiJudul]}>{t('lacak.lihatBukti')}</Text>
              <Text style={teks.mono}>{bukti.kode_bukti}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={warna.hijau} />
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  jarakSkeleton: { marginTop: spacing.lg },
  ringkas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  ringkasInfo: { flex: 1, minWidth: 0 },
  ringkasSub: { marginTop: 2 },
  kartuTimeline: { padding: spacing.lg },
  tajuk: { marginBottom: spacing.lg },
  tajukRincian: { marginBottom: 2 },
  rincian: { marginTop: spacing.lg, padding: spacing.lg, gap: spacing.sm },
  barisRincian: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  labelRedup: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },
  langkah: { flexDirection: 'row', gap: spacing.md },
  rel: { alignItems: 'center' },
  bulat: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulatNanti: { borderWidth: 2, borderColor: warna.border },
  bulatAktif: {
    borderWidth: 4,
    borderColor: warna.skyTint,
    width: 34,
    height: 34,
  },
  garis: { width: 2, flex: 1, minHeight: 28 },
  langkahIsi: { flex: 1 },
  langkahJarak: { paddingBottom: spacing.lg },
  langkahWaktu: { marginTop: 2 },
  teksNanti: { color: warna.placeholder },
  catatan: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  catatanIkon: { marginTop: 1 },
  catatanTeks: { flex: 1, lineHeight: 18 },
  buktiCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.kartu,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  buktiCtaDitekan: { opacity: 0.85 },
  buktiIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buktiInfo: { flex: 1, minWidth: 0, gap: 1 },
  buktiJudul: { color: warna.hijau },
});
