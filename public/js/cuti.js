let hariKerja = "";

$.ajax({
    url: "/api/getBiodata",
    method: "GET",
    success: function (a) {
        hariKerja = a.data.jns_kerja;
    },
    error: function (a) {
        console.log(a);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Lengkapi biodata anda terlebih dahulu",
            toast: true,
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: true
        }).then(a => {
            if (a.isConfirmed) window.location.href = "/profile";
        });
    }
});

let totalCuti = 0,
    maxCuti = 0,
    dataCuti = [],
    mulaicuti = moment().format("YYYY-MM-DD"),
    akhircuti = moment().format("YYYY-MM-DD");

async function sisaCuti(a) {
    return $.ajax({
        url: "/api/cuti/sisa?type_cuti=" + a,
        method: "GET",
        success: function (a) { return a.data; },
        error: function (a) { }
    });
}

$.ajax({
    url: "/api/cuti/jns",
    method: "GET",
    success: function (a) {
        dataCuti = a.data;
        a.data.forEach(a => {
            $("#jnsCuti").append(`<option value="${a.id}">${a.type_cuti}</option>`);
        });
    },
    error: function (a) { }
});

$("#jnsCuti").change(async function () {
    $("#reservation").prop("disabled", false);
    let a, t = $(this).val(),
        e = dataCuti.find(a => a.id == t),
        i = await sisaCuti(e.id);

    $("#Keterangan_cuti").text(e.type_cuti + " maksimal " + e.max + " hari secara berturut-turut dan maksimal " + e.total + " hari dalam setahun. Sisa cuti anda " + i.data.sisa_cuti + " hari");
    $("#reservation").val("");
    $("#totalReservation").val("1");

    if ("Cuti Sakit" == e.type_cuti || "Cuti Melahirkan" == e.type_cuti || "Cuti Alasan Penting" == e.type_cuti) {
        a = moment().subtract(1, "weeks").startOf("day");
        $("#lampiran").empty();
        $("#lampiran").append(`
            <label class="label" for="inputSuratCuti">
                <span class="label-text font-semibold">Lampiran Surat ${e.type_cuti}</span>
            </label>
            <input type="hidden" id="suratLampiran" name="suratLampiran">
            <input type="file" class="file-input file-input-bordered w-full hover:border-primary focus:border-primary transition-colors" id="inputSuratCuti" name="inputSuratCuti" accept="image/png, image/jpeg, application/pdf">
        `);
    } else {
        a = moment().subtract(1, "days").startOf("day");
        $("#lampiran").empty();
    }

    $("#reservation").daterangepicker({
        minDate: a,
        maxDate: moment("2026-12-31", "YYYY-MM-DD"),
        singleDatePicker: false,
        autoApply: false,
        autoUpdateInput: true,
        locale: {
            format: "DD/MM/YYYY",
            daysOfWeek: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            monthNames: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
            firstDay: 1,
            applyLabel: "Pilih",
            cancelLabel: "Batal",
            customRangeLabel: "Pilih Tanggal"
        }
    }, function (a, t) {
        mulaicuti = a.format("YYYY-MM-DD");
        const i = moment(a, "YYYY-MM-DD");
        akhircuti = t.format("YYYY-MM-DD");
        const n = moment(t, "YYYY-MM-DD").diff(i, "days") + 1;

        if (n > e.max) return Swal.fire({ icon: "error", title: "Oops...", text: `Cuti tidak boleh lebih dari ${e.max} hari` }), $("#reservation").val(""), $("#totalReservation").val(""), !1;

        if ("5 Hari kerja" == hariKerja) $("#totalReservation").prop("disabled", false);
        $("#totalReservation").val(n);
    });
});

let token = getCookie("token");

