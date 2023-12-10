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
            $("#id_akun").val(data.data.user.id);
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
    placeholder: "Cari data pasien",
    ajax: {
        url: '/rest/hardin/rm/pasien',
        dataType: 'json',
        data: function (params) {
            return {
                search: params.term,  // Menambahkan parameter 'q' dengan nilai input pengguna
                page: params.page
            };
        },
        processResults: function (data, params) {
            params.page = params.page || 1;
            console.log(data.data);
            return {
                results: data.data.map(function (item) {
                    return {
                        id: item.no_rkm_medis,  // Menetapkan ID dan teks dari setiap item array
                        text: item.nm_pasien + " - " + item.no_rkm_medis
                    };
                })
            };
        },
        cache: true,
        minimumInputLength: 3,
        // Additional AJAX parameters go here; see the end of this chapter for the full code of this example
    }

});

$('#cari_pasien').on('change', function (e) {
    let selectedValue = $(this).val();
    $.ajax({
        url: "/rest/hardin/rm/pasien/" + selectedValue,
        method: "GET",
        success: function (data) {
            console.log(data.data);
            $("#nama_pasien").val(data.data.nm_pasien);
            $("#nik_pasien").val(data.data.no_ktp);
            $("#norm_pasien").val(data.data.no_rkm_medis);
            $("#tgl_lahir_pasien").val(data.data.tgl_lahir);
            $('#no_bpjs').val(data.data.no_peserta);
            $("#tambah_anggota_pasien").prop('disabled', false);
        },
        error: function (error) {
            return Swal.fire({
                text: error.responseJSON.message,
                icon: "warning",
            });
        }
    });
    console.log('Nilai yang dipilih:', selectedValue);
});
$("#tambah_anggota_pasien").on("click", function () {
    let id_akun = $("#id_akun").val();
    let no_rkm_medis = $("#norm_pasien").val();
    let hubungan = $("#hubungan_pasien").val();
    let nama = $("#nama_pasien").val();
    let nik = $("#nik_pasien").val();
    if (hubungan == "Pilih Hubungan") {
        return Swal.fire({
            text: "Pilih status hubungan dengan pasien",
            icon: "warning",
        });
    }
    let data = {
        name: nama, nik: nik, noRm: no_rkm_medis, familyId: id_akun, hubungan
    }
    console.log(data);
    // $.ajax({
    //     url: "/rest/hardin/family",
    //     method: "POST",
    //     data: data,
    //     success: function (data) {
    //         console.log(data);
    //         Swal.fire({
    //             text: "Data keluarga berhasil ditambahkan",
    //             icon: "success",
    //         });
    //         $("#hubungan").val("");
    //         $("#nama").val("");
    //         $("#nik").val("");
    //         $("#tgl_lahir").val("");
    //         $("#no_bpjs").val("");
    //     },
    //     error: function (error) {
    //         return Swal.fire({
    //             text: error.responseJSON.message,
    //             icon: "warning",
    //         });
    //     }
    // });

});