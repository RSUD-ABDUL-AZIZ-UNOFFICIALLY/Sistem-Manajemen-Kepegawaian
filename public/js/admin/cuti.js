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
    if (jnsCuti.type_cuti == "Cuti Sakit" || jnsCuti.type_cuti == "Cuti Melahirkan") {

        $('#lampiran').empty();
        $('#lampiran').append(`<label for="InputActivities">Lampiran Surat ${jnsCuti.type_cuti}</label>
                        <input type="hidden" class="form-control" id="suratLampiran" name="suratLampiran">
                        <div class="input-group mb-3">
                          <input type="file" class="form-control" id="inputSuratCuti" name="inputSuratCuti" accept="image/png, image/jpeg, application/pdf">
                          <label class="input-group-text" for="inputSuratCuti" id="UploadSuratCuti">Upload</label>
                        </div>`);

    } else {
        $('#lampiran').empty();
    }
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
let token = getCookie("token");
// on button submit 
$('#Cuti').submit(function (event) {
    event.preventDefault();
    $('#btnSubmit').prop('disabled', true);
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
    let id = $('#jnsCuti').val();
    let jnsCuti = dataCuti.find(x => x.id == id);

    // let jnsCuti = dataCuti.find(x => x.id == id);
    if (jnsCuti.type_cuti == "Cuti Sakit" || jnsCuti.type_cuti == "Cuti Melahirkan") {
        if ($('#inputSuratCuti').prop('files')[0] == undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lampiran surat harus diisi',
            })
            return false;
        }
        let file = $('#inputSuratCuti').prop('files')[0];
        if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
            Swal.fire({
                icon: 'warning',
                title: 'File Tidak Valid.',
                text: 'File harus berupa PDF, JPG, PNG',
            })
            return false;
        }
        if (file.size > 3000000) {
            Swal.fire({
                icon: 'warning',
                title: 'File Terlalu Besar.',
                text: 'File harus kurang dari 3 MB',
            })
            return false;
        }
        if (file.type == 'application/pdf') {
            var form = new FormData();
            form.append("file", file, 'surat-cuti.pdf');
            var settings = {
                url: "https://api.rsudaa.singkawangkota.go.id/api/cdn/upload/file",
                method: "POST",
                timeout: 0,
                headers: {
                    Authorization: "Bearer " + token,
                },
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: form
            };

            $.ajax(settings).done(function (response) {
                response = JSON.parse(response);
                console.log(response.data.url);
                datafrom.lampiran = response.data.url;
                postCuti(datafrom)
                inputSuratCuti.value = null;
                return;
            });
        }
        if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/jpg') {
            let fileType = file.type.split('/')[1];
            let form = new FormData();
            form.append("image", file, 'surat-cuti.' + fileType);

            let settings = {
                url: "https://api.rsudaa.singkawangkota.go.id/api/cdn/upload/img",
                method: "POST",
                timeout: 0,
                headers: {
                    Authorization: "Bearer " + token,
                },
                processData: false,
                mimeType: "multipart/form-data",
                contentType: false,
                data: form
            };

            $.ajax(settings).done(function (response) {
                response = JSON.parse(response);
                console.log(response.data.url);
                datafrom.lampiran = response.data.url;
                postCuti(datafrom)
                inputSuratCuti.value = null;
                return;
            });
        }
    } else {
        // console.log(datafrom);
        postCuti(datafrom)
    }


});

function postCuti(datafrom) {
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
            $('#jnsCuti').val('');
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
}