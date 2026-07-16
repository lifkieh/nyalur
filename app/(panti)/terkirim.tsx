import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol } from '../../components/ui';
import { warna, spacing, radius, teks, font } from '../../constants/theme';
import { formatJumlah, formatRupiah } from '../../lib/format';
import { useSession } from '../../lib/session';

// A7 — request terkirim. Kartu switch akun di bawah adalah engsel demo:
// dari sini juri melihat kebutuhan yang baru diajukan muncul di sisi donatur.
export default function RequestTerkirim() {
  const router = useRouter();
  const { daftarAkun, switchAkun } = useSession();
  const { barang, jumlah, satuan, total, batch } = useLocalSearchParams<{
    requestId: string;
    barang: string;
    jumlah: string;
    satuan: string;
    total: string;
    batch?: string;
  }>();

  const porsi = formatJumlah(Number(jumlah) || 0, satuan ?? '');
  const jadwal = batch ?? 'Jumat';

  const indeksDonatur = daftarAkun.findIndex((a) => a.peran === 'donatur');
  const donatur = indeksDonatur >= 0 ? daftarAkun[indeksDonatur] : null;
  const inisial = (donatur?.nama ?? '')
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

  const beralih = () => {
    if (indeksDonatur < 0) return;
    switchAkun(indeksDonatur);
    router.replace('/etalase');
  };

  return (
    <ScrollView style={s.layar} contentContainerStyle={s.isi}>
      <View style={s.tengah}>
        <View style={s.ikon}>
          <Feather name="check-circle" size={42} color={warna.biru} />
        </View>

        <Text style={[teks.display, s.rata, s.judul]}>Kebutuhan diajukan</Text>
        <Text style={[teks.body, s.rata, s.sub]}>
          Kebutuhan ini sudah tayang di etalase donatur. Kamu akan dikabari saat ada yang
          menyalurkan.
        </Text>

        <View style={s.ringkas}>
          <Text style={teks.mikro}>Ringkasan</Text>
          <Text style={[teks.subjudul, s.ringkasJudul]}>
            {barang} · {porsi}
          </Text>

          <View style={s.ringkasBaris}>
            <Text style={teks.caption}>Estimasi biaya</Text>
            <Text style={[teks.caption, s.nilai]}>{formatRupiah(Number(total) || 0)}</Text>
          </View>
          <View style={[s.ringkasBaris, s.tanpaGaris]}>
            <Text style={teks.caption}>Batch pengiriman</Text>
            <Text style={[teks.caption, s.nilai]}>{jadwal}</Text>
          </View>
        </View>
      </View>

      <View style={s.aksi}>
        <Tombol
          label="Kembali ke dashboard"
          varian="sekunder"
          onPress={() => router.replace('/dashboard')}
        />

        {!!donatur && (
          <View style={s.switchKotak}>
            <Text style={[teks.mikro, s.switchLabel]}>Beralih akun untuk demo</Text>
            <Pressable
              onPress={beralih}
              style={({ pressed }) => [s.switchTombol, pressed && s.ditekan]}
            >
              <View style={s.avatar}>
                <Text style={s.avatarTeks}>{inisial}</Text>
              </View>
              <View style={s.switchInfo}>
                <Text style={teks.bodyMedium}>{donatur.nama}</Text>
                <Text style={teks.mikro}>Donatur · Tangerang Selatan</Text>
              </View>
              <Feather name="chevron-right" size={20} color={warna.biru} />
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih },
  isi: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ikon: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rata: { textAlign: 'center' },
  judul: { fontSize: 24 },
  sub: { color: warna.muted, marginTop: spacing.sm, maxWidth: 290, lineHeight: 23 },
  ringkas: {
    alignSelf: 'stretch',
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  ringkasJudul: { marginTop: 4 },
  ringkasBaris: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: warna.border,
  },
  tanpaGaris: { borderTopWidth: 0, paddingTop: 0, marginTop: spacing.sm },
  nilai: { color: warna.ink },
  aksi: { gap: spacing.md, marginTop: spacing.xl },
  switchKotak: {
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    backgroundColor: warna.pageBg,
    padding: 6,
  },
  switchLabel: { paddingHorizontal: 10, paddingTop: spacing.sm, paddingBottom: 6 },
  switchTombol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.tombol,
    padding: spacing.md,
  },
  ditekan: { opacity: 0.85 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTeks: { fontFamily: font.medium, fontSize: 15, color: warna.putih },
  switchInfo: { flex: 1 },
});
