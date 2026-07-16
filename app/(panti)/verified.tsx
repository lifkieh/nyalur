import { useCallback, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Tombol } from '../../components/ui';
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
        <View style={s.ikon}>
          <Feather name="shield" size={46} color={warna.biru} />
        </View>

        <Text style={[teks.display, s.rata, s.judul]}>Panti terverifikasi</Text>
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
  layar: { flex: 1, backgroundColor: warna.putih, paddingHorizontal: 24 },
  pusat: { alignItems: 'center', justifyContent: 'center' },
  tengah: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ikon: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  rata: { textAlign: 'center' },
  judul: { fontSize: 26 },
  sub: { color: warna.muted, marginTop: spacing.sm, maxWidth: 280, lineHeight: 23 },
  kartu: {
    alignSelf: 'stretch',
    backgroundColor: warna.pageBg,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: 18,
    marginTop: 28,
  },
  plafon: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 28,
    letterSpacing: -0.28,
    color: warna.ink,
    marginTop: 4,
  },
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
