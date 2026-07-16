import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tombol, Chip, Badge, ProgressBar, Kartu } from '../components/ui';
import { warna, spacing, teks } from '../constants/theme';
import { formatRupiah, labelProgress, rasio } from '../lib/format';
import { useSession } from '../lib/session';

// Sementara: pratinjau komponen dasar. Nanti diganti A1 Onboarding.
export default function Pratinjau() {
  const { akun } = useSession();

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <ScrollView contentContainerStyle={s.isi}>
        <View>
          <Text style={teks.judul}>Nyalur</Text>
          <Text style={teks.caption}>Komponen dasar · masuk sebagai {akun.nama}</Text>
        </View>

        <Text style={teks.label}>Tombol</Text>
        <Tombol label="Nyalur 1 kg" varian="primer" ukuran="besar" />
        <Tombol label="Bagikan" varian="sekunder" />
        <Tombol label="Lihat katalog" varian="netral" />
        <Tombol label="Memproses" varian="primer" loading />

        <Text style={teks.label}>Chip</Text>
        <View style={s.baris}>
          <Chip label="Terdekat" varian="aktif" />
          <Chip label="Pangan" varian="pasif" />
          <Chip label="Kebersihan" varian="tint" />
          <Chip label="Sisa 3 kg" varian="netral" />
        </View>

        <Text style={teks.label}>Badge</Text>
        <View style={s.baris}>
          <Badge label="Terverifikasi" varian="verified" />
          <Badge label="Diterima" varian="terkirim" />
          <Badge label="Dikemas" varian="netral" />
        </View>

        <Text style={teks.label}>Kartu + progress</Text>
        <Kartu>
          <View style={s.judulKartu}>
            <Text style={teks.subjudul}>Panti Harapan Bunda</Text>
            <Badge label="Terverifikasi" varian="verified" />
          </View>
          <Text style={teks.caption}>25 anak · 2,4 km · batch Jumat</Text>
          <View style={s.pisah} />
          <View style={s.barisRata}>
            <Text style={teks.kecil}>Beras premium</Text>
            <Text style={teks.mikro}>{formatRupiah(13000)} / kg</Text>
          </View>
          <ProgressBar
            nilai={rasio(7, 10)}
            label="Progress"
            keterangan={labelProgress(7, 10, 'kg')}
            style={s.progress}
          />
        </Kartu>

        <Kartu isian>
          <ProgressBar
            nilai={1}
            selesai
            label="Progress"
            keterangan={labelProgress(10, 10, 'kg')}
          />
        </Kartu>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isi: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl * 2 },
  baris: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  barisRata: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  judulKartu: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pisah: { height: 1, backgroundColor: warna.border, marginVertical: spacing.md },
  progress: { marginTop: spacing.sm },
});
