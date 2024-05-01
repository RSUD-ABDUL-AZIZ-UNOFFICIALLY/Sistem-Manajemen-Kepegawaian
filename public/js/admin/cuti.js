$("#button-findID").on("click", function () {
    let findID = $("#findID").val();
    identias(findID);
});

function identias(id) {
    $.ajax({
        url: "/api/contact/user?search=" + id,
        method: "GET",
        success: function (response) {
            console.log(response);
            let data = response.data;
            console.log(data.length);
            if (data.length > 0 && data.length <= 1) {
                let user = data[0];
                $("#nik").val(user.fnik);
                $("#nama").val(user.nama);
                $("#noWA").val(user.wa);
                $("#jabatan").val(user.jabatan);
                $("#departemen").val(user.departemen);
                console.log(user.status);
                statusPegawai(user.status, user.fnik);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Data tidak ditemukan",
                    showConfirmButton: false,
                    timer: 1500
                });

            }
        },
        error: function (error) {
            console.log(error);

        },
    });
}

function statusPegawai(status, nik) {
    $.ajax({
        url: '/api/cuti/jns?status=' + status + '&nik=' + nik,
        method: 'GET',
        success: function (response) {
            $('#jnsCuti').attr("disabled", false);
            dataCuti = response.data;
            hariKerja = response.bio.jns_kerja;
            // change select option jnscuti type_cuti
            response.data.forEach(element => {
                $('#jnsCuti').append(`<option value="${element.id}">${element.type_cuti}</option>`);
            });
        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.responseJSON.message,
            })
        }
    });
}
let hariKerja = '';
let totalCuti = 0;
let maxCuti = 0;
let dataCuti = [];
let mulaicuti = '';
let akhircuti = '';

$('#jnsCuti').change(function () {
    // enable reservation
    $('#reservation').prop('disabled', false);
    let id = $(this).val();
    let jnsCuti = dataCuti.find(x => x.id == id);
    $('#Keterangan_cuti').text(jnsCuti.type_cuti + ' maksimal ' + jnsCuti.max + ' hari secara berturut-turut dan maksimal ' + jnsCuti.total + ' hari dalam setahun.');
    $('#reservation').val('');
    $('#totalReservation').val('');

    $('#reservation').daterangepicker({
        // opens: 'left',
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (start, end) {
        // Tanggal awal
        mulaicuti = start.format('YYYY-MM-DD');
        const tanggalAwal = moment(start, 'YYYY-MM-DD');
        // Tanggal akhir
        akhircuti = end.format('YYYY-MM-DD');
        const tanggalAkhir = moment(end, 'YYYY-MM-DD');

        // Menghitung perbedaan hari
        const selisihHari = tanggalAkhir.diff(tanggalAwal, 'days') + 1;
        if (selisihHari > jnsCuti.max) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Cuti tidak boleh lebih dari ${jnsCuti.max} hari`,
            })
            $('#reservation').val('');
            $('#totalReservation').val('');
            return false;
        }
        if (hariKerja == "5 Hari kerja") {
            $('#totalReservation').prop('disabled', false);
        }
        $('#totalReservation').val(selisihHari);
    });
});

$('#Cuti').submit(function (event) {
    event.preventDefault();
    let datafrom = {
        nama: $('#nama').val(),
        nik: $('#nik').val(),
        noWA: $('#noWA').val(),
        departemen: $('#departemen').val(),
        type_cuti: $('#jnsCuti').val(),
        mulai: mulaicuti,
        samapi: akhircuti,
        jumlah: $('#totalReservation').val(),
        keterangan: $('#alasanCuti').val(),
        maxCuti: maxCuti,
        alamat: $('#alamat').val()
    };
    $('#btnSubmit').prop('disabled', true);
    $.ajax({
        url: '/api/cuti/late',
        method: 'POST',
        data: datafrom,
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
                text: 'Cuti berhasil disimpan',
                showConfirmButton: false,
                timer: 2000
            })
            // $('#jnsCuti').val('');
            $('#reservation').val('');
            $('#totalReservation').val('');
            $('#reservation').prop('disabled', false);
            $('#totalReservation').prop('disabled', false);
            $('#alasanCuti').val('');
            $('#alamat').val('');
            let tahun = $('#tahun').val();
            getRiwayatCuti(tahun);
            $('#btnSubmit').prop('disabled', false);
        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                icon: error.responseJSON.icon,
                title: error.responseJSON.message,
                text: error.responseJSON.data,
                showConfirmButton: false,
                timer: 2000
            });
            $('#btnSubmit').prop('disabled', false);
        }
    });
});
