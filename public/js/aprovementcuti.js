$(document).ready(function () {
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
});

$('#tahun').change(function () {
    let tahun = $(this).val(); $("tbody > tr").remove();
    getRiwayatCuti(tahun);
});

async function getRiwayatCuti(tahun) {
    try {
        let response = await $.ajax({
            url: '/api/cuti/approvementcuti?tahun=' + tahun,
            method: 'GET'
        });
        parsingDataCuti(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

function parsingDataCuti(data) {
    let tbody = $("tbody");
    tbody.empty();

    if (!data || data.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="11" class="py-8 text-center text-base-content/60">
                    Tidak ada pengajuan cuti yang ditemukan.
                </td>
            </tr>
        `);
        return;
    }

    data.forEach((i, index) => {
        let nomor = index + 1;
        let tanggalmulai = (i.data_cuti.mulai && i.data_cuti.mulai !== '0000-00-00')
            ? new Date(i.data_cuti.mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })
            : "-";

        let tanggalsampai = (i.data_cuti.samapi && i.data_cuti.samapi !== '0000-00-00')
            ? new Date(i.data_cuti.samapi).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })
            : "-";

        let approve_status = "-";
        if (i.approve_date) {
            approve_status = new Date(i.approve_date).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        } else {
            approve_status = `<span class="badge badge-sm badge-warning badge-outline">Belum di Approve</span>`;
        }

        let ket = i.keterangan ? i.keterangan : "-";
        let alasan = i.data_cuti.keterangan ? i.data_cuti.keterangan : "-";
        let tipeCuti = i.data_cuti.jenis_cuti ? i.data_cuti.jenis_cuti.type_cuti : "-";
        let namaUser = i.data_cuti.user ? i.data_cuti.user.nama : "-";

        // Styling Badge Status Permohonan Cuti
        let badgeStatusClass = "badge-ghost";
        if (i.status === "Disetujui") badgeStatusClass = "badge-success";
        else if (i.status === "Ditolak") badgeStatusClass = "badge-error";
        else if (i.status === "Menunggu") badgeStatusClass = "badge-warning";

        let row = $("<tr>").addClass("hover");
        row.append($(`<td>${nomor}</td>`).addClass("font-medium"));
        row.append($(`<td>${namaUser}</td>`).addClass("font-semibold text-base-content"));
        row.append($(`<td>${tanggalmulai} s/d ${tanggalsampai}</td>`));
        row.append($(`<td><span class="badge badge-sm badge-outline badge-primary">${tipeCuti}</span></td>`));
        row.append($(`<td>${i.data_cuti.jumlah} hari</td>`));
        row.append($(`<td>${alasan}</td>`));
        row.append($(`<td class="align-middle">${i.alamat}</td>`));
        row.append($(`<td><span class="badge badge-sm ${badgeStatusClass}">${i.status}</span></td>`));
        row.append($(`<td>${approve_status}</td>`));

        if (i.status === "Menunggu") {
            row.append($(`
                <td>
                    <button type="button" class="btn btn-xs md:btn-sm btn-outline btn-primary gap-1" onclick="preview(${i.id_cuti}, '${namaUser}')">
                        <i class="fa-solid fa-signature"></i> Preview
                    </button>
                </td>
            `));
        } else {
            row.append($(`<td><span class="text-xs font-semibold text-success">Sudah diproses</span></td>`));
        }

        row.append($(`<td>${ket}</td>`).addClass("text-base-content/70"));
        tbody.append(row);
    });
}

async function preview(id, nama) {
    modalTemp(id, nama);
    // Menggunakan modal DaisyUI jika ada elemen dialog, atau fallback ke jQuery modal jika menggunakan plugin lama
    if ($('#templateModal').hasClass('modal')) {
        $('#templateModal')[0].showModal();
    } else {
        $('#templateModal').modal('show');
    }
}

function modalTemp(id, nama) {
    // Pastikan elemen label modal tersedia
    if (typeof templateModalLabel !== 'undefined' && templateModalLabel) {
        templateModalLabel.innerHTML = "Preview Cuti : " + nama;
    }

    let body = $('#body');
    body.empty();
    body.append(`
        <div class="space-y-4 py-2 text-center">
            <h3 class="text-lg font-bold text-base-content">Apakah anda menyetujui cuti ini?</h3>
            <p class="text-xs md:text-sm text-base-content/70">Berikan catatan atau alasan penolakan/persetujuan jika diperlukan.</p>

            <div class="form-control w-full">
                <input type="text" id="catatan" class="input input-bordered w-full hover:border-primary focus:border-primary transition-colors" placeholder="Catatan tambahan (Opsional)">
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                <button type="button" class="btn btn-success flex-1" onclick="setuju(${id})">
                    <i class="fas fa-check mr-1"></i> Setuju
                </button>
                <button type="button" class="btn btn-error flex-1" onclick="tolak(${id})">
                    <i class="fas fa-times mr-1"></i> Tolak
                </button>
            </div>
        </div>
    `);
}

async function setuju(id) {
    let data = {
        id: id,
        status: "Disetujui",
        keterangan: $('#catatan').val()
    };
    await updateCuti(data);
    Swal.fire('SIP!', 'Terima kasih telah menyetujui cuti ini.', 'success');

    if ($('#templateModal').hasClass('modal')) {
        $('#templateModal')[0].close();
    } else {
        $('#templateModal').modal('hide');
    }

    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
}

async function tolak(id) {
    let data = {
        id: id,
        status: "Ditolak",
        keterangan: $('#catatan').val()
    };
    await updateCuti(data);
    Swal.fire('Dibatalkan', 'Cuti tidak disetujui.', 'warning');

    if ($('#templateModal').hasClass('modal')) {
        $('#templateModal')[0].close();
    } else {
        $('#templateModal').modal('hide');
    }

    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);
}

async function updateCuti(data) {
    try {
        let response = await $.ajax({
            url: '/api/cuti/approvementcuti',
            method: 'POST',
            data: data
        });
        return response.data;
    } catch (error) {
        console.log(error.responseJSON);
        let err = error.responseJSON || { message: 'Terjadi kesalahan', data: 'Gagal memperbarui status cuti' };
        Swal.fire(err.message, err.data, 'error');
    }
}