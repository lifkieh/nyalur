import { Pressable, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, spacing, teks } from '../../constants/theme';

type Varian = 'primer' | 'sekunder' | 'netral';
type Ukuran = 'sedang' | 'besar';

type Props = {
  label: string;
  onPress?: () => void;
  varian?: Varian;
  ukuran?: Ukuran;
  disabled?: boolean;
  loading?: boolean;
  ikon?: ReactNode;
  penuh?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Tombol({
  label,
  onPress,
  varian = 'primer',
  ukuran = 'sedang',
  disabled,
  loading,
  ikon,
  penuh = true,
  style,
}: Props) {
  const mati = disabled || loading;
  const warnaTeks = varian === 'primer' ? warna.putih : varian === 'sekunder' ? warna.biru : warna.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={mati}
      style={({ pressed }) => [
        s.dasar,
        ukuran === 'besar' ? s.besar : s.sedang,
        s[varian],
        penuh && s.penuh,
        pressed && !mati && s.ditekan,
        mati && s.mati,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={warnaTeks} />
      ) : (
        <View style={s.isi}>
          {ikon}
          <Text
            style={[
              ukuran === 'besar' ? teks.subjudul : teks.bodyMedium,
              { color: warnaTeks },
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  dasar: {
    borderRadius: radius.tombol,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  penuh: { alignSelf: 'stretch' },
  sedang: { paddingVertical: 13, paddingHorizontal: spacing.lg },
  besar: { paddingVertical: 15, paddingHorizontal: spacing.lg },
  isi: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  primer: { backgroundColor: warna.biru },
  sekunder: { backgroundColor: warna.putih, borderColor: warna.biru },
  netral: { backgroundColor: warna.putih, borderColor: warna.border },
  ditekan: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  mati: { opacity: 0.45 },
});
