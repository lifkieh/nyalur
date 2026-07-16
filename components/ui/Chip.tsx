import { Pressable, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, teks } from '../../constants/theme';

// aktif  = filter terpilih (biru solid)
// pasif  = filter tersedia (putih + border)
// tint   = chip informasi biru muda (kategori)
// netral = chip metadata abu (mis. "Sisa 3 kg")
type Varian = 'aktif' | 'pasif' | 'tint' | 'netral';

type Props = {
  label: string;
  varian?: Varian;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({ label, varian = 'pasif', onPress, style }: Props) {
  const warnaTeks =
    varian === 'aktif' ? warna.putih : varian === 'tint' ? warna.biru : warna.muted;

  const isi = (
    <Text style={[teks.caption, { color: warnaTeks }]} numberOfLines={1}>
      {label}
    </Text>
  );

  if (!onPress) {
    return <Pressable style={[s.dasar, s[varian], style]} disabled>{isi}</Pressable>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.dasar, s[varian], pressed && s.ditekan, style]}
    >
      {isi}
    </Pressable>
  );
}

const s = StyleSheet.create({
  dasar: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  aktif: { backgroundColor: warna.biru },
  pasif: { backgroundColor: warna.putih, borderColor: warna.border },
  tint: { backgroundColor: warna.skyTint },
  netral: { backgroundColor: warna.pageBg },
  ditekan: { opacity: 0.7 },
});
