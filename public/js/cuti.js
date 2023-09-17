
let hariKerja = '';
$.ajax({
    url: '/api/getBiodata',
    method: 'GET',
    success: function (response) {
        console.log(response);
        hariKerja = response.data.jns_kerja;
    },
    error: function (error) {
        console.log(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Lengkapi biodata anda terlebih dahulu',
            toast: true,
            confirmButtonText: "OK",
            // showCancelButton: true,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false, // Tidak memungkinkan untuk mengklik luar jendela SweetAlert
            allowEscapeKey: false,   // Tidak memungkinkan untuk menutup dengan tombol "Esc"
            allowEnterKey: true,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/profile';
            }
        });
    }
});

let totalCuti = 0;
let maxCuti = 0;
let dataCuti = [];
let mulaicuti = '';
let akhircuti = '';

$.ajax({
    url: '/api/cuti/jns',
    method: 'GET',
    success: function (response) {
        console.log(response);
        dataCuti = response.data;
        // change select option jnscuti type_cuti
        response.data.forEach(element => {
            $('#jnsCuti').append(`<option value="${element.id}">${element.type_cuti}</option>`);
        });
    },
    error: function (error) {
    }
});
$('#jnsCuti').change(function () {
    // enable reservation
    $('#reservation').prop('disabled', false);
    let id = $(this).val();
    console.log(id);
    console.log(dataCuti);
    let jnsCuti = dataCuti.find(x => x.id == id);
    console.log(jnsCuti);

    $('#reservation').daterangepicker({
        // opens: 'left',
        minDate: moment().startOf('day'),
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
        const selisihHari = tanggalAkhir.diff(tanggalAwal, 'days');
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
            console.log('5 hari kerja');
            $('#totalReservation').prop('disabled', false);
        }
        $('#totalReservation').val(selisihHari);
    });
});

// on button submit 
$('#Cuti').submit(function (event) {
    event.preventDefault();
    let datafrom = {
        type_cuti: $('#jnsCuti').val(),
        mulai: mulaicuti,
        samapi: akhircuti,
        jumlah: $('#totalReservation').val(),
        keterangan: $('#alasanCuti').val(),
        maxCuti: maxCuti,
    };
    console.log(datafrom);
    $.ajax({
        url: '/api/cuti',
        method: 'POST',
        data: datafrom,
        success: function (response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
                text: 'Cuti berhasil disimpan',
                showConfirmButton: false,
                timer: 2000
            })
            // $('#jnsCuti').val('');
            // $('#reservation').val('');
            // $('#totalReservation').val('');
            // $('#keterangan').val('');
            return;
        },
        error: function (error) {
            console.log(error);
        }
    });
});

