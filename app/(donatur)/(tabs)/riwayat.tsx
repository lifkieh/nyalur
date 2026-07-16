import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../../../constants/theme';

// Placeholder — riwayat donasi masuk daftar P1, belum dibangun.
export default function Riwayat() {
  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Text style={teks.judul}>Riwayat</Text>
      </View>

      <View style={s.tengah}>
        <View style={s.ikon}>
          <Feather name="clock" size={28} color={warna.biru} />
        </View>
        <Text style={[teks.subjudul, s.rata]}>Belum ada riwayat</Text>
        <Text style={[teks.caption, s.rata, s.sub]}>
          Donasi yang sudah kamu salurkan akan tercatat di sini.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  ikon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  rata: { textAlign: 'center' },
  sub: { marginTop: spacing.xs, maxWidth: 260 },
});
