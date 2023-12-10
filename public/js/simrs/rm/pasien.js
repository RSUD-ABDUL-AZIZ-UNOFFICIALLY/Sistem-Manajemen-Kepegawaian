$("#button-cari_akun").on("click", function () {
    let no_wa = $("#no_wa_akun").val();
    console.log(no_wa.length);
    if (no_wa.length <= 10) {
        return Swal.fire({
            text: "No WA tidak boleh kurang dari 10 digit",
            icon: "warning",
        });
    }
    $.ajax({
        url: "/rest/hardin/rm/user?no_wa=" + no_wa,
        method: "GET",
        data: {
            no_wa: no_wa,
        },
        success: function (data) {
            $("#nama_akun").val(data.data.user.fullname);
            $("#nik_akun").val(data.data.user.nik);
            if (data.data.family.length < 1) {
                Swal.fire({
                    text: "Data keluarga belum ada",
                    icon: "warning",
                });
            }
            $("#cari_pasien").prop('disabled', false);
        },
        error: function (error) {
            return Swal.fire({
                text: error.responseJSON.message,
                icon: "warning",
            });
        }
    });
});
$("#cari_pasien").select2({
    placeholder: "Cari pasien",
    ajax: {
        url: 'https://api.github.com/search/repositories',
        dataType: 'json'
        // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
    }

});