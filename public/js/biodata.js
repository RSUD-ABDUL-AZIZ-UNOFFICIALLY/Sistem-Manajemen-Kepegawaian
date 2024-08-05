$(document).ready(function () {
    getProfilePic();
    $.ajax({
        url: "/api/getBiodata",
        method: "GET",
        success: function (response) {
            console.log(response)
            $("#alamat").val(response.data.alamat);
            $("#pangkat").val(response.data.pangkat);
            $("#tmt_pangkat").val(response.data.tmt_pangkat);
            $("#marital").val(response.data.marital);
            $("#golongan_darah").val(response.data.golongan_darah);
            $("#jns_kerja").val(response.data.jns_kerja);
            $("#tmt_kerja").val(response.data.tmt_kerja);
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
        tmt_pangkat: $("#tmt_pangkat").val(),
        marital: $("#marital").val(),
        golongan_darah: $("#golongan_darah").val(),
        jns_kerja: $("#jns_kerja").val(),
        tmt_kerja: $("#tmt_kerja").val(),
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

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#preview').attr('src', e.target.result).show();
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#profilePic").change(function () {
    readURL(this);
});



function getProfilePic() {
    let src = $("#imgUser").attr("src");
    $("#preview").attr("src", src);
}

$("#profilePicForm").submit(function (event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru
    let formData = new FormData();
    formData.append("image", $("#profilePic")[0].files[0]);
    console.log(formData)


    // kiriman data ke /api/postPic
    $.ajax({
        url: "/api/postPic",
        method: "POST",
        data: formData,
        mimeType: "multipart/form-data",
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response)
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Foto berhasil diubah",
            });
            // clear file input
            $("#profilePic").val(null);
            sessionStorage.removeItem("img");
        },
        error: function (error) {
            console.error(error)
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Foto gagal diubah",
            });
        },
    });

});