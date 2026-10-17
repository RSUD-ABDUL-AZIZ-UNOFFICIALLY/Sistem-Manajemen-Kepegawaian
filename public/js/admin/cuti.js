$("#button-findID").on("click", function () {
    let findID = $("#findID").val();
    identias(findID);
});

function identias(id) {
    $.ajax({
        url: "/api/contact/user?search=" + id,
        method: "GET",
        success: function (response) {
            let data = response.data;
            if (data.length > 0 && data.length <= 1) {
                let user = data[0];
                $("#nik").val(user.fnik);
                $("#nama").val(user.nama);
                $("#noWA").val(user.wa);
                $("#jabatan").val(user.jabatan);
                $("#departemen").val(user.departemen);
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

            $('#jnsCuti').empty().append('<option value="" disabled selected>Pilih Jenis Cuti</option>');
            response.data.forEach(element => {
                $('#jnsCuti').append(`<option value="${element.id}">${element.type_cuti}</option>`);
            });
        },
        error: function (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.responseJSON ? error.responseJSON.message : 'Gagal memuat jenis cuti',
            });
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
    $('#reservation').prop('disabled', false);
    let id = $(this).val();
    let jnsCuti = dataCuti.find(x => x.id == id);

    if (jnsCuti) {
        $('#Keterangan_cuti').text(`${jnsCuti.type_cuti} maksimal ${jnsCuti.max} hari secara berturut-turut dan maksimal ${jnsCuti.total} hari dalam setahun.`);
        $('#reservation').val('');
        $('#totalReservation').val('');

        if (["Cuti Sakit", "Cuti Melahirkan", "Cuti Alasan Penting"].includes(jnsCuti.type_cuti)) {
            $('#lampiran').empty().append(`
                <label class="label" for="inputSuratCuti">
                    <span class="label-text font-semibold">Lampiran Surat ${jnsCuti.type_cuti}</span>
                </label>
                <input type="hidden" id="suratLampiran" name="suratLampiran">
                <input type="file" class="file-input file-input-bordered w-full hover:border-primary focus:border-primary transition-colors" id="inputSuratCuti" name="inputSuratCuti" accept="image/png, image/jpeg, application/pdf">
            `);
        } else {
            $('#lampiran').empty();
        }

        $('#reservation').daterangepicker({
            locale: { format: 'DD/MM/YYYY' }
        }, function (start, end) {
            mulaicuti = start.format('YYYY-MM-DD');
            akhircuti = end.format('YYYY-MM-DD');

            const selisihHari = moment(end, 'YYYY-MM-DD').diff(moment(start, 'YYYY-MM-DD'), 'days') + 1;

            if (selisihHari > jnsCuti.max) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Cuti tidak boleh lebih dari ${jnsCuti.max} hari`,
                });
                $('#reservation').val('');
                $('#totalReservation').val('');
                return false;
            }

            if (hariKerja === "5 Hari kerja") {
                $('#totalReservation').prop('disabled', false);
            }
            $('#totalReservation').val(selisihHari);
        });
    }
});

let token = getCookie("token");

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

    if (jnsCuti && ["Cuti Sakit", "Cuti Melahirkan", "Cuti Alasan Penting"].includes(jnsCuti.type_cuti)) {
        let file = $('#inputSuratCuti').prop('files')[0];

        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lampiran surat harus diisi',
            });
            $('#btnSubmit').prop('disabled', false);
            return false;
        }

        if (!['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            Swal.fire({
                icon: 'warning',
                title: 'File Tidak Valid.',
                text: 'File harus berupa PDF, JPG, PNG',
            });
            $('#btnSubmit').prop('disabled', false);
            return false;
        }

        if (file.size > 3000000) {
            Swal.fire({
                icon: 'warning',
                title: 'File Terlalu Besar.',
                text: 'File harus kurang dari 3 MB',
            });
            $('#btnSubmit').prop('disabled', false);
            return false;
        }

        let form = new FormData();
        let uploadUrl = "https://api.spairum.my.id/api/cdn/upload/file";

        if (file.type === 'application/pdf') {
            form.append("file", file, 'surat-cuti.pdf');
        } else {
            let fileType = file.type.split('/')[1];
            form.append("image", file, 'surat-cuti.' + fileType);
            uploadUrl = "https://api.spairum.my.id/api/cdn/upload/img";
        }

        $.ajax({
            url: uploadUrl,
            method: "POST",
            timeout: 0,
            headers: { Authorization: "Bearer " + token },
            processData: false,
            contentType: false,
            data: form,
            success: function (response) {
                let res = typeof response === 'string' ? JSON.parse(response) : response;
                datafrom.lampiran = res.data.url;
                postCuti(datafrom);
                if ($('#inputSuratCuti').length) $('#inputSuratCuti').val(null);
            },
            error: function () {
                Swal.fire('Gagal', 'Gagal mengunggah berkas lampiran', 'error');
                $('#btnSubmit').prop('disabled', false);
            }
        });
    } else {
        postCuti(datafrom);
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
                title: 'Berhasil',
                text: 'Cuti berhasil disimpan',
                showConfirmButton: false,
                timer: 2000
            });
            $('#jnsCuti').val('');
            $('#reservation').val('');
            $('#totalReservation').val('');
            $('#alasanCuti').val('');
            $('#alamat').val('');

            let tahun = $('#tahun').val();
            if (typeof getRiwayatCuti === 'function') getRiwayatCuti(tahun);
            $('#btnSubmit').prop('disabled', false);
        },
        error: function (error) {
            let err = error.responseJSON || { icon: 'error', message: 'Gagal', data: 'Terjadi kesalahan' };
            Swal.fire({
                icon: err.icon || 'error',
                title: err.message,
                text: err.data,
                showConfirmButton: false,
                timer: 2000
            });
            $('#btnSubmit').prop('disabled', false);
        }
    });
}