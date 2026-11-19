let rawDataCuti = [];
let sortState = { key: null, direction: 'asc' };

$(document).ready(function () {
    let tahun = $('#tahun').val();
    getRiwayatCuti(tahun);

    // Filter Tahun
    $('#tahun').on('change', function () {
        let tahun = $(this).val();
        getRiwayatCuti(tahun);
    });

    // Pencarian Nama Real-time
    $("#searchNama").on("input", function () {
        const hasVal = $(this).val().length > 0;
        $("#clearSearch").toggleClass("hidden", !hasVal);
        renderFilteredAndSortedData();
    });

    // Tombol Reset Pencarian
    $("#clearSearch").on("click", function () {
        $("#searchNama").val("").trigger("input").focus();
    });

    // Sort Dropdown khusus Mobile
    $("#mobileSort").on("change", function () {
        const val = $(this).val();
        if (val === "default") {
            sortState = { key: null, direction: 'asc' };
        } else {
            const [key, direction] = val.split("-");
            sortState = { key, direction };
        }
        updateSortIcons();
        renderFilteredAndSortedData();
    });
});

async function getRiwayatCuti(tahun) {
    showLoadingState();
    try {
        let response = await $.ajax({
            url: '/api/cuti/approvementcuti?tahun=' + tahun,
            method: 'GET'
        });
        parsingDataCuti(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        rawDataCuti = [];
        renderFilteredAndSortedData();
    }
}

function showLoadingState() {
    $("#tbodyCuti").html(`
        <tr>
            <td colspan="12" class="py-10 text-center text-base-content/60">
                <span class="loading loading-spinner loading-md text-primary mb-2"></span>
                <p class="text-xs">Memuat data pengajuan cuti...</p>
            </td>
        </tr>
    `);
    $("#mobileCutiContainer").html(`
        <div class="py-10 text-center text-base-content/60">
            <span class="loading loading-spinner loading-md text-primary mb-2"></span>
            <p class="text-xs">Memuat data pengajuan cuti...</p>
        </div>
    `);
}

function parsingDataCuti(data) {
    rawDataCuti = Array.isArray(data) ? [...data] : [];
    renderFilteredAndSortedData();
}

function renderFilteredAndSortedData() {
    const keyword = ($("#searchNama").val() || "").toLowerCase().trim();

    // 1. Filter berdasarkan nama
    let filtered = rawDataCuti.filter(item => {
        const nama = (item.data_cuti?.user?.nama || "").toLowerCase();
        return nama.includes(keyword);
    });

    // 2. Sorting data
    if (sortState.key) {
        filtered.sort((a, b) => {
            let valA = getSortValue(a, sortState.key);
            let valB = getSortValue(b, sortState.key);

            if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // Update info jumlah data
    $("#infoJumlahData").text(`Menampilkan ${filtered.length} dari ${rawDataCuti.length} pengajuan`);

    renderDesktopTable(filtered);
    renderMobileCards(filtered);
}

function getSortValue(item, key) {
    const dc = item.data_cuti || {};
    switch (key) {
        case 'nama':
            return (dc.user?.nama || "").toLowerCase();
        case 'mulai':
            return dc.mulai || "0000-00-00";
        case 'tipe':
            return (dc.jenis_cuti?.type_cuti || "").toLowerCase();
        case 'jumlah':
            return Number(dc.jumlah) || 0;
        case 'sisa':
            return (item.ledger_cuti && item.ledger_cuti.sisa_cuti !== null && item.ledger_cuti.sisa_cuti !== undefined)
                ? Number(item.ledger_cuti.sisa_cuti)
                : -1;
        case 'status':
            return (item.status || "").toLowerCase();
        case 'approve':
            return item.approve_date || "";
        default:
            return "";
    }
}

function sortTable(key) {
    if (sortState.key === key) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.key = key;
        sortState.direction = 'asc';
    }
    updateSortIcons();
    renderFilteredAndSortedData();
}

function updateSortIcons() {
    $("[id^='sort-icon-']").removeClass("fa-sort-up fa-sort-down text-primary").addClass("fa-sort text-base-content/30");
    if (sortState.key) {
        const iconClass = sortState.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        $(`#sort-icon-${sortState.key}`).removeClass("fa-sort text-base-content/30").addClass(`${iconClass} text-primary`);
    }
}

function formatItemCuti(i, index) {
    const dc = i.data_cuti || {};
    const tanggalmulai = (dc.mulai && dc.mulai !== '0000-00-00')
        ? new Date(dc.mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : "-";
    const tanggalsampai = (dc.samapi && dc.samapi !== '0000-00-00')
        ? new Date(dc.samapi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : "-";

    const rentangTanggal = (tanggalmulai === tanggalsampai)
        ? tanggalmulai
        : `${tanggalmulai} - ${tanggalsampai}`;

    const approveDateFormatted = i.approve_date
        ? new Date(i.approve_date).toLocaleString("id-ID", {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', timeZone: "Asia/Jakarta"
        })
        : null;

    let badgeStatusClass = "badge-ghost";
    if (i.status === "Disetujui") badgeStatusClass = "badge-success text-success-content";
    else if (i.status === "Ditolak") badgeStatusClass = "badge-error text-error-content";
    else if (i.status === "Menunggu") badgeStatusClass = "badge-warning text-warning-content";

    const namaUser = dc.user?.nama || "-";
    const safeNamaUser = namaUser.replace(/'/g, "\\'");
    const rawSisa = i.ledger_cuti?.sisa_cuti;
    const sisaCuti = (rawSisa !== null && rawSisa !== undefined) ? `${rawSisa} Hari` : "-";

    return {
        nomor: index + 1,
        namaUser,
        safeNamaUser,
        nip: dc.user?.nip || "",
        rentangTanggal,
        tipeCuti: dc.jenis_cuti?.type_cuti || "-",
        jumlah: dc.jumlah ? `${dc.jumlah} Hari` : "-",
        sisaCuti, // <-- Tambahkan i
        alasan: dc.keterangan || "-",
        alamat: i.cuti_alamat?.alamat || "-",
        status: i.status || "-",
        badgeStatusClass,
        approveDateFormatted,
        keterangan: i.keterangan || "-",
        fileLampiran: i.lampiran?.file || null,
        idCuti: i.id_cuti
    };
}

function renderDesktopTable(data) {
    const tbody = $("#tbodyCuti");
    tbody.empty();

    if (!data || data.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="12" class="py-10 text-center text-base-content/60">
                    <i class="fas fa-folder-open text-2xl mb-2 block opacity-40"></i>
                    Tidak ada pengajuan cuti yang ditemukan.
                </td>
            </tr>
        `);
        return;
    }


    function getTipeCutiBadge(tipeCuti) {
        const normalized = (tipeCuti || "").toLowerCase().trim();

        if (normalized.includes("sakit")) {
            return `<span class="badge badge-sm badge-error badge-soft font-medium whitespace-nowrap">
                    <i class="fa-solid fa-notes-medical mr-1 text-[10px]"></i>${tipeCuti}
                </span>`;
        }
        if (normalized.includes("tahunan")) {
            return `<span class="badge badge-sm badge-primary badge-soft font-medium whitespace-nowrap">
                    <i class="fa-solid fa-calendar-check mr-1 text-[10px]"></i>${tipeCuti}
                </span>`;
        }
        if (normalized.includes("melahirkan")) {
            return `<span class="badge badge-sm badge-secondary badge-soft font-medium whitespace-nowrap">
                    <i class="fa-solid fa-baby-carriage mr-1 text-[10px]"></i>${tipeCuti}
                </span>`;
        }
        console.log(normalized);
        if (normalized.includes("penting")) {
            return `<span class="badge badge-sm badge-warning badge-soft font-medium whitespace-nowrap">
                    <i class="fa-solid fa-circle-exclamation mr-1 text-[10px]"></i>${tipeCuti}
                </span>`;
        }

        return `<span class="badge badge-sm badge-info badge-soft font-medium whitespace-nowrap">
                <i class="fa-solid fa-tag mr-1 text-[10px]"></i>${tipeCuti || "-"}
            </span>`;
    }

    data.forEach((item, index) => {
        const d = formatItemCuti(item, index);

        const tipeCutiHtml = getTipeCutiBadge(d.tipeCuti);

        const approveHtml = d.approveDateFormatted
            ? `<span class="text-[11px] whitespace-nowrap text-base-content/80">${d.approveDateFormatted}</span>`
            : `<span class="badge badge-xs badge-warning badge-outline whitespace-nowrap">Belum Approve</span>`;

        const pratinjauHtml = (d.status === "Menunggu")
            ? `<button type="button" class="btn btn-xs btn-primary gap-1 whitespace-nowrap" onclick="preview(${d.idCuti}, '${d.safeNamaUser}')">
               <i class="fa-solid fa-signature"></i> Preview
           </button>`
            : `<span class="text-[11px] font-semibold whitespace-nowrap text-success">
               <i class="fas fa-check-circle mr-1"></i>Diproses
           </span>`;

        const lampiranHtml = d.fileLampiran
            ? `<a href="${d.fileLampiran}" target="_blank" rel="noopener noreferrer" class="btn btn-xs btn-outline btn-info whitespace-nowrap" title="Lihat Lampiran">
               <i class="fa-solid fa-file-pdf"></i> File
           </a>`
            : `<span class="text-base-content/40">-</span>`;

        tbody.append(`
        <tr class="hover align-middle">
            <td class="text-center font-medium text-base-content/60 whitespace-nowrap">${d.nomor}</td>
            <td class="font-semibold text-base-content min-w-[140px] max-w-[200px]">
                <div class="truncate" title="${d.namaUser}">${d.namaUser}</div>
            </td>
            <td class="whitespace-nowrap text-[11px]">${d.rentangTanggal}</td>
            <td class="whitespace-nowrap" title="${d.tipeCuti}">${tipeCutiHtml}</td>
            <td class="text-center font-medium whitespace-nowrap">${d.jumlah}</td>
            <td class="text-center font-semibold text-info whitespace-nowrap">${d.sisaCuti}</td>
            <td class="min-w-[160px] max-w-[240px]">
                <div class="line-clamp-2 text-xs leading-snug" title="${d.alasan}">${d.alasan}</div>
            </td>
            <td class="min-w-[160px] max-w-[240px]">
                <div class="line-clamp-2 text-xs leading-snug" title="${d.alamat}">${d.alamat}</div>
            </td>
            <td class="text-center whitespace-nowrap">
                <span class="badge badge-xs ${d.badgeStatusClass} font-semibold whitespace-nowrap">${d.status}</span>
            </td>
            <td class="whitespace-nowrap">${approveHtml}</td>
            <td class="text-center whitespace-nowrap">${pratinjauHtml}</td>
            <td class="min-w-[150px] max-w-[220px] text-base-content/70">
                <div class="line-clamp-2 text-xs leading-snug" title="${d.keterangan}">${d.keterangan}</div>
            </td>
            <td class="text-center whitespace-nowrap">${lampiranHtml}</td>
        </tr>
    `);
    });

}

function renderMobileCards(data) {
    const container = $("#mobileCutiContainer");
    container.empty();

    if (!data || data.length === 0) {
        container.append(`
            <div class="py-10 text-center text-base-content/60 bg-base-200/30 rounded-xl border border-dashed border-base-300">
                <i class="fas fa-folder-open text-2xl mb-2 block opacity-40"></i>
                Tidak ada pengajuan cuti yang ditemukan.
            </div>
        `);
        return;
    }

    data.forEach((item, index) => {
        const d = formatItemCuti(item, index);

        const approveMobileHtml = d.approveDateFormatted
            ? `<span class="text-base-content font-medium">${d.approveDateFormatted}</span>`
            : `<span class="text-warning font-medium">Belum di Approve</span>`;

        const pratinjauMobileBtn = (d.status === "Menunggu")
            ? `<button type="button" class="btn btn-sm btn-primary flex-1 gap-1.5" onclick="preview(${d.idCuti}, '${d.safeNamaUser}')">
                   <i class="fa-solid fa-signature"></i> Preview & TTD
               </button>`
            : `<div class="flex-1 text-xs font-semibold text-success flex items-center gap-1.5">
                   <i class="fas fa-check-circle"></i> Sudah diproses
               </div>`;

        const lampiranMobileBtn = d.fileLampiran
            ? `<a href="${d.fileLampiran}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline btn-info gap-1.5">
                   <i class="fa-solid fa-file-pdf"></i> Lampiran
               </a>`
            : ``;

        container.append(`
            <div class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4 space-y-3">
                    <!-- Top: Nomor, Nama & Status -->
                    <div class="flex items-start justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="badge badge-xs badge-ghost font-mono">#${d.nomor}</span>
                                <h3 class="font-bold text-sm text-base-content leading-snug">${d.namaUser}</h3>
                            </div>
                            ${d.nip ? `<p class="text-[11px] text-base-content/60 mt-0.5">NIP. ${d.nip}</p>` : ''}
                        </div>
                        <span class="badge badge-sm ${d.badgeStatusClass} font-semibold shrink-0">${d.status}</span>
                    </div>

                    <!-- Info Utama: Tipe, Durasi & Tanggal -->
                    <div class="bg-base-200/50 rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span class="text-[11px] text-base-content/60 block">Tipe & Durasi</span>
                            <span class="font-semibold text-primary">${d.tipeCuti}</span>
                            <span class="text-base-content/80">(${d.jumlah})</span>
                            <span class="block text-[11px] text-info font-semibold mt-0.5">Sisa Cuti: ${d.sisaCuti}</span>
                        </div>
                        <div>
                            <span class="text-[11px] text-base-content/60 block">Tanggal Cuti</span>
                            <span class="font-semibold text-base-content">${d.rentangTanggal}</span>
                        </div>
                    </div>

                    <!-- Detail Alasan & Alamat -->
                    <div class="space-y-1.5 text-xs">
                        <div class="flex items-start gap-2">
                            <i class="fas fa-comment-alt text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Alasan:</span> ${d.alasan}</p>
                        </div>
                        <div class="flex items-start gap-2">
                            <i class="fas fa-map-marker-alt text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Alamat:</span> ${d.alamat}</p>
                        </div>
                        <div class="flex items-start gap-2">
                            <i class="fas fa-calendar-check text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Persetujuan:</span> ${approveMobileHtml}</p>
                        </div>
                        ${d.keterangan !== "-" ? `
                        <div class="flex items-start gap-2">
                            <i class="fas fa-info-circle text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Ket:</span> ${d.keterangan}</p>
                        </div>` : ''}
                    </div>

                    <!-- Action Buttons -->
                    <div class="pt-2 border-t border-base-200 flex items-center justify-between gap-2">
                        ${pratinjauMobileBtn}
                        ${lampiranMobileBtn}
                    </div>
                </div>
            </div>
        `);
    });
}

// --- FUNGSI MODAL & APPROVAL ---

async function preview(id, nama) {
    modalTemp(id, nama);
    if ($('#templateModal').hasClass('modal')) {
        $('#templateModal')[0].showModal();
    } else {
        $('#templateModal').modal('show');
    }
}

function modalTemp(id, nama) {
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

function closeTemplateModal() {
    if ($('#templateModal').hasClass('modal')) {
        $('#templateModal')[0].close();
    } else {
        $('#templateModal').modal('hide');
    }
}

async function setuju(id) {
    let data = {
        id: id,
        status: "Disetujui",
        keterangan: $('#catatan').val()
    };
    const res = await updateCuti(data);
    if (res !== undefined) {
        closeTemplateModal();
        Swal.fire('SIP!', 'Terima kasih telah menyetujui cuti ini.', 'success');
        let tahun = $('#tahun').val();
        getRiwayatCuti(tahun);
    }
}

async function tolak(id) {
    let data = {
        id: id,
        status: "Ditolak",
        keterangan: $('#catatan').val()
    };
    const res = await updateCuti(data);
    if (res !== undefined) {
        closeTemplateModal();
        Swal.fire('Dibatalkan', 'Cuti tidak disetujui.', 'warning');
        let tahun = $('#tahun').val();
        getRiwayatCuti(tahun);
    }
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
        return undefined;
    }
}