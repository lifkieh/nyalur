import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';
import { warna } from '../../constants/theme';

/**
 * Kerangka layar bertab. Enam layar memakainya: etalase, riwayat, profil,
 * dashboard, katalog, penerimaan.
 *
 * Menggantikan <SafeAreaView edges={['top']}>. SafeAreaView mewarnai area inset
 * dengan background layarnya sendiri, dan background layar itu pageBg — jadi
 * strip status bar tampil abu di atas header yang putih, dan sambungannya
 * kelihatan sebagai garis. Di sini insetnya jadi View sendiri berwarna putih,
 * menyatu dengan header di bawahnya sampai ke tepi atas HP.
 *
 * Isi di bawah header tetap pageBg lewat View pembungkus.
 */
export function LayarTab({ children }: { children: ReactNode }) {
  const inset = useSafeAreaInsets();

  return (
    <View style={s.layar}>
      <View style={[s.inset, { height: inset.top }]} />
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  inset: { backgroundColor: warna.putih },
});
