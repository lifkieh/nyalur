import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, teks } from '../../constants/theme';

// verified = kredibilitas panti (biru)
// terkirim = status sukses (hijau — HANYA di sini)
// netral   = status proses (abu)
type Varian = 'verified' | 'terkirim' | 'netral';

const IKON: Record<Varian, keyof typeof Feather.glyphMap> = {
  verified: 'check-circle',
  terkirim: 'check',
  netral: 'clock',
};

type Props = {
  label: string;
  varian?: Varian;
  ikon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Badge({ label, varian = 'verified', ikon, style }: Props) {
  const warnaIsi =
    varian === 'terkirim' ? warna.hijau : varian === 'netral' ? warna.muted : warna.biru;

  return (
    <View style={[s.dasar, s[varian], style]}>
      <Feather name={ikon ?? IKON[varian]} size={13} color={warnaIsi} />
      <Text style={[teks.mikro, { color: warnaIsi }]}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  dasar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.badge,
    alignSelf: 'flex-start',
  },
  verified: { backgroundColor: warna.skyTint },
  terkirim: { backgroundColor: warna.hijauTint },
  netral: { backgroundColor: warna.pageBg },
});
