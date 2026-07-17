// Generator aset logo Nyalur. Sumber tunggal: assets/logo-sumber.png
//
// Jalankan: npm run logo:gen
//
// Kenapa skrip, bukan sunting manual di editor gambar: aset ikon ada 5 ukuran
// dengan aturan berbeda-beda (persegi vs transparan vs safe zone Android). Kalau
// dikerjakan tangan, satu ganti mark = lima file harus diulang dan salah satu
// pasti ketinggalan. Di sini satu perintah, lima file, selalu sinkron.
//
// Yang dilakukan ke gambar sumber:
//   1. Latar dibuang. Sumbernya berlatar #F8FAF5 buram, bukan transparan.
//      Dikunci lewat "colorfulness" (max kanal - min kanal): latar putih-abu dan
//      garis pemisah putih nilainya ~0, tangan berwarna nilainya >170. Ambang
//      bertingkat, jadi tepi anti-alias dapat alpha separuh — tidak bergerigi.
//   2. Hijau -> navy. Brief §9 mengunci hijau HANYA untuk status terkirim. Logo
//      adalah elemen paling sering tampil; kalau ia hijau, hijau berhenti berarti
//      "terkirim" dan pil hijau di layar bukti kehilangan tenaganya.
//   3. Warna dipatok ke token. Sumber memakai #02B07D & #1D63DF — dekat, tapi
//      bukan token. Dipatok ke navy #0B2E6F & biru #1B5FE3 supaya logo dan app
//      memakai hex yang sama persis.
//
// Catatan: mematok warna juga membuang gradien halus bawaan generator gambar.
// Itu disengaja — brief §9 minta "bersih, terstruktur, seperti fintech", bukan
// mengkilap.
import fs from 'fs';
import zlib from 'zlib';
import path from 'path';
import { fileURLToPath } from 'url';

const AKAR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SUMBER = path.join(AKAR, 'assets', 'logo-sumber.png');

// Token dari constants/theme.ts — jangan tulis hex di tempat lain.
const NAVY = [0x0b, 0x2e, 0x6f];
const BIRU = [0x1b, 0x5f, 0xe3];
const PUTIH = [0xff, 0xff, 0xff];

// ---- baca PNG ----
function bacaPng(berkas) {
  const b = fs.readFileSync(berkas);
  const W = b.readUInt32BE(16);
  const H = b.readUInt32BE(20);
  const ct = b[25];
  if (b[24] !== 8) throw new Error('hanya mendukung 8-bit per kanal');
  if (ct !== 6 && ct !== 2) throw new Error('hanya mendukung RGB / RGBA');

  const potongan = [];
  let i = 8;
  while (i < b.length) {
    const len = b.readUInt32BE(i);
    const typ = b.slice(i + 4, i + 8).toString();
    if (typ === 'IDAT') potongan.push(b.slice(i + 8, i + 8 + len));
    i += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(potongan));

  const ch = ct === 6 ? 4 : 3;
  const stride = W * ch;
  const px = Buffer.alloc(H * stride);
  let p = 0;
  for (let y = 0; y < H; y++) {
    const f = raw[p++];
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? px[y * stride + x - ch] : 0;
      const up = y > 0 ? px[(y - 1) * stride + x] : 0;
      const ul = x >= ch && y > 0 ? px[(y - 1) * stride + x - ch] : 0;
      let v = raw[p + x];
      if (f === 1) v += a;
      else if (f === 2) v += up;
      else if (f === 3) v += (a + up) >> 1;
      else if (f === 4) {
        const pa = Math.abs(up - ul);
        const pb = Math.abs(a - ul);
        const pc = Math.abs(a + up - 2 * ul);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? up : ul;
      }
      px[y * stride + x] = v & 255;
    }
    p += stride;
  }

  // normalkan ke RGBA
  const out = Buffer.alloc(W * H * 4);
  for (let i2 = 0, o = 0; o < out.length; i2 += ch, o += 4) {
    out[o] = px[i2];
    out[o + 1] = px[i2 + 1];
    out[o + 2] = px[i2 + 2];
    out[o + 3] = ch === 4 ? px[i2 + 3] : 255;
  }
  return { W, H, px: out };
}

