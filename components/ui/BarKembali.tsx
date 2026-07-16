import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../../constants/theme';

type Props = {
  judul: string;
  onKembali?: () => void;
  /** kunci tombol kembali selama transaksi berjalan */
  disabled?: boolean;
};

/** Bar atas seragam untuk layar push: tombol kembali bulat + judul. */
export function BarKembali({ judul, onKembali, disabled }: Props) {
  return (
    <View style={s.bar}>
      <Pressable
        onPress={onKembali}
        disabled={disabled}
        style={({ pressed }) => [s.tombol, pressed && !disabled && s.ditekan]}
        hitSlop={8}
      >
        <Feather name="chevron-left" size={20} color={warna.ink} />
      </Pressable>
      <Text style={teks.subjudul}>{judul}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingTop: 52,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  tombol: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ditekan: { opacity: 0.7, transform: [{ scale: 0.96 }] },
});
