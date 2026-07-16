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
import { Tombol, FotoPlaceholder } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah } from '../lib/format';
import { GalatPlafon, type Katalog } from '../lib/queries';

const MAKS_QTY = 999;

type Props = {
  item: Katalog | null;
  sisaPlafon: number;
  onTutup: () => void;
  onAjukan: (jumlah: number) => Promise<void>;
};

export function SheetAturJumlah({ item, sisaPlafon, onTutup, onAjukan }: Props) {
  const [qty, setQty] = useState(1);
  const [kirim, setKirim] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!item) return;
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
  }, [item, anim]);

  const tutup = () => {
    if (kirim) return;
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => finished && onTutup());
  };

  const total = useMemo(() => qty * (item?.harga_per_satuan ?? 0), [qty, item]);

  if (!item) return null;

  const sisaSetelah = sisaPlafon - total;
  const lewat = sisaSetelah < 0;

  const ajukan = async () => {
    setKirim(true);
    setGalat(null);
    try {
      await onAjukan(qty);
    } catch (e) {
      // Penolakan plafon dijelaskan lengkap — ini guardrail yang sengaja
      // dipamerkan, bukan error biasa.
      if (e instanceof GalatPlafon) {
        setGalat(
          `Sistem menolak pengajuan ini: nilai kebutuhan ${formatRupiah(e.nilai)} melebihi sisa plafon bulan ini (${formatRupiah(e.sisa)}). Kurangi jumlahnya atau ajukan bulan depan.`
        );
      } else {
        setGalat(e instanceof Error ? e.message : String(e));
      }
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

        <ScrollView contentContainerStyle={s.isi}>
          <View style={s.kepala}>
            <FotoPlaceholder url={item.foto_url} label={item.nama} ukuran={60} bulat={12} />
            <View style={s.kepalaInfo}>
              <Text style={teks.title} numberOfLines={1}>
                {item.nama}
              </Text>
              <Text style={[teks.caption, s.kepalaMeta]}>
                {formatRupiah(item.harga_per_satuan)} / {item.satuan}
              </Text>
            </View>
          </View>

          <Text style={[teks.bodyMedium, s.tajuk]}>Jumlah</Text>

          <View style={s.stepper}>
            <Pressable
              onPress={() => setQty(Math.max(1, qty - 1))}
              disabled={qty <= 1}
              style={({ pressed }) => [s.tombolStep, qty <= 1 && s.stepMati, pressed && s.ditekan]}
              hitSlop={6}
            >
              <Feather name="minus" size={20} color={warna.ink} />
            </Pressable>

            <View style={s.qtyKotak}>
              <Text style={teks.display}>{qty}</Text>
              <Text style={teks.mikro}>× {item.satuan}</Text>
            </View>

            <Pressable
              onPress={() => setQty(Math.min(MAKS_QTY, qty + 1))}
              disabled={qty >= MAKS_QTY}
              style={({ pressed }) => [
                s.tombolStep,
                s.stepTambah,
                qty >= MAKS_QTY && s.stepMati,
                pressed && s.ditekan,
              ]}
              hitSlop={6}
            >
              <Feather name="plus" size={20} color={warna.biru} />
            </Pressable>
          </View>

          <View style={s.kartuHitung}>
            <View style={s.baris}>
              <Text style={teks.bodyMedium}>Total kebutuhan</Text>
              <Text style={teks.bodyMedium}>{formatRupiah(total)}</Text>
            </View>
            <View style={s.pisah} />
            <View style={s.baris}>
              <Text style={[teks.kecil, s.labelRedup]}>Sisa plafon sekarang</Text>
              <Text style={teks.kecil}>{formatRupiah(sisaPlafon)}</Text>
            </View>
            <View style={s.baris}>
              <Text style={[teks.kecil, s.labelRedup]}>Sisa plafon setelah ini</Text>
              <Text style={[teks.bodyMedium, lewat ? s.nilaiBahaya : s.nilaiBiru]}>
                {formatRupiah(sisaSetelah)}
              </Text>
            </View>
          </View>

          {lewat ? (
            <View style={s.kotakBahaya}>
              <Feather name="alert-triangle" size={16} color={warna.bahaya} style={s.ikonAtas} />
              <Text style={[teks.mikro, s.teksBahaya]}>
                Melebihi plafon bulan ini sebesar {formatRupiah(Math.abs(sisaSetelah))}. Sistem
                akan menolak pengajuan ini.
              </Text>
            </View>
          ) : (
            <View style={s.catatan}>
              <Feather name="info" size={15} color={warna.biru} style={s.ikonAtas} />
              <Text style={[teks.mikro, s.catatanTeks]}>
                Kebutuhan tidak boleh melebihi sisa plafon bulan ini.
              </Text>
            </View>
          )}

          {!!galat && (
            <View style={s.kotakBahaya}>
              <Feather name="x-circle" size={16} color={warna.bahaya} style={s.ikonAtas} />
              <Text style={[teks.mikro, s.teksBahaya]}>{galat}</Text>
            </View>
          )}

          <Tombol
            label="Ajukan kebutuhan ini"
            varian="primer"
            ukuran="besar"
            loading={kirim}
            onPress={ajukan}
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
  pegangan: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  peganganGaris: { width: 38, height: 4, borderRadius: radius.pill, backgroundColor: warna.border },
  isi: { padding: 20, paddingTop: spacing.sm, paddingBottom: 32 },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  kepalaInfo: { flex: 1, minWidth: 0 },
  kepalaMeta: { marginTop: 2 },
  tajuk: { marginBottom: 10 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  qtyKotak: { alignItems: 'center' },
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
  kartuHitung: {
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: 10,
  },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  labelRedup: { color: warna.muted },
  pisah: { height: 1, backgroundColor: warna.border },
  nilaiBiru: { color: warna.biru },
  nilaiBahaya: { color: warna.bahaya },
  catatan: { flexDirection: 'row', gap: spacing.sm, marginBottom: 18 },
  catatanTeks: { flex: 1, lineHeight: 18 },
  ikonAtas: { marginTop: 1 },
  kotakBahaya: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: warna.bahayaTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
    marginBottom: 18,
  },
  teksBahaya: { flex: 1, color: warna.bahaya, lineHeight: 18 },
});
