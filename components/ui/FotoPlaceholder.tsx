import { View, Text, Image, StyleSheet } from 'react-native';
import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { warna } from '../../constants/theme';

type Props = {
  /** aset lokal hasil require() — menang atas url; nol permintaan jaringan */
  sumber?: ImageSourcePropType;
  /** kalau ada, foto asli dipakai; kalau null, tampil kotak placeholder */
  url?: string | null;
  /** teks di tengah placeholder, mis. "foto panti" */
  label?: string;
  ukuran?: number;
  tinggi?: number;
  bulat?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Urutan jatuh: aset lokal -> url -> kotak berlabel.
 *
 * Aset lokal sengaja menang atas url. foto_url di DB masih menyimpan URL
 * placehold.co, dan menariknya lewat jaringan saat demo adalah risiko yang
 * justru mau dibuang (lihat lib/gambar.ts). Kolomnya tidak dihapus supaya skema
 * tetap utuh dan URL asli tetap bisa dipakai kalau suatu saat ada.
 */
export function FotoPlaceholder({ sumber, url, label, ukuran, tinggi, bulat, style }: Props) {
  const bentuk = {
    width: ukuran ?? '100%',
    height: tinggi ?? ukuran ?? 64,
    borderRadius: bulat ?? 10,
  } as const;

  const asal: ImageSourcePropType | null = sumber ?? (url ? { uri: url } : null);

  if (asal) {
    return (
      <Image
        source={asal}
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
