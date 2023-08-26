$(document).ready(function () {
    console.log("ready! biodata.js");
    $.ajax({
        url: "/api/getBiodata",
        method: "GET",
        success: function (response) {
            console.log(response)
            $("#alamat").val(response.data.alamat);
            $("#pangkat").val(response.data.pangkat);
            $("#marital").val(response.data.marital);
            $("#golongan_darah").val(response.data.golongan_darah);
            $("#jns_kerja").val(response.data.jns_kerja);
        },
        error: function (error) {
            console.error(error)
            Swal.fire({
                icon: "warning",
                title: error.message,
                text: "lengkapi biodata anda",
            });
        },
    });
});

$("#biodata").submit(function (event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru
    let formData = {
        alamat: $("#alamat").val(),
        pangkat: $("#pangkat").val(),
        marital: $("#marital").val(),
        golongan_darah: $("#golongan_darah").val(),
        jns_kerja: $("#jns_kerja").val(),
    }
    console.log(formData)
    $.ajax({
        url: "/api/updateBiodata",
        method: "POST",
        data: formData,
        success: function (response) {
            console.log(response)
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Data berhasil diubah",
            });
        },
        error: function (error) {
            console.error(error)
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Data gagal diubah",
            });
        },
    });
})
