
# Sistem Manajemen Kepegawaian (SIMPEG)

Sistem Informasi Manajemen Kepegawaian (SIMPEG) yang digunakan oleh RSUD Abdul Aziz Kota Singkawang. Sistem ini dirancang untuk mengelola informasi terkait kepegawaian, seperti data pegawai, layanan administratif, dan otentikasi login berbasis One-Time Password (OTP) yang dikirimkan melalui WhatsApp.



## Installation
Berikut adalah petunjuk instalasi untuk REST API profile matching sistem rekomendasi penentuan jurusan kuliah bagi siswa-siswi SMA:

```bash
  git clone https://github.com/RSUD-ABDUL-AZIZ-UNOFFICIALLY/Sistem-Manajemen-Kepegawaian.git
  cd Sistem-Manajemen-Kepegawaian
```

Setelah setup Environment Variables jalankan scrip
untuk memulai pertamakali
```bash
   npm run build
   npm run dev
```
## Environment Variables

Untuk menjalankan proyek ini, Anda perlu menambahkan variabel lingkungan berikut ke file .env yang dapat di copy dari file env

#### SQL SECURITY
```bash
PORT=
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=
DB_PORT=3306
DB_DIALECT=mariadb
JWT_SECRET_KEY=
HOSTWA=""

SECRET_WA="DEV-TOKEN"
HOSTCONTACT=""
HOSTWA2=""
GROUP_IT=""
BASE_URL="http://"

HOSTCDN=""
SECRET_CDN=""

SENTRY_DSN=""

HOSTMAIL=""
SECRET_MAIL=""

HOSTKHNZA=
SECRET_KHNZA=""

MORGAN_FORMAT="dev"
# MORGAN_FORMAT="combined" || "common" || "dev" || "short" || "tiny"
NODE_ENV="development"

REDIS_URL="redis://localhost:6379"
REDIS_URL_PORT="
REDIS_PASSWORD=""

```

## Authors

- [@fakhryhizballah](https://github.com/fakhryhizballah)


## Changelog

### [2.6.3-security] - 2025-02-27
#### Ditambahkan
- Hanndel brute force OTP.
- Menambahakan session.
- Mendambahkan Modul Momen Js.
- Menampilakan sesi login.

#### Diperbaiki
- Bug pada visit ID.
- Optimasi kecepatan aplikasi.
- Bug pada session menambhakan transaksi agar data sesi konsisten.

#### Diubah
- Menyiman IP dari proxy.
- Membuat redis menjadi singleton pattern.
- Tidak mengirim pesan pada untuk nomor yang tidak di kenal.


### [2.6.4-security] - 2025-03-06
#### Ditambahkan
- UUID.
- Halaman 404.

#### Diubah
-  Visit_id ganti dengan UUID.

### [2.7.0-pegawai] - 2025-03-10
#### Ditambahkan
- Modul Kepegawaian.
- Data statistik pegawai.
- Pembaruhuan data pegawai.

### [2.7.1-pegawai] - 2025-03-12
#### Diperbaiki
- Bug pada perhitungan jumlah pegawi.
- Bug pada data pegawai.

#### Ditambahkan
- Pagination pada data pegawai.
- Pencarian data pegawai.
- Filter data pegawai.

### [2.7.2-pegawai] - 2025-04-10
#### Ditambahkan
- Notifikasi alamat cuti pegawai.


### [2.7.3-pegawai] - 2025-04-10
#### Ditambahkan
- Pengaturan Jam Dinas.