new DataTable('#table-cuti', {
    ajax: {
        url: '/api/cuti/approve/all',
        method: 'GET',
        dataSrc: 'data'
    },
    columns: [
        { data: null },
        { data: 'data_cuti.user.nama' },
        {
            data: null,
            render: function (data, type, row) {
                let tmulai = row.data_cuti.mulai.split("-");
                let tanggalmulai = tmulai[2] + "/" + tmulai[1] + "/" + tmulai[0];
                let tsampai = row.data_cuti.samapi.split("-");
                let tanggalsampai = tsampai[2] + "/" + tsampai[1] + "/" + tsampai[0];
                return tanggalmulai + " - " + tanggalsampai;
            }
        },
        { data: 'data_cuti.jenis_cuti.type_cuti' },
        { data: 'data_cuti.jumlah' },
        { data: 'data_cuti.keterangan' },
        { data: 'status' },
        {
            data: null,
            render: function (data, type, row) {
                if (row.approve_date == null) {
                    return "Belum di Approve"
                } else {
                    let tanggalWaktuUTC = new Date(row.approve_date).toLocaleString("en-US", {
                        timeZone: "Asia/Jakarta",
                    });
                    // Mengubah zona waktu menjadi WIB (Waktu Indonesia Barat)

                    // Format akhir dalam format WIB
                    return tanggalWaktuUTC;
                    // approve_status = `${ tanggal } / ${ bulan } / ${ tahun } ${ jam }: ${ menit }: ${ detik } WIB`;

                }
            }
        },
        {
            data: null,
            render: function (data, type, row) {
                if (row.status == "Menunggu") {
                    return `<button type="button" class="btn  btn-outline-primary" onclick="preview(${row.id_cuti},'${row.data_cuti.user.nama}')"><i class="fa-solid fa-signature"></i>Preview</button>`;
                } else {
                    return `Sudah`;
                }
            }
        },
        { data: 'keterangan' }
    ],
    columnDefs: [
        {
            targets: [0],
            orderable: false,
            searchable: false,
        },
    ],
    order: [[1, 'asc']]
}
);