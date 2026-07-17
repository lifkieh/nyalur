import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Tombol, Chip, ProgressBar, FotoPlaceholder } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { fotoKatalog } from '../lib/gambar';
import {
  formatRupiah,
  formatJumlah,
  labelProgress,
  rasio,
  sisa,
  terjemahHari,
} from '../lib/format';
import { useBahasa } from '../lib/i18n';
import { hitungBiaya, type Request } from '../lib/queries';

type Props = {
  kebutuhan: Request | null;
  namaPanti: string;
  onTutup: () => void;
  onNyalur: (jumlah: number) => Promise<void>;
};

export function SheetPilihPorsi({ kebutuhan, namaPanti, onTutup, onNyalur }: Props) {
  const { t, nb, sb } = useBahasa();
  const [qty, setQty] = useState(1);
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  const kurang = kebutuhan ? sisa(kebutuhan.jumlah_terpenuhi, kebutuhan.jumlah_diminta) : 0;
  const bisaNyalur = kurang > 0;
  // Stepper tetap ditahan di 1 supaya tidak pernah menampilkan "0 kg";
  // yang mencegah overfill adalah CTA yang mati saat sisa habis.
  const maks = Math.max(1, kurang);

  useEffect(() => {
    if (!kebutuhan) return;
    setQty(1);
    setGalat(null);
    setKirim(false);
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [kebutuhan, anim]);

  const tutup = () => {
    if (kirim) return;
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => finished && onTutup());
  };

  const biaya = useMemo(
    () => hitungBiaya(qty, kebutuhan?.katalog.harga_per_satuan ?? 0),
    [qty, kebutuhan]
  );

  if (!kebutuhan) return null;

  const { katalog } = kebutuhan;
  const satuan = sb(katalog);
  const setAman = (n: number) => setQty(Math.min(maks, Math.max(1, n)));

  const nyalur = async () => {
    setKirim(true);
    setGalat(null);
    try {
      await onNyalur(qty);
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
      setKirim(false);
    }
  };

  const geser = anim.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={tutup} statusBarTranslucent>
      <Animated.View style={[s.scrim, { opacity: anim }]}>
        <Pressable style={s.scrimTekan} onPress={tutup} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: geser }] }]}>
        <View style={s.pegangan}>
          <View style={s.peganganGaris} />
        </View>

        <ScrollView contentContainerStyle={s.isi} keyboardShouldPersistTaps="handled">
          <View style={s.kepala}>
            <FotoPlaceholder
              sumber={fotoKatalog(katalog)}
              url={katalog.foto_url}
              label={nb(katalog)}
              ukuran={60}
            />
            <View style={s.kepalaInfo}>
              <Text style={teks.title} numberOfLines={1}>
                {nb(katalog)}
              </Text>
              <Text style={[teks.caption, s.kepalaMeta]} numberOfLines={2}>
                {namaPanti} ·{' '}
                {t('umum.perSatuan', { rp: formatRupiah(katalog.harga_per_satuan), satuan })}
              </Text>
            </View>
          </View>

          <View style={s.kartuProgress}>
            <ProgressBar
              nilai={rasio(kebutuhan.jumlah_terpenuhi, kebutuhan.jumlah_diminta)}
              label={t('porsi.progress')}
              keterangan={labelProgress(
                kebutuhan.jumlah_terpenuhi,
                kebutuhan.jumlah_diminta,
                satuan
              )}
            />
          </View>

          <Text style={[teks.label, s.tajuk]}>{t('porsi.pilih')}</Text>

          <View style={s.stepper}>
            <Pressable
              onPress={() => setAman(qty - 1)}
              disabled={qty <= 1}
              style={({ pressed }) => [s.tombolStep, qty <= 1 && s.stepMati, pressed && s.ditekan]}
              hitSlop={6}
            >
              <Feather name="minus" size={20} color={warna.ink} />
            </Pressable>

            <Text style={teks.display}>{formatJumlah(qty, satuan)}</Text>

            <Pressable
              onPress={() => setAman(qty + 1)}
              disabled={qty >= maks}
              style={({ pressed }) => [
                s.tombolStep,
                s.stepTambah,
                qty >= maks && s.stepMati,
                pressed && s.ditekan,
              ]}
              hitSlop={6}
            >
              <Feather name="plus" size={20} color={warna.biru} />
            </Pressable>
          </View>

          <View style={s.cepat}>
            <Chip
              label={`1 ${satuan}`}
              varian={qty === 1 ? 'tint' : 'pasif'}
              onPress={() => setAman(1)}
              style={s.chipCepat}
            />
            {maks > 3 && (
              <Chip
                label={`3 ${satuan}`}
                varian={qty === 3 ? 'tint' : 'pasif'}
                onPress={() => setAman(3)}
                style={s.chipCepat}
              />
            )}
            <Chip
              label={t('porsi.penuhiSemua', { porsi: formatJumlah(maks, satuan) })}
              varian={qty === maks ? 'tint' : 'pasif'}
              onPress={() => setAman(maks)}
              style={s.chipCepat}
            />
          </View>

          <View style={s.kartuBiaya}>
            <View style={s.barisBiaya}>
              <Text style={[teks.kecil, s.labelBiaya]}>
                {t('biaya.hargaBarang', { porsi: formatJumlah(qty, satuan) })}
              </Text>
              <Text style={teks.kecil}>{formatRupiah(biaya.hargaBarang)}</Text>
            </View>
            <View style={s.barisBiaya}>
              <Text style={[teks.kecil, s.labelBiaya]}>{t('biaya.ongkir')}</Text>
              <Text style={teks.kecil}>{formatRupiah(biaya.ongkir)}</Text>
            </View>
            <View style={s.barisBiaya}>
              <Text style={[teks.kecil, s.labelBiaya]}>{t('biaya.platform')}</Text>
              <Text style={teks.kecil}>{formatRupiah(biaya.platformFee)}</Text>
            </View>
            <View style={s.pisah} />
            <View style={s.barisBiaya}>
              <Text style={teks.bodyMedium}>{t('biaya.total')}</Text>
              <Text style={teks.bodyMedium}>{formatRupiah(biaya.total)}</Text>
            </View>
          </View>

          <View style={s.catatan}>
            <Feather name="info" size={15} color={warna.biru} style={s.catatanIkon} />
            <Text style={[teks.mikro, s.catatanTeks]}>
              {t('porsi.catatan', { hari: terjemahHari(kebutuhan.batch_kirim) })}
            </Text>
          </View>

          {!bisaNyalur && (
            <View style={s.kotakPenuh}>
              <Feather name="check-circle" size={16} color={warna.hijau} style={s.catatanIkon} />
              <Text style={[teks.mikro, s.teksPenuh]}>{t('porsi.penuh')}</Text>
            </View>
          )}

          {!!galat && <Text style={[teks.mikro, s.galat]}>{galat}</Text>}

          <Tombol
            label={
              bisaNyalur
                ? t('porsi.cta', { porsi: formatJumlah(qty, satuan) })
                : t('porsi.ctaPenuh')
            }
            varian="primer"
            ukuran="besar"
            loading={kirim}
            disabled={!bisaNyalur}
            onPress={nyalur}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: warna.scrim },
  scrimTekan: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '92%',
    backgroundColor: warna.putih,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  pegangan: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  peganganGaris: {
    width: 38,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: warna.border,
  },
  isi: { padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: 32, gap: 0 },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  kepalaInfo: { flex: 1, minWidth: 0 },
  kepalaMeta: { marginTop: 2 },
  kartuProgress: {
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  tajuk: { marginBottom: spacing.sm },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  tombolStep: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    borderWidth: 1,
    borderColor: warna.border,
    backgroundColor: warna.putih,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTambah: { borderColor: warna.biru, backgroundColor: warna.skyTint },
  stepMati: { opacity: 0.4 },
  ditekan: { opacity: 0.7 },
  cepat: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  chipCepat: { flex: 1, alignItems: 'center' },
  kartuBiaya: {
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  barisBiaya: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  labelBiaya: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },
  catatan: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  catatanIkon: { marginTop: 1 },
  catatanTeks: { flex: 1, lineHeight: 18 },
  galat: { color: warna.bahaya, marginBottom: spacing.md },
  kotakPenuh: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: warna.hijauTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  teksPenuh: { flex: 1, color: warna.hijau, lineHeight: 18 },
});
