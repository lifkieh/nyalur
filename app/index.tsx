import { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMuncul, useMunculPegas } from '../components/ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useBahasa } from '../lib/i18n';

// Splash. Bukan layar tunggu — tidak ada yang dimuat di sini. Font sudah siap
// sebelum layar ini render (gate di _layout), jadi durasinya murni napas
// sebelum intro: brand mark mendarat, tagline menyusul.
const TAHAN_MS = 1700;

export default function Splash() {
  const router = useRouter();
  const { t } = useBahasa();

  const cincinMasuk = useMunculPegas(0);
  const logoMasuk = useMunculPegas(120);
  const namaMasuk = useMuncul(360);
  const taglineMasuk = useMuncul(500);

  useEffect(() => {
    const t = setTimeout(() => router.replace('/intro'), TAHAN_MS);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={s.layar}>
      <View style={s.tengah}>
        <View style={s.markBungkus}>
          <Animated.View style={[s.cincin, cincinMasuk]} />
          <Animated.Image
            source={require('../assets/logo.png')}
            style={[s.logo, logoMasuk]}
            resizeMode="contain"
          />
        </View>

        <Animated.Text style={[s.nama, namaMasuk]}>Nyalur</Animated.Text>
        <Animated.Text style={[teks.subjudul, s.tagline, taglineMasuk]}>
          {t('splash.tagline')}
        </Animated.Text>
      </View>

      <View style={s.kaki}>
        <Text style={teks.mikro}>{t('splash.kaki')}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: spacing.xl },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  markBungkus: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  // Satu-satunya ornamen di layar ini — tint tipis, bukan lingkaran biru penuh.
  cincin: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
  },
  // Mark-nya lanskap (±1,7:1) di dalam kanvas persegi, jadi kotak 104 memberinya
  // lebar ±100 dan tinggi ±58 — muat di cincin 132 tanpa menyentuh tepinya.
  logo: { width: 104, height: 104 },
  nama: { ...teks.wordmark },
  tagline: { color: warna.muted, marginTop: spacing.sm },
  kaki: { alignItems: 'center', paddingBottom: 44 },
});
