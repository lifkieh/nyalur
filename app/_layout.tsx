import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SessionProvider } from '../lib/session';
import { warna } from '../constants/theme';

export default function RootLayout() {
  const [fontSiap] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
  });

  if (!fontSiap) {
    return (
      <View style={s.muat}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: warna.pageBg },
        }}
      />
    </SessionProvider>
  );
}

const s = StyleSheet.create({
  muat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: warna.pageBg,
  },
});
