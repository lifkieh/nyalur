import { useCallback, useState } from 'react';
import { View, Text, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol, useMuncul, useMunculPegas } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { formatRupiah } from '../../lib/format';
import { useSession } from '../../lib/session';
import { getPantiById, PLAFON_PER_ANAK, type PantiDenganRequest } from '../../lib/queries';

// A3 — verifikasi instan. Di produksi masuk antrean 2×24 jam.
export default function Verified() {
  const router = useRouter();
  const { akun } = useSession();
  const [panti, setPanti] = useState<PantiDenganRequest | null>(null);
  const [muat, setMuat] = useState(true);

  // "Verifikasi instan" tetap perlu terasa seperti momen — perisai masuk
  // dengan pegas, kartu plafon menyusul.
  const ikonMasuk = useMunculPegas(80);
  const isiMasuk = useMuncul(220);

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setMuat(false);
      return;
    }
    try {
      setPanti(await getPantiById(akun.pantiId));
    } catch {
      // biarkan null — layar tetap tampil tanpa kartu plafon
    } finally {
      setMuat(false);
    }
  }, [akun.pantiId]);

  useFocusEffect(
    useCallback(() => {
      ambil();
    }, [ambil])
  );

  if (muat) {
    return (
      <View style={[s.layar, s.pusat]}>
        <ActivityIndicator color={warna.biru} />
      </View>
    );
  }

  return (
    <View style={s.layar}>
      <View style={s.tengah}>
        <Animated.View style={[s.ikon, ikonMasuk]}>
          <Feather name="shield" size={44} color={warna.biru} />
        </Animated.View>

        <Animated.View style={[s.blok, isiMasuk]}>
          <Text style={[teks.display, s.rata]}>Panti terverifikasi</Text>
          <Text style={[teks.body, s.rata, s.sub]}>
            Legalitas {panti?.nama ?? akun.nama} sudah dicek dan lolos verifikasi Nyalur.
          </Text>

          {!!panti && (
            <View style={s.kartu}>
              <Text style={teks.caption}>Plafon kebutuhan bulanan</Text>
              <Text style={s.plafon}>{formatRupiah(panti.plafon_bulanan)}</Text>
              <View style={s.rumus}>
                <Feather name="info" size={15} color={warna.biru} />
                <Text style={[teks.caption, s.rumusTeks]}>
                  {panti.jumlah_anak} anak × {formatRupiah(PLAFON_PER_ANAK)} / anak / bulan
                </Text>
              </View>
            </View>
          )}
        </Animated.View>
      </View>

      <View style={s.aksi}>
        <Tombol
          label="Mulai ajukan kebutuhan"
          varian="primer"
          ukuran="besar"
          onPress={() => router.replace('/dashboard')}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: spacing.xl },
  pusat: { alignItems: 'center', justifyContent: 'center' },
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
  kartu: {
    alignSelf: 'stretch',
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  plafon: { ...teks.display, marginTop: 4 },
  rumus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: warna.skyTint,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.tombol,
    marginTop: spacing.md,
  },
  rumusTeks: { color: warna.biru, flex: 1 },
  aksi: { paddingBottom: 44 },
});
