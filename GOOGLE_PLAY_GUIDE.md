# Panduan Lengkap Merilis Aplikasi ke Google Play Store & Menyiapkan Pembayaran

Dokumen ini berisi panduan langkah demi langkah agar aplikasi **Mencongak Master Pro** dapat dirilis ke **Google Play Store** dan Anda bisa **menerima uang pembayaran langsung ke rekening bank Anda**.

---

## 1. Daftar Akun Pengembang Google Play Console
1. Buka [Google Play Console](https://play.google.com/console).
2. Masuk menggunakan akun Google Anda (disarankan akun Google yang aman dan terverifikasi).
3. Pilih tipe akun: **Perorangan (Individual)** atau **Organisasi / Bisnis**.
4. Bayar biaya pendaftaran resmi Google Play Console sebesar **$25 USD** (dibayar sekali seumur hidup via kartu debit/kredit Jenius, BCA Mastercard, Bank Jago, dsb).
5. Lakukan verifikasi identitas (unggah foto KTP / Paspor sesuai instruksi Google).

---

## 2. Setting Rekening Bank Anda (Google Payments Merchant Account)
*Langkah ini adalah kunci agar setiap pembelian item/aplikasi otomatis ditransfer ke rekening bank Anda.*

1. Di Google Play Console, buka menu sebelah kiri:
   - Masuk ke **Pengaturan (Settings)** -> **Profil Pembayaran (Payments Profile)** atau **Penyiapan Monetisasi (Monetization setup)**.
2. Klik **Buat Profil Penjual (Create Merchant Account)**.
3. Masukkan data:
   - Nama pemilik rekening / nama bisnis.
   - Alamat lengkap dan nomor NPWP (jika diminta).
4. Masukkan Rekening Bank Indonesia Anda:
   - **Nama Bank**: (BCA, Bank Mandiri, BRI, BNI, Bank Jago, dll).
   - **Nomor Rekening**.
   - **Nama Pemilik Rekening** (harus sama persis dengan nama di buku tabungan/KTP).
5. **Jadwal Pencairan Uang**:
   - Google mengumpulkan hasil penjualan selama sebulan.
   - Uang penjualan ditransfer otomatis ke rekening bank Anda setiap **tanggal 15 setiap bulannya** jika saldo telah mencapai batas minimum ($100 USD atau setara Rupiah).
   - Potongan bagi hasil Google hanya 15% untuk $1 juta USD pertama per tahun.

---

## 3. Daftarkan Produk Dalam Aplikasi (In-App Products / SKU)
Di dalam kode aplikasi kita, item toko sudah disiapkan dengan Product ID (SKU) berikut:

| Product ID (SKU) di Play Console | Nama Produk di Aplikasi | Tipe | Rekomendasi Harga |
| :--- | :--- | :--- | :--- |
| `vip_pass` | VIP Pass Seumur Hidup | Non-Consumable (Permanen) | Rp 29.000 |
| `coins_pack_1` | Kantong Koin Pelajar (300 Koin) | Consumable (Habis Pakai) | Rp 9.000 |
| `coins_pack_2` | Peti Koin Juara (750 Koin) | Consumable (Habis Pakai) | Rp 19.000 |
| `coins_pack_3` | Gudang Koin Sultan (1.500 + 500 Bonus) | Consumable (Habis Pakai) | Rp 49.000 |
| `cert_official` | Lisensi Sertifikat Resmi | Non-Consumable | Rp 15.000 |

### Cara Mendaftarkannya di Play Console:
1. Buka aplikasi Anda di Google Play Console.
2. Di menu kiri, buka **Monetisasi** -> **Produk dalam aplikasi (In-app products)**.
3. Klik **Buat produk (Create product)**.
4. Masukkan **ID Produk** (contoh: `coins_pack_3`).
5. Masukkan Nama Produk: *Gudang Koin Sultan*.
6. Tentukan Harga: *Rp 49.000*.
7. Klik **Aktifkan (Activate)**.

---

## 4. Cara Mengubah Web App Menjadi File Android (.AAB)
Google Play Store sekarang mewajibkan format **Android App Bundle (.aab)**. Karena aplikasi Anda adalah Web App (PWA) modern, cara tercepat dan resmi dari Google adalah menggunakan **Bubblewrap (Trusted Web Activity - TWA)**:

### Opsi A: Menggunakan Bubblewrap (Resmi dari Google untuk PWA)
1. Install Bubblewrap CLI di komputer/laptop:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Inisialisasi proyek dari URL aplikasi Anda:
   ```bash
   bubblewrap init --manifest=https://URL_APLIKASI_ANDA/manifest.json
   ```
3. Build file `.aab`:
   ```bash
   bubblewrap build
   ```
   *Perintah ini akan menghasilkan file `app-release-signed.aab` yang siap diunggah ke Google Play Console.*

### Opsi B: Menggunakan PWABuilder (Paling Mudah via Web Browser)
1. Buka [PWABuilder.com](https://www.pwabuilder.com/).
2. Masukkan URL hosting aplikasi Anda.
3. Klik **Package for Stores** -> Pilih **Android**.
4. Isi Package ID: `com.mencongak.masterpro`.
5. Klik **Generate** dan download file `.zip` yang berisi file `.aab` dan keystore.

---

## 5. Unggah ke Google Play Console & Rilis
1. Di Google Play Console, klik **Buat Aplikasi (Create App)**:
   - Nama: *Mencongak Master Pro*
   - Kategori: *Game / Pendidikan*
   - Gratis atau Berbayar: *Gratis (dengan Pembelian Dalam Aplikasi / In-App Purchase)*.
2. Buka menu **Produksi (Production)** -> **Buat Rilis Baru (Create Release)**.
3. Unggah file `.aab` yang sudah Anda buat tadi.
4. Lengkapi formulir standar Google:
   - Ikon aplikasi (512x512 PNG).
   - Screenshot tampilan game (min. 2 gambar).
   - Banner grafis fitur (1024x500 PNG).
   - Kebijakan Privasi (Privacy Policy URL).
5. Kirim untuk peninjauan (*Submit for Review*). Biasanya disetujui dalam 1-3 hari kerja.

Setelah disetujui, aplikasi akan live di Google Play Store dan setiap kali ada pengguna yang menekan tombol *Beli dengan 1-Ketukan*, Google Play Billing akan memproses uangnya dan menyalurkannya langsung ke rekening bank Anda!
