import { View, Text, StyleSheet } from 'react-native';
import { Kartu, Badge, Chip, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { formatAngka } from '../lib/format';
import { requestAktif, type PantiDenganRequest } from '../lib/queries';

type Props = {
  panti: PantiDenganRequest;
  onPress?: () => void;
};

export function KartuPanti({ panti, onPress }: Props) {
  // Kartu etalase tidak menyebut kebutuhan sama sekali — itu isi B2. Di sini
  // cukup identitas panti supaya daftar terbaca sekali lihat.
  const batch = requestAktif(panti)[0]?.batch_kirim;

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
            {!!batch && <Chip label={`Batch ${batch}`} varian="netral" />}
          </View>
        </View>
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  atas: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  info: { flex: 1, minWidth: 0, gap: 2 },
  judul: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tanda: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
});
