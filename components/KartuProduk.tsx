import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Kartu, FotoPlaceholder } from './ui';
import { warna, spacing, radius, teks, font } from '../constants/theme';
import { fotoKatalog } from '../lib/gambar';
import { formatRupiah } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import type { Katalog } from '../lib/queries';

export function KartuProduk({ item, onPress }: { item: Katalog; onPress?: () => void }) {
  const { t, nb, sb } = useBahasa();

  return (
    <Kartu onPress={onPress} rapat style={s.kartu}>
      <FotoPlaceholder
        sumber={fotoKatalog(item)}
        url={item.foto_url}
        label={nb(item)}
        tinggi={96}
        bulat={0}
      />
      <View style={s.badan}>
        <Text style={[teks.kecil, s.nama]} numberOfLines={2}>
          {nb(item)}
        </Text>
        <Text style={[teks.mikro, s.satuan]}>{t('katalog.perSatuan', { satuan: sb(item) })}</Text>
        <View style={s.kaki}>
          <Text style={teks.bodyMedium}>{formatRupiah(item.harga_per_satuan)}</Text>
          <View style={s.tambah}>
            <Feather name="plus" size={17} color={warna.biru} />
          </View>
        </View>
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  kartu: { flex: 1 },
  badan: { padding: spacing.md },
  nama: { fontFamily: font.medium },
  satuan: { marginTop: 2 },
  kaki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  tambah: {
    width: 30,
    height: 30,
    borderRadius: radius.tombol,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
