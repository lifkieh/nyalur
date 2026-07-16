import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Kartu, Tombol, FotoPlaceholder } from '../../components/ui';
import { warna, spacing, radius, teks, font } from '../../constants/theme';
import { formatJumlah, formatRupiah, sisa } from '../../lib/format';
import { useSession } from '../../lib/session';
import {
  buatDonasi,
  getRequestDenganDonasi,
  hitungBiaya,
  GalatOverfill,
  type Panti,
  type RequestDenganDonasi,
} from '../../lib/queries';

type Metode = 'qris' | 'va' | 'ewallet';

const METODE: { kunci: Metode; nama: string; keterangan: string; ikon: 'grid' | 'credit-card' | 'smartphone' }[] = [
  { kunci: 'qris', nama: 'QRIS', keterangan: 'Scan dari aplikasi bank atau e-wallet', ikon: 'grid' },
  { kunci: 'va', nama: 'Virtual Account', keterangan: 'BCA, BNI, Mandiri, BRI', ikon: 'credit-card' },
  { kunci: 'ewallet', nama: 'E-Wallet', keterangan: 'GoPay, OVO, DANA, ShopeePay', ikon: 'smartphone' },
];

const NAMA_METODE: Record<Metode, string> = { qris: 'QRIS', va: 'Virtual Account', ewallet: 'E-Wallet' };

// Payment gateway asli cukup di slide — di sini pembayaran disimulasikan
// (jeda singkat lalu sukses), tapi alur konfirmasinya lengkap: ringkasan
// pesanan, rincian biaya, pilih metode, baru Bayar.
const jedaMock = () => new Promise((r) => setTimeout(r, 1400));

