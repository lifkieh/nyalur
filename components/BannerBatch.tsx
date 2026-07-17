import { View, Text, StyleSheet } from 'react-native';
import { warna, spacing, radius, teks } from '../constants/theme';
import { formatRupiah, formatTanggalPendek, jumatBerikutnya } from '../lib/format';
import { ONGKIR } from '../lib/queries';

type Props = {
  /** donatur berbeda yang sudah menyalurkan — dihitung dari baris donasi */
  donatur: number;
};

export function BannerBatch({ donatur }: Props) {
  return (
    <View style={s.banner}>
      <View style={s.cahaya} />
      <View style={s.isi}>
        <Text style={s.kepala}>Batch pengiriman berikutnya</Text>
        <Text style={s.tanggal}>
          {formatTanggalPendek(jumatBerikutnya())} · ongkir dibagi bersama
        </Text>

        <View style={s.statBaris}>
          <View>
            <Text style={s.statNilai}>{donatur}</Text>
            <Text style={s.statLabel}>donatur sudah menyalurkan</Text>
          </View>
          <View style={s.pisah} />
          <View>
            <Text style={s.statNilai}>{formatRupiah(ONGKIR)}</Text>
            <Text style={s.statLabel}>ongkir per orang</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    backgroundColor: warna.navy,
    borderRadius: radius.kartu,
    padding: 18,
    overflow: 'hidden',
  },
  cahaya: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(27,95,227,0.35)',
  },
  isi: { position: 'relative' },
  kepala: { ...teks.mikro, color: warna.navyTeks },
  tanggal: {
    ...teks.subjudul,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.19,
    color: warna.putih,
    marginTop: 4,
  },
  statBaris: { flexDirection: 'row', gap: 20, marginTop: 14 },
  statNilai: { ...teks.subjudul, fontSize: 20, lineHeight: 26, color: warna.putih },
  statLabel: { ...teks.mikro, fontSize: 11, lineHeight: 15, color: warna.navyTeks },
  pisah: { width: 1, backgroundColor: warna.navyTrack },
});
