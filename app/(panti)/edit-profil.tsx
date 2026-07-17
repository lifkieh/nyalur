import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BarKembali, Kartu, Tombol, Skeleton, StatusLayar } from '../../components/ui';
import { warna, spacing, radius, teks } from '../../constants/theme';
import { useSession } from '../../lib/session';
import { useBahasa } from '../../lib/i18n';
import { getPantiById, simpanProfilPanti, MAKS_GALERI, type Panti } from '../../lib/queries';

// A8 — pengurus menyunting cerita & foto panti. Ini satu-satunya form di POV
// panti yang benar-benar menulis ke DB (A2 cuma menampilkan data verifikasi),
// jadi di sini state lokal boleh berbeda dari server sampai Simpan ditekan.
export default function EditProfil() {
  const router = useRouter();
  const { akun } = useSession();
  const { t } = useBahasa();

  const [panti, setPanti] = useState<Panti | null>(null);
  const [deskripsi, setDeskripsi] = useState('');
  const [sampul, setSampul] = useState<string | null>(null);
  const [galeri, setGaleri] = useState<string[]>([]);
  const [muat, setMuat] = useState(true);
  const [simpan, setSimpan] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const [izinDitolak, setIzinDitolak] = useState(false);

  const ambil = useCallback(async () => {
    if (!akun.pantiId) {
      setMuat(false);
      return;
    }
    try {
      setGalat(null);
      const p = await getPantiById(akun.pantiId);
      setPanti(p);
      setDeskripsi(p?.deskripsi ?? '');
      setSampul(p?.sampul ?? null);
      setGaleri(p?.galeri ?? []);
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
    } finally {
      setMuat(false);
    }
  }, [akun.pantiId]);

  // Sengaja bukan useFocusEffect yang mengambil ulang tiap fokus: layar ini
  // memegang ketikan yang belum disimpan, dan refetch akan menimpanya.
  useFocusEffect(
    useCallback(() => {
      if (!panti) ambil();
    }, [ambil, panti])
  );

  const sisaSlot = MAKS_GALERI - galeri.length;

  const mintaIzin = async () => {
    setIzinDitolak(false);
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) setIzinDitolak(true);
    return izin.granted;
  };

  // Sampul dipotong 16:9 saat dipilih. Bukan kosmetik: hero-nya memang 16:9, dan
  // memotongnya di sini berarti pengurus yang memutuskan bagian mana yang tampil,
  // bukan resizeMode="cover" yang memotong kepala orang secara acak.
  const pilihSampul = async () => {
    if (!(await mintaIzin())) return;
    const hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    if (hasil.canceled) return;
    setSampul(hasil.assets[0].uri);
  };

  const tambahFoto = async () => {
    if (!(await mintaIzin())) return;
    const hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: sisaSlot,
      quality: 0.7,
    });
    if (hasil.canceled) return;

    setGaleri((g) => [...g, ...hasil.assets.map((a) => a.uri)].slice(0, MAKS_GALERI));
  };

  const buangFoto = (uri: string) => setGaleri((g) => g.filter((x) => x !== uri));

  const kirim = async () => {
    if (!akun.pantiId) return;
    setSimpan(true);
    setGalat(null);
    try {
      await simpanProfilPanti({ pantiId: akun.pantiId, deskripsi, sampul, galeri });
      router.back();
    } catch (e) {
      setGalat(e instanceof Error ? e.message : String(e));
      setSimpan(false);
    }
  };

  if (muat) {
    return (
      <View style={s.layar}>
        <BarKembali judul={t('editProfil.judul')} onKembali={() => router.back()} />
        <View style={s.isi}>
          <Skeleton tinggi={64} />
          <Skeleton tinggi={120} />
          <Skeleton tinggi={160} />
        </View>
      </View>
    );
  }

  if (!panti) {
    return (
      <StatusLayar
        ikon="wifi-off"
        judul={t('panti.galat')}
        pesan={galat ?? t('panti.takAda')}
        aksiLabel={t('umum.kembaliBeranda')}
        onAksi={() => router.replace('/dashboard')}
      />
    );
  }

  return (
    <View style={s.layar}>
      <BarKembali judul={t('editProfil.judul')} onKembali={() => router.back()} disabled={simpan} />

      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={s.isi} keyboardShouldPersistTaps="handled">
          {/* Yang tidak bisa disunting ditampilkan, bukan disembunyikan — pengurus
              perlu tahu data ini ada dan dari mana asalnya. */}
          <Kartu style={s.kartuKunci}>
            <View style={s.kunciBaris}>
              <Feather name="lock" size={14} color={warna.placeholder} />
              <Text style={teks.bodyMedium} numberOfLines={1}>
                {panti.nama}
              </Text>
            </View>
            <Text style={teks.mikro}>{t('editProfil.terkunci')}</Text>
          </Kartu>

          <View style={s.bagian}>
            <Text style={teks.label}>{t('editProfil.tajukSampul')}</Text>
            <Text style={teks.caption}>{t('editProfil.sampulBantu')}</Text>

            {sampul ? (
              <View style={s.sampulIsi}>
                <Image source={{ uri: sampul }} style={s.sampulFoto} resizeMode="cover" />
                <View style={s.sampulAksi}>
                  <Pressable
                    onPress={pilihSampul}
                    style={({ pressed }) => [s.sampulTombol, pressed && s.ditekan]}
                  >
                    <Feather name="refresh-cw" size={13} color={warna.putih} />
                    <Text style={s.sampulTombolTeks}>{t('editProfil.gantiSampul')}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSampul(null)}
                    style={({ pressed }) => [s.sampulTombol, pressed && s.ditekan]}
                  >
                    <Feather name="trash-2" size={13} color={warna.putih} />
                    <Text style={s.sampulTombolTeks}>{t('editProfil.hapusSampul')}</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={pilihSampul}
                style={({ pressed }) => [s.sampulKosong, pressed && s.ditekan]}
              >
                <Feather name="image" size={22} color={warna.biru} />
                <Text style={[teks.bodyMedium, s.sampulKosongTeks]}>
                  {t('editProfil.pilihSampul')}
                </Text>
              </Pressable>
            )}
          </View>

          <View style={s.bagian}>
            <Text style={teks.label}>{t('editProfil.tajukFoto')}</Text>
            <Text style={teks.caption}>{t('editProfil.fotoBantu', { n: MAKS_GALERI })}</Text>

            <View style={s.grid}>
              {galeri.map((uri) => (
                <View key={uri} style={s.sel}>
                  <Image source={{ uri }} style={s.foto} resizeMode="cover" />
                  <Pressable
                    onPress={() => buangFoto(uri)}
                    hitSlop={6}
                    style={({ pressed }) => [s.buang, pressed && s.ditekan]}
                  >
                    <Feather name="x" size={13} color={warna.putih} />
                  </Pressable>
                </View>
              ))}

              {sisaSlot > 0 && (
                <Pressable
                  onPress={tambahFoto}
                  style={({ pressed }) => [s.sel, s.selTambah, pressed && s.ditekan]}
                >
                  <Feather name="plus" size={20} color={warna.biru} />
                  <Text style={s.tambahTeks}>{t('editProfil.tambahFoto')}</Text>
                </Pressable>
              )}
            </View>
          </View>

          {izinDitolak && (
            <View style={s.izin}>
              <Feather name="alert-circle" size={16} color={warna.muted} />
              <View style={s.izinTeks}>
                <Text style={teks.bodyMedium}>{t('editProfil.izinJudul')}</Text>
                <Text style={teks.mikro}>{t('editProfil.izinPesan')}</Text>
              </View>
            </View>
          )}

          <View style={s.bagian}>
            <Text style={teks.label}>{t('editProfil.tajukCerita')}</Text>
            <Text style={teks.caption}>{t('editProfil.ceritaBantu')}</Text>
            <TextInput
              value={deskripsi}
              onChangeText={setDeskripsi}
              placeholder={t('editProfil.ceritaContoh')}
              placeholderTextColor={warna.placeholder}
              multiline
              textAlignVertical="top"
              style={s.area}
            />
          </View>

          {!!galat && (
            <View style={s.galat}>
              <Feather name="alert-triangle" size={16} color={warna.bahaya} />
              <Text style={[teks.caption, s.galatTeks]}>{t('editProfil.galat')}</Text>
            </View>
          )}
        </ScrollView>

        <View style={s.kaki}>
          <Tombol
            label={t('editProfil.simpan')}
            varian="primer"
            ukuran="besar"
            loading={simpan}
            onPress={kirim}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  flex: { flex: 1 },
  isi: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xl },

  kartuKunci: { gap: 6 },
  kunciBaris: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  bagian: { gap: spacing.sm },

  sampulIsi: {
    position: 'relative',
    borderRadius: radius.kartu,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  sampulFoto: { width: '100%', aspectRatio: 16 / 9, backgroundColor: warna.skyTint },
  sampulAksi: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sampulTombol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: warna.fotoScrim,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  sampulTombolTeks: { ...teks.mikro, color: warna.putih },
  sampulKosong: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    aspectRatio: 16 / 9,
    marginTop: spacing.xs,
    borderRadius: radius.kartu,
    borderWidth: 1,
    borderColor: warna.biru,
    borderStyle: 'dashed',
    backgroundColor: warna.putih,
  },
  sampulKosongTeks: { color: warna.biru },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  sel: {
    width: 104,
    height: 104,
    borderRadius: radius.kartu,
    overflow: 'hidden',
    backgroundColor: warna.skyTint,
  },
  foto: { width: '100%', height: '100%' },
  ditekan: { opacity: 0.7 },
  buang: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: warna.fotoScrim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selTambah: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.biru,
    borderStyle: 'dashed',
  },
  tambahTeks: { ...teks.mikro, color: warna.biru, textAlign: 'center' },

  izin: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.md,
  },
  izinTeks: { flex: 1, gap: 2 },

  area: {
    ...teks.body,
    minHeight: 180,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.md,
    marginTop: spacing.xs,
    lineHeight: 22,
  },

  galat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: warna.bahayaTint,
    borderRadius: radius.tombol,
    padding: spacing.md,
  },
  galatTeks: { flex: 1, color: warna.bahaya },

  kaki: {
    backgroundColor: warna.putih,
    borderTopWidth: 1,
    borderTopColor: warna.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 28,
  },
});
