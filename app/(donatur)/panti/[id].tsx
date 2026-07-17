import { useCallback, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BarisKebutuhan } from '../../../components/BarisKebutuhan';
import { SheetPilihPorsi } from '../../../components/SheetPilihPorsi';
import {
  Badge,
  Kartu,
  FotoPlaceholder,
  Segmen,
  Skeleton,
  SkeletonKartuProgress,
  StatusLayar,
} from '../../../components/ui';
import { warna, spacing, radius, teks } from '../../../constants/theme';
import { fotoKatalog, fotoPanti } from '../../../lib/gambar';
import { formatAngka, formatJumlah, terjemahHari } from '../../../lib/format';
import { useBahasa } from '../../../lib/i18n';
import {
  getPantiById,
  requestAktif,
  type PantiDenganRequest,
  type Request,
} from '../../../lib/queries';

type Tab = 'profil' | 'kebutuhan';

export default function DetailPanti() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, nb, sb } = useBahasa();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [dipilih, setDipilih] = useState<Request | null>(null);
  // Buka di Profil, bukan Kebutuhan: urutan pitch-nya kenali dulu, baru danai.
  const [tab, setTab] = useState<Tab>('profil');

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

  // Donasi belum tercatat di sini — sheet hanya memilih porsi. Transaksi
  // terjadi di layar pembayaran (B4) setelah donatur menekan Bayar.
  const nyalur = async (jumlah: number) => {
    if (!dipilih) return;
    const requestId = dipilih.id;
    setDipilih(null);
    router.push({
      pathname: '/bayar',
      params: { requestId, jumlah: String(jumlah) },
    });
  };

  if (muat) {
    return (
      <View style={s.layar}>
        <Skeleton tinggi={220} bulat={0} />
        <View style={s.headerSkeleton}>
          <Skeleton lebar="70%" tinggi={18} />
          <Skeleton lebar="45%" tinggi={12} />
        </View>
        <View style={s.daftar}>
          <SkeletonKartuProgress />
          <SkeletonKartuProgress />
        </View>
      </View>
    );
  }

  if (galat || !panti) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul={t('panti.galat')}
        pesan={galat ?? t('panti.takAda')}
        aksiLabel={t('umum.kembaliBeranda')}
        onAksi={kembali}
      />
    );
  }

  const aktif = requestAktif(panti);
  const tersalurkan = (panti.request ?? []).filter((r) => r.status === 'diterima');
  const batch = aktif[0]?.batch_kirim;

  return (
    <ScrollView style={s.layar} contentContainerStyle={s.isiLayar}>
      <View style={s.hero}>
        <FotoPlaceholder
          sumber={fotoPanti(panti)}
          url={panti.foto_url}
          label={t('umum.fotoPanti')}
          tinggi={220}
          bulat={0}
        />
        <Pressable onPress={kembali} style={s.kembali} hitSlop={8}>
          <Feather name="chevron-left" size={20} color={warna.ink} />
        </Pressable>
      </View>

      <View style={s.header}>
        <View style={s.judul}>
          <Text style={teks.title} numberOfLines={2}>
            {panti.nama}
          </Text>
          <Badge label={t('umum.terverifikasi')} varian="verified" />
        </View>
        <Text style={teks.kecil}>
          {t('panti.metaJarak', {
            n: panti.jumlah_anak,
            kota: panti.kota,
            km: formatAngka(panti.jarak_km),
          })}
        </Text>
        {!!batch && (
          <View style={s.batch}>
            <Feather name="calendar" size={15} color={warna.biru} />
            <Text style={[teks.caption, s.batchTeks]}>
              {t('panti.batchBerikutnya', { hari: terjemahHari(batch) })}
            </Text>
          </View>
        )}

        <View style={s.tab}>
          <Segmen<Tab>
            nilai={tab}
            onPilih={setTab}
            opsi={[
              { nilai: 'profil', label: t('panti.tabProfil') },
              {
                nilai: 'kebutuhan',
                label: aktif.length
                  ? `${t('panti.tabKebutuhan')} · ${aktif.length}`
                  : t('panti.tabKebutuhan'),
              },
            ]}
          />
        </View>
      </View>

      {tab === 'profil' ? (
        <View style={s.daftar}>
          <Text style={teks.label}>{t('panti.galeri')}</Text>
          <Galeri foto={panti.galeri ?? []} kosong={t('panti.belumAdaFoto')} />

          <Text style={[teks.label, s.tajukKedua]}>{t('panti.tentang')}</Text>
          <Kartu>
            {panti.deskripsi ? (
              <Text style={[teks.body, s.cerita]}>{panti.deskripsi}</Text>
            ) : (
              <Text style={[teks.body, s.ceritaKosong]}>{t('panti.belumAdaCerita')}</Text>
            )}
          </Kartu>
          <Text style={[teks.mikro, s.sumberCerita]}>{t('panti.ditulisPengurus')}</Text>
        </View>
      ) : (
        <>
          <View style={s.daftar}>
            <Text style={teks.label}>{t('panti.kebutuhanAktif')}</Text>
            {aktif.map((r) => (
              <BarisKebutuhan key={r.id} kebutuhan={r} onNyalur={() => setDipilih(r)} />
            ))}
            {!aktif.length && (
              <View style={s.kosongAktif}>
                <Feather name="check-circle" size={16} color={warna.hijau} />
                <Text style={[teks.caption, s.kosongAktifTeks]}>{t('panti.semuaTerpenuhi')}</Text>
              </View>
            )}
          </View>

          {/* Transparansi publik (brief §6): kebutuhan yang sudah terpenuhi tetap
              terlihat, tidak hilang dari etalase. */}
          {!!tersalurkan.length && (
            <View style={s.daftarSelesai}>
              <Text style={teks.label}>{t('panti.sudahTersalurkan')}</Text>
              {tersalurkan.map((r) => (
                <Kartu key={r.id} style={s.barisSelesai}>
                  <FotoPlaceholder
                    sumber={fotoKatalog(r.katalog)}
                    url={r.katalog.foto_url}
                    label={nb(r.katalog)}
                    ukuran={44}
                  />
                  <View style={s.selesaiInfo}>
                    <Text style={teks.bodyMedium} numberOfLines={1}>
                      {nb(r.katalog)}
                    </Text>
                    <Text style={teks.mikro}>
                      {t('panti.terpenuhiPenuh', {
                        porsi: formatJumlah(r.jumlah_diminta, sb(r.katalog)),
                      })}
                    </Text>
                  </View>
                  <Badge label={t('panti.terkirim')} varian="terkirim" />
                </Kartu>
              ))}
            </View>
          )}
        </>
      )}

      <SheetPilihPorsi
        kebutuhan={dipilih}
        namaPanti={panti.nama}
        onTutup={() => setDipilih(null)}
        onNyalur={nyalur}
      />
    </ScrollView>
  );
}

/**
 * Galeri foto panti. Digulir mendatar, bukan grid: jumlah fotonya 0-6 dan
 * berubah-ubah, jadi grid selalu menyisakan sel bolong.
 */
function Galeri({ foto, kosong }: { foto: string[]; kosong: string }) {
  if (!foto.length) {
    return (
      <View style={s.galeriKosong}>
        <Feather name="image" size={18} color={warna.placeholder} />
        <Text style={[teks.caption, s.galeriKosongTeks]}>{kosong}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.galeri}
      style={s.galeriGulir}
    >
      {foto.map((uri) => (
        <Image key={uri} source={{ uri }} style={s.galeriFoto} resizeMode="cover" />
      ))}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  judul: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 6 },
  batch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: warna.skyTint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.tombol,
    alignSelf: 'flex-start',
  },
  batchTeks: { color: warna.biru },
  tab: { marginTop: spacing.lg },

  daftar: { padding: spacing.lg, gap: spacing.md },
  tajukKedua: { marginTop: spacing.sm },
  cerita: { lineHeight: 23 },
  ceritaKosong: { color: warna.muted },
  sumberCerita: { marginTop: -spacing.xs },

  galeriGulir: { marginHorizontal: -spacing.lg },
  galeri: { gap: spacing.md, paddingHorizontal: spacing.lg },
  galeriFoto: {
    width: 190,
    height: 140,
    borderRadius: radius.kartu,
    backgroundColor: warna.skyTint,
  },
  galeriKosong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 96,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.kartu,
    borderWidth: 1,
    borderColor: warna.border,
    borderStyle: 'dashed',
    backgroundColor: warna.putih,
  },
  galeriKosongTeks: { flex: 1 },
  daftarSelesai: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  barisSelesai: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  selesaiInfo: { flex: 1, minWidth: 0, gap: 2 },
  headerSkeleton: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  kosongAktif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
  },
  kosongAktifTeks: { flex: 1, color: warna.hijau },
});