function postCuti(a) {
    $.ajax({
        url: "/api/cuti",
        method: "POST",
        data: a,
        success: function (a) {
            Swal.fire({ icon: "success", title: "Berhasil", text: "Cuti berhasil disimpan", showConfirmButton: false, timer: 2000 });
            $("#jnsCuti").val("");
            $("#reservation").val("");
            $("#totalReservation").val("");
            $("#reservation").prop("disabled", false);
            $("#totalReservation").prop("disabled", false);
            $("#alasanCuti").val("");
            $("#alamat").val("");
            $("#lampiran").empty();
            getRiwayatCuti($("#tahun").val());
            $("#btnSubmit").prop("disabled", false);
        },
        error: function (a) {
            console.log(a);
            Swal.fire({ icon: a.responseJSON.icon, title: a.responseJSON.message, text: a.responseJSON.data, showConfirmButton: false, timer: 2000 });
            $("#btnSubmit").prop("disabled", false);
        }
    });
}
let rawDataRiwayat = [];
let sortRiwayatState = { key: null, direction: 'asc' };
function showLoadingRiwayat() {
    $("#tbodyRiwayatCuti").html(`
        <tr>
            <td colspan="11" class="py-10 text-center text-base-content/60">
                <span class="loading loading-spinner loading-md text-primary mb-2"></span>
                <p class="text-xs">Memuat riwayat pengajuan cuti...</p>
            </td>
        </tr>
    `);
    $("#mobileRiwayatContainer").html(`
        <div class="py-10 text-center text-base-content/60">
            <span class="loading loading-spinner loading-md text-primary mb-2"></span>
            <p class="text-xs">Memuat riwayat pengajuan cuti...</p>
        </div>
    `);
}

