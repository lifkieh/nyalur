import { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import { warna, radius, spacing } from '../../constants/theme';

type Props = {
  lebar?: DimensionValue;
  tinggi?: number;
  bulat?: number;
  style?: StyleProp<ViewStyle>;
};

/** Balok abu berdenyut — pengganti spinner saat konten dimuat. */
export function Skeleton({ lebar = '100%', tinggi = 14, bulat = radius.badge, style }: Props) {
  const denyut = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(denyut, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(denyut, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [denyut]);

  return (
    <Animated.View
      style={[
        { width: lebar, height: tinggi, borderRadius: bulat, backgroundColor: warna.border },
        { opacity: denyut },
        style,
      ]}
    />
  );
}

/** Kerangka baris daftar: foto kecil + dua baris teks. */
export function SkeletonBaris() {
  return (
    <View style={s.kartu}>
      <View style={s.baris}>
        <Skeleton lebar={48} tinggi={48} bulat={10} />
        <View style={s.kolom}>
          <Skeleton lebar="70%" tinggi={13} />
          <Skeleton lebar="45%" tinggi={11} />
        </View>
      </View>
    </View>
  );
}

/** Kerangka kartu etalase/dashboard: foto + teks + progress bar. */
export function SkeletonKartuProgress() {
  return (
    <View style={s.kartu}>
      <View style={s.baris}>
        <Skeleton lebar={64} tinggi={64} bulat={10} />
        <View style={s.kolom}>
          <Skeleton lebar="65%" tinggi={14} />
          <Skeleton lebar="40%" tinggi={11} />
          <Skeleton lebar={96} tinggi={20} />
        </View>
      </View>
      <Skeleton tinggi={8} bulat={radius.pill} style={s.progress} />
    </View>
  );
}

const s = StyleSheet.create({
  kartu: {
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
  },
  baris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  kolom: { flex: 1, gap: 8 },
  progress: { marginTop: 14 },
});
