import { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../constants/theme';
import { useBahasa } from '../lib/i18n';

/** Posisi bawaan: seluruh jangkauan gudang Nyalur. */
export const AREA_SEMUA = 'semua';

/**
 * Label satu opsi area. Nama kota datang dari data dan tidak diterjemahkan;
 * yang perlu kamus cuma posisi bawaannya. Butuh `t`, jadi dipanggil dari dalam
 * komponen — bukan lagi konstanta modul.
 */
export const useLabelArea = () => {
  const { t } = useBahasa();
  return (area: string) => (area === AREA_SEMUA ? t('area.semua') : area);
};

type Props = {
  tampil: boolean;
  area: string;
  /** kota tempat panti berada — diturunkan dari data, bukan daftar tetap */
  daftarKota: string[];
  onPilih: (area: string) => void;
  onTutup: () => void;
};

export function SheetPilihArea({ tampil, area, daftarKota, onPilih, onTutup }: Props) {
  const { t } = useBahasa();
  const labelArea = useLabelArea();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!tampil) return;
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 280,
      easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      useNativeDriver: true,
    }).start();
  }, [tampil, anim]);

  const tutup = (lalu?: () => void) => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      onTutup();
      lalu?.();
    });
  };

  const pilih = (nilai: string) => {
    if (nilai === area) return tutup();
    tutup(() => onPilih(nilai));
  };

  if (!tampil) return null;

  const geser = anim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });
  const opsi = [AREA_SEMUA, ...daftarKota];

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => tutup()} statusBarTranslucent>
      <Animated.View style={[s.scrim, { opacity: anim }]}>
        <Pressable style={s.scrimTekan} onPress={() => tutup()} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: geser }] }]}>
        <View style={s.pegangan}>
          <View style={s.peganganGaris} />
        </View>

        <View style={s.isi}>
          <Text style={teks.title}>{t('area.judul')}</Text>
          <Text style={[teks.caption, s.sub]}>{t('area.sub')}</Text>

          <View style={s.daftar}>
            {opsi.map((o) => {
              const aktif = o === area;
              return (
                <Pressable
                  key={o}
                  onPress={() => pilih(o)}
                  style={({ pressed }) => [s.baris, aktif && s.barisAktif, pressed && s.ditekan]}
                >
                  <View style={[s.ikon, aktif && s.ikonAktif]}>
                    <Feather
                      name={o === AREA_SEMUA ? 'globe' : 'map-pin'}
                      size={17}
                      color={aktif ? warna.biru : warna.muted}
                    />
                  </View>
                  <Text style={[teks.bodyMedium, s.nama]} numberOfLines={1}>
                    {labelArea(o)}
                  </Text>
                  {aktif && (
                    <View style={s.tandaAktif}>
                      <Feather name="check" size={13} color={warna.putih} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* jarak_km di data diukur dari Tangsel dan tidak dihitung ulang —
              jadi angkanya disembunyikan begitu posisimu pindah, bukan dibiarkan
              memajang jarak yang salah. Lihat brief §10: jarak hardcode. */}
          <View style={s.catatan}>
            <Feather name="info" size={14} color={warna.muted} style={s.catatanIkon} />
            <Text style={[teks.mikro, s.catatanTeks]}>{t('area.catatan')}</Text>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: warna.scrim },
  scrimTekan: { flex: 1 },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: warna.putih,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
  pegangan: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.xs },
  peganganGaris: { width: 38, height: 4, borderRadius: radius.pill, backgroundColor: warna.border },
  isi: { paddingTop: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: 32 },
  sub: { marginTop: 2, marginBottom: spacing.lg },
  daftar: { gap: spacing.sm },
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
  barisAktif: { borderColor: warna.biru },
  ditekan: { opacity: 0.85 },
  ikon: {
    width: 36,
    height: 36,
    borderRadius: radius.tombol,
    backgroundColor: warna.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ikonAktif: { backgroundColor: warna.skyTint },
  nama: { flex: 1, minWidth: 0 },
  tandaAktif: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: warna.biru,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catatan: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  catatanIkon: { marginTop: 1 },
  catatanTeks: { flex: 1, lineHeight: 17 },
});
