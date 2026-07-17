import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { warna, spacing, radius, teks } from '../constants/theme';
import {
  formatJumlah,
  formatRupiah,
  formatTanggalPendek,
  hariLagi,
  jumatBerikutnya,
  labelHariLagi,
} from '../lib/format';
import { useBahasa } from '../lib/i18n';
import { totalOngkir, type DonasiLengkap } from '../lib/queries';

type Props = {
  /** donasi milik donatur ini yang belum sampai — isi batch Jumat berikutnya */
  batch: DonasiLengkap[];
};

/**
 * Kartu batch. Isinya sengaja MILIK DONATUR INI, bukan agregat lintas panti.
 *
 * Versi lama memajang "N donatur sudah menyalurkan" (dihitung dari seluruh
 * donasi yang pernah ada, lintas panti, lintas waktu) di bawah tajuk "Batch
 * pengiriman berikutnya" — angka masa lalu di bawah tajuk masa depan, dan tidak
 * pernah menyebut panti mana. Ongkirnya pun konstanta ONGKIR yang dipajang
 * seolah hasil hitungan.
 *
 * Sekarang: kalau punya barang di jalan, kartu menyebut barangmu dan panti
 * tujuannya. Kalau belum, kartu menjelaskan cara kerja batching — jawaban brief
 * §5 atas pertanyaan ongkir, tayang permanen di layar.
 */
export function BannerBatch({ batch }: Props) {
  const { t, nb, sb } = useBahasa();
  const jumat = jumatBerikutnya();
  const sisa = labelHariLagi(hariLagi(jumat));
  const ada = batch.length > 0;

  return (
    <View style={s.banner}>
      <View style={s.cahaya} />
      <View style={s.isi}>
        <Text style={s.kepala}>{ada ? t('batch.kamu') : t('batch.berikutnya')}</Text>
        <Text style={s.tanggal}>
          {formatTanggalPendek(jumat)} · {sisa}
        </Text>

        {ada ? (
          <>
            <View style={s.daftar}>
              {batch.map((d) => (
                <View key={d.id} style={s.baris}>
                  <Feather name="package" size={14} color={warna.navyTeks} />
                  <Text style={s.barisTeks} numberOfLines={1}>
                    {nb(d.request.katalog)} {formatJumlah(d.jumlah, sb(d.request.katalog))}
                  </Text>
                  <Feather name="arrow-right" size={13} color={warna.navyTeks} />
                  <Text style={s.barisPanti} numberOfLines={1}>
                    {d.request.panti.nama}
                  </Text>
                </View>
              ))}
            </View>

            <View style={s.kaki}>
              <Text style={s.kakiTeks}>
                {t('batch.ongkirmu', { rp: formatRupiah(totalOngkir(batch)) })}
              </Text>
            </View>
          </>
        ) : (
          <Text style={s.jelas}>{t('batch.jelas')}</Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    backgroundColor: warna.navy,
    borderRadius: radius.kartu,
    padding: 18,
    overflow: 'hidden',
  },
  cahaya: {
    position: 'absolute',
    right: -24,
    top: -24,
    width: 120,
    height: 120,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(27,95,227,0.35)',
  },
  isi: { position: 'relative' },
  kepala: { ...teks.mikro, color: warna.navyTeks },
  tanggal: {
    ...teks.subjudul,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.19,
    color: warna.putih,
    marginTop: 4,
  },

  daftar: { gap: 7, marginTop: 14 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barisTeks: { ...teks.mikro, fontSize: 12, lineHeight: 16, color: warna.putih, flexShrink: 1 },
  barisPanti: { ...teks.mikro, fontSize: 12, lineHeight: 16, color: warna.navyTeks, flex: 1 },

  kaki: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: warna.navyGaris,
  },
  kakiTeks: { ...teks.mikro, fontSize: 11, lineHeight: 15, color: warna.navyTeks },

  jelas: { ...teks.mikro, fontSize: 12, lineHeight: 17, color: warna.navyTeks, marginTop: 10 },
});
