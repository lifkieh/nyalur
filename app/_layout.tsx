import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SessionProvider } from '../lib/session';
import { BahasaProvider } from '../lib/i18n';
import { warna } from '../constants/theme';

export default function RootLayout() {
  const [fontSiap] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  // Gate font sengaja kosong, bukan spinner: layar sesudahnya adalah splash
  // putih, jadi jeda ini menyatu dengannya. Spinner malah jadi kedip.
  if (!fontSiap) return <View style={s.muat} />;

  return (
    <BahasaProvider>
      <SessionProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: warna.pageBg },
          }}
        />
      </SessionProvider>
    </BahasaProvider>
  );
}

const s = StyleSheet.create({
  muat: { flex: 1, backgroundColor: warna.putih },
});
