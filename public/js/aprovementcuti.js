

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
        url: '/api/cuti/approvementcuti?tahun=' + tahun,
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
// new DataTable('#tabelCuti', {
//     layout: {
//         bottomEnd: {
//             paging: {
//                 boundaryNumbers: false
//             }
//         }
//     }
// });
function parsingDataCuti(data) {
    let rows = $("tbody > tr");
    rows.remove();
    for (let i of data) {
        let nomor = data.indexOf(i) + 1;
        let tanggalmulai;
        let tanggalsampai;
        if (i.data_cuti.mulai == null || i.data_cuti.mulai == '0000-00-00') {
            tanggalmulai = "-";
        } else {
            tanggalmulai = new Date(i.data_cuti.mulai).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            });
        }
        if (i.data_cuti.samapi == null || i.data_cuti.samapi == '0000-00-00') {
            tanggalsampai = "-";

        } else {
            tanggalsampai = new Date(i.data_cuti.samapi).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            });
        }
        let approve_status = "";
        if (i.approve_date == null) {
            approve_status = "Belum di Approve"
        } else {
            let tanggalWaktuUTC = new Date(i.approve_date).toLocaleString("en-US", {
                timeZone: "Asia/Jakarta",
            });
            // Mengubah zona waktu menjadi WIB (Waktu Indonesia Barat)

            // Format akhir dalam format WIB
            approve_status = tanggalWaktuUTC;
            // approve_status = `${ tanggal } / ${ bulan } / ${ tahun } ${ jam }: ${ menit }: ${ detik } WIB`;

        }
        let ket
        if (i.keterangan == null) {
            i.keterangan = "-"
        }

        let row = $("<tr>");
        row.append($("<td>" + nomor + "</td>"));
        row.append($("<td>" + i.data_cuti.user.nama + "</td>"));
        row.append($("<td>" + tanggalmulai + " s/d " + tanggalsampai + "</td>"));
        row.append($("<td>" + i.data_cuti.jenis_cuti.type_cuti + "</td>"));
        row.append($("<td>" + i.data_cuti.jumlah + "</td>"));
        row.append($("<td>" + i.data_cuti.keterangan + "</td>"));
        row.append($("<td style='vertical-align: inherit'>" + i.alamat + "</td>"));
        row.append($("<td>" + i.status + "</td>"));
        row.append($("<td>" + approve_status + "</td>"));
        if (i.status == "Menunggu") {
            row.append($(`<td><button type="button" class="btn  btn-outline-primary" onclick="preview(${i.id_cuti},'${i.data_cuti.user.nama}')"><i class="fa-solid fa-signature"></i>Preview</button></td > `));
        } else {
            row.append($(`<td>Sudah</td>`));
        }
        row.append($("<td>" + i.keterangan + "</td>"));
        $("tbody").append(row);
    }
}

async function preview(id, nama) {
    modalTemp(id, nama);
    $('#templateModal').modal('show');
}
function modalTemp(id, nama) {
    templateModalLabel.innerHTML = "Preview Cuti : " + nama;
    let body = $('#body');
    body.empty();
    body.append(`
        <div class="container">
          <div class="card-body text-center">
            <h4 class="card-title-center ">Apkah anda menyetujui cuti ini?</h4>
            <p class="card-text">Berikan catatan jika diperlukan</p>
            <input type="text" class="form-control" id="catatan" placeholder="Catatan">
            <br>
            <button type="button" class="btn btn-primary" onclick="setuju(${id})">Setuju</button>
            <button type="button" class="btn btn-danger" onclick="tolak(${id})">Tolak</button>
          </div>
        </div>
        `);
}
async function setuju(id) {
    let data = {
        id: id,
        status: "Disetujui",
        keterangan: $('#catatan').val()
    }
    await updateCuti(data);
    Swal.fire('SIP', 'Terima kasih telah menyetujui cuti ini.', 'success')
    $('#templateModal').modal('hide');
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
}
async function tolak(id) {
    let data = {
        id: id,
        status: "Ditolak",
        keterangan: $('#catatan').val()
    }
    await updateCuti(data);
    Swal.fire('Terimakasih', 'Cuti tidak disetujui dan di batalkan', 'warning')
    $('#templateModal').modal('hide');
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
}
async function updateCuti(data) {
    await $.ajax({
        url: '/api/cuti/approvementcuti',
        method: 'POST',
        data: data,
        success: function (response) {
            return response.data;
        },
        error: function (error) {
            console.log(error.responseJSON);
            Swal.fire(error.responseJSON.message, error.responseJSON.data, 'error')
        }
    });
}