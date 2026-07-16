import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SheetSwitchAkun } from './SheetSwitchAkun';
import { Badge, Kartu, Tombol } from './ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useSession } from '../lib/session';

const LABEL_PERAN = { donatur: 'Donatur', panti: 'Pengurus panti' } as const;

/** Dipakai kedua persona — isinya ikut akun yang sedang aktif. */
export function LayarProfil() {
  const { akun } = useSession();
  const [switcher, setSwitcher] = useState(false);

  const inisial = akun.nama
    .replace(/^Panti\s+|^Rumah\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={s.layar} edges={['top']}>
      <View style={s.header}>
        <Text style={teks.judul}>Profil</Text>
      </View>

      <View style={s.isi}>
        <Kartu style={s.kartu}>
          <View style={[s.avatar, akun.peran === 'panti' ? s.avatarPanti : s.avatarDonatur]}>
            <Text style={s.avatarTeks}>{inisial}</Text>
          </View>
          <View style={s.info}>
            <Text style={teks.subjudul} numberOfLines={1}>
              {akun.nama}
            </Text>
            <Text style={teks.mikro}>{LABEL_PERAN[akun.peran]}</Text>
          </View>
          {akun.peran === 'panti' && <Badge label="Terverifikasi" varian="verified" />}
        </Kartu>

        <Tombol
          label="Ganti akun"
          varian="sekunder"
          ukuran="besar"
          onPress={() => setSwitcher(true)}
          ikon={<Feather name="repeat" size={17} color={warna.biru} />}
        />

        <Text style={[teks.mikro, s.catatan]}>
          Satu HP dipakai bergantian untuk demo — donatur dan panti.
        </Text>
      </View>

      <SheetSwitchAkun tampil={switcher} onTutup={() => setSwitcher(false)} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.pageBg },
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  isi: { padding: spacing.lg, gap: spacing.md },
  kartu: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDonatur: { backgroundColor: warna.biru },
  avatarPanti: { backgroundColor: warna.navy },
  avatarTeks: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16, color: warna.putih },
  info: { flex: 1, minWidth: 0 },
  catatan: { textAlign: 'center', marginTop: spacing.xs },
});
