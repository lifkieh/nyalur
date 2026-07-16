import { View, Text, Animated, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, teks } from '../../constants/theme';
import { useIsiProgress } from './animasi';

type Props = {
  /** 0..1 */
  nilai: number;
  /** teks kiri, mis. "Progress" */
  label?: string;
  /** teks kanan, mis. "7 dari 10 kg" */
  keterangan?: string;
  /** hijau saat item sudah terkirim/diterima */
  selesai?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ nilai, label, keterangan, selesai, style }: Props) {
  const lebar = useIsiProgress(nilai);

  return (
    <View style={style}>
      {(label || keterangan) && (
        <View style={s.baris}>
          <Text style={teks.mikro}>{label}</Text>
          <Text style={teks.mikro}>{keterangan}</Text>
        </View>
      )}
      <View style={s.track}>
        <Animated.View
          style={[
            s.isi,
            { width: lebar, backgroundColor: selesai ? warna.hijau : warna.biru },
          ]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  baris: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    overflow: 'hidden',
  },
  isi: { height: '100%', borderRadius: radius.pill },
});