// ---- tulis PNG ----
function tulisPng(berkas, W, H, px) {
  const stride = W * 4;
  const raw = Buffer.alloc(H * (stride + 1));
  for (let y = 0; y < H; y++) {
    raw[y * (stride + 1)] = 0; // filter none
    px.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  const potong = (typ, data) => {
    const b = Buffer.alloc(8 + data.length + 4);
    b.writeUInt32BE(data.length, 0);
    b.write(typ, 4);
    data.copy(b, 8);
    b.writeInt32BE(crc(Buffer.concat([Buffer.from(typ), data])), 8 + data.length);
    return b;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  fs.writeFileSync(
    berkas,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      potong('IHDR', ihdr),
      potong('IDAT', idat),
      potong('IEND', Buffer.alloc(0)),
    ])
  );
}

const TABEL_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TABEL_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

// ---- 1. kunci latar + patok warna ----
function bersihkan({ W, H, px }) {
  const out = Buffer.alloc(W * H * 4);
  for (let o = 0; o < px.length; o += 4) {
    const r = px[o],
      g = px[o + 1],
      b = px[o + 2];
    const maks = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const warnaan = maks - min; // 0 = abu/putih, tinggi = berwarna

    // Ambang diukur dari gambarnya, bukan ditebak:
    //   latar polos      ~5
    //   bayangan elips   <=53   <- HARUS terbuang. Percobaan pertama memakai
    //                              ambang 18 dan bayangannya ikut terjaring,
    //                              lalu ia melebarkan kotak batas ke bawah
    //                              sehingga mark terdorong ke atas di kanvas.
    //   mark             174-194
    // 70..130 duduk di celah lebar antara bayangan dan mark, dan menyisakan
    // 60 tingkat untuk tepi anti-alias.
    const alpha = Math.max(0, Math.min(255, Math.round(((warnaan - 70) / 60) * 255)));
    if (alpha === 0) continue; // biarkan transparan

    // kanal dominan menentukan tangan mana
    const token = g >= b ? NAVY : BIRU;
    out[o] = token[0];
    out[o + 1] = token[1];
    out[o + 2] = token[2];
    out[o + 3] = alpha;
  }
  return { W, H, px: out };
}

