
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

  return tanggalFormat;
}
function convertdatetime(tanggalInput) {
  date = new Date(tanggalInput);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return day + "-" + month + "-" + year + " " + hours + ":" + minutes + ":" + seconds;
}
function generateUID(length) {
  // Generate a random number between 100000 and 999999
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var uid = '';
  
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    uid += chars[randomIndex];
  }
  
  return uid;
}
function generateDelay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = {
    convertdate,
    convertdatetime,
  generateUID,
  generateDelay
}