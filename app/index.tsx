import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol } from '../components/ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useSession } from '../lib/session';

// A1 — pilih peran. Bukan login: tidak ada auth, peran menentukan persona.
export default function Onboarding() {
  const router = useRouter();
  const { daftarAkun, switchAkun } = useSession();

  const masuk = (peran: 'donatur' | 'panti', tujuan: string) => {
    const i = daftarAkun.findIndex((a) => a.peran === peran);
    if (i >= 0) switchAkun(i);
    router.replace(tujuan);
  };

  return (
    <View style={s.layar}>
      <View style={s.tengah}>
        <View style={s.logo}>
          <Feather name="download" size={36} color={warna.putih} />
        </View>
        <Text style={s.nama}>Nyalur</Text>
        <Text style={[teks.subjudul, s.tagline]}>Bantuan yang nyalur langsung.</Text>
      </View>

      <View style={s.aksi}>
        <Text style={[teks.caption, s.label]}>Masuk sebagai</Text>
        <Tombol
          label="Saya donatur"
          varian="primer"
          ukuran="besar"
          onPress={() => masuk('donatur', '/etalase')}
        />
        <Tombol
          label="Saya pengurus panti"
          varian="sekunder"
          ukuran="besar"
          onPress={() => masuk('panti', '/daftar')}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: 28 },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  nama: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 30,
    letterSpacing: -0.6,
    color: warna.ink,
  },
  tagline: { color: warna.muted, marginTop: spacing.sm },
  aksi: { paddingBottom: 44, gap: spacing.md },
  label: { textAlign: 'center', marginBottom: spacing.xs },
});