async function getRiwayatCuti(tahun) {
    showLoadingRiwayat();
    try {
        const response = await $.ajax({
            url: "/api/cuti/riwayat?tahun=" + tahun,
            method: "GET"
        });
        parsingDataCuti(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        rawDataRiwayat = [];
        renderRiwayatData();
    }
}

function parsingDataCuti(data) {
    rawDataRiwayat = Array.isArray(data) ? [...data] : [];
    renderRiwayatData();
}


function renderRiwayatData() {
    const keyword = ($("#searchRiwayat").val() || "").toLowerCase().trim();

    // 1. Filter berdasarkan tipe cuti, alasan, status, atau nama atasan
    let filtered = rawDataRiwayat.filter(item => {
        const tipe = (item.jenis_cuti?.type_cuti || "").toLowerCase();
        const alasan = (item.keterangan || "").toLowerCase();
        const atasan = (item.approval?.atasan?.nama || "").toLowerCase();
        const status = (item.approval?.status || "").toLowerCase();
        return tipe.includes(keyword) || alasan.includes(keyword) || atasan.includes(keyword) || status.includes(keyword);
    });

    // 2. Sorting data
    if (sortRiwayatState.key) {
        filtered.sort((a, b) => {
            let valA = getSortRiwayatValue(a, sortRiwayatState.key);
            let valB = getSortRiwayatValue(b, sortRiwayatState.key);

            if (valA < valB) return sortRiwayatState.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortRiwayatState.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    $("#infoJumlahRiwayat").text(`Menampilkan ${filtered.length} dari ${rawDataRiwayat.length} riwayat cuti`);

    renderDesktopRiwayat(filtered);
    renderMobileRiwayat(filtered);
}

function getSortRiwayatValue(item, key) {
    switch (key) {
        case 'mulai':
            return item.mulai || "0000-00-00";
        case 'tipe':
            return (item.jenis_cuti?.type_cuti || "").toLowerCase();
        case 'jumlah':
            return Number(item.jumlah) || 0;
        case 'status':
            return (item.approval?.status || "").toLowerCase();
        case 'approve':
            return item.approval?.approve_date || "";
        case 'atasan':
            return (item.approval?.atasan?.nama || "").toLowerCase();
        default:
            return "";
    }
}

function sortRiwayat(key) {
    if (sortRiwayatState.key === key) {
        sortRiwayatState.direction = sortRiwayatState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortRiwayatState.key = key;
        sortRiwayatState.direction = 'asc';
    }
    updateSortRiwayatIcons();
    renderRiwayatData();
}

function updateSortRiwayatIcons() {
    $("[id^='sort-icon-']").removeClass("fa-sort-up fa-sort-down text-primary").addClass("fa-sort text-base-content/30");
    if (sortRiwayatState.key) {
        const iconClass = sortRiwayatState.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
        $(`#sort-icon-${sortRiwayatState.key}`).removeClass("fa-sort text-base-content/30").addClass(`${iconClass} text-primary`);
    }
}

// Helper format data tanpa mengubah object asli (immutable)
function formatItemRiwayat(t, index) {
    const tglMulai = (!t.mulai || t.mulai === "0000-00-00")
        ? "-"
        : new Date(t.mulai).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

    const tglSampai = (!t.samapi || t.samapi === "0000-00-00")
        ? "-"
        : new Date(t.samapi).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

    const rentangTanggal = (tglMulai === tglSampai) ? tglMulai : `${tglMulai} - ${tglSampai}`;

    const approval = t.approval || {};
    let approveDateFormatted = "-";
    if (approval.approve_date) {
        const dApprove = new Date(approval.approve_date);
        const r = dApprove.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
        const o = dApprove.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        approveDateFormatted = `${r} ${o}`;
    }

    const status = approval.status || "-";
    let badgeClass = "badge-ghost";
    if (status === "Disetujui") badgeClass = "badge-success text-success-content";
    else if (status === "Ditolak") badgeClass = "badge-error text-error-content";
    else if (status === "Menunggu") badgeClass = "badge-warning text-warning-content";
    else if (status === "Perubahan") badgeClass = "badge-info text-info-content";

    return {
        nomor: index + 1,
        id: t.id,
        rentangTanggal,
        tipeCuti: t.jenis_cuti?.type_cuti || "-",
        jumlah: t.jumlah ? `${t.jumlah} Hari` : "-",
        alasan: t.keterangan || "-",
        status,
        badgeClass,
        approveDateFormatted,
        namaAtasan: approval.atasan?.nama || "-",
        ketApproval: approval.keterangan || "-",
        fileLampiran: t.lampiran?.file || null
    };
}

// Render Tabel Desktop
function renderDesktopRiwayat(data) {
    const tbody = $("#tbodyRiwayatCuti");
    tbody.empty();

    if (!data || data.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="11" class="py-10 text-center text-base-content/60">
                    <i class="fas fa-folder-open text-2xl mb-2 block opacity-40"></i>
                    Tidak ada riwayat cuti yang ditemukan.
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
        const d = formatItemRiwayat(item, index);
        const tipeCutiHtml = getTipeCutiBadge(d.tipeCuti);

        // Tombol Tindakan
        let actionHtml = "-";
        const btnCetak = `
            <button type="button" class="btn btn-primary btn-xs gap-1" onclick="cetakSuratCuti(${d.id})" title="Cetak Surat Cuti">
                <i class="fa-solid fa-envelope-open-text"></i> Cetak
            </button>`;
        const btnBatal = `
            <button type="button" class="btn btn-error btn-xs gap-1" onclick="deleteCuti(${d.id})" title="Batalkan Pengajuan">
                <i class="fas fa-trash"></i> Batal
            </button>`;

        if (d.status === "Menunggu") {
            actionHtml = `<div class="flex items-center justify-center gap-1">${btnCetak}${btnBatal}</div>`;
        } else if (["Disetujui", "Ditolak", "Perubahan"].includes(d.status)) {
            actionHtml = btnCetak;
        }

        // Tombol Lampiran
        const lampiranHtml = d.fileLampiran
            ? `<button type="button" class="btn btn-info btn-xs gap-1 text-white" onclick="downloadLampiran('${d.fileLampiran}')" title="Unduh Lampiran">
                   <i class="fa-solid fa-download"></i> File
               </button>`
            : `<span class="text-base-content/40">-</span>`;

        tbody.append(`
            <tr class="hover">
                <td class="text-center font-medium text-base-content/60">${d.nomor}</td>
                <td class="whitespace-nowrap text-[11px] font-medium">${d.rentangTanggal}</td>
                <td class="whitespace-nowrap" title="${d.tipeCuti}">${tipeCutiHtml}</td>
                <td class="text-center font-medium">${d.jumlah}</td>
                <td class="truncate" title="${d.alasan}">${d.alasan}</td>
                <td class="text-center"><span class="badge badge-xs ${d.badgeClass} font-semibold">${d.status}</span></td>
                <td class="text-[11px] text-base-content/80">${d.approveDateFormatted}</td>
                <td class="truncate font-medium text-base-content" title="${d.namaAtasan}">${d.namaAtasan}</td>
                <td class="truncate text-base-content/70" title="${d.ketApproval}">${d.ketApproval}</td>
                <td class="text-center">${actionHtml}</td>
                <td class="text-center">${lampiranHtml}</td>
            </tr>
        `);
    });
}

// Render Card Mobile
function renderMobileRiwayat(data) {
    const container = $("#mobileRiwayatContainer");
    container.empty();

    if (!data || data.length === 0) {
        container.append(`
            <div class="py-10 text-center text-base-content/60 bg-base-200/30 rounded-xl border border-dashed border-base-300">
                <i class="fas fa-folder-open text-2xl mb-2 block opacity-40"></i>
                Tidak ada riwayat cuti yang ditemukan.
            </div>
        `);
        return;
    }

    data.forEach((item, index) => {
        const d = formatItemRiwayat(item, index);

        // Tombol Aksi Mobile
        let mobileActions = [];
        if (["Menunggu", "Disetujui", "Ditolak", "Perubahan"].includes(d.status)) {
            mobileActions.push(`
                <button type="button" class="btn btn-sm btn-primary flex-1 gap-1.5" onclick="cetakSuratCuti(${d.id})">
                    <i class="fa-solid fa-envelope-open-text"></i> Cetak
                </button>
            `);
        }
        if (d.status === "Menunggu") {
            mobileActions.push(`
                <button type="button" class="btn btn-sm btn-outline btn-error gap-1.5" onclick="deleteCuti(${d.id})">
                    <i class="fas fa-trash"></i> Batalkan
                </button>
            `);
        }
        if (d.fileLampiran) {
            mobileActions.push(`
                <button type="button" class="btn btn-sm btn-info text-white gap-1.5" onclick="downloadLampiran('${d.fileLampiran}')">
                    <i class="fa-solid fa-download"></i> File
                </button>
            `);
        }

        container.append(`
            <div class="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="card-body p-4 space-y-3">
                    <!-- Top: Nomor, Tipe Cuti & Status -->
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="badge badge-xs badge-ghost font-mono">#${d.nomor}</span>
                            <span class="font-bold text-sm text-primary">${d.tipeCuti}</span>
                            <span class="text-xs font-semibold text-base-content/70">(${d.jumlah})</span>
                        </div>
                        <span class="badge badge-sm ${d.badgeClass} font-semibold shrink-0">${d.status}</span>
                    </div>

                    <!-- Box Tanggal Cuti & Persetujuan -->
                    <div class="bg-base-200/50 rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span class="text-[11px] text-base-content/60 block">Tanggal Cuti</span>
                            <span class="font-semibold text-base-content">${d.rentangTanggal}</span>
                        </div>
                        <div>
                            <span class="text-[11px] text-base-content/60 block">Tgl Persetujuan</span>
                            <span class="font-semibold text-base-content">${d.approveDateFormatted}</span>
                        </div>
                    </div>

                    <!-- Detail Atasan, Alasan & Keterangan -->
                    <div class="space-y-1.5 text-xs">
                        <div class="flex items-start gap-2">
                            <i class="fas fa-user-tie text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Atasan:</span> ${d.namaAtasan}</p>
                        </div>
                        <div class="flex items-start gap-2">
                            <i class="fas fa-comment-alt text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Alasan:</span> ${d.alasan}</p>
                        </div>
                        ${d.ketApproval !== "-" ? `
                        <div class="flex items-start gap-2">
                            <i class="fas fa-info-circle text-base-content/40 mt-0.5 w-3.5"></i>
                            <p class="text-base-content/80 flex-1"><span class="font-semibold text-base-content">Ket. Atasan:</span> ${d.ketApproval}</p>
                        </div>` : ''}
                    </div>

                    <!-- Action Buttons -->
                    ${mobileActions.length > 0 ? `
                    <div class="pt-2 border-t border-base-200 flex items-center justify-between gap-2">
                        ${mobileActions.join('')}
                    </div>` : ''}
                </div>
            </div>
        `);
    });
}

$("#Cuti").submit(function (a) {
    a.preventDefault();
    $("#btnSubmit").prop("disabled", true);

    let t = {
        type_cuti: $("#jnsCuti").val(),
        mulai: mulaicuti,
        samapi: akhircuti,
        jumlah: $("#totalReservation").val(),
        keterangan: $("#alasanCuti").val(),
        maxCuti: maxCuti,
        alamat: $("#alamat").val()
    },
        e = $("#jnsCuti").val(),
        i = dataCuti.find(a => a.id == e);

    if (i && ["Cuti Sakit", "Cuti Melahirkan", "Cuti Alasan Penting"].includes(i.type_cuti)) {
        let fileInput = $("#inputSuratCuti").prop("files")[0];
        if (!fileInput) return Swal.fire({ icon: "error", title: "Oops...", text: "Lampiran surat harus diisi" }), $("#btnSubmit").prop("disabled", false), false;

        if (!["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(fileInput.type))
            return Swal.fire({ icon: "warning", title: "File Tidak Valid.", text: "File harus berupa PDF, JPG, PNG" }), $("#btnSubmit").prop("disabled", false), false;

        if (fileInput.size > 3e6)
            return Swal.fire({ icon: "warning", title: "File Terlalu Besar.", text: "File harus kurang dari 3 MB" }), $("#btnSubmit").prop("disabled", false), false;

        let n = new FormData();
        let uploadUrl = "https://api.spairum.my.id/api/cdn/upload/file";

        if ("application/pdf" == fileInput.type) {
            n.append("file", fileInput, "surat-cuti.pdf");
        } else {
            let fileType = fileInput.type.split("/")[1];
            n.append("image", fileInput, "surat-cuti." + fileType);
            uploadUrl = "https://api.spairum.my.id/api/cdn/upload/img";
        }

        $.ajax({
            url: uploadUrl,
            method: "POST",
            timeout: 0,
            headers: { Authorization: "Bearer " + token },
            processData: false,
            contentType: false,
            data: n,
            success: function (response) {
                let res = typeof response === 'string' ? JSON.parse(response) : response;
                t.lampiran = res.data.url;
                postCuti(t);
                $("#inputSuratCuti").val(null);
            },
            error: function () {
                Swal.fire("Gagal", "Gagal mengunggah lampiran surat", "error");
                $("#btnSubmit").prop("disabled", false);
            }
        });
    } else {
        postCuti(t);
    }
});

$(document).ready(function () {
    $(document).ready(function () {
        let tahun = $('#tahun').val();
        getRiwayatCuti(tahun);

        $('#tahun').on('change', function () {
            getRiwayatCuti($(this).val());
        });

        // Pencarian Real-time
        $("#searchRiwayat").on("input", function () {
            const hasVal = $(this).val().length > 0;
            $("#clearSearchRiwayat").toggleClass("hidden", !hasVal);
            renderRiwayatData();
        });

        $("#clearSearchRiwayat").on("click", function () {
            $("#searchRiwayat").val("").trigger("input").focus();
        });

        // Sort Mobile
        $("#mobileSortRiwayat").on("change", function () {
            const val = $(this).val();
            if (val === "default") {
                sortRiwayatState = { key: null, direction: 'asc' };
            } else {
                const [key, direction] = val.split("-");
                sortRiwayatState = { key, direction };
            }
            updateSortRiwayatIcons();
            renderRiwayatData();
        });
    });
});



window.downloadLampiran = a => {
    window.open(a.trim(), "_blank");
};

window.cetakSuratCuti = a => {
    $.ajax({
        url: "/api/cuti/suratCuti",
        method: "POST",
        data: { id: a },
        success: function (res) {
            window.open("/api/cuti/suratCuti?token=" + res.data, "_blank");
        }
    });
};

window.deleteCuti = a => {
    Swal.fire({
        title: "Apakah anda yakin?",
        text: "Data cuti akan dihapus",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, hapus data!"
    }).then(t => {
        if (t.isConfirmed) {
            $.ajax({
                url: "/api/cuti?id=" + a,
                method: "DELETE",
                success: function (res) {
                    Swal.fire({ icon: "success", title: "Berhasil", text: "Data berhasil dihapus", showConfirmButton: false, timer: 2000 });
                    getRiwayatCuti($("#tahun").val());
                },
                error: function (err) {
                    let errData = err.responseJSON || { icon: 'error', message: 'Gagal', data: 'Terjadi kesalahan' };
                    Swal.fire({ icon: errData.icon, title: errData.message, text: errData.data, showConfirmButton: false, timer: 2000 });
                }
            });
        }
    });
};