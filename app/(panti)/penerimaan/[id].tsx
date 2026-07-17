import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Badge,
  Chip,
  Kartu,
  ProgressBar,
  FotoPlaceholder,
  BarKembali,
  Skeleton,
  SkeletonBaris,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import {
  formatJumlah,
  formatRupiah,
  formatTanggalJam,
  labelProgress,
  rasio,
} from '../../../lib/format';
import { STATUS_DONASI } from '../../../lib/status';
import {
  getRequestDenganDonasi,
  jumlahDonatur,
  type DonasiMasuk,
  type Panti,
  type RequestDenganDonasi,
} from '../../../lib/queries';

const inisial = (nama: string) =>
  nama
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

export default function DetailPenerimaan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<(RequestDenganDonasi & { panti: Panti }) | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  const ambil = useCallback(async () => {
    if (!id) return;
    try {
      setGalat(null);
      setData(await getRequestDenganDonasi(id));
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

  const kembali = () => (router.canGoBack() ? router.back() : router.replace('/penerimaan'));

  if (muat) {
    return (
      <View style={s.layar}>
        <BarKembali judul="Detail penerimaan" onKembali={kembali} />
        <View style={s.isi}>
          <Skeleton tinggi={150} bulat={12} />
          <Skeleton tinggi={72} bulat={12} style={s.jarakSkeleton} />
          <View style={s.daftarSkeleton}>
            <SkeletonBaris />
            <SkeletonBaris />
          </View>
        </View>
      </View>
    );
  }

  if (galat || !data) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul="Gagal memuat kebutuhan"
        pesan={galat ?? 'Kebutuhan tidak ditemukan.'}
        aksiLabel="Kembali"
        onAksi={kembali}
      />
    );
  }

  const { katalog, donasi } = data;
  const nDonatur = jumlahDonatur(data);
  const totalMasuk = donasi.reduce((n, d) => n + d.jumlah, 0);

  return (
    <View style={s.layar}>
      <BarKembali judul="Detail penerimaan" onKembali={kembali} />

      <ScrollView contentContainerStyle={s.isi}>
        <Kartu>
          <View style={s.atas}>
            <FotoPlaceholder url={katalog.foto_url} label={katalog.nama} ukuran={56} />
            <View style={s.info}>
              <Text style={teks.subjudul} numberOfLines={1}>
                {katalog.nama}
              </Text>
              <Text style={[teks.caption, s.harga]}>
                {formatRupiah(katalog.harga_per_satuan)} / {katalog.satuan}
              </Text>
            </View>
          </View>

          <ProgressBar
            nilai={rasio(data.jumlah_terpenuhi, data.jumlah_diminta)}
            label={labelProgress(data.jumlah_terpenuhi, data.jumlah_diminta, katalog.satuan)}
            keterangan={`${Math.round(rasio(data.jumlah_terpenuhi, data.jumlah_diminta) * 100)}%`}
            selesai={data.status === 'diterima'}
            style={s.progress}
          />

          <View style={s.chips}>
            <Chip label={`Batch ${data.batch_kirim}`} varian="pasif" />
          </View>
        </Kartu>

        {/* Inti pitch: satu kebutuhan dipenuhi banyak orang. Tidak ada kas
            kolektif — yang ada transaksi kecil yang masing-masing terikat. */}
        <View style={s.sorot}>
          <View style={s.sorotIkon}>
            <Feather name="users" size={20} color={warna.biru} />
          </View>
          <View style={s.sorotInfo}>
            <Text style={[teks.subjudul, s.sorotJudul]}>
              Terkumpul dari {nDonatur} donatur
            </Text>
            <Text style={teks.mikro}>
              {donasi.length} donasi · {formatJumlah(totalMasuk, katalog.satuan)} tercatat masuk
            </Text>
          </View>
        </View>

        <Text style={[teks.label, s.tajuk]}>Donasi yang masuk</Text>

        <View style={s.daftar}>
          {donasi.map((d) => (
            <KartuDonasi key={d.id} donasi={d} satuan={katalog.satuan} router={router} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function KartuDonasi({
  donasi: d,
  satuan,
  router,
}: {
  donasi: DonasiMasuk;
  satuan: string;
  router: ReturnType<typeof useRouter>;
}) {
  const st = STATUS_DONASI[d.status];
  const bukti = d.bukti_terima?.[0] ?? null;

  return (
    <Kartu>
      <View style={s.donaturBaris}>
        <View style={s.avatar}>
          <Text style={s.avatarTeks}>{inisial(d.donatur_nama)}</Text>
        </View>
        <View style={s.info}>
          <Text style={teks.bodyMedium} numberOfLines={1}>
            {d.donatur_nama}
          </Text>
          <Text style={teks.mikro}>{formatTanggalJam(d.created_at)}</Text>
        </View>
        <Badge label={st.label} varian={st.varian} />
      </View>

      <View style={s.pisah} />

      <View style={s.rincian}>
        <View style={s.baris}>
          <Text style={[teks.kecil, s.redup]}>
            Harga barang ({formatJumlah(d.jumlah, satuan)})
          </Text>
          <Text style={teks.kecil}>{formatRupiah(d.harga_barang)}</Text>
        </View>
        <View style={s.baris}>
          <Text style={[teks.kecil, s.redup]}>Ongkir (dibagi batch)</Text>
          <Text style={teks.kecil}>{formatRupiah(d.ongkir)}</Text>
        </View>
        <View style={s.baris}>
          <Text style={[teks.kecil, s.redup]}>Biaya platform</Text>
          <Text style={teks.kecil}>{formatRupiah(d.platform_fee)}</Text>
        </View>
        <View style={s.pisah} />
        <View style={s.baris}>
          <Text style={teks.bodyMedium}>Total</Text>
          <Text style={teks.bodyMedium}>{formatRupiah(d.total)}</Text>
        </View>
      </View>

      {!!bukti && (
        <Pressable
          onPress={() => router.push(`/bukti/${d.id}`)}
          style={({ pressed }) => [s.bukti, pressed && s.ditekan]}
        >
          <View style={s.buktiIkon}>
            <Feather name="shield" size={18} color={warna.hijau} />
          </View>
          <View style={s.info}>
            <Text style={s.buktiJudul}>Bukti serah terima</Text>
            <Text style={teks.mono}>{bukti.kode_bukti}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={warna.placeholder} />
        </Pressable>
      )}
    </Kartu>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  jarakSkeleton: { marginTop: spacing.md },
  daftarSkeleton: { gap: spacing.md, marginTop: spacing.xl },
  atas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  harga: { marginTop: 2 },
  progress: { marginTop: spacing.md },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },

  sorot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.skyTint,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  sorotIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sorotInfo: { flex: 1, minWidth: 0 },
  sorotJudul: { color: warna.navy },

  tajuk: { marginTop: spacing.xl, marginBottom: spacing.md },
  daftar: { gap: spacing.md },

  donaturBaris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTeks: { ...teks.bodyMedium, color: warna.putih },
  pisah: { height: 1, backgroundColor: warna.border, marginVertical: spacing.md },
  rincian: { gap: spacing.sm },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  redup: { color: warna.muted },

  bukti: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  buktiIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buktiJudul: { ...teks.bodyMedium, color: warna.hijau },
  ditekan: { opacity: 0.85 },
});
