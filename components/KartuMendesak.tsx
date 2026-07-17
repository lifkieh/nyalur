import { View, Text, StyleSheet } from 'react-native';
import { Kartu, ProgressBar, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { formatAngka, rasio, sisa } from '../lib/format';
import type { Request } from '../lib/queries';

type Props = {
  kebutuhan: Request;
  namaPanti: string;
  onPress?: () => void;
};

export function KartuMendesak({ kebutuhan: k, namaPanti, onPress }: Props) {
  const kurang = sisa(k.jumlah_terpenuhi, k.jumlah_diminta);

  return (
    <Kartu onPress={onPress} rapat style={s.kartu}>
      <FotoPlaceholder url={k.katalog.foto_url} label={k.katalog.nama} tinggi={84} bulat={0} />
      <View style={s.isi}>
        <Text style={s.nama} numberOfLines={1}>
          {k.katalog.nama}
        </Text>
        <Text style={s.panti} numberOfLines={1}>
          {namaPanti}
        </Text>
        <View style={s.angka}>
          <Text style={s.mikro}>
            {formatAngka(k.jumlah_terpenuhi)}/{formatAngka(k.jumlah_diminta)} {k.katalog.satuan}
          </Text>
          <Text style={s.mikro}>sisa {formatAngka(kurang)}</Text>
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
