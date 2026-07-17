import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import {
  Kartu,
  Tombol,
  FotoPlaceholder,
  BarKembali,
  SkeletonBaris,
  Skeleton,
  StatusLayar,
} from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { fotoKatalog } from '../../lib/gambar';
import { formatJumlah, formatRupiah, sisa, terjemahHari } from '../../lib/format';
import { useBahasa } from '../../lib/i18n';
import type { Kunci } from '../../lib/teks';
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

// Nama & keterangan metode tinggal berupa kunci kamus: scope modul tidak punya
// akses hook, jadi kalimatnya baru diterjemahkan di dalam komponen.
const METODE: { kunci: Metode; nama: Kunci; keterangan: Kunci; ikon: 'grid' | 'credit-card' | 'smartphone' }[] = [
  { kunci: 'qris', nama: 'bayar.qris.nama', keterangan: 'bayar.qris.ket', ikon: 'grid' },
  { kunci: 'va', nama: 'bayar.va.nama', keterangan: 'bayar.va.ket', ikon: 'credit-card' },
  { kunci: 'ewallet', nama: 'bayar.ewallet.nama', keterangan: 'bayar.ewallet.ket', ikon: 'smartphone' },
];

const NAMA_METODE: Record<Metode, Kunci> = {
  qris: 'bayar.qris.nama',
  va: 'bayar.va.nama',
  ewallet: 'bayar.ewallet.nama',
};

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
  const { t, nb, sb } = useBahasa();
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
      <View style={s.layar}>
        <BarKembali judul={t('bayar.judul')} onKembali={kembali} />
        <View style={s.isi}>
          <SkeletonBaris />
          <Skeleton tinggi={130} bulat={12} style={s.jarakSkeleton} />
          <Skeleton tinggi={200} bulat={12} style={s.jarakSkeleton} />
        </View>
      </View>
    );
  }

  if (galat || !data || !jumlah) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul={t('bayar.galat')}
        pesan={galat ?? t('bayar.takAda')}
        aksiLabel={t('umum.kembali')}
        onAksi={kembali}
      />
    );
  }

  const { katalog, panti } = data;
  const satuan = sb(katalog);
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
          barang: nb(katalog),
          jumlah: String(jumlah),
          satuan,
          panti: panti.nama,
          batch: data.batch_kirim,
          total: String(biaya.total),
          metode: t(NAMA_METODE[metode]),
        },
      });
    } catch (e) {
      if (e instanceof GalatOverfill) {
        setGalatBayar(t('bayar.direbut', { porsi: formatJumlah(e.sisa, satuan) }));
      } else {
        setGalatBayar(e instanceof Error ? e.message : String(e));
      }
      setKirim(false);
    }
  };

  return (
    <View style={s.layar}>
      <BarKembali judul={t('bayar.judul')} onKembali={kembali} disabled={kirim} />

      <ScrollView contentContainerStyle={s.isi}>
        <Text style={[teks.label, s.tajuk]}>{t('bayar.pesananmu')}</Text>
        <Kartu style={s.pesanan}>
          <FotoPlaceholder
            sumber={fotoKatalog(katalog)}
            url={katalog.foto_url}
            label={nb(katalog)}
            ukuran={52}
          />
          <View style={s.pesananInfo}>
            <Text style={teks.bodyMedium} numberOfLines={1}>
              {nb(katalog)} · {formatJumlah(jumlah, satuan)}
            </Text>
            <Text style={[teks.mikro, s.pesananSub]} numberOfLines={1}>
              {t('umum.kePanti', { panti: panti.nama })}
            </Text>
            <View style={s.batch}>
              <Feather name="calendar" size={12} color={warna.biru} />
              <Text style={[teks.mikro, s.batchTeks]}>
                {t('umum.batch', { hari: terjemahHari(data.batch_kirim) })}
              </Text>
            </View>
          </View>
        </Kartu>

        <Text style={[teks.label, s.tajuk]}>{t('bayar.rincian')}</Text>
        <Kartu style={s.rincian}>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>
              {t('biaya.hargaBarang', { porsi: formatJumlah(jumlah, satuan) })}
            </Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.hargaBarang)}</Text>
          </View>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>{t('biaya.ongkir')}</Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.ongkir)}</Text>
          </View>
          <View style={s.baris}>
            <Text style={[teks.kecil, s.redup]}>{t('biaya.platform')}</Text>
            <Text style={teks.kecil}>{formatRupiah(biaya.platformFee)}</Text>
          </View>
          <View style={s.pisah} />
          <View style={s.baris}>
            <Text style={teks.bodyMedium}>{t('biaya.totalBayar')}</Text>
            <Text style={teks.bodyMedium}>{formatRupiah(biaya.total)}</Text>
          </View>
        </Kartu>

        <Text style={[teks.label, s.tajuk]}>{t('bayar.metode')}</Text>
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
                  <Text style={teks.bodyMedium}>{t(m.nama)}</Text>
                  <Text style={teks.mikro}>{t(m.keterangan)}</Text>
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
          <Text style={[teks.mikro, s.catatanTeks]}>{t('bayar.catatan')}</Text>
        </View>

        {kelebihan && (
          <View style={s.kotakBahaya}>
            <Feather name="alert-triangle" size={16} color={warna.bahaya} style={s.catatanIkon} />
            <Text style={[teks.mikro, s.teksBahaya]}>
              {t('bayar.kelebihan', { porsi: formatJumlah(sisaKini, satuan) })}
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
          <Text style={teks.mikro}>{t('biaya.totalBayar')}</Text>
          <Text style={s.kakiAngka}>{formatRupiah(biaya.total)}</Text>
        </View>
        <Tombol
          label={t('bayar.cta', { rp: formatRupiah(biaya.total) })}
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
  isi: { padding: spacing.lg, paddingBottom: spacing.xl },
  jarakSkeleton: { marginTop: spacing.lg },
  tajuk: { marginBottom: spacing.md, marginTop: spacing.sm },

  pesanan: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  pesananInfo: { flex: 1, minWidth: 0, gap: 2 },
  pesananSub: { marginBottom: 2 },
  batch: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  batchTeks: { color: warna.biru },

  rincian: { gap: spacing.sm, marginBottom: spacing.lg },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  redup: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },

  metodeDaftar: { gap: spacing.md, marginBottom: spacing.lg },
  metode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.md,
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
    paddingBottom: 32,
    gap: spacing.md,
  },
  kakiTotal: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kakiAngka: { ...teks.title },
});