// ---- 2. kotak batas mark ----
function batas({ W, H, px }) {
  let x0 = W,
    y0 = H,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (px[(y * W + x) * 4 + 3] > 12) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  return { x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// ---- 3. gambar ke kanvas persegi ----
/**
 * @param sisi     ukuran kanvas keluaran
 * @param isian    0..1 — berapa bagian sisi yang boleh dipakai mark.
 *                 Android adaptive memangkas ~33% tepi, jadi foreground-nya
 *                 harus jauh lebih kecil daripada ikon biasa.
 * @param latar    null = transparan
 * @param mono     paksa satu warna (ikon monochrome Android)
 */
function render(src, sisi, isian, latar, mono) {
  const bb = batas(src);
  const out = Buffer.alloc(sisi * sisi * 4);

  if (latar) {
    for (let o = 0; o < out.length; o += 4) {
      out[o] = latar[0];
      out[o + 1] = latar[1];
      out[o + 2] = latar[2];
      out[o + 3] = 255;
    }
  }

  const muat = sisi * isian;
  const skala = Math.min(muat / bb.w, muat / bb.h);
  const lebar = Math.round(bb.w * skala);
  const tinggi = Math.round(bb.h * skala);
  const ox = Math.round((sisi - lebar) / 2);
  const oy = Math.round((sisi - tinggi) / 2);

  // rerata area (box filter) — turun-skala tajam tanpa aliasing
  for (let y = 0; y < tinggi; y++) {
    for (let x = 0; x < lebar; x++) {
      const sx0 = bb.x0 + (x / skala);
      const sy0 = bb.y0 + (y / skala);
      const sx1 = bb.x0 + ((x + 1) / skala);
      const sy1 = bb.y0 + ((y + 1) / skala);
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        n = 0;
      for (let sy = Math.floor(sy0); sy < Math.ceil(sy1); sy++) {
        for (let sx = Math.floor(sx0); sx < Math.ceil(sx1); sx++) {
          if (sx < 0 || sy < 0 || sx >= src.W || sy >= src.H) continue;
          const o = (sy * src.W + sx) * 4;
          const pa = src.px[o + 3];
          // pramultiplikasi: tanpa ini tepi transparan menyeret warna hitam
          r += src.px[o] * pa;
          g += src.px[o + 1] * pa;
          b += src.px[o + 2] * pa;
          a += pa;
          n++;
        }
      }
      if (!n || !a) continue;
      const ra = a / n;
      const cr = r / a,
        cg = g / a,
        cb = b / a;
      const o = ((oy + y) * sisi + (ox + x)) * 4;
      const warna = mono ? mono : [cr, cg, cb];
      if (latar) {
        // komposit atas latar buram
        const t = ra / 255;
        out[o] = Math.round(warna[0] * t + latar[0] * (1 - t));
        out[o + 1] = Math.round(warna[1] * t + latar[1] * (1 - t));
        out[o + 2] = Math.round(warna[2] * t + latar[2] * (1 - t));
        out[o + 3] = 255;
      } else {
        out[o] = Math.round(warna[0]);
        out[o + 1] = Math.round(warna[1]);
        out[o + 2] = Math.round(warna[2]);
        out[o + 3] = Math.round(ra);
      }
    }
  }
  return out;
}

// ---- jalankan ----
if (!fs.existsSync(SUMBER)) {
  console.error(`Sumber tidak ada: ${path.relative(AKAR, SUMBER)}`);
  process.exit(1);
}

const asli = bacaPng(SUMBER);
const bersih = bersihkan(asli);
const bb = batas(bersih);

// isian = berapa bagian sisi kanvas yang boleh dipakai mark.
//
// Angka Android dihitung, bukan dikira-kira. Adaptive icon memangkas tepi dan
// memasking jadi lingkaran; safe zone-nya lingkaran berdiameter 66% kanvas =
// 338px dari 512. Mark ini lanskap ~1,74:1, jadi diagonalnya = lebar x 1,15.
// Pada isian 0,54: lebar 276, diagonal 319 — masih di dalam 338. Percobaan
// pertama memakai 0,46 dan mark-nya tampak tenggelam padahal ruangnya ada.
const KELUARAN = [
  { nama: 'logo.png', sisi: 512, isian: 0.94, latar: null },
  { nama: 'icon.png', sisi: 1024, isian: 0.72, latar: PUTIH },
  { nama: 'splash-icon.png', sisi: 1024, isian: 0.62, latar: null },
  { nama: 'android-icon-foreground.png', sisi: 512, isian: 0.54, latar: null },
  { nama: 'android-icon-monochrome.png', sisi: 512, isian: 0.54, latar: null, mono: PUTIH },
  { nama: 'favicon.png', sisi: 48, isian: 0.86, latar: null },
];

console.log(`sumber  : ${asli.W}x${asli.H}`);
console.log(`mark    : ${bb.w}x${bb.h} di (${bb.x0},${bb.y0})`);
console.log('');

for (const k of KELUARAN) {
  const px = render(bersih, k.sisi, k.isian, k.latar, k.mono);
  const tujuan = path.join(AKAR, 'assets', k.nama);
  tulisPng(tujuan, k.sisi, k.sisi, px);
  const kb = Math.round(fs.statSync(tujuan).size / 1024);
  const catatan = k.latar ? 'latar putih' : k.mono ? 'monochrome' : 'transparan';
  console.log(`  ${k.nama.padEnd(32)} ${String(k.sisi).padStart(4)}px  ${String(kb).padStart(3)} KB  ${catatan}`);
}

console.log('');
console.log('selesai — 6 aset ditulis ke assets/');
