import { View, Text, StyleSheet } from 'react-native';
import { warna, spacing, font, teks } from '../../constants/theme';

export type Stat = { nilai: string; label: string };

type Props = {
  /** Angka utama — dapat lebar penuh. Taruh rupiah di sini. */
  utama: Stat;
  /** Dua angka pendukung, dibagi rata di bawahnya. */
  sisi: [Stat, Stat];
};

/**
 * Ringkasan angka di kartu profil — dipakai POV donatur dan panti.
 *
 * Tiga kolom sama lebar tidak dipakai lagi: rupiah tidak muat di sepertiga kartu
 * dan pecah jadi dua baris, sementara tetangganya satu baris — barisnya jadi
 * miring. Rupiah sekarang dapat baris sendiri, dan itu kebetulan juga urutan
 * yang benar: nilai yang tersalurkan memang angka utamanya, bukan salah satu
 * dari tiga yang setara.
 *
 * adjustsFontSizeToFit yang menutup sisanya: Rp999.999.999 pun tetap satu baris.
 */
export function RingkasanStat({ utama, sisi }: Props) {
  return (
    <View style={s.bungkus}>
      <View style={s.utama}>
        <Text style={s.utamaNilai} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.65}>
          {utama.nilai}
        </Text>
        <Text style={s.label}>{utama.label}</Text>
      </View>

      <View style={s.garis} />

      <View style={s.baris}>
        {sisi.map((st, i) => (
          <View key={st.label} style={s.selBungkus}>
            {i > 0 && <View style={s.pisah} />}
            <View style={s.sel}>
              <Text
                style={[s.nilai, s.tengah]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {st.nilai}
              </Text>
              <Text style={[s.label, s.tengah]} numberOfLines={2}>
                {st.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  bungkus: { gap: spacing.md },

  utama: { gap: 2 },
  utamaNilai: {
    fontFamily: font.bold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
    color: warna.ink,
  },

  garis: { height: 1, backgroundColor: warna.border },

  baris: { flexDirection: 'row' },
  selBungkus: { flex: 1, flexDirection: 'row' },
  sel: { flex: 1, minWidth: 0, gap: 2, alignItems: 'center' },
  nilai: { ...teks.subjudul, fontSize: 18, lineHeight: 24 },
  label: { ...teks.mikro, fontSize: 11, lineHeight: 15 },
  // alignItems saja tidak cukup: label yang pecah dua baris tetap rata kiri di
  // dalam kotaknya sendiri.
  tengah: { textAlign: 'center' },
  pisah: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: warna.border,
    marginHorizontal: spacing.md,
  },
});
