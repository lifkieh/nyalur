import { View, Text, StyleSheet } from 'react-native';
import { Kartu, Chip, Tombol, ProgressBar, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { fotoKatalog } from '../lib/gambar';
import { formatRupiah, formatJumlah, labelProgress, rasio, sisa, terjemahHari } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import type { Request } from '../lib/queries';

type Props = {
  kebutuhan: Request;
  onNyalur?: () => void;
};

export function BarisKebutuhan({ kebutuhan, onNyalur }: Props) {
  const { t, nb, sb } = useBahasa();
  const { katalog, jumlah_terpenuhi, jumlah_diminta, batch_kirim } = kebutuhan;
  const nilai = rasio(jumlah_terpenuhi, jumlah_diminta);
  const kurang = sisa(jumlah_terpenuhi, jumlah_diminta);
  const satuan = sb(katalog);

  return (
    <Kartu>
      <View style={s.atas}>
        <FotoPlaceholder
          sumber={fotoKatalog(katalog)}
          url={katalog.foto_url}
          label={nb(katalog)}
          ukuran={56}
        />
        <View style={s.info}>
          <Text style={teks.subjudul} numberOfLines={1}>
            {nb(katalog)}
          </Text>
          <Text style={[teks.caption, s.harga]}>
            {t('umum.perSatuan', { rp: formatRupiah(katalog.harga_per_satuan), satuan })}
          </Text>
        </View>
      </View>

      <ProgressBar
        nilai={nilai}
        label={labelProgress(jumlah_terpenuhi, jumlah_diminta, satuan)}
        keterangan={`${Math.round(nilai * 100)}%`}
        style={s.progress}
      />

      <View style={s.chips}>
        <Chip label={t('kebutuhan.sisa', { porsi: formatJumlah(kurang, satuan) })} varian="pasif" />
        <Chip label={t('kebutuhan.kirim', { hari: terjemahHari(batch_kirim) })} varian="pasif" />
      </View>

      <Tombol label={t('kebutuhan.nyalur')} varian="primer" onPress={onNyalur} />
    </Kartu>
  );
}

const s = StyleSheet.create({
  atas: { flexDirection: 'row', gap: spacing.md },
  info: { flex: 1, minWidth: 0 },
  harga: { marginTop: 2 },
  progress: { marginTop: spacing.md },
  chips: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.md },
});
