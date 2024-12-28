
let hariKerja = '';
$.ajax({
    url: '/api/getBiodata',
    method: 'GET',
    success: function (response) {
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
let mulaicuti = moment().format('YYYY-MM-DD');
let akhircuti = moment().format('YYYY-MM-DD');

$.ajax({
    url: '/api/cuti/jns',
    method: 'GET',
    success: function (response) {
        dataCuti = response.data;
        // change select option jnscuti type_cuti
        response.data.forEach(element => {
            $('#jnsCuti').append(`<option value="${element.id}">${element.type_cuti}</option>`);
        });
    },
    error: function (error) {
    }
});
async function sisaCuti(id_cuti) {
    return $.ajax({
        url: '/api/cuti/sisa?type_cuti=' + id_cuti,
        method: 'GET',
        success: function (response) {
            return response.data;
        },
        error: function (error) {
        }
    })
}
$('#jnsCuti').change(async function () {
    // enable reservation
    $('#reservation').prop('disabled', false);
    let id = $(this).val();
    let jnsCuti = dataCuti.find(x => x.id == id);
    let x = await sisaCuti(jnsCuti.id);
    $('#Keterangan_cuti').text(jnsCuti.type_cuti + ' maksimal ' + jnsCuti.max + ' hari secara berturut-turut dan maksimal ' + jnsCuti.total + ' hari dalam setahun. Sisa cuti anda ' + x.data.sisa_cuti + ' hari');
    $('#reservation').val('');
    $('#totalReservation').val('1');
    // $('#totalReservation').val('');
    let mindate
    if (jnsCuti.type_cuti == "Cuti Sakit" || jnsCuti.type_cuti == "Cuti Melahirkan") {
        // mindate = moment().clone().startOf('week')
        mindate = moment().subtract(1, 'weeks').startOf('day')
        $('#lampiran').empty();
        $('#lampiran').append(`<label for="InputActivities">Lampiran Surat ${jnsCuti.type_cuti}</label>
                        <input type="hidden" class="form-control" id="suratLampiran" name="suratLampiran">
                        <div class="input-group mb-3">
                          <input type="file" class="form-control" id="inputSuratCuti" name="inputSuratCuti" accept="image/png, image/jpeg, application/pdf">
                          <label class="input-group-text" for="inputSuratCuti" id="UploadSuratCuti">Upload</label>
                        </div>`);

    } else {
        mindate = moment().subtract(1, 'days').startOf('day')
        $('#lampiran').empty();
    }
    $('#reservation').daterangepicker({
        // opens: 'left',
        minDate: mindate,
        maxDate: moment('2024-12-31', 'YYYY-MM-DD'),
        singleDatePicker: false,
        autoApply: false,
        autoUpdateInput: true,
        locale: {
            format: 'DD/MM/YYYY',
            daysOfWeek: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
            monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
            firstDay: 1,
            applyLabel: 'Pilih',
            cancelLabel: 'Batal',
            customRangeLabel: 'Pilih Tanggal'
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
        url: '/api/cuti',
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

$(document).ready(function () {
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
});
$('#tahun').change(function () {
    let tahun = $(this).val();
    let rows = $("tbody > tr");
    rows.remove();
    getRiwayatCuti(tahun);
});
async function getRiwayatCuti(tahun) {
    let data = await $.ajax({
        url: '/api/cuti/riwayat?tahun=' + tahun,
        method: 'GET',
        success: function (response) {
            parsingDataCuti(response.data);
            return response.data;
        },
        error: function (error) {
            console.log(error);
        }
    });
    return data;
}
function parsingDataCuti(data) {

    let rows = $("tbody > tr");
    rows.remove();
    for (let i of data) {
        // console.log(i.mulai);
        let nomor = data.indexOf(i) + 1;
        // let tmulai = i.mulai.split("-");
        // let tanggalmulai = tmulai[2] + "/" + tmulai[1] + "/" + tmulai[0];
        let tanggalmulai;
        let tanggalsampai;
        if (i.mulai == null || i.mulai == '0000-00-00') {
            tanggalmulai = "-";
        } else {
            tanggalmulai = new Date(i.mulai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        // let tsampai = i.samapi.split("-");
        // let tanggalsampai = tsampai[2] + "/" + tsampai[1] + "/" + tsampai[0];
        if (i.samapi == null || i.samapi == '0000-00-00') {
            tanggalsampai = "-";

        } else {
            tanggalsampai = new Date(i.samapi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }

        let tglApproval = new Date(i.approval.approve_date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        let waktuApproval = new Date(i.approval.approve_date).toLocaleTimeString('id-ID');

        if (i.approval.approve_date === null) {
            i.approval.approve_date = '-'
        } else {
            i.approval.approve_date = tglApproval + " " + waktuApproval;
        }
        if (i.approval.atasan === null) {
            i.approval.atasan = { nama: '-' };
        }

        let row = $("<tr>");
        row.append($("<td>" + nomor + "</td>"));
        row.append($("<td>" + tanggalmulai + " - " + tanggalsampai + "</td>"));
        row.append($("<td>" + i.jenis_cuti.type_cuti + "</td>"));
        row.append($("<td>" + i.jumlah + "</td>"));
        row.append($("<td>" + i.keterangan + "</td>"));
        row.append($("<td>" + i.approval.status + "</td>"));
        row.append($("<td>" + i.approval.approve_date + "</td>"));
        row.append($("<td>" + i.approval.atasan.nama + "</td>"));
        row.append($("<td>" + i.approval.keterangan + "</td>"));
        // tabah tombol edit dan delete
        let btnDelete = $("<button>");
        btnDelete.addClass("btn btn-danger btn-sm");
        btnDelete.attr("onclick", "deleteCuti(" + i.id + ")");
        btnDelete.html("<i class='fas fa-trash'></i> Batalkan");
        let btnCetak = $("<button>");
        btnCetak.addClass("btn btn-primary btn-sm");
        btnCetak.attr("onclick", "cetakSuratCuti(" + i.id + ")");
        btnCetak.html("<i class='fa-solid fa-envelope-open-text'></i> Cetak Surat Cuti");
        if (i.approval.status == "Menunggu") {
            row.append($("<td>").append(btnCetak, btnDelete));
        } else if (i.approval.status == "Disetujui" || i.approval.status == "Ditolak" || i.approval.status == "Perubahan") {
            row.append($("<td>").append(btnCetak));
        } $("tbody").append(row);
    }
}
cetakSuratCuti = (id) => {
    let data = $.ajax({
        url: '/api/cuti/suratCuti',
        method: 'POST',
        data: { id: id },
        success: function (response) {
            window.open('/api/cuti/suratCuti?token=' + response.data, '_blank');
            // return response;
        },
    });


}

deleteCuti = (id) => {
    Swal.fire({
        title: 'Apakah anda yakin?',
        text: "Data cuti akan dihapus",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, hapus data!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/cuti?id=' + id,
                method: 'DELETE',
                success: function (response) {
                    console.log(response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Succeed',
                        text: 'Data berhasil dihapus',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    let tahun = $('#tahun').val();
                    getRiwayatCuti(tahun);
                },
                error: function (error) {
                    Swal.fire({
                        icon: error.responseJSON.icon,
                        title: error.responseJSON.message,
                        text: error.responseJSON.data,
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        }
    })

}