import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Badge, Chip, Kartu, ProgressBar, Tombol, FotoPlaceholder } from '../../../components/ui';
import { warna, spacing, radius, teks, font } from '../../../constants/theme';
import {
  formatJumlah,
  formatRupiah,
  formatTanggalJam,
  labelProgress,
  rasio,
} from '../../../lib/format';
import {
  getRequestDenganDonasi,
  jumlahDonatur,
  type DonasiMasuk,
  type Panti,
  type RequestDenganDonasi,
  type StatusDonasi,
} from '../../../lib/queries';

const STATUS: Record<StatusDonasi, { label: string; varian: 'netral' | 'terkirim' }> = {
  dikemas: { label: 'Dikemas', varian: 'netral' },
  dikirim: { label: 'Dikirim', varian: 'netral' },
  diterima: { label: 'Diterima', varian: 'terkirim' },
};

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
      <View style={s.tengah}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  if (galat || !data) {
    return (
      <View style={s.tengah}>
        <Text style={[teks.body, s.rata]}>{galat ?? 'Kebutuhan tidak ditemukan.'}</Text>
        <Tombol label="Kembali" varian="sekunder" penuh={false} onPress={kembali} />
      </View>
    );
  }

  const { katalog, donasi } = data;
  const nDonatur = jumlahDonatur(data);
  const totalMasuk = donasi.reduce((n, d) => n + d.jumlah, 0);

  return (
    <View style={s.layar}>
      <View style={s.bar}>
        <Pressable onPress={kembali} style={s.tombolKembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
        <Text style={teks.subjudul}>Detail penerimaan</Text>
      </View>

      <ScrollView contentContainerStyle={s.isi}>
        <Kartu>
          <View style={s.atas}>
            <FotoPlaceholder url={katalog.foto_url} label={katalog.nama} ukuran={56} bulat={10} />
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
  const st = STATUS[d.status];
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
            <Feather name="shield" size={17} color={warna.hijau} />
          </View>
          <View style={s.info}>
            <Text style={[teks.caption, s.buktiJudul]}>Bukti serah terima</Text>
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
  atas: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  harga: { marginTop: 2 },
  progress: { marginTop: 14 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginTop: 14 },

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
  daftar: { gap: 10 },

  donaturBaris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTeks: { fontFamily: font.medium, fontSize: 14, color: warna.putih },
  pisah: { height: 1, backgroundColor: warna.border, marginVertical: spacing.md },
  rincian: { gap: 10 },
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
    width: 34,
    height: 34,
    borderRadius: radius.tombol,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buktiJudul: { fontFamily: font.medium, color: warna.hijau },
  ditekan: { opacity: 0.85 },

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
