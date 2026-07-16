import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Kartu, FotoPlaceholder } from './ui';
import { warna, spacing, radius, teks, font } from '../constants/theme';
import { formatRupiah } from '../lib/format';
import type { Katalog } from '../lib/queries';

export function KartuProduk({ item, onPress }: { item: Katalog; onPress?: () => void }) {
  return (
    <Kartu onPress={onPress} rapat style={s.kartu}>
      <FotoPlaceholder url={item.foto_url} label={item.nama} tinggi={96} bulat={0} />
      <View style={s.badan}>
        <Text style={[teks.kecil, s.nama]} numberOfLines={2}>
          {item.nama}
        </Text>
        <Text style={[teks.mikro, s.satuan]}>per {item.satuan}</Text>
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
  nama: { fontFamily: font.medium, lineHeight: 18 },
  satuan: { marginTop: 2 },
  kaki: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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
