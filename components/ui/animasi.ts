import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Gerak halus saja — layar sukses & bukti terima diberi entrance ringan,
// bukan animasi ramai. Semua pakai Animated bawaan, tanpa dependency baru.

/** Fade + naik pelan saat konten pertama tampil. Spread ke style Animated.View. */
export function useMuncul(delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [anim, delay]);

  return {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }],
  };
}

/** Skala pegas untuk ikon momen penting (sukses, terverifikasi, diterima). */
export function useMunculPegas(delay = 0) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const jalan = Animated.spring(anim, {
      toValue: 1,
      delay,
      friction: 6,
      tension: 70,
      useNativeDriver: true,
    });
    jalan.start();
    return () => jalan.stop();
  }, [anim, delay]);

  return {
    opacity: anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 1, 1] }),
    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
  };
}

/** Lebar progress bar yang mengisi pelan ke nilai 0..1. Non-native driver: animasi layout. */
export function useIsiProgress(nilai: number) {
  const target = Math.min(1, Math.max(0, nilai || 0));
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [anim, target]);

  return anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
}
