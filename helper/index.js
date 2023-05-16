
function convertdate(tanggalInput) {
// Array hari dalam bahasa Inggris
var namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

// Membuat objek Date dari tanggal input
var tanggal = new Date(tanggalInput);

// Mengambil hari dari tanggal
var hari = tanggal.getDay();

// Mengambil tanggal, bulan, dan tahun dari tanggal
var tanggalAngka = tanggal.getDate();
var bulan = tanggal.getMonth() + 1; // Penambahan 1 karena Januari dimulai dari 0
var tahun = tanggal.getFullYear();

// Format tanggal ke dalam "hari, DD-MM-YYYY"
var tanggalFormat = namaHari[hari] + ", " + ("0" + tanggalAngka).slice(-2) + "-" + ("0" + bulan).slice(-2) + "-" + tahun;

// console.log(tanggalFormat);
  return tanggalFormat;
}

module.exports = {
    convertdate
}