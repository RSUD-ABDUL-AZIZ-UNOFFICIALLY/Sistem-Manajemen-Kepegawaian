let periode = new Date().toISOString().slice(0, 4);

async function getTabel(periode) {
    // Hancurkan instance DataTable yang lama jika ada
    if ($.fn.DataTable.isDataTable('#tableCuti')) {
        $('#tableCuti').DataTable().destroy();
    }

    // Daftarkan custom searching plug-in untuk memfilter name_user (kolom index 2) atau departemen (kolom index 3)
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        if (settings.nTable.id !== 'tableCuti') {
            return true;
        }

        let keyword = $('#searchUserDep').val().toLowerCase();
        if (!keyword) {
            return true;
        }

        let namaUser = (data[2] || "").toLowerCase();
        let departemen = (data[3] || "").toLowerCase();

        if (namaUser.includes(keyword) || departemen.includes(keyword)) {
            return true;
        }

        return false;
    });

    let table = $('#tableCuti').DataTable({
        ajax: {
            url: "/api/cuti/approve/all?tahun=" + periode,
            type: "GET",
            dataSrc: function (json) {
                return json.data || json;
            }
        },
        columns: [
            { data: "id", className: "font-medium" },
            {
                data: "data_cuti.createdAt",
                render: function (data) {
                    return data ? moment(data).format("YYYY-MM-DD HH:mm") : "-";
                }
            },
            { data: "name_user", className: "font-semibold text-base-content" },
            { data: "departemen" },
            {
                data: "type_cuti",
                render: function (data) {
                    return `<span class="badge badge-sm badge-outline badge-primary">${data || '-'}</span>`;
                }
            },
            { data: "tgl_cuti" },
            { data: "cuti_diambil", className: "text-center font-medium" },
            {
                data: "sisa_cuti",
                className: "text-center font-bold text-success"
            },
            { data: "data_cuti.keterangan", className: "max-w-xs truncate" },
            {
                data: "approve_date",
                render: function (data) {
                    return data ? moment(data).format("YYYY-MM-DD HH:mm") : '<span class="text-warning text-xs">Menunggu</span>';
                }
            },
            { data: "name_atasan" },
            { data: "tembusan" },
            { data: "keterangan", className: "max-w-xs truncate text-base-content/70" }
        ],
        language: {
            search: "Cari Semua:",
            lengthMenu: "Tampilkan _MENU_ data",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            paginate: {
                previous: "Sebelumnya",
                next: "Selanjutnya"
            },
            emptyTable: "Tidak ada data cuti yang ditemukan."
        },
        // dom: '<"flex flex-col md:flex-row items-center justify-between gap-4 mb-4"lf>rt<"flex flex-col md:flex-row items-center justify-between gap-4 mt-4"ip>',
        dom: '<"flex flex-col md:flex-row items-center justify-between gap-4 mb-4"l>rt<"flex flex-col md:flex-row items-center justify-between gap-4 mt-4"ip>',
        initComplete: function () {
            $('.dataTables_filter input').addClass('input input-bordered input-sm ml-2'); $('.dataTables_length select').addClass('select select-bordered select-sm mx-2');
        }
    });

    // Event listener untuk input pencarian khusus Nama / Departemen
    $('#searchUserDep').off('keyup change').on('keyup change', function () {
        table.draw();
    });
}

// Inisialisasi awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    getTabel(periode);
    $("#periodeTahun").val(periode);

    // Event listener saat periode tahun diubah
    $("#periodeTahun").on("change", function () {
        getTabel($(this).val());
    });
});