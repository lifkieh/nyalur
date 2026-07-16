import { View, Text, Image, StyleSheet } from 'react-native';
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { warna } from '../../constants/theme';

type Props = {
  /** kalau ada, foto asli dipakai; kalau null, tampil kotak placeholder */
  url?: string | null;
  /** teks di tengah placeholder, mis. "foto panti" */
  label?: string;
  ukuran?: number;
  tinggi?: number;
  bulat?: number;
  style?: StyleProp<ViewStyle>;
};

export function FotoPlaceholder({ url, label, ukuran, tinggi, bulat, style }: Props) {
  const bentuk = {
    width: ukuran ?? '100%',
    height: tinggi ?? ukuran ?? 64,
    borderRadius: bulat ?? 10,
  } as const;

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[bentuk, style] as StyleProp<ImageStyle>}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[s.kotak, bentuk, style]}>
      {!!label && (
        <Text style={s.label} numberOfLines={2}>
          {label}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  kotak: {
    backgroundColor: warna.skyTint,
    borderWidth: 1,
    borderColor: warna.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: warna.placeholder,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});
