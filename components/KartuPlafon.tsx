import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah, formatBulanTahun } from '../lib/format';
import { PLAFON_PER_ANAK, sisaPlafon, type Panti } from '../lib/queries';

export function KartuPlafon({ panti }: { panti: Panti }) {
  const sisa = sisaPlafon(panti);
  const rasioTerpakai = panti.plafon_bulanan
    ? Math.min(1, panti.plafon_terpakai / panti.plafon_bulanan)
    : 0;

  return (
    <View style={s.kartu}>
      <View style={s.atas}>
        <Text style={s.labelRedup}>Plafon bulan ini</Text>
        <View style={s.chipBulan}>
          <Text style={s.chipBulanTeks}>{formatBulanTahun()}</Text>
        </View>
      </View>

      <View style={s.angka}>
        <Text style={s.sisa}>{formatRupiah(sisa)}</Text>
        <Text style={s.labelRedup}>sisa</Text>
      </View>

      <View style={s.track}>
        <View style={[s.isi, { width: `${rasioTerpakai * 100}%` }]} />
      </View>

      <View style={s.kaki}>
        <Text style={s.labelRedupKecil}>Terpakai {formatRupiah(panti.plafon_terpakai)}</Text>
        <Text style={s.labelRedupKecil}>Plafon {formatRupiah(panti.plafon_bulanan)}</Text>
      </View>

      <View style={s.catatan}>
        <Feather name="shield" size={14} color={warna.navyTeks} />
        <Text style={[s.labelRedupKecil, s.catatanTeks]}>
          Batas {formatRupiah(PLAFON_PER_ANAK)} / anak / bulan — mencegah penyalahgunaan
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  kartu: { backgroundColor: warna.navy, borderRadius: radius.kartu, padding: 20 },
  atas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelRedup: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: warna.navyTeks },
  labelRedupKecil: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: warna.navyTeks },
  chipBulan: {
    borderWidth: 1,
    borderColor: warna.navyBorder,
    borderRadius: radius.badge,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  chipBulanTeks: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: warna.navyTeks },
  angka: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: 10 },
  sisa: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 28,
    letterSpacing: -0.28,
    color: warna.putih,
  },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: warna.navyTrack,
    overflow: 'hidden',
    marginTop: 14,
  },
  isi: { height: '100%', borderRadius: radius.pill, backgroundColor: warna.biru },
  kaki: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  catatan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: warna.navyGaris,
  },
  catatanTeks: { flex: 1 },
});
