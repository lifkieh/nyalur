import { Stack } from 'expo-router';
import { warna } from '../../constants/theme';

// Bottom nav (C2) menyusul. Untuk sekarang stack polos.
export default function LayoutDonatur() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: warna.pageBg },
      }}
    />
  );
}
