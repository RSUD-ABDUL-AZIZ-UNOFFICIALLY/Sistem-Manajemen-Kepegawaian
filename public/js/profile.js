$(document).ready(function () {
  $("#profil").submit(function (event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru

    var form = $(this);
    let data = {
      nama: $("#nama").val(),
      nik: $("#nik").val(),
      dep: $("#departemen").val(),
      jab: $("#jab").val(),
      atasan: $("#atasan").val(),
      bos: $("#bos").val(),
      tgl_lahir: $("#tgl_lahir").val(),
      nip: $("#nip").val(),
    };
   
    if ($("#atasan").val() == "") {
      Swal.fire({
        icon: "error",
        title: "Wajib ada atasan",
      });
      return;
    }
    if ($("#departemen").val() == "") {
     return Swal.fire({
        icon: "error",
        text: "Bidang departemen harus diisi.",
      });
    }

    $.ajax({
      url: "/api/updateProfile",
      method: "POST",
      data: data,
      success: function (response) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data berhasil diubah",
        });
        return;
      },
      error: function (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Data gagal diubah",
        });
      },
    });
  });
});
