import { useCallback, useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Kartu, Tombol, BarKembali } from '../../components/ui';
import { warna, spacing, radius, teks, font } from '../../constants/theme';
import { useSession } from '../../lib/session';
import { getPantiById } from '../../lib/queries';

type Dokumen = { kunci: string; nama: string; berkas: string };

const DOKUMEN_TERUNGGAH: Dokumen[] = [
  { kunci: 'akta', nama: 'Akta yayasan', berkas: 'akta-yayasan.pdf' },
  { kunci: 'nib', nama: 'NIB', berkas: 'nib-2024.pdf' },
];

// A2 — form pendaftaran. Data panti sudah ada di seed, jadi layar ini tidak
// menulis apa pun: mengisi ulang panti yang sama akan menggandakan etalase dan
// memutus pantiId di sesi. Verifikasi instan disimulasikan di A3.
export default function DaftarPanti() {
  const router = useRouter();
  const { akun } = useSession();
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [anak, setAnak] = useState('');
  const [skTerunggah, setSkTerunggah] = useState(false);

  const isi = useCallback(async () => {
    if (!akun.pantiId) return;
    try {
      const p = await getPantiById(akun.pantiId);
      if (!p) return;
      setNama(p.nama);
      setAlamat(`${p.alamat}, ${p.kota}`);
      setAnak(String(p.jumlah_anak));
    } catch {
      // form tetap bisa diisi manual kalau panti gagal dimuat
    }
  }, [akun.pantiId]);

  useFocusEffect(
    useCallback(() => {
      isi();
    }, [isi])
  );

  const kembali = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <View style={s.layar}>
      <BarKembali judul="Daftar panti" onKembali={kembali} />

      <ScrollView contentContainerStyle={s.isi} keyboardShouldPersistTaps="handled">
        <View style={s.grup}>
          <View>
            <Text style={[teks.caption, s.label]}>Nama panti</Text>
            <TextInput value={nama} onChangeText={setNama} style={s.input} />
          </View>
          <View>
            <Text style={[teks.caption, s.label]}>Alamat</Text>
            <TextInput value={alamat} onChangeText={setAlamat} style={s.input} multiline />
          </View>
          <View>
            <Text style={[teks.caption, s.label]}>Jumlah penghuni</Text>
            <TextInput
              value={anak}
              onChangeText={setAnak}
              keyboardType="number-pad"
              style={s.input}
            />
          </View>
        </View>

        <Text style={[teks.caption, s.tajuk]}>Dokumen legalitas</Text>

        <View style={s.dokumen}>
          {DOKUMEN_TERUNGGAH.map((d) => (
            <Kartu key={d.kunci} style={s.baris}>
              <View style={s.ikonBerkas}>
                <Feather name="file-text" size={20} color={warna.biru} />
              </View>
              <View style={s.berkasInfo}>
                <Text style={[teks.kecil, s.berkasNama]}>{d.nama}</Text>
                <Text style={teks.mikro}>{d.berkas}</Text>
              </View>
              <View style={s.terunggah}>
                <Feather name="check" size={14} color={warna.hijau} />
                <Text style={[teks.mikro, s.terunggahTeks]}>Terunggah</Text>
              </View>
            </Kartu>
          ))}

          {skTerunggah ? (
            <Kartu style={s.baris}>
              <View style={s.ikonBerkas}>
                <Feather name="file-text" size={20} color={warna.biru} />
              </View>
              <View style={s.berkasInfo}>
                <Text style={[teks.kecil, s.berkasNama]}>SK Kemensos</Text>
                <Text style={teks.mikro}>sk-kemensos.pdf</Text>
              </View>
              <View style={s.terunggah}>
                <Feather name="check" size={14} color={warna.hijau} />
                <Text style={[teks.mikro, s.terunggahTeks]}>Terunggah</Text>
              </View>
            </Kartu>
          ) : (
            <Pressable
              onPress={() => setSkTerunggah(true)}
              style={({ pressed }) => [s.barisKosong, pressed && s.ditekan]}
            >
              <View style={s.ikonKosong}>
                <Feather name="upload" size={20} color={warna.muted} />
              </View>
              <View style={s.berkasInfo}>
                <Text style={[teks.kecil, s.berkasNama]}>SK Kemensos</Text>
                <Text style={teks.mikro}>Belum diunggah</Text>
              </View>
              <Text style={[teks.caption, s.unggah]}>Unggah</Text>
            </Pressable>
          )}
        </View>

        <Tombol
          label="Ajukan verifikasi"
          varian="primer"
          ukuran="besar"
          style={s.cta}
          onPress={() => router.push('/verified')}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  isi: { padding: spacing.lg, paddingBottom: 40 },
  grup: { gap: spacing.md },
  label: { marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.tombol,
    backgroundColor: warna.putih,
    padding: spacing.md,
    ...teks.body,
  },
  tajuk: { marginTop: spacing.lg, marginBottom: spacing.md },
  dokumen: { gap: 10 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: 14 },
  barisKosong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: warna.placeholder,
    borderRadius: radius.kartu,
    padding: 14,
  },
  ditekan: { opacity: 0.85 },
  ikonBerkas: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikonKosong: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  berkasInfo: { flex: 1, minWidth: 0 },
  berkasNama: { fontFamily: font.medium },
  terunggah: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  terunggahTeks: { color: warna.hijau },
  unggah: { color: warna.biru, fontFamily: font.medium },
  cta: { marginTop: spacing.lg },
});
