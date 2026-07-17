import { View, Text, StyleSheet } from 'react-native';
import { Kartu, ProgressBar, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { fotoKatalog } from '../lib/gambar';
import { formatAngka, rasio, sisa } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import type { Request } from '../lib/queries';

type Props = {
  kebutuhan: Request;
  namaPanti: string;
  onPress?: () => void;
};

export function KartuMendesak({ kebutuhan: k, namaPanti, onPress }: Props) {
  const { t, nb, sb } = useBahasa();
  const kurang = sisa(k.jumlah_terpenuhi, k.jumlah_diminta);

  return (
    <Kartu onPress={onPress} rapat style={s.kartu}>
      {/* Foto katalog semuanya 1:1 (assets/foto/*.jpg). Kotaknya dulu 150x84,
          jadi resizeMode="cover" membuang 44% tinggi gambar — beras kepotong
          jadi pita. Kotaknya sekarang ikut sumbernya: lebar kartu 150 dikurangi
          border 1px kiri-kanan = 148, tingginya 148 juga. Nol yang terpotong. */}
      <FotoPlaceholder
        sumber={fotoKatalog(k.katalog)}
        url={k.katalog.foto_url}
        label={nb(k.katalog)}
        tinggi={148}
        bulat={0}
      />
      <View style={s.isi}>
        <Text style={s.nama} numberOfLines={1}>
          {nb(k.katalog)}
        </Text>
        <Text style={s.panti} numberOfLines={1}>
          {namaPanti}
        </Text>
        <View style={s.angka}>
          <Text style={s.mikro}>
            {formatAngka(k.jumlah_terpenuhi)}/{formatAngka(k.jumlah_diminta)} {sb(k.katalog)}
          </Text>
          <Text style={s.mikro}>{t('beranda.sisa', { n: formatAngka(kurang) })}</Text>
        </View>
        <ProgressBar nilai={rasio(k.jumlah_terpenuhi, k.jumlah_diminta)} />
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  kartu: { width: 150 },
  isi: { padding: 11 },
  nama: { ...teks.kecil, fontSize: 13, lineHeight: 18, fontFamily: teks.bodyMedium.fontFamily },
  panti: { ...teks.mikro, fontSize: 11, lineHeight: 15, marginTop: 1 },
  angka: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: 9,
    marginBottom: 5,
  },
  mikro: { ...teks.mikro, fontSize: 11, lineHeight: 15 },
});
