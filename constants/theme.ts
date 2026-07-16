// Sumber tunggal warna & spacing. Jangan hardcode hex di komponen.

export const warna = {
  biru: '#1B5FE3',
  navy: '#0B2E6F',
  skyTint: '#EAF2FE',
  hijau: '#00B37E',
  hijauTint: 'rgba(0,179,126,0.10)',
  putih: '#FFFFFF',
  pageBg: '#F8FAFC',
  border: '#E2E8F0',
  ink: '#0F172A',
  muted: '#64748B',
  scrim: 'rgba(11,46,111,0.45)',
  placeholder: '#94A3B8',
} as const;

export const radius = {
  kartu: 12,
  tombol: 8,
  chip: 8,
  badge: 6,
  sheet: 20,
  pill: 99,
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const font = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
} as const;

// Skala tipografi dari design sheet — pakai spread ke <Text style={...}>
export const teks = {
  display: { fontFamily: font.medium, fontSize: 28, letterSpacing: -0.56, color: warna.ink },
  judul: { fontFamily: font.medium, fontSize: 22, letterSpacing: -0.22, color: warna.ink },
  title: { fontFamily: font.medium, fontSize: 20, letterSpacing: -0.2, color: warna.ink },
  subjudul: { fontFamily: font.medium, fontSize: 16, color: warna.ink },
  body: { fontFamily: font.regular, fontSize: 15, color: warna.ink },
  bodyMedium: { fontFamily: font.medium, fontSize: 15, color: warna.ink },
  kecil: { fontFamily: font.regular, fontSize: 14, color: warna.ink },
  caption: { fontFamily: font.regular, fontSize: 13, color: warna.muted },
  mikro: { fontFamily: font.regular, fontSize: 12, color: warna.muted },
  label: {
    fontFamily: font.medium,
    fontSize: 12,
    color: warna.muted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.72,
  },
  mono: { fontFamily: 'monospace', fontSize: 12, color: warna.muted },
} as const;

export const bayangan = {
  hijau: {
    shadowColor: warna.hijau,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
} as const;
