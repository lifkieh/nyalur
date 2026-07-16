import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Kartu, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { formatJumlah, formatRupiah, formatTanggalJam } from '../../../lib/format';
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
      <View style={s.tengah}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  if (galat || !donasi) {
    return (
      <View style={s.tengah}>
        <Text style={[teks.body, s.rata]}>{galat ?? 'Donasi tidak ditemukan.'}</Text>
        <Tombol label="Kembali ke etalase" varian="sekunder" penuh={false} onPress={kembali} />
      </View>
    );
  }

  const { request } = donasi;
  const bukti = buktiDari(donasi);
  const kini = URUTAN.indexOf(donasi.status);

  // Skema hanya menyimpan waktu donasi dibuat dan waktu serah terima. Langkah
  // "dikirim" tidak punya timestamp — jadwal batch yang ditampilkan, bukan jam
  // karangan.
  const langkah = [
    {
      kunci: 'dikemas' as const,
      judul: 'Dikemas',
      ikon: 'package' as const,
      selesaiTeks: formatTanggalJam(donasi.created_at),
      nantiTeks: 'Menunggu diproses gudang',
    },
    {
      kunci: 'dikirim' as const,
      judul: 'Dikirim',
      ikon: 'truck' as const,
      selesaiTeks: `Batch ${request.batch_kirim}`,
      aktifTeks: 'Sedang dalam perjalanan',
      nantiTeks: `Menunggu batch ${request.batch_kirim}`,
    },
    {
      kunci: 'diterima' as const,
      judul: 'Diterima',
      ikon: 'check' as const,
      selesaiTeks: bukti ? formatTanggalJam(bukti.diterima_at) : 'Sudah sampai di panti',
      nantiTeks: 'Menunggu bukti serah terima',
    },
  ];

  return (
    <View style={s.layar}>
      <View style={s.bar}>
        <Pressable onPress={kembali} style={s.tombolKembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
        <Text style={teks.subjudul}>Lacak donasi</Text>
      </View>

      <ScrollView contentContainerStyle={s.isi}>
        <Kartu style={s.ringkas}>
          <FotoPlaceholder url={request.katalog.foto_url} label={request.katalog.nama} ukuran={48} />
          <View style={s.ringkasInfo}>
            <Text style={teks.bodyMedium} numberOfLines={1}>
              {request.katalog.nama} · {formatJumlah(donasi.jumlah, request.katalog.satuan)}
            </Text>
            <Text style={[teks.mikro, s.ringkasSub]} numberOfLines={1}>
              ke {request.panti.nama}
            </Text>
          </View>
        </Kartu>

        <Kartu style={s.kartuTimeline}>
          <Text style={[teks.caption, s.tajuk]}>Status barang</Text>

          {langkah.map((l, i) => {
            const selesai = i < kini;
            const aktif = i === kini;
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
          <Text style={teks.caption}>Rincian transaksi</Text>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>
              Harga barang ({formatJumlah(donasi.jumlah, request.katalog.satuan)})
            </Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.harga_barang)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>Ongkir (dibagi batch)</Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.ongkir)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.kecil, s.labelRedup]}>Biaya platform</Text>
            <Text style={teks.kecil}>{formatRupiah(donasi.platform_fee)}</Text>
          </View>
          <View style={s.pisah} />
          <View style={s.barisRincian}>
            <Text style={teks.bodyMedium}>Total</Text>
            <Text style={teks.bodyMedium}>{formatRupiah(donasi.total)}</Text>
          </View>
          <View style={s.barisRincian}>
            <Text style={[teks.mikro, s.labelRedup]}>Disalurkan</Text>
            <Text style={teks.mikro}>{formatTanggalJam(donasi.created_at)}</Text>
          </View>
        </Kartu>

        <View style={s.catatan}>
          <Feather name="info" size={15} color={warna.biru} style={s.catatanIkon} />
          <Text style={[teks.mikro, s.catatanTeks]}>
            Yang dilacak adalah barang fisikmu sampai ke panti — bukan status dana.
          </Text>
        </View>

        {!!bukti && (
          <Tombol
            label="Lihat bukti serah terima"
            varian="primer"
            ukuran="besar"
            style={s.cta}
            onPress={() => router.push(`/bukti/${donasi.id}`)}
          />
        )}
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
  ringkas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  ringkasInfo: { flex: 1, minWidth: 0 },
  ringkasSub: { marginTop: 2 },
  kartuTimeline: { paddingVertical: 20, paddingHorizontal: 18 },
  tajuk: { marginBottom: 18 },
  rincian: { marginTop: spacing.lg, paddingVertical: 16, paddingHorizontal: 18, gap: 10 },
  barisRincian: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  labelRedup: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },
  langkah: { flexDirection: 'row', gap: 14 },
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
  langkahJarak: { paddingBottom: 20 },
  langkahWaktu: { marginTop: 2 },
  teksNanti: { color: warna.placeholder },
  catatan: { flexDirection: 'row', gap: spacing.sm, marginTop: 14 },
  catatanIkon: { marginTop: 1 },
  catatanTeks: { flex: 1, lineHeight: 18 },
  cta: { marginTop: spacing.xl },
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: warna.pageBg,
  },
  rata: { textAlign: 'center' },
});
