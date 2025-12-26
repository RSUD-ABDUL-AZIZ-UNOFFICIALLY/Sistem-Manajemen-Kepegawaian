
# Sistem Manajemen Kepegawaian (SIMPEG) RSUD Abdul Aziz

Sistem Informasi Manajemen Kepegawaian (SIMPEG) yang dikembangkan untuk RSUD Abdul Aziz Kota Singkawang. Sistem ini dirancang untuk mengelola data kepegawaian, layanan administratif, dan fitur presensi secara terintegrasi.

## Fitur Utama

- **Otentikasi Aman**: Login menggunakan One-Time Password (OTP) yang dikirimkan via WhatsApp.
- **Manajemen Pegawai**: Pengelolaan data profil, statistik, dan riwayat kepegawaian.
- **Modul Presensi**: Integrasi dengan mesin finger print (bridging) dan rekapitulasi presensi.
- **Layanan Mandiri**: Pengajuan cuti, pelaporan LPKP, dan pengaturan jam dinas.
- **Monitoring Sesi**: Pemantauan sesi login aktif untuk keamanan tambahan.

## Teknologi (Tech Stack)

Sistem ini dibangun menggunakan teknologi modern:

- **Backend**: Express.js (Node.js framework)
- **Database**: MariaDB via Sequelize ORM
- **Cache**: Redis (untuk session dan singleton pattern)
- **View Engine**: EJS
- **Integrasi**: WhatsApp API, Finger Print Bridging
- **Utility**: Moment.js, UUID, Morgan, Axios, Multer
- **Monitoring**: Sentry Integration

## Instalasi

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal:

1. **Clone Repositori**
   ```bash
   git clone https://github.com/RSUD-ABDUL-AZIZ-UNOFFICIALLY/Sistem-Manajemen-Kepegawaian.git
   cd Sistem-Manajemen-Kepegawaian
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Salin file `.env` contoh dan sesuaikan dengan konfigurasi server Anda. pastikan variabel database, redis, dan API WhatsApp telah terisi dengan benar.

4. **Menjalankan Aplikasi**
   ```bash
   # Jalankan mode pengembangan (Development)
   npm run dev

   # Jalankan mode produksi (Production)
   npm run start:prod
   ```

## Variabel Lingkungan (.env)

Berikut adalah daftar variabel lingkungan yang diperlukan:

### Konfigurasi Database & Keamanan
- `PORT`: Port server aplikasi.
- `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`: Kredensial MariaDB.
- `JWT_SECRET_KEY`: Kunci rahasia untuk token JWT.

### Konfigurasi Integrasi WhatsApp & Layanan
- `HOSTWA`, `SECRET_WA`, `HOSTWA2`: Konfigurasi API pengiriman pesan WhatsApp.
- `BASE_URL`: URL dasar aplikasi.
- `HOSTCDN`, `SECRET_CDN`: Konfigurasi Content Delivery Network.
- `SENTRY_DSN`: Data Source Name untuk monitoring error Sentry.

### Konfigurasi Redis & Lainnya
- `REDIS_URL`: URL koneksi Redis (e.g., `redis://localhost:6379`).
- `MORGAN_FORMAT`: Format log aplikasi (`dev`, `combined`, dll).
- `NODE_ENV`: Mode lingkungan (`development` atau `production`).

## Kontributor

- [@fakhryhizballah](https://github.com/fakhryhizballah)

---

## Riwayat Perubahan (Changelog)

### [2.7.6-absen] - 2025-05-27
- **Ditambahkan**: Informasi status LPKP dan model baru.
- **Diubah**: Pembaruan pada rekap LPKP.

### [2.7.5-absen] - 2025-05-16
- **Ditambahkan**: Modul Rekap Presensi Pegawai.
- **Diubah**: Perubahan urutan absen berdasarkan jadwal dinas.

### [2.7.4-absen] - 2025-04-10
- **Ditambahkan**: Bridging dengan mesin finger print.
- **Diubah**: Pengaturan jam dinas.

### [2.7.0 - 2.7.3] - Periode Maret-April 2025
- Penambahan modul kepegawaian, statistik, dan pagination.
- Perbaikan bug perhitungan pegawai dan filter pencarian.
- Notifikasi alamat cuti pegawai dan pengaturan jam dinas.

### [2.6.3 - 2.6.4] - Periode Feb-Maret 2025
- Implementasi brute force handler pada OTP.
- Penambahan UUID dan manajemen session login.
- Optimasi kecepatan aplikasi dan penggunaan Redis singleton pattern.