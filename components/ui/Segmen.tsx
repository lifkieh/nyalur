import { View, Text, Pressable, StyleSheet } from 'react-native';
import { warna, radius, spacing, teks } from '../../constants/theme';

type Opsi<T extends string> = { nilai: T; label: string };

type Props<T extends string> = {
  opsi: Opsi<T>[];
  nilai: T;
  onPilih: (v: T) => void;
};

/**
 * Tab dalam-halaman. Bukan pengganti bottom nav (C2) — itu pindah layar, ini
 * cuma menukar isi layar yang sama.
 */
export function Segmen<T extends string>({ opsi, nilai, onPilih }: Props<T>) {
  return (
    <View style={s.track}>
      {opsi.map((o) => {
        const aktif = o.nilai === nilai;
        return (
          <Pressable
            key={o.nilai}
            onPress={() => onPilih(o.nilai)}
            style={({ pressed }) => [s.segmen, aktif && s.segmenAktif, pressed && !aktif && s.ditekan]}
          >
            <Text style={[teks.bodyMedium, aktif ? s.teksAktif : s.teksPasif]} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  track: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.pill,
    padding: spacing.xs,
  },
  segmen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  segmenAktif: { backgroundColor: warna.biru },
  ditekan: { opacity: 0.6 },
  teksAktif: { color: warna.putih },
  teksPasif: { color: warna.muted },
});
