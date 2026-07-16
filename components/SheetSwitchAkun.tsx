import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useSession, type Akun } from '../lib/session';

const inisial = (nama: string) =>
  nama
    .replace(/^Panti\s+|^Rumah\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

const LABEL_PERAN: Record<Akun['peran'], string> = {
  donatur: 'Donatur',
  panti: 'Pengurus panti',
};

const BERANDA: Record<Akun['peran'], string> = {
  donatur: '/etalase',
  panti: '/dashboard',
};

export function SheetSwitchAkun({ tampil, onTutup }: { tampil: boolean; onTutup: () => void }) {
  const router = useRouter();
  const { akun, daftarAkun, switchAkun } = useSession();
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

  const pilih = (i: number) => {
    const target = daftarAkun[i];
    if (target.id === akun.id) {
      tutup();
      return;
    }
    // Ganti persona dulu, baru pindah beranda — supaya layar tujuan langsung
    // membaca akun yang benar saat pertama render.
    switchAkun(i);
    tutup(() => router.replace(BERANDA[target.peran]));
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
          <Text style={teks.title}>Ganti akun</Text>
          <Text style={[teks.caption, s.sub]}>Satu HP, dua peran — tap untuk beralih.</Text>

          <View style={s.daftar}>
            {daftarAkun.map((a, i) => {
              const aktif = a.id === akun.id;
              return (
                <Pressable
                  key={a.id}
                  onPress={() => pilih(i)}
                  style={({ pressed }) => [s.baris, aktif && s.barisAktif, pressed && s.ditekan]}
                >
                  <View style={[s.avatar, a.peran === 'panti' ? s.avatarPanti : s.avatarDonatur]}>
                    <Text style={s.avatarTeks}>{inisial(a.nama)}</Text>
                  </View>

                  <View style={s.info}>
                    <View style={s.namaBaris}>
                      <Text style={teks.bodyMedium} numberOfLines={1}>
                        {a.nama}
                      </Text>
                      {a.peran === 'panti' && (
                        <Feather name="check-circle" size={14} color={warna.biru} />
                      )}
                    </View>
                    <Text style={teks.mikro}>{LABEL_PERAN[a.peran]}</Text>
                  </View>

                  {aktif ? (
                    <View style={s.tandaAktif}>
                      <Feather name="check" size={14} color={warna.putih} />
                    </View>
                  ) : (
                    <Feather name="chevron-right" size={20} color={warna.placeholder} />
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
  pegangan: { alignItems: 'center', paddingTop: 10, paddingBottom: 4 },
  peganganGaris: { width: 38, height: 4, borderRadius: radius.pill, backgroundColor: warna.border },
  isi: { paddingTop: 10, paddingHorizontal: 20, paddingBottom: 30 },
  sub: { marginTop: 2, marginBottom: spacing.lg },
  daftar: { gap: 10 },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: 14,
  },
  barisAktif: { borderColor: warna.biru },
  ditekan: { opacity: 0.85 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDonatur: { backgroundColor: warna.biru },
  avatarPanti: { backgroundColor: warna.navy },
  avatarTeks: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: warna.putih },
  info: { flex: 1, minWidth: 0 },
  namaBaris: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tandaAktif: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
