import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { warna, radius, teks } from '../../constants/theme';

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
  const persen: `${number}%` = `${Math.min(100, Math.max(0, (nilai || 0) * 100))}%`;

  return (
    <View style={style}>
      {(label || keterangan) && (
        <View style={s.baris}>
          <Text style={teks.mikro}>{label}</Text>
          <Text style={teks.mikro}>{keterangan}</Text>
        </View>
      )}
      <View style={s.track}>
        <View
          style={[
            s.isi,
            { width: persen, backgroundColor: selesai ? warna.hijau : warna.biru },
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
