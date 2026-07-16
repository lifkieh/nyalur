import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Tombol } from './Tombol';
import { warna, spacing, radius, teks } from '../../constants/theme';

type Props = {
  ikon?: keyof typeof Feather.glyphMap;
  judul: string;
  pesan?: string;
  aksiLabel?: string;
  onAksi?: () => void;
};

/** Keadaan kosong / galat seragam: lingkaran ikon + judul + pesan + aksi. */
export function StatusLayar({ ikon = 'inbox', judul, pesan, aksiLabel, onAksi }: Props) {
  return (
    <View style={s.tengah}>
      <View style={s.lingkar}>
        <Feather name={ikon} size={28} color={warna.biru} />
      </View>
      <Text style={[teks.subjudul, s.rata]}>{judul}</Text>
      {!!pesan && <Text style={[teks.caption, s.rata, s.pesan]}>{pesan}</Text>}
      {!!aksiLabel && !!onAksi && (
        <Tombol label={aksiLabel} varian="sekunder" penuh={false} onPress={onAksi} />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  tengah: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  lingkar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rata: { textAlign: 'center' },
  pesan: { maxWidth: 270, marginTop: -spacing.sm },
});
