import { View, Text, StyleSheet } from 'react-native';
import { Kartu, Badge, FotoPlaceholder } from './ui';
import { spacing, teks } from '../constants/theme';
import { fotoPanti } from '../lib/gambar';
import { formatAngka, terjemahHari } from '../lib/format';
import { useBahasa } from '../lib/i18n';
import { requestAktif, type PantiDenganRequest } from '../lib/queries';

type Props = {
  panti: PantiDenganRequest;
  /** jarak_km diukur dari Tangsel dan tidak dihitung ulang — saat posisi donatur
   *  bukan di sana, kotanya yang tampil, bukan jarak yang sudah tidak berlaku. */
  tampilkanJarak?: boolean;
  onPress?: () => void;
};

export function KartuPanti({ panti, tampilkanJarak = true, onPress }: Props) {
  const { t, tn } = useBahasa();
  // Kartu etalase tidak menyebut kebutuhan sama sekali — itu isi B2. Di sini
  // cukup identitas panti supaya daftar terbaca sekali lihat.
  const batch = requestAktif(panti)[0]?.batch_kirim;

  return (
    <Kartu onPress={onPress} rapat>
      <View style={s.atas}>
        <FotoPlaceholder
          sumber={fotoPanti(panti)}
          url={panti.foto_url}
          label={t('umum.fotoPanti')}
          ukuran={64}
        />

        <View style={s.info}>
          <View style={s.judul}>
            <Text style={teks.subjudul} numberOfLines={1}>
              {panti.nama}
            </Text>
          </View>
          <Text style={teks.caption}>
            {tn('umum.anak', panti.jumlah_anak)} ·{' '}
            {tampilkanJarak ? `${formatAngka(panti.jarak_km)} km` : panti.kota}
          </Text>
          {/* Keduanya Badge, bukan Badge + Chip. Chip punya border dan teks
              caption, Badge tidak dan pakai mikro — bersebelahan tingginya
              selisih 8px dan barisnya terbaca miring. Dua penanda sebaris harus
              satu komponen. */}
          <View style={s.tanda}>
            <Badge label={t('umum.terverifikasi')} varian="verified" />
            {!!batch && (
              <Badge
                label={t('umum.batch', { hari: terjemahHari(batch) })}
                varian="netral"
                ikon="calendar"
              />
            )}
          </View>
        </View>
      </View>
    </Kartu>
  );
}

const s = StyleSheet.create({
  atas: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  info: { flex: 1, minWidth: 0, gap: 2 },
  judul: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tanda: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
});
