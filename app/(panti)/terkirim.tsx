import { View, Text, Pressable, ScrollView, Animated, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, useMuncul, useMunculPegas } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { formatJumlah, formatRupiah, terjemahHari } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useBahasa } from '../../lib/i18n';

// A7 — request terkirim. Kartu switch akun di bawah adalah engsel demo:
// dari sini juri melihat kebutuhan yang baru diajukan muncul di sisi donatur.
export default function RequestTerkirim() {
  const router = useRouter();
  const { daftarAkun, switchAkun } = useSession();
  const { t } = useBahasa();
  const { barang, jumlah, satuan, total, batch } = useLocalSearchParams<{
    requestId: string;
    barang: string;
    jumlah: string;
    satuan: string;
    total: string;
    batch?: string;
  }>();

  const porsi = formatJumlah(Number(jumlah) || 0, satuan ?? '');
  const jadwal = terjemahHari(batch ?? 'Jumat');

  const ikonMasuk = useMunculPegas(80);
  const isiMasuk = useMuncul(220);
  const aksiMasuk = useMuncul(340);

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
        <Animated.View style={[s.ikon, ikonMasuk]}>
          <Feather name="check-circle" size={44} color={warna.biru} />
        </Animated.View>

        <Animated.View style={[s.blok, isiMasuk]}>
          <Text style={[teks.display, s.rata]}>{t('terkirim.judul')}</Text>
          <Text style={[teks.body, s.rata, s.sub]}>{t('terkirim.pesan')}</Text>

          <View style={s.ringkas}>
            <Text style={teks.mikro}>{t('terkirim.ringkasan')}</Text>
            <Text style={[teks.subjudul, s.ringkasJudul]}>
              {barang} · {porsi}
            </Text>

            <View style={s.ringkasBaris}>
              <Text style={teks.caption}>{t('terkirim.estimasi')}</Text>
              <Text style={[teks.caption, s.nilai]}>{formatRupiah(Number(total) || 0)}</Text>
            </View>
            <View style={[s.ringkasBaris, s.tanpaGaris]}>
              <Text style={teks.caption}>{t('terkirim.batch')}</Text>
              <Text style={[teks.caption, s.nilai]}>{jadwal}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[s.aksi, aksiMasuk]}>
        <Tombol
          label={t('terkirim.keDashboard')}
          varian="sekunder"
          onPress={() => router.replace('/dashboard')}
        />

        {!!donatur && (
          <View style={s.switchKotak}>
            <Text style={[teks.mikro, s.switchLabel]}>{t('terkirim.beralih')}</Text>
            <Pressable
              onPress={beralih}
              style={({ pressed }) => [s.switchTombol, pressed && s.ditekan]}
            >
              <View style={s.avatar}>
                <Text style={s.avatarTeks}>{inisial}</Text>
              </View>
              <View style={s.switchInfo}>
                <Text style={teks.bodyMedium}>{donatur.nama}</Text>
                <Text style={teks.mikro}>{t('terkirim.donaturSub')}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={warna.biru} />
            </Pressable>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih },
  isi: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 60, paddingBottom: 40 },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ikon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  rata: { textAlign: 'center' },
  blok: { alignSelf: 'stretch', alignItems: 'center' },
  sub: { color: warna.muted, marginTop: spacing.sm, maxWidth: 300 },
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
    padding: spacing.xs,
  },
  switchLabel: { paddingHorizontal: spacing.sm, paddingTop: spacing.sm, paddingBottom: 6 },
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
  avatarTeks: { ...teks.bodyMedium, color: warna.putih },
  switchInfo: { flex: 1 },
});
