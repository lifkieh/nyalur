import { View, Text, StyleSheet } from 'react-native';
import { Kartu, Chip, Tombol, ProgressBar, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { formatRupiah, formatJumlah, labelProgress, rasio, sisa } from '../lib/format';
import type { Request } from '../lib/queries';

type Props = {
  kebutuhan: Request;
  onNyalur?: () => void;
};

export function BarisKebutuhan({ kebutuhan, onNyalur }: Props) {
  const { katalog, jumlah_terpenuhi, jumlah_diminta, batch_kirim } = kebutuhan;
  const nilai = rasio(jumlah_terpenuhi, jumlah_diminta);
  const kurang = sisa(jumlah_terpenuhi, jumlah_diminta);

  return (
    <Kartu>
      <View style={s.atas}>
        <FotoPlaceholder url={katalog.foto_url} label={katalog.nama} ukuran={56} />
        <View style={s.info}>
          <Text style={teks.subjudul} numberOfLines={1}>
            {katalog.nama}
          </Text>
          <Text style={[teks.caption, s.harga]}>
            {formatRupiah(katalog.harga_per_satuan)} / {katalog.satuan}
          </Text>
        </View>
      </View>

      <ProgressBar
        nilai={nilai}
        label={labelProgress(jumlah_terpenuhi, jumlah_diminta, katalog.satuan)}
        keterangan={`${Math.round(nilai * 100)}%`}
        style={s.progress}
      />

      <View style={s.chips}>
        <Chip label={`Sisa ${formatJumlah(kurang, katalog.satuan)}`} varian="pasif" />
        <Chip label={`Kirim ${batch_kirim}`} varian="pasif" />
      </View>

      <Tombol label="Nyalur" varian="primer" onPress={onNyalur} />
    </Kartu>
  );
}

const s = StyleSheet.create({
  atas: { flexDirection: 'row', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  harga: { marginTop: 2 },
  progress: { marginTop: 14 },
  chips: { flexDirection: 'row', gap: spacing.sm, marginVertical: 14 },
});
