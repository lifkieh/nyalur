// Kamus dwibahasa. SATU-SATUNYA tempat kalimat yang dilihat pengguna boleh
// ditulis — layar tidak menaruh string mentah lagi.
//
// Sisipan pakai {kurung}: t('bayar.harga', { porsi: '1 kg' }).
// Bentuk tunggal Inggris ditaruh di `en1` dan dipilih lewat tn(kunci, n).
// Bahasa Indonesia tidak mengenal jamak, jadi `id` selalu satu bentuk.
//
// Istilah yang dikunci di EN — jangan diubah sebagian:
//   panti          -> orphanage        kebutuhan  -> need
//   donatur        -> donor            saldo      -> monthly balance
//   bukti serah terima -> handover proof   ongkir -> shipping
//   Nyalur (kata kerja brand) TIDAK diterjemahkan — itu inti brief §2.

export type Entri = { id: string; en: string; en1?: string };

export const KAMUS = {
  // ---- umum ----
  'umum.terverifikasi': { id: 'Terverifikasi', en: 'Verified' },
  'umum.cobaLagi': { id: 'Coba lagi', en: 'Try again' },
  'umum.kembali': { id: 'Kembali', en: 'Back' },
  'umum.kembaliBeranda': { id: 'Kembali ke beranda', en: 'Back to home' },
  'umum.donatur': { id: 'Donatur', en: 'Donor' },
  'umum.pengurusPanti': { id: 'Pengurus panti', en: 'Orphanage admin' },
  'umum.anak': { id: '{n} anak', en: '{n} children', en1: '{n} child' },
  'umum.batch': { id: 'Batch {hari}', en: '{hari} batch' },
  'umum.perSatuan': { id: '{rp} / {satuan}', en: '{rp} / {satuan}' },
  'umum.kePanti': { id: 'ke {panti}', en: 'to {panti}' },

  // Label FotoPlaceholder. Bukan alt text — seed tidak punya foto_url untuk
  // panti & katalog, jadi kotak inilah yang benar-benar tampil di layar.
  'umum.fotoPanti': { id: 'foto panti', en: 'orphanage photo' },
  'umum.fotoBukti': { id: 'foto serah terima (kurir)', en: 'handover photo (courier)' },

  // ---- label tab (beda dari judul layarnya) ----
  'tab.ajukan': { id: 'Ajukan', en: 'Request' },

  // ---- pilih bahasa ----
  'bahasa.judul': { id: 'Pilih bahasa', en: 'Choose language' },
  'bahasa.sub': {
    id: 'Mengubah seluruh app, termasuk tanggal dan mata uang.',
    en: 'Changes the whole app, including dates and currency.',
  },

  // ---- status barang (lib/status.ts) ----
  'status.menungguDonatur': { id: 'Menunggu donatur', en: 'Awaiting donors' },
  'status.dikemas': { id: 'Dikemas', en: 'Packing' },
  'status.dikirim': { id: 'Dikirim', en: 'Shipped' },
  'status.diterima': { id: 'Diterima', en: 'Received' },

  // ---- splash ----
  'splash.tagline': { id: 'Dari kita untuk kita', en: 'From us, for us' },
  'splash.kaki': { id: 'Donasi barang · bukan uang', en: 'Goods, not cash' },

  // ---- intro ----
  'intro.lewati': { id: 'Lewati', en: 'Skip' },
  'intro.lanjut': { id: 'Lanjut', en: 'Next' },
  'intro.mulai': { id: 'Mulai', en: 'Get started' },
  'intro.1.label': { id: 'Kebutuhan nyata', en: 'Real needs' },
  'intro.1.judul': {
    id: 'Panti tidak minta uang.\nPanti minta beras.',
    en: 'Orphanages don’t ask\nfor money. They ask\nfor rice.',
  },
  'intro.1.isi': {
    id: 'Setiap kebutuhan dipecah jadi barang konkret, beras 10 kg, susu 20 kotak. Kamu lihat barangnya, progresnya, dan berapa yang masih kurang.',
    en: 'Every need is broken down into real items, 10 kg of rice, 20 boxes of milk. You see the item, the progress, and how much is still missing.',
  },
  'intro.2.label': { id: 'Bukan transfer', en: 'Not a transfer' },
  'intro.2.judul': {
    id: 'Kamu beli barang,\nbukan kirim uang.',
    en: 'You buy goods,\nnot send money.',
  },
  'intro.2.isi': {
    id: 'Tidak ada rekening panti yang kamu transfer. Kamu membeli dari gudang Nyalur, dan barangnya yang berangkat. Karena tidak ada kas yang berpindah, tidak ada kas yang bisa hilang.',
    en: 'You never transfer to an orphanage’s bank account. You buy from Nyalur’s warehouse, and the goods are what travel. No cash moves, so no cash can go missing.',
  },
  'intro.3.label': { id: 'Sampai, terbukti', en: 'Delivered, proven' },
  'intro.3.judul': {
    id: 'Sampai di tangan\nyang tepat.',
    en: 'It reaches the\nright hands.',
  },
  'intro.3.isi': {
    id: 'Setiap barang sampai dengan foto serah terima, nama penerima, jam, dan lokasi. Bukan laporan PDF bulan depan.',
    en: 'Every delivery comes with a handover photo, the recipient’s name, the time, and the location. Not a PDF report next month.',
  },

  // ---- pilih peran ----
  'peran.masukSebagai': { id: 'Masuk sebagai', en: 'Continue as' },
  'peran.donatur': { id: 'Donatur', en: 'Donor' },
  'peran.donaturIsi': {
    id: 'Lihat kebutuhan panti terverifikasi, kirim barangnya, lacak sampai ada bukti terima.',
    en: 'Browse verified needs, send the goods, track them to a signed proof of receipt.',
  },
  'peran.panti': { id: 'Pengurus panti', en: 'Orphanage staff' },
  'peran.pantiIsi': {
    id: 'Ajukan kebutuhan dari katalog, pantau saldo bulanan, terima barangnya.',
    en: 'Request items from the catalog, track your monthly ceiling, receive the goods.',
  },
  'peran.lanjut': { id: 'Lanjut', en: 'Continue' },
  'peran.kaki': {
    id: 'Tanpa kata sandi, demo memakai akun contoh.',
    en: 'No password, the demo uses sample accounts.',
  },

  // ---- masuk ----
  'masuk.judul': { id: 'Masuk', en: 'Sign in' },
  'masuk.tajuk': { id: 'Masuk ke akunmu', en: 'Sign in to your account' },
  'masuk.sub': {
    id: 'Akun demo {peran} sudah terisi. Tinggal tekan Masuk.',
    en: 'The {peran} demo account is prefilled. Just press Sign in.',
  },
  'masuk.email': { id: 'Email', en: 'Email' },
  'masuk.sandi': { id: 'Kata sandi', en: 'Password' },
  'masuk.terisi': { id: 'Terisi otomatis', en: 'Prefilled' },
  'masuk.cta': { id: 'Masuk', en: 'Sign in' },
  'masuk.gantiPeran': { id: 'Masuk sebagai peran lain', en: 'Sign in with another role' },
  'masuk.kaki': {
    id: 'Demo, tidak ada autentikasi sungguhan di balik layar ini.',
    en: 'Demo, there is no real authentication behind this screen.',
  },

  // ---- beranda ----
  'beranda.judul': { id: 'Beranda', en: 'Home' },
  'beranda.cari': { id: 'Cari panti atau barang', en: 'Search orphanages or items' },
  'beranda.filter.terdekat': { id: 'Terdekat', en: 'Nearest' },
  'beranda.filter.pangan': { id: 'Pangan', en: 'Food' },
  'beranda.filter.kebersihan': { id: 'Kebersihan', en: 'Hygiene' },
  'beranda.filter.sekolah': { id: 'Sekolah', en: 'School' },
  'beranda.filter.kesehatan': { id: 'Kesehatan', en: 'Health' },
  'beranda.mendesak': { id: 'Kebutuhan mendesak', en: 'Urgent needs' },
  'beranda.lihatSemua': { id: 'Lihat semua', en: 'See all' },
  'beranda.daftarJudul': { id: 'Panti di sekitarmu', en: 'Orphanages near you' },
  'beranda.daftarKaption': {
    id: '{n} panti terverifikasi di sekitarmu',
    en: '{n} verified orphanages near you',
    en1: '{n} verified orphanage near you',
  },
  'beranda.daftarKaptionArea': {
    id: '{n} panti terverifikasi · panti di {area} tampil lebih dulu',
    en: '{n} verified orphanages · those in {area} come first',
  },
  'beranda.galat': { id: 'Gagal memuat beranda', en: 'Couldn’t load home' },
  'beranda.kosongJudul': { id: 'Tidak ada panti yang cocok', en: 'No orphanages match' },
  'beranda.kosongPesan': {
    id: 'Coba ubah kata kunci atau pilih filter lain.',
    en: 'Try a different keyword or filter.',
  },
  'beranda.hapusCari': { id: 'Hapus pencarian', en: 'Clear search' },
  'beranda.sisa': { id: 'sisa {n}', en: '{n} to go' },

  // ---- pilih area ----
  'area.semua': { id: 'Tangerang Selatan & sekitarnya', en: 'Greater Tangerang Selatan' },
  'area.judul': { id: 'Pilih lokasimu', en: 'Choose your location' },
  'area.sub': {
    id: 'Menentukan panti mana yang tampil lebih dulu.',
    en: 'Decides which orphanages appear first.',
  },
  'area.catatan': {
    id: 'Jarak panti dihitung dari Tangerang Selatan. Kalau kamu pilih area lain, jarak disembunyikan, gudang Nyalur tetap mengirim ke semua panti.',
    en: 'Distances are measured from Tangerang Selatan. Pick another area and they’re hidden, Nyalur’s warehouse still ships to every orphanage.',
  },

  // ---- kartu batch ----
  'batch.kamu': { id: 'Batch kamu', en: 'Your batch' },
  'batch.berikutnya': { id: 'Batch pengiriman berikutnya', en: 'Next shipping batch' },
  'batch.ongkirmu': {
    id: 'Ongkirmu {rp}, dibagi rata dengan donatur lain di batch yang sama.',
    en: 'Your shipping is {rp}, split evenly with the other donors in the same batch.',
  },
  'batch.jelas': {
    id: 'Barang berangkat bareng tiap Jumat. Ongkir dibagi rata antar donatur di batch yang sama, makin ramai, makin murah.',
    en: 'Goods ship together every Friday. Shipping is split evenly among donors in the same batch, the more of us, the cheaper it gets.',
  },

  // ---- detail panti ----
  'panti.metaJarak': { id: '{n} anak · {kota} · {km} km', en: '{n} children · {kota} · {km} km' },
  'panti.batchBerikutnya': {
    id: 'Pengiriman berikutnya: batch {hari}',
    en: 'Next delivery: {hari} batch',
  },
  'panti.kebutuhanAktif': { id: 'Kebutuhan aktif', en: 'Active needs' },
  'panti.semuaTerpenuhi': {
    id: 'Semua kebutuhan panti ini sudah terpenuhi. Terima kasih, para donatur.',
    en: 'Every need here is met. Thank you, donors.',
  },
  'panti.sudahTersalurkan': { id: 'Sudah tersalurkan', en: 'Already delivered' },
  'panti.terpenuhiPenuh': { id: '{porsi} terpenuhi penuh', en: '{porsi} fully met' },
  'panti.terkirim': { id: 'Terkirim', en: 'Delivered' },
  'panti.galat': { id: 'Gagal memuat panti', en: 'Couldn’t load orphanage' },
  'panti.takAda': { id: 'Panti tidak ditemukan.', en: 'Orphanage not found.' },

  // ---- tab profil panti ----
  'panti.tabProfil': { id: 'Profil', en: 'About' },
  'panti.tabKebutuhan': { id: 'Kebutuhan', en: 'Needs' },
  'panti.tentang': { id: 'Tentang panti ini', en: 'About this orphanage' },
  'panti.belumAdaCerita': {
    id: 'Panti ini belum menuliskan ceritanya.',
    en: 'This orphanage hasn’t written its story yet.',
  },
  'panti.galeri': { id: 'Foto panti', en: 'Photos' },
  'panti.belumAdaFoto': {
    id: 'Pengurus belum mengunggah foto.',
    en: 'The staff hasn’t uploaded any photos yet.',
  },
  'panti.ditulisPengurus': {
    id: 'Ditulis sendiri oleh pengurus panti.',
    en: 'Written by the orphanage staff themselves.',
  },

  // ---- edit profil panti (A8) ----
  'editProfil.judul': { id: 'Edit profil', en: 'Edit profile' },
  'editProfil.tajukCerita': { id: 'Cerita panti', en: 'Your story' },
  'editProfil.ceritaBantu': {
    id: 'Ceritakan kondisi dan apa yang paling sering kurang. Ini yang dibaca donatur sebelum memutuskan.',
    en: 'Describe your situation and what runs short most often. This is what donors read before deciding.',
  },
  'editProfil.ceritaContoh': {
    id: 'Sejak kapan panti berdiri, berapa anak yang diasuh, apa yang paling sering habis duluan…',
    en: 'When you were founded, how many children you care for, what runs out first…',
  },
  'editProfil.tajukSampul': { id: 'Foto sampul', en: 'Cover photo' },
  'editProfil.sampulBantu': {
    id: 'Satu foto, jadi wajah panti di etalase. Ini yang dilihat donatur sebelum membuka profilmu.',
    en: 'One photo, your face in the registry. This is what donors see before they open your profile.',
  },
  'editProfil.pilihSampul': { id: 'Pilih foto sampul', en: 'Choose a cover photo' },
  'editProfil.gantiSampul': { id: 'Ganti', en: 'Replace' },
  'editProfil.hapusSampul': { id: 'Hapus', en: 'Remove' },
  'editProfil.tajukFoto': { id: 'Galeri panti', en: 'Photo gallery' },
  'editProfil.fotoBantu': {
    id: 'Maksimal {n} foto kondisi panti. Tampil di tab Profil, terpisah dari sampul.',
    en: 'Up to {n} photos of your conditions. Shown in the About tab, separate from the cover.',
  },
  'editProfil.tambahFoto': { id: 'Tambah foto', en: 'Add photo' },
  'editProfil.izinJudul': { id: 'Izin foto ditolak', en: 'Photo access denied' },
  'editProfil.izinPesan': {
    id: 'Nyalur butuh izin membuka galeri untuk menambahkan foto panti. Aktifkan lewat Pengaturan HP.',
    en: 'Nyalur needs photo library access to add orphanage photos. Enable it in your phone settings.',
  },
  'editProfil.terkunci': {
    id: 'Nama, alamat, dan jumlah anak ikut data verifikasi, tidak bisa diubah di sini.',
    en: 'Name, address, and number of children come from your verification, they can’t be changed here.',
  },
  'editProfil.simpan': { id: 'Simpan perubahan', en: 'Save changes' },
  'editProfil.tersimpan': { id: 'Profil tersimpan.', en: 'Profile saved.' },
  'editProfil.galat': { id: 'Gagal menyimpan profil', en: 'Couldn’t save profile' },

  // ---- baris kebutuhan ----
  'kebutuhan.sisa': { id: 'Sisa {porsi}', en: '{porsi} to go' },
  'kebutuhan.kirim': { id: 'Kirim {hari}', en: 'Ships {hari}' },
  'kebutuhan.nyalur': { id: 'Nyalur', en: 'Nyalur' },

  // ---- sheet pilih porsi ----
  'porsi.progress': { id: 'Progress saat ini', en: 'Progress so far' },
  'porsi.pilih': { id: 'Pilih porsi', en: 'Choose a portion' },
  'porsi.penuhiSemua': { id: 'Penuhi semua ({porsi})', en: 'Fill it all ({porsi})' },
  'porsi.catatan': {
    id: 'Ongkir dibagi rata dengan donatur lain di batch pengiriman {hari}. Makin ramai, makin murah.',
    en: 'Shipping is split evenly with the other donors in the {hari} batch. The more of us, the cheaper it gets.',
  },
  'porsi.penuh': {
    id: 'Kebutuhan ini sudah terpenuhi. Coba kebutuhan lain di panti ini.',
    en: 'This need is already met. Try another need at this orphanage.',
  },
  'porsi.cta': { id: 'Nyalur {porsi}', en: 'Nyalur {porsi}' },
  'porsi.ctaPenuh': { id: 'Sudah terpenuhi', en: 'Already met' },

  // ---- rincian biaya (dipakai 4 layar) ----
  'biaya.hargaBarang': { id: 'Harga barang ({porsi})', en: 'Item price ({porsi})' },
  'biaya.ongkir': { id: 'Ongkir (dibagi batch)', en: 'Shipping (split per batch)' },
  'biaya.platform': { id: 'Biaya platform', en: 'Platform fee' },
  'biaya.total': { id: 'Total', en: 'Total' },
  'biaya.totalBayar': { id: 'Total bayar', en: 'Total to pay' },

  // ---- bayar ----
  'bayar.judul': { id: 'Pembayaran', en: 'Payment' },
  'bayar.pesananmu': { id: 'Pesananmu', en: 'Your order' },
  'bayar.rincian': { id: 'Rincian biaya', en: 'Cost breakdown' },
  'bayar.metode': { id: 'Metode pembayaran', en: 'Payment method' },
  'bayar.qris.nama': { id: 'QRIS', en: 'QRIS' },
  'bayar.qris.ket': {
    id: 'Scan dari aplikasi bank atau e-wallet',
    en: 'Scan from your bank or e-wallet app',
  },
  'bayar.va.nama': { id: 'Virtual Account', en: 'Virtual Account' },
  'bayar.va.ket': { id: 'BCA, BNI, Mandiri, BRI', en: 'BCA, BNI, Mandiri, BRI' },
  'bayar.ewallet.nama': { id: 'E-Wallet', en: 'E-Wallet' },
  'bayar.ewallet.ket': {
    id: 'GoPay, OVO, DANA, ShopeePay',
    en: 'GoPay, OVO, DANA, ShopeePay',
  },
  'bayar.catatan': {
    id: 'Kamu membeli barang dari gudang Nyalur, tidak ada uang yang masuk ke rekening panti. Yang sampai ke panti adalah barangnya.',
    en: 'You’re buying goods from Nyalur’s warehouse, no money enters the orphanage’s account. What arrives there is the goods.',
  },
  'bayar.kelebihan': {
    id: 'Sisa kebutuhan tinggal {porsi}, kembali dan pilih ulang porsimu.',
    en: 'Only {porsi} is still needed, go back and pick your portion again.',
  },
  'bayar.direbut': {
    id: 'Donatur lain sudah mengisi kebutuhan ini, sisa tinggal {porsi}. Kembali dan pilih ulang porsimu.',
    en: 'Another donor just filled this need, only {porsi} is left. Go back and pick your portion again.',
  },
  'bayar.cta': { id: 'Bayar {rp}', en: 'Pay {rp}' },
  'bayar.galat': { id: 'Gagal memuat pesanan', en: 'Couldn’t load order' },
  'bayar.takAda': { id: 'Pesanan tidak ditemukan.', en: 'Order not found.' },

  // ---- sukses ----
  'sukses.judul': { id: 'Nyalur berhasil', en: 'Nyalur complete' },
  'sukses.pesan': {
    id: '{porsi} {barang} kamu akan dikirim ke {panti} hari {hari}.',
    en: 'Your {porsi} of {barang} will be delivered to {panti} on {hari}.',
  },
  'sukses.batch': { id: 'Batch pengiriman {hari}', en: '{hari} shipping batch' },
  'sukses.struk': { id: 'Dibayar {rp} via {metode}', en: 'Paid {rp} via {metode}' },
  'sukses.lacak': { id: 'Lacak donasi', en: 'Track donation' },

  // ---- lacak ----
  'lacak.judul': { id: 'Lacak donasi', en: 'Track donation' },
  'lacak.statusBarang': { id: 'Status barang', en: 'Item status' },
  'lacak.dikemas.nanti': { id: 'Menunggu diproses gudang', en: 'Waiting on the warehouse' },
  'lacak.dikirim.selesai': { id: 'Berangkat dari gudang', en: 'Left the warehouse' },
  'lacak.dikirim.aktif': { id: 'Sedang dalam perjalanan', en: 'On the way' },
  'lacak.dikirim.nanti': { id: 'Menunggu batch {hari}', en: 'Waiting for the {hari} batch' },
  'lacak.diterima.selesai': { id: 'Sudah sampai di panti', en: 'Arrived at the orphanage' },
  'lacak.diterima.nanti': { id: 'Menunggu bukti serah terima', en: 'Awaiting handover proof' },
  'lacak.rincian': { id: 'Rincian transaksi', en: 'Transaction details' },
  'lacak.disalurkan': { id: 'Disalurkan', en: 'Donated' },
  'lacak.catatan': {
    id: 'Yang dilacak adalah barang fisikmu sampai ke panti, bukan status dana.',
    en: 'What you’re tracking is your physical goods reaching the orphanage, not the status of funds.',
  },
  'lacak.lihatBukti': { id: 'Lihat bukti serah terima', en: 'View handover proof' },
  'lacak.galat': { id: 'Gagal memuat donasi', en: 'Couldn’t load donation' },
  'lacak.takAda': { id: 'Donasi tidak ditemukan.', en: 'Donation not found.' },

  // ---- bukti ----
  'bukti.judul': { id: 'Bukti serah terima', en: 'Handover proof' },
  'bukti.gps': { id: 'Lokasi GPS terverifikasi', en: 'GPS location verified' },
  'bukti.pil': { id: 'Diterima', en: 'Received' },
  'bukti.kalimat': { id: '{barang} {porsi} dari kamu', en: 'Your {porsi} of {barang}' },
  'bukti.sub': { id: 'telah sampai di {panti}', en: 'has arrived at {panti}' },
  'bukti.ditandatangani': {
    id: 'Diterima & ditandatangani oleh',
    en: 'Received & signed by',
  },
  'bukti.diverifikasi': { id: 'Diverifikasi oleh Nyalur', en: 'Verified by Nyalur' },
  'bukti.id': { id: 'ID bukti: {kode}', en: 'Proof ID: {kode}' },
  'bukti.koordinat': { id: 'Koordinat: {nilai}', en: 'Coordinates: {nilai}' },
  'bukti.bagikan': { id: 'Bagikan', en: 'Share' },
  'bukti.nyalurLagi': { id: 'Nyalur lagi', en: 'Nyalur again' },
  'bukti.pesanBagikan': {
    id: '{barang} {porsi} dari saya sudah sampai di {panti}. Diterima {penerima}, {waktu}. Bukti: {kode} · Nyalur',
    en: 'My {porsi} of {barang} has arrived at {panti}. Received by {penerima}, {waktu}. Proof: {kode} · Nyalur',
  },
  'bukti.belumAda': { id: 'Bukti belum tersedia', en: 'Proof not available yet' },
  'bukti.belumAdaPesan': {
    id: 'Bukti serah terima belum tersedia untuk donasi ini.',
    en: 'No handover proof for this donation yet.',
  },

  // ---- riwayat ----
  'riwayat.judul': { id: 'Riwayat', en: 'History' },
  'riwayat.ringkas': {
    id: '{n} donasi · {rp} tersalurkan',
    en: '{n} donations · {rp} delivered',
    en1: '{n} donation · {rp} delivered',
  },
  'riwayat.filter.semua': { id: 'Semua', en: 'All' },
  'riwayat.kosongFilter': {
    id: 'Tidak ada donasi berstatus {status}.',
    en: 'No donations with status “{status}”.',
  },
  'riwayat.tampilkanSemua': { id: 'Tampilkan semua', en: 'Show all' },
  'riwayat.kosongJudul': { id: 'Belum ada riwayat', en: 'No history yet' },
  'riwayat.kosongPesan': {
    id: 'Donasi yang sudah kamu salurkan akan tercatat di sini.',
    en: 'Donations you’ve sent will show up here.',
  },
  'riwayat.lihatBeranda': { id: 'Lihat beranda', en: 'Go to home' },
  'riwayat.lihatBukti': { id: 'Lihat bukti', en: 'View proof' },

  // ---- profil ----
  'profil.judul': { id: 'Profil', en: 'Profile' },
  'profil.akun': { id: 'Akun', en: 'Account' },
  'profil.gantiAkun': { id: 'Ganti akun', en: 'Switch account' },
  'profil.gantiAkunSub': {
    id: 'Satu HP, dua peran, donatur dan panti',
    en: 'One phone, two roles, donor and orphanage',
  },
  'profil.bahasa': { id: 'Bahasa', en: 'Language' },
  'profil.editProfil': { id: 'Edit profil panti', en: 'Edit orphanage profile' },
  'profil.editProfilSub': {
    id: 'Cerita & foto yang dilihat donatur',
    en: 'The story & photos donors see',
  },
  'profil.daftarPanti': { id: 'Alur pendaftaran panti', en: 'Orphanage sign-up flow' },
  'profil.daftarPantiSub': {
    id: 'Dokumen legalitas & verifikasi',
    en: 'Legal documents & verification',
  },
  'profil.keluar': { id: 'Keluar', en: 'Sign out' },
  'profil.keluarSub': { id: 'Kembali ke pilih peran', en: 'Back to role selection' },
  'profil.catatan': {
    id: 'Nyalur demo · satu HP dipakai bergantian untuk donatur dan panti.',
    en: 'Nyalur demo · one phone shared between donor and orphanage.',
  },

  // ---- profil donatur ----
  'dampak.judul': { id: 'Dampakmu', en: 'Your impact' },
  'dampak.donasi': { id: 'donasi', en: 'donations', en1: 'donation' },
  'dampak.panti': { id: 'panti dibantu', en: 'orphanages helped', en1: 'orphanage helped' },
  'dampak.tersalurkan': { id: 'tersalurkan', en: 'delivered' },
  'dampak.sampai': {
    id: '{n} dari {total} sudah sampai dengan bukti serah terima',
    en: '{n} of {total} arrived with handover proof',
  },
  'dampak.kosong': {
    id: 'Belum ada barang yang kamu salurkan. Mulai dari beranda, 1 kg beras pun sampai.',
    en: 'You haven’t sent anything yet. Start from home, even 1 kg of rice gets there.',
  },

  // ---- profil panti ----
  'dataPanti.judul': { id: 'Data panti', en: 'Orphanage details' },
  'dataPanti.anak': { id: 'anak terdaftar', en: 'children registered', en1: 'child registered' },
  'dataPanti.sisaPlafon': { id: 'sisa saldo', en: 'balance left' },
  'dataPanti.tier1': { id: 'Terdaftar', en: 'Registered' },
  'dataPanti.tier2': { id: 'Terverifikasi', en: 'Verified' },
  'dataPanti.syarat1': { id: 'Akta yayasan', en: 'Foundation deed' },
  'dataPanti.syarat2': { id: 'NIB + SK Kemensos', en: 'NIB + Ministry of Social Affairs decree' },
  'dataPanti.tierJelas': {
    id: '{tier} {nama}, {syarat} sudah dicek. Tier 3 butuh kunjungan lapangan.',
    en: '{tier} {nama}, {syarat} checked. Tier 3 requires a site visit.',
  },

  // ---- switch akun ----
  'switch.judul': { id: 'Ganti akun', en: 'Switch account' },
  'switch.sub': {
    id: 'Satu HP, dua peran, tap untuk beralih.',
    en: 'One phone, two roles, tap to switch.',
  },

  // ---- daftar panti ----
  'daftar.judul': { id: 'Daftar panti', en: 'Register orphanage' },
  'daftar.nama': { id: 'Nama panti', en: 'Orphanage name' },
  'daftar.alamat': { id: 'Alamat', en: 'Address' },
  'daftar.penghuni': { id: 'Jumlah penghuni', en: 'Number of residents' },
  'daftar.dokumen': { id: 'Dokumen legalitas', en: 'Legal documents' },
  'daftar.akta': { id: 'Akta yayasan', en: 'Foundation deed' },
  'daftar.nib': { id: 'NIB', en: 'NIB' },
  'daftar.sk': { id: 'SK Kemensos', en: 'Ministry decree' },
  'daftar.terunggah': { id: 'Terunggah', en: 'Uploaded' },
  'daftar.belumUnggah': { id: 'Belum diunggah', en: 'Not uploaded' },
  'daftar.unggah': { id: 'Unggah', en: 'Upload' },
  'daftar.cta': { id: 'Ajukan verifikasi', en: 'Submit for verification' },

  // ---- verified ----
  'verif.judul': { id: 'Panti terverifikasi', en: 'Orphanage verified' },
  'verif.pesan': {
    id: 'Legalitas {nama} sudah dicek dan lolos verifikasi Nyalur.',
    en: '{nama}’s legal documents have been checked and passed Nyalur’s verification.',
  },
  'verif.plafon': { id: 'Saldo kebutuhan bulanan', en: 'Monthly needs balance' },
  'verif.rumus': {
    id: '{n} anak × {rp} / anak / bulan',
    en: '{n} children × {rp} / child / month',
  },
  'verif.cta': { id: 'Mulai ajukan kebutuhan', en: 'Start requesting needs' },

  // ---- dashboard panti ----
  'dash.judul': { id: 'Dashboard', en: 'Dashboard' },
  'dash.diajukan': { id: 'Kebutuhan diajukan', en: 'Needs requested' },
  'dash.jumlah': { id: '{n} kebutuhan', en: '{n} needs', en1: '{n} need' },
  'dash.kosong': {
    id: 'Belum ada kebutuhan diajukan. Mulai dari katalog, saldomu masih tersedia.',
    en: 'No needs requested yet. Start from the catalogue, your balance is still open.',
  },
  'dash.fab': { id: 'Ajukan kebutuhan', en: 'Request a need' },
  'dash.galat': { id: 'Gagal memuat dashboard', en: 'Couldn’t load dashboard' },
  'dash.takTerhubung': {
    id: 'Akun ini tidak terhubung ke panti mana pun.',
    en: 'This account isn’t linked to any orphanage.',
  },

  // ---- kartu saldo ----
  'plafon.bulanIni': { id: 'Saldo bulan ini', en: 'This month’s balance' },
  'plafon.sisa': { id: 'sisa', en: 'left' },
  'plafon.terpakai': { id: 'Terpakai {rp}', en: '{rp} used' },
  'plafon.total': { id: 'Saldo {rp}', en: '{rp} balance' },
  'plafon.catatan': {
    id: 'Batas {rp} / anak / bulan, mencegah penyalahgunaan',
    en: 'Balance of {rp} / child / month, prevents abuse',
  },

  // ---- katalog ----
  'katalog.judul': { id: 'Katalog', en: 'Catalogue' },
  'katalog.sisa': { id: 'Sisa {rp}', en: '{rp} left' },
  'katalog.perSatuan': { id: 'per {satuan}', en: 'per {satuan}' },
  'katalog.kosong': {
    id: 'Belum ada barang di kategori ini. Katalog dikurasi bertahap, coba kategori lain.',
    en: 'Nothing in this category yet. The catalogue is curated gradually, try another one.',
  },
  'katalog.galat': { id: 'Gagal memuat katalog', en: 'Couldn’t load catalogue' },

  // ---- sheet atur jumlah ----
  'aturJumlah.jumlah': { id: 'Jumlah', en: 'Quantity' },
  'aturJumlah.totalKebutuhan': { id: 'Total kebutuhan', en: 'Total need value' },
  'aturJumlah.sisaSekarang': { id: 'Sisa saldo sekarang', en: 'Balance left now' },
  'aturJumlah.sisaSetelah': { id: 'Sisa saldo setelah ini', en: 'Balance left after this' },
  'aturJumlah.lewat': {
    id: 'Melebihi saldo bulan ini sebesar {rp}. Sistem akan menolak pengajuan ini.',
    en: 'This exceeds the monthly balance by {rp}. The system will reject this request.',
  },
  'aturJumlah.catatan': {
    id: 'Kebutuhan tidak boleh melebihi sisa saldo bulan ini.',
    en: 'A need can’t exceed what’s left of this month’s balance.',
  },
  'aturJumlah.ditolak': {
    id: 'Sistem menolak pengajuan ini: nilai kebutuhan {nilai} melebihi sisa saldo bulan ini ({sisa}). Kurangi jumlahnya atau ajukan bulan depan.',
    en: 'The system rejected this request: the need is worth {nilai}, which exceeds what’s left of this month’s balance ({sisa}). Lower the quantity or request again next month.',
  },
  'aturJumlah.cta': { id: 'Ajukan kebutuhan ini', en: 'Request this need' },

  // ---- request terkirim ----
  'terkirim.judul': { id: 'Kebutuhan diajukan', en: 'Need requested' },
  'terkirim.pesan': {
    id: 'Kebutuhan ini sudah tayang di beranda donatur. Kamu akan dikabari saat ada yang menyalurkan.',
    en: 'This need is now live on the donor home screen. You’ll be notified when someone sends it.',
  },
  'terkirim.ringkasan': { id: 'Ringkasan', en: 'Summary' },
  'terkirim.estimasi': { id: 'Estimasi biaya', en: 'Estimated cost' },
  'terkirim.batch': { id: 'Batch pengiriman', en: 'Shipping batch' },
  'terkirim.keDashboard': { id: 'Kembali ke dashboard', en: 'Back to dashboard' },
  'terkirim.beralih': { id: 'Beralih akun untuk demo', en: 'Switch account for the demo' },
  'terkirim.donaturSub': { id: 'Donatur · Tangerang Selatan', en: 'Donor · Tangerang Selatan' },

  // ---- penerimaan ----
  'terima.judul': { id: 'Penerimaan', en: 'Incoming' },
  'terima.ringkas': {
    id: '{n} kebutuhan · {m} donasi masuk',
    en: '{n} needs · {m} donations in',
  },
  'terima.terkumpul': {
    id: 'Terkumpul dari {n} donatur',
    en: 'Pooled from {n} donors',
    en1: 'Pooled from {n} donor',
  },
  'terima.filter.semua': { id: 'Semua', en: 'All' },
  'terima.kosongFilter': {
    id: 'Tidak ada kebutuhan berstatus {status}.',
    en: 'No needs with status “{status}”.',
  },
  'terima.tampilkanSemua': { id: 'Tampilkan semua', en: 'Show all' },
  'terima.kosongJudul': { id: 'Belum ada penerimaan', en: 'Nothing received yet' },
  'terima.kosongPesan': {
    id: 'Barang yang disalurkan donatur ke panti ini akan tercatat di sini.',
    en: 'Goods donors send to this orphanage will be logged here.',
  },
  'terima.galat': { id: 'Gagal memuat penerimaan', en: 'Couldn’t load incoming' },
  'terima.detailJudul': { id: 'Detail penerimaan', en: 'Incoming details' },
  'terima.tercatat': {
    id: '{n} donasi · {porsi} tercatat masuk',
    en: '{n} donations · {porsi} logged in',
    en1: '{n} donation · {porsi} logged in',
  },
  'terima.donasiMasuk': { id: 'Donasi yang masuk', en: 'Donations received' },
  'terima.galatKebutuhan': { id: 'Gagal memuat kebutuhan', en: 'Couldn’t load need' },
  'terima.takAda': { id: 'Kebutuhan tidak ditemukan.', en: 'Need not found.' },

  // ---- galat jaringan umum ----
  'galat.riwayat': { id: 'Gagal memuat riwayat', en: 'Couldn’t load history' },
} as const satisfies Record<string, Entri>;

