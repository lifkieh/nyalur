import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../constants/theme';
import { BAHASA } from '../lib/bahasa';
import { useBahasa } from '../lib/i18n';

export function SheetPilihBahasa({ tampil, onTutup }: { tampil: boolean; onTutup: () => void }) {
  const { bahasa, setBahasa, t } = useBahasa();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!tampil) return;
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [tampil, anim]);

  const tutup = (lalu?: () => void) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      onTutup();
      lalu?.();
    });
  };

  if (!tampil) return null;

  const geser = anim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => tutup()} statusBarTranslucent>
      <Animated.View style={[s.scrim, { opacity: anim }]}>
        <Pressable style={s.scrimTekan} onPress={() => tutup()} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: geser }] }]}>
        <View style={s.pegangan}>
          <View style={s.peganganGaris} />
        </View>

        <View style={s.isi}>
          <Text style={teks.title}>{t('bahasa.judul')}</Text>
          <Text style={[teks.caption, s.sub]}>{t('bahasa.sub')}</Text>

          <View style={s.daftar}>
            {BAHASA.map((b) => {
              const aktif = b.kode === bahasa;
              return (
                <Pressable
                  key={b.kode}
                  // Bahasa diganti SETELAH sheet menutup: mengganti saat sheet
                  // masih terbuka bikin teks di dalamnya berkedip ganti bahasa
                  // tepat saat ia beranimasi turun.
                  onPress={() => (aktif ? tutup() : tutup(() => setBahasa(b.kode)))}
                  style={({ pressed }) => [s.baris, aktif && s.barisAktif, pressed && s.ditekan]}
                >
                  <Text style={s.bendera}>{b.bendera}</Text>
                  <Text style={[teks.bodyMedium, s.nama]} numberOfLines={1}>
                    {b.nama}
                  </Text>
                  {aktif && (
                    <View style={s.tandaAktif}>
                      <Feather name="check" size={13} color={warna.putih} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
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
    backgroundColor: warna.putih,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  pegangan: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  peganganGaris: { width: 38, height: 4, borderRadius: radius.pill, backgroundColor: warna.border },
  isi: { paddingTop: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: 32 },
  sub: { marginTop: 2, marginBottom: spacing.lg },
  daftar: { gap: spacing.sm },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.md,
  },
  barisAktif: { borderColor: warna.biru },
  ditekan: { opacity: 0.85 },
  bendera: { fontSize: 24 },
  nama: { flex: 1, minWidth: 0 },
  tandaAktif: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
