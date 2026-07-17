import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol } from '../components/ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useBahasa } from '../lib/i18n';
import type { Kunci } from '../lib/teks';

type Slide = {
  kunci: string;
  ikon: keyof typeof Feather.glyphMap;
  label: Kunci;
  judul: Kunci;
  isi: Kunci;
  /** Slide bukti saja — hijau tetap milik momen barang sampai. */
  hijau?: boolean;
};

// Tiga pilar dari brief §4, urutannya sama dengan urutan pitch: kebutuhan
// terlihat -> yang berpindah barang -> ada buktinya.
const SLIDE: Slide[] = [
  {
    kunci: 'registry',
    ikon: 'list',
    label: 'intro.1.label',
    judul: 'intro.1.judul',
    isi: 'intro.1.isi',
  },
  {
    kunci: 'barang',
    ikon: 'shopping-bag',
    label: 'intro.2.label',
    judul: 'intro.2.judul',
    isi: 'intro.2.isi',
  },
  {
    kunci: 'bukti',
    ikon: 'shield',
    label: 'intro.3.label',
    judul: 'intro.3.judul',
    isi: 'intro.3.isi',
    hijau: true,
  },
];

export default function Intro() {
  const router = useRouter();
  const { t } = useBahasa();
  const { width } = useWindowDimensions();
  const gulir = useRef<ScrollView>(null);
  const [indeks, setIndeks] = useState(0);

  const akhir = indeks === SLIDE.length - 1;
  const kePeran = () => router.replace('/peran');

  const lanjut = () => {
    if (akhir) return kePeran();
    gulir.current?.scrollTo({ x: (indeks + 1) * width, animated: true });
  };

  const geser = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndeks(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={kePeran} hitSlop={10} style={({ pressed }) => pressed && s.ditekan}>
          <Text style={s.lewati}>{t('intro.lewati')}</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={gulir}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={geser}
        scrollEventThrottle={16}
      >
        {SLIDE.map((sl) => (
          <View key={sl.kunci} style={[s.slide, { width }]}>
            <View style={[s.ikon, sl.hijau && s.ikonHijau]}>
              <Feather name={sl.ikon} size={40} color={sl.hijau ? warna.hijau : warna.biru} />
            </View>

            <View style={[s.pil, sl.hijau && s.pilHijau]}>
              <Text style={[s.pilTeks, sl.hijau && s.pilTeksHijau]}>{t(sl.label)}</Text>
            </View>

            <Text style={[teks.judul, s.judul]}>{t(sl.judul)}</Text>
            <Text style={[teks.body, s.isi]}>{t(sl.isi)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={s.kaki}>
        <View style={s.titikBaris}>
          {SLIDE.map((sl, i) => (
            <View key={sl.kunci} style={[s.titik, i === indeks && s.titikAktif]} />
          ))}
        </View>

        <Tombol
          label={akhir ? t('intro.mulai') : t('intro.lanjut')}
          varian="primer"
          ukuran="besar"
          onPress={lanjut}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    minHeight: 40,
  },
  lewati: { ...teks.bodyMedium, color: warna.muted },
  ditekan: { opacity: 0.6 },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  ikon: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  ikonHijau: { backgroundColor: warna.hijauTint },
  pil: {
    backgroundColor: warna.skyTint,
    borderRadius: radius.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  pilHijau: { backgroundColor: warna.hijauTint },
  pilTeks: { ...teks.mikro, color: warna.biru },
  pilTeksHijau: { color: warna.hijau },
  judul: { textAlign: 'center', marginTop: spacing.lg },
  isi: {
    ...teks.body,
    color: warna.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.md,
    maxWidth: 320,
  },

  kaki: { paddingHorizontal: spacing.xl, paddingBottom: 44, gap: spacing.xl },
  titikBaris: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  titik: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: warna.border,
  },
  titikAktif: { width: 20, backgroundColor: warna.biru },
});
