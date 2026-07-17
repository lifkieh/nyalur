import { View, Text, Animated, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useIsiProgress } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah, formatBulanTahun } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import { PLAFON_PER_ANAK, sisaPlafon, type Panti } from '../lib/queries';

export function KartuPlafon({ panti }: { panti: Panti }) {
  const { t } = useBahasa();
  const sisa = sisaPlafon(panti);
  const rasioTerpakai = panti.plafon_bulanan
    ? Math.min(1, panti.plafon_terpakai / panti.plafon_bulanan)
    : 0;
  const lebarTerpakai = useIsiProgress(rasioTerpakai);

  return (
    <View style={s.kartu}>
      <View style={s.atas}>
        <Text style={s.labelRedup}>{t('plafon.bulanIni')}</Text>
        <View style={s.chipBulan}>
          <Text style={s.chipBulanTeks}>{formatBulanTahun()}</Text>
        </View>
      </View>

      <View style={s.angka}>
        <Text style={s.sisa}>{formatRupiah(sisa)}</Text>
        <Text style={s.labelRedup}>{t('plafon.sisa')}</Text>
      </View>

      <View style={s.track}>
        <Animated.View style={[s.isi, { width: lebarTerpakai }]} />
      </View>

      <View style={s.kaki}>
        <Text style={s.labelRedupKecil}>
          {t('plafon.terpakai', { rp: formatRupiah(panti.plafon_terpakai) })}
        </Text>
        <Text style={s.labelRedupKecil}>
          {t('plafon.total', { rp: formatRupiah(panti.plafon_bulanan) })}
        </Text>
      </View>

      <View style={s.catatan}>
        <Feather name="shield" size={14} color={warna.navyTeks} />
        <Text style={[s.labelRedupKecil, s.catatanTeks]}>
          {t('plafon.catatan', { rp: formatRupiah(PLAFON_PER_ANAK) })}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  kartu: { backgroundColor: warna.navy, borderRadius: radius.kartu, padding: spacing.lg },
  atas: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelRedup: { ...teks.caption, color: warna.navyTeks },
  labelRedupKecil: { ...teks.mikro, color: warna.navyTeks },
  chipBulan: {
    borderWidth: 1,
    borderColor: warna.navyBorder,
    borderRadius: radius.badge,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  chipBulanTeks: { ...teks.mikro, color: warna.navyTeks },
  angka: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm },
  sisa: { ...teks.display, color: warna.putih },
  track: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: warna.navyTrack,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  isi: { height: '100%', borderRadius: radius.pill, backgroundColor: warna.biru },
  kaki: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  catatan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: warna.navyGaris,
  },
  catatanTeks: { flex: 1 },
});
