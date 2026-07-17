import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BarKembali, Tombol, useMuncul } from '../components/ui';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useSession, type Peran } from '../lib/session';
import { useBahasa } from '../lib/i18n';
import type { Kunci } from '../lib/teks';

const LABEL_PERAN: Record<Peran, Kunci> = {
  donatur: 'umum.donatur',
  panti: 'umum.pengurusPanti',
};

// Donatur langsung ke etalase; panti lewat A2 dulu — alur demo tetap utuh.
const TUJUAN: Record<Peran, string> = {
  donatur: '/etalase',
  panti: '/daftar',
};

// A1b — layar masuk. Bentuknya login email biasa, isinya tidak: kredensial
// sudah terisi dan field-nya dikunci. Auth sungguhan tidak ada (lib/session.tsx),
// jadi form yang bisa diketik cuma akan bikin orang mengetik lalu ditolak.
export default function Masuk() {
  const router = useRouter();
  const { peran } = useLocalSearchParams<{ peran?: Peran }>();
  const { daftarAkun, switchAkun } = useSession();
  const { t } = useBahasa();
  const [muat, setMuat] = useState(false);

  const target: Peran = peran === 'panti' ? 'panti' : 'donatur';
  const indeks = daftarAkun.findIndex((a) => a.peran === target);
  const akun = daftarAkun[indeks >= 0 ? indeks : 0];

  const muncul = useMuncul();

  const masuk = () => {
    setMuat(true);
    // Jeda mock — tanpa ini tombolnya terasa seperti tautan, bukan login.
    setTimeout(() => {
      if (indeks >= 0) switchAkun(indeks);
      router.replace(TUJUAN[target]);
    }, 900);
  };

  return (
    <View style={s.layar}>
      <BarKembali judul={t('masuk.judul')} onKembali={() => router.back()} disabled={muat} />

      <Animated.View style={[s.isi, muncul]}>
        <View style={s.kepala}>
          <View style={[s.avatar, target === 'panti' ? s.avatarPanti : s.avatarDonatur]}>
            <Feather name={target === 'panti' ? 'home' : 'heart'} size={22} color={warna.putih} />
          </View>
          <Text style={[teks.judul, s.tajuk]}>{t('masuk.tajuk')}</Text>
          <Text style={[teks.body, s.sub]}>
            {t('masuk.sub', { peran: t(LABEL_PERAN[target]).toLowerCase() })}
          </Text>
        </View>

        <View style={s.form}>
          <Kolom label={t('masuk.email')} ikon="mail" nilai={akun.email} tanda={t('masuk.terisi')} />
          <Kolom label={t('masuk.sandi')} ikon="lock" nilai="demo1234" rahasia />
        </View>

        <View style={s.aksi}>
          <Tombol label={t('masuk.cta')} varian="primer" ukuran="besar" loading={muat} onPress={masuk} />
          <Pressable
            onPress={() => router.back()}
            disabled={muat}
            hitSlop={8}
            style={({ pressed }) => pressed && !muat && s.ditekan}
          >
            <Text style={[teks.kecil, s.ganti]}>{t('masuk.gantiPeran')}</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Text style={[teks.mikro, s.kaki]}>{t('masuk.kaki')}</Text>
    </View>
  );
}

/** Field login yang terlihat normal tapi dikunci — nilainya sudah benar. */
function Kolom({
  label,
  ikon,
  nilai,
  tanda,
  rahasia,
}: {
  label: string;
  ikon: keyof typeof Feather.glyphMap;
  nilai: string;
  tanda?: string;
  rahasia?: boolean;
}) {
  return (
    <View style={s.kolom}>
      <View style={s.kolomKepala}>
        <Text style={teks.label}>{label}</Text>
        {tanda && (
          <View style={s.pil}>
            <Text style={s.pilTeks}>{tanda}</Text>
          </View>
        )}
      </View>

      <View style={s.kotak}>
        <Feather name={ikon} size={16} color={warna.placeholder} />
        <TextInput
          value={nilai}
          editable={false}
          secureTextEntry={rahasia}
          style={s.input}
          selectTextOnFocus={false}
        />
        <Feather name="check" size={16} color={warna.biru} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  layar: { flex: 1, backgroundColor: warna.putih },
  isi: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 36, gap: 32 },

  kepala: { alignItems: 'center' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarDonatur: { backgroundColor: warna.biru },
  avatarPanti: { backgroundColor: warna.navy },
  tajuk: { textAlign: 'center' },
  sub: { color: warna.muted, textAlign: 'center', marginTop: spacing.sm, maxWidth: 300 },

  form: { gap: spacing.lg },
  kolom: { gap: 6 },
  kolomKepala: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pil: {
    backgroundColor: warna.skyTint,
    borderRadius: radius.pill,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
  },
  pilTeks: { ...teks.mikro, color: warna.biru },
  kotak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 50,
    paddingHorizontal: spacing.md,
    borderRadius: radius.tombol,
    borderWidth: 1,
    borderColor: warna.border,
    backgroundColor: warna.pageBg,
  },
  input: { ...teks.body, flex: 1, padding: 0 },

  aksi: { gap: spacing.lg },
  ganti: { color: warna.biru, textAlign: 'center' },
  ditekan: { opacity: 0.6 },

  kaki: { textAlign: 'center', paddingHorizontal: spacing.xl, paddingBottom: 32 },
});
