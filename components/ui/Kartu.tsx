import { View, Pressable, StyleSheet } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, spacing } from '../../constants/theme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  /** matikan padding bawaan kalau isi kartu perlu menempel tepi (mis. foto hero) */
  rapat?: boolean;
  /** background F8FAFC — untuk kartu di dalam kartu */
  isian?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Kartu({ children, onPress, rapat, isian, style }: Props) {
  const gaya = [
    s.dasar,
    isian ? s.isian : s.putih,
    !rapat && s.padding,
    style,
  ];

  if (!onPress) return <View style={gaya}>{children}</View>;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [...gaya, pressed && s.ditekan]}>
      {children}
    </Pressable>
  );
}

const s = StyleSheet.create({
  dasar: {
    borderRadius: radius.kartu,
    borderWidth: 1,
    borderColor: warna.border,
    overflow: 'hidden',
  },
  putih: { backgroundColor: warna.putih },
  isian: { backgroundColor: warna.pageBg },
  padding: { padding: spacing.lg },
  ditekan: { opacity: 0.9 },
});
