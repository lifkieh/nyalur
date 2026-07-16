import { Stack } from 'expo-router';
import { warna } from '../../constants/theme';

// Bottom nav panti (C2) menyusul, sama seperti sisi donatur.
export default function LayoutPanti() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: warna.pageBg },
      }}
    />
  );
}
