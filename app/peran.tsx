import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, useMuncul } from '../components/ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import type { Peran } from '../lib/session';
import { useBahasa } from '../lib/i18n';
import type { Kunci } from '../lib/teks';

type Opsi = {
  peran: Peran;
  ikon: keyof typeof Feather.glyphMap;
  judul: Kunci;
  isi: Kunci;
};

// Urutan sama dengan urutan pitch: donatur dulu, itu POV yang dibuka juri.
const OPSI: Opsi[] = [
  { peran: 'donatur', ikon: 'heart', judul: 'peran.donatur', isi: 'peran.donaturIsi' },
  { peran: 'panti', ikon: 'home', judul: 'peran.panti', isi: 'peran.pantiIsi' },
];

// A1 — pilih peran. Bukan login: peran menentukan persona, /masuk yang
// mengganti akunnya. Bentuknya dipinjam dari sign-up biasa (pilih dulu, lalu
// Lanjut) supaya orang tahu harus apa tanpa dijelaskan.
export default function PilihPeran() {
  const router = useRouter();
  const { t } = useBahasa();
  const [dipilih, setDipilih] = useState<Peran | null>(null);

  const munculMerek = useMuncul();
  const munculPilihan = useMuncul(120);

  const lanjut = () => {
    if (!dipilih) return;
    router.push({ pathname: '/masuk', params: { peran: dipilih } });
  };

  return (
    <SafeAreaView style={s.layar} edges={['top', 'bottom']}>
      <View style={s.isi}>
        <Animated.View style={[s.merek, munculMerek]}>
          {/* Kanvas persegi, mark-nya lanskap di dalamnya — lihat catatan di app/index.tsx. */}
          <Image source={require('../assets/logo.png')} style={s.logo} resizeMode="contain" />
          <Text style={teks.wordmark}>Nyalur</Text>
          <Text style={[teks.subjudul, s.tagline]}>{t('splash.tagline')}</Text>
        </Animated.View>

        <Animated.View style={[s.pilihan, munculPilihan]}>
          <Text style={[teks.label, s.label]}>{t('peran.masukSebagai')}</Text>

          {OPSI.map((o) => {
            const aktif = dipilih === o.peran;
            return (
              <Pressable
                key={o.peran}
                onPress={() => setDipilih(o.peran)}
                style={({ pressed }) => [s.kartu, aktif && s.kartuAktif, pressed && s.ditekan]}
              >
                <View style={[s.ikon, aktif && s.ikonAktif]}>
                  <Feather name={o.ikon} size={20} color={aktif ? warna.putih : warna.biru} />
                </View>

                <View style={s.teksKartu}>
                  <Text style={teks.subjudul}>{t(o.judul)}</Text>
                  <Text style={[teks.caption, s.isiKartu]}>{t(o.isi)}</Text>
                </View>

                <View style={[s.radio, aktif && s.radioAktif]}>
                  {aktif && <Feather name="check" size={12} color={warna.putih} />}
                </View>
              </Pressable>
            );
          })}
        </Animated.View>
      </View>

      <View style={s.kaki}>
        <Tombol
          label={t('peran.lanjut')}
          varian="primer"
          ukuran="besar"
          disabled={!dipilih}
          onPress={lanjut}
        />
        <Text style={[teks.mikro, s.kakiTeks]}>{t('peran.kaki')}</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih },
  isi: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, gap: 36 },

  merek: { alignItems: 'center' },
  logo: { width: 88, height: 88, marginBottom: spacing.sm },
  tagline: { color: warna.muted, textAlign: 'center', marginTop: spacing.sm },

  pilihan: { gap: spacing.md },
  label: { marginBottom: spacing.xs },

  kartu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.kartu,
    borderWidth: 1,
    borderColor: warna.border,
    backgroundColor: warna.putih,
  },
  kartuAktif: { borderColor: warna.biru, backgroundColor: warna.skyTint },
  ditekan: { opacity: 0.9, transform: [{ scale: 0.99 }] },

  ikon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikonAktif: { backgroundColor: warna.biru },

  teksKartu: { flex: 1, gap: 2 },
  isiKartu: { lineHeight: 18 },

  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioAktif: { backgroundColor: warna.biru, borderColor: warna.biru },

  kaki: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, gap: spacing.md },
  kakiTeks: { textAlign: 'center' },
});
