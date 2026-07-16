import { View, Text, StyleSheet } from 'react-native';
import { Kartu, Badge, Chip, ProgressBar, FotoPlaceholder } from './ui';
import { warna, spacing, teks } from '../constants/theme';
import { formatAngka, labelProgress, rasio } from '../lib/format';
import { kebutuhanSorotan, type PantiDenganRequest } from '../lib/queries';

type Props = {
  panti: PantiDenganRequest;
  onPress?: () => void;
};

export function KartuPanti({ panti, onPress }: Props) {
  const sorotan = kebutuhanSorotan(panti);
  const terkirim = sorotan?.status === 'diterima';

  return (
    <Kartu onPress={onPress} rapat>
      <View style={s.atas}>
        <FotoPlaceholder url={panti.foto_url} label="foto panti" ukuran={64} />

        <View style={s.info}>
          <View style={s.judul}>
            <Text style={teks.subjudul} numberOfLines={1}>
              {panti.nama}
            </Text>
          </View>
          <Text style={teks.caption}>
            {panti.jumlah_anak} anak · {formatAngka(panti.jarak_km)} km
          </Text>
          <View style={s.tanda}>
            <Badge label="Terverifikasi" varian="verified" />
            {!!sorotan && <Chip label={`Batch ${sorotan.batch_kirim}`} varian="netral" />}
          </View>
        </View>
      </View>

      {!!sorotan && (
        <View style={s.bawah}>
          <View style={s.pisah} />
          <View style={s.barisKebutuhan}>
            <Text style={teks.kecil} numberOfLines={1}>
              {sorotan.katalog.nama}
            </Text>
            {terkirim ? (
              <Badge label="Terkirim" varian="terkirim" />
            ) : (
              <Text style={teks.mikro}>
                {labelProgress(
                  sorotan.jumlah_terpenuhi,
                  sorotan.jumlah_diminta,
                  sorotan.katalog.satuan
                )}
              </Text>
            )}
          </View>
          <ProgressBar
            nilai={rasio(sorotan.jumlah_terpenuhi, sorotan.jumlah_diminta)}
            selesai={terkirim}
          />
        </View>
      )}
    </Kartu>
  );
}

const s = StyleSheet.create({
  atas: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  info: { flex: 1, minWidth: 0, gap: 3 },
  judul: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tanda: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  bawah: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  pisah: { height: 1, backgroundColor: warna.border, marginBottom: spacing.md },
  barisKebutuhan: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: spacing.sm,
  },
});
