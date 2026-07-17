import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SheetSwitchAkun } from './SheetSwitchAkun';
import { SheetPilihBahasa } from './SheetPilihBahasa';
import { ProfilDonatur } from './ProfilDonatur';
import { ProfilPanti } from './ProfilPanti';
import { Badge, Kartu, LayarTab } from './ui';
import { warna, spacing, radius, teks, font } from '../constants/theme';
import { useSession } from '../lib/session';
import { BAHASA } from '../lib/bahasa';
import { useBahasa } from '../lib/i18n';

const LABEL_PERAN = { donatur: 'umum.donatur', panti: 'umum.pengurusPanti' } as const;

type BarisProps = {
  ikon: keyof typeof Feather.glyphMap;
  judul: string;
  sub: string;
  onPress: () => void;
};

function BarisMenu({ ikon, judul, sub, onPress }: BarisProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.baris, pressed && s.ditekan]}
    >
      <View style={s.barisIkon}>
        <Feather name={ikon} size={18} color={warna.biru} />
      </View>
      <View style={s.barisInfo}>
        <Text style={teks.bodyMedium}>{judul}</Text>
        <Text style={teks.mikro}>{sub}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={warna.placeholder} />
    </Pressable>
  );
}

/** Dipakai kedua persona — isinya ikut akun yang sedang aktif. */
export function LayarProfil() {
  const router = useRouter();
  const { akun } = useSession();
  const { bahasa, t } = useBahasa();
  const [switcher, setSwitcher] = useState(false);
  const [pilihBahasa, setPilihBahasa] = useState(false);

  const inisial = akun.nama
    .replace(/^Panti\s+|^Rumah\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

  // Fake auth tidak punya state "logged out" yang perlu dibersihkan — keluar
  // cuma memulangkan ke pilih peran. Sengaja lewat /peran, bukan '/': splash
  // punya timer auto-lanjut, mendarat di sana malah memantul ke intro.
  const keluar = () => router.replace('/peran');

  return (
    <LayarTab>
      <View style={s.header}>
        <Text style={teks.judulTab}>{t('profil.judul')}</Text>
      </View>

      <ScrollView contentContainerStyle={s.isi}>
        <Kartu style={s.kartuAkun}>
          <View style={[s.avatar, akun.peran === 'panti' ? s.avatarPanti : s.avatarDonatur]}>
            <Text style={s.avatarTeks}>{inisial}</Text>
          </View>
          <View style={s.info}>
            <Text style={[teks.subjudul, s.nama]} numberOfLines={1}>
              {akun.nama}
            </Text>
            <Text style={teks.mikro}>{t(LABEL_PERAN[akun.peran])}</Text>
          </View>
          {/* alignSelf center menimpa bawaan Badge (flex-start), yang bikin dia
              nempel ke atas walau barisnya sudah alignItems center. */}
          {akun.peran === 'panti' && (
            <Badge label={t('umum.terverifikasi')} varian="verified" style={s.badge} />
          )}
        </Kartu>

        {akun.peran === 'donatur' ? (
          <ProfilDonatur donaturId={akun.id} />
        ) : (
          <ProfilPanti pantiId={akun.pantiId} />
        )}

        <Text style={[teks.label, s.tajuk]}>{t('profil.akun')}</Text>

        <View style={s.menu}>
          <BarisMenu
            ikon="repeat"
            judul={t('profil.gantiAkun')}
            sub={t('profil.gantiAkunSub')}
            onPress={() => setSwitcher(true)}
          />

          <BarisMenu
            ikon="globe"
            judul={t('profil.bahasa')}
            sub={BAHASA.find((b) => b.kode === bahasa)?.nama ?? ''}
            onPress={() => setPilihBahasa(true)}
          />

          {akun.peran === 'panti' && (
            <BarisMenu
              ikon="edit-3"
              judul={t('profil.editProfil')}
              sub={t('profil.editProfilSub')}
              onPress={() => router.push('/edit-profil')}
            />
          )}

          {/* Jalan masuk ke A2 + A3 kapan saja. Tanpa ini, alur pendaftaran
              cuma bisa dilihat sekali di awal demo dan hilang setelah lewat. */}
          {akun.peran === 'panti' && (
            <BarisMenu
              ikon="file-text"
              judul={t('profil.daftarPanti')}
              sub={t('profil.daftarPantiSub')}
              onPress={() => router.push('/daftar')}
            />
          )}

          {/* Keluar tetap netral, bukan merah — di sistem ini merah cuma dipakai
              saat guardrail menolak sesuatu. */}
          <BarisMenu
            ikon="log-out"
            judul={t('profil.keluar')}
            sub={t('profil.keluarSub')}
            onPress={keluar}
          />
        </View>

        <Text style={[teks.mikro, s.catatan]}>{t('profil.catatan')}</Text>
      </ScrollView>

      <SheetSwitchAkun tampil={switcher} onTutup={() => setSwitcher(false)} />
      <SheetPilihBahasa tampil={pilihBahasa} onTutup={() => setPilihBahasa(false)} />
    </LayarTab>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: warna.putih,
    borderBottomWidth: 1,
    borderBottomColor: warna.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  isi: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },

  kartuAkun: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDonatur: { backgroundColor: warna.biru },
  avatarPanti: { backgroundColor: warna.navy },
  avatarTeks: { ...teks.bodyMedium, color: warna.putih },
  info: { flex: 1, minWidth: 0 },
  nama: { fontFamily: font.bold },
  badge: { alignSelf: 'center' },

  tajuk: { marginTop: spacing.sm },
  menu: { gap: spacing.md },
  baris: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: warna.putih,
    borderWidth: 1,
    borderColor: warna.border,
    borderRadius: radius.kartu,
    padding: spacing.md,
  },
  ditekan: { opacity: 0.85 },
  barisIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.tombol,
    backgroundColor: warna.skyTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barisInfo: { flex: 1, minWidth: 0, gap: 1 },

  catatan: { textAlign: 'center', marginTop: spacing.sm },
});