export default function Pembayaran() {
  const { requestId, jumlah: jumlahParam } = useLocalSearchParams<{
    requestId: string;
    jumlah: string;
  }>();
  const router = useRouter();
  const { akun } = useSession();
  const [data, setData] = useState<(RequestDenganDonasi & { panti: Panti }) | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [metode, setMetode] = useState<Metode>('qris');
  const [kirim, setKirim] = useState(false);
  const [galatBayar, setGalatBayar] = useState<string | null>(null);

  const jumlah = Number(jumlahParam) || 0;

  const ambil = useCallback(async () => {
    if (!requestId) return;
    try {
      setGalat(null);
      setData(await getRequestDenganDonasi(requestId));
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [requestId]);

  // Sisa kebutuhan dibaca ulang dari server — porsi yang dipilih di sheet bisa
  // basi kalau donatur lain masuk duluan.
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

  if (galat || !data || !jumlah) {
    return (
      <View style={s.tengah}>
        <Text style={[teks.body, s.rata]}>{galat ?? 'Pesanan tidak ditemukan.'}</Text>
        <Tombol label="Kembali" varian="sekunder" penuh={false} onPress={kembali} />
      </View>
    );
  }

  const { katalog, panti } = data;
  const biaya = hitungBiaya(jumlah, katalog.harga_per_satuan);
  const sisaKini = sisa(data.jumlah_terpenuhi, data.jumlah_diminta);
  const kelebihan = jumlah > sisaKini;

  const bayar = async () => {
    setKirim(true);
    setGalatBayar(null);
    try {
      await jedaMock();
      const donasiId = await buatDonasi({
        requestId: data.id,
        jumlah,
        katalog,
        donatur: { id: akun.id, nama: akun.nama },
        panti: { nama: panti.nama },
      });
      router.replace({
        pathname: '/checkout',
        params: {
          donasiId,
          barang: katalog.nama,
          jumlah: String(jumlah),
          satuan: katalog.satuan,
          panti: panti.nama,
          batch: data.batch_kirim,
          total: String(biaya.total),
          metode: NAMA_METODE[metode],
        },
      });
    } catch (e) {
      if (e instanceof GalatOverfill) {
        setGalatBayar(
          `Donatur lain sudah mengisi kebutuhan ini — sisa tinggal ${formatJumlah(e.sisa, katalog.satuan)}. Kembali dan pilih ulang porsimu.`
        );
      } else {
        setGalatBayar(e instanceof Error ? e.message : String(e));
      }
      setKirim(false);
    }
  };

  return (
    <View style={s.layar}>
      <View style={s.bar}>
        <Pressable onPress={kembali} disabled={kirim} style={s.tombolKembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
        <Text style={teks.subjudul}>Pembayaran</Text>
      </View>

      <ScrollView contentContainerStyle={s.isi}>
        <Text style={[teks.label, s.tajuk]}>Pesananmu</Text>
        <Kartu style={s.pesanan}>
          <FotoPlaceholder url={katalog.foto_url} label={katalog.nama} ukuran={52} />
          <View style={s.pesananInfo}>
            <Text style={teks.bodyMedium} numberOfLines={1}>
              {katalog.nama} · {formatJumlah(jumlah, katalog.satuan)}
            </Text>
            <Text style={[teks.mikro, s.pesananSub]} numberOfLines={1}>
              ke {panti.nama}
            </Text>
            <View style={s.batch}>
              <Feather name="calendar" size={12} color={warna.biru} />
              <Text style={[teks.mikro, s.batchTeks]}>Batch {data.batch_kirim}</Text>
            </View>
          </View>
        </Kartu>

        <Text style={[teks.label, s.tajuk]}>Rincian biaya</Text>
        <Kartu style={s.rincian}>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>
              Harga barang ({formatJumlah(jumlah, katalog.satuan)})
            </Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.hargaBarang)}</Text>
          </View>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>Ongkir (dibagi batch)</Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.ongkir)}</Text>
          </View>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>Biaya platform</Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.platformFee)}</Text>
          </View>
          <View style={s.pisah} />
          <View style={s.baris}>
            <Text style={teks.bodyMedium}>Total bayar</Text>
            <Text style={teks.bodyMedium}>{formatRupiah(biaya.total)}</Text>
          </View>
        </Kartu>

        <Text style={[teks.label, s.tajuk]}>Metode pembayaran</Text>
        <View style={s.metodeDaftar}>
          {METODE.map((m) => {
            const aktif = metode === m.kunci;
            return (
              <Pressable
                key={m.kunci}
                onPress={() => setMetode(m.kunci)}
                disabled={kirim}
                style={({ pressed }) => [
                  s.metode,
                  aktif && s.metodeAktif,
                  pressed && s.ditekan,
                ]}
              >
                <View style={[s.metodeIkon, aktif && s.metodeIkonAktif]}>
                  <Feather name={m.ikon} size={18} color={aktif ? warna.biru : warna.muted} />
                </View>
                <View style={s.metodeInfo}>
                  <Text style={teks.bodyMedium}>{m.nama}</Text>
                  <Text style={teks.mikro}>{m.keterangan}</Text>
                </View>
                <View style={[s.radio, aktif && s.radioAktif]}>
                  {aktif && <View style={s.radioIsi} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={s.catatan}>
          <Feather name="shield" size={15} color={warna.biru} style={s.catatanIkon} />
          <Text style={[teks.mikro, s.catatanTeks]}>
            Kamu membeli barang dari gudang Nyalur — tidak ada uang yang masuk ke rekening
            panti. Yang sampai ke panti adalah barangnya.
          </Text>
        </View>

        {kelebihan && (
          <View style={s.kotakBahaya}>
            <Feather name="alert-triangle" size={16} color={warna.bahaya} style={s.catatanIkon} />
            <Text style={[teks.mikro, s.teksBahaya]}>
              Sisa kebutuhan tinggal {formatJumlah(sisaKini, katalog.satuan)} — kembali dan
              pilih ulang porsimu.
            </Text>
          </View>
        )}

        {!!galatBayar && (
          <View style={s.kotakBahaya}>
            <Feather name="x-circle" size={16} color={warna.bahaya} style={s.catatanIkon} />
            <Text style={[teks.mikro, s.teksBahaya]}>{galatBayar}</Text>
          </View>
        )}
      </ScrollView>

      <View style={s.kaki}>
        <View style={s.kakiTotal}>
          <Text style={teks.mikro}>Total bayar</Text>
          <Text style={s.kakiAngka}>{formatRupiah(biaya.total)}</Text>
        </View>
        <Tombol
          label={`Bayar ${formatRupiah(biaya.total)}`}
          varian="primer"
          ukuran="besar"
          loading={kirim}
          disabled={kelebihan}
          onPress={bayar}
        />
      </View>
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
  isi: { padding: spacing.lg, paddingBottom: spacing.xl },
  tajuk: { marginBottom: spacing.md, marginTop: spacing.sm },

  pesanan: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  pesananInfo: { flex: 1, minWidth: 0, gap: 2 },
  pesananSub: { marginBottom: 2 },
  batch: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  batchTeks: { color: warna.biru },

  rincian: { gap: 10, marginBottom: spacing.lg },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  redup: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },

  metodeDaftar: { gap: 10, marginBottom: spacing.lg },
  metode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: 14,
  },
  metodeAktif: { borderColor: warna.biru },
  ditekan: { opacity: 0.85 },
  metodeIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metodeIkonAktif: { backgroundColor: warna.skyTint },
  metodeInfo: { flex: 1, minWidth: 0, gap: 1 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioAktif: { borderColor: warna.biru },
  radioIsi: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
  },

  catatan: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  catatanIkon: { marginTop: 1 },
  catatanTeks: { flex: 1, lineHeight: 18 },
  kotakBahaya: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: warna.bahayaTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  teksBahaya: { flex: 1, color: warna.bahaya, lineHeight: 18 },

  kaki: {
    backgroundColor: warna.putih,
    borderTopWidth: 1,
    borderTopColor: warna.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 30,
    gap: spacing.md,
  },
  kakiTotal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kakiAngka: { fontFamily: font.medium, fontSize: 18, letterSpacing: -0.18, color: warna.ink },

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