export type Kunci = keyof typeof KAMUS;

/**
 * Nama & satuan barang datang dari database, jadi mode EN tidak menyentuhnya
 * sendiri. Katalog sengaja kaku dan cuma 6 baris (brief §10), dan id-nya dipatok
 * di gen-seed.mjs — jadi dipetakan di klien, tanpa migrasi kolom.
 *
 * Nama panti TIDAK ada di sini: nama diri tidak diterjemahkan.
 */
export const BARANG_EN: Record<string, { nama: string; satuan: string }> = {
  '86a858c2-989f-4214-a8bb-160d97bdfa19': { nama: 'Premium rice', satuan: 'kg' },
  '69941d9c-9894-4641-8165-37d16abd1e12': { nama: 'Cooking oil', satuan: 'L' },
  '3cb78f18-bb50-4ba0-a508-8edf87be2676': { nama: 'Chicken eggs', satuan: 'kg' },
  '455e47be-4ee5-47ac-8fd2-c972ac901594': { nama: 'UHT milk', satuan: 'boxes' },
  'f33e546c-9751-42d9-b7ca-1264c7ebe4fd': { nama: 'Bath soap', satuan: 'pcs' },
  '89787eb3-6ff5-403f-aa24-3fef087b6a87': { nama: 'Notebook', satuan: 'pcs' },
};
