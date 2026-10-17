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

async function getRiwayatCuti(a) {
    return await $.ajax({
        url: "/api/cuti/riwayat?tahun=" + a,
        method: "GET",
        success: function (a) {
            parsingDataCuti(a.data);
            return a.data;
        },
        error: function (a) { console.log(a); }
    });
}

function parsingDataCuti(a) {
    $("tbody > tr").remove();

    if (!a || a.length === 0) {
        $("tbody").append(`
            <tr>
                <td colspan="11" class="py-8 text-center text-base-content/60">
                    Tidak ada riwayat cuti yang ditemukan.
                </td>
            </tr>
        `);
        return;
    }

    for (let t of a) {
        let e, i, n = a.indexOf(t) + 1;
        e = null == t.mulai || "0000-00-00" == t.mulai ? "-" : new Date(t.mulai).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        i = null == t.samapi || "0000-00-00" == t.samapi ? "-" : new Date(t.samapi).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

        let r = new Date(t.approval.approve_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            o = new Date(t.approval.approve_date).toLocaleTimeString("id-ID");

        null === t.approval.approve_date ? t.approval.approve_date = "-" : t.approval.approve_date = r + " " + o;
        null === t.approval.atasan && (t.approval.atasan = { nama: "-" });

        // Badge Status DaisyUI
        let badgeClass = "badge-ghost";
        if (t.approval.status === "Disetujui") badgeClass = "badge-success";
        else if (t.approval.status === "Ditolak") badgeClass = "badge-error";
        else if (t.approval.status === "Menunggu") badgeClass = "badge-warning";

        let u = $("<tr>").addClass("hover");
        u.append($("<td>" + n + "</td>").addClass("font-medium"));
        u.append($("<td>" + e + " - " + i + "</td>"));
        u.append($("<td><span class='badge badge-sm badge-outline badge-primary'>" + t.jenis_cuti.type_cuti + "</span></td>"));
        u.append($("<td>" + t.jumlah + " hari</td>"));
        u.append($("<td>" + t.keterangan + "</td>"));
        u.append($("<td><span class='badge badge-sm " + badgeClass + "'>" + t.approval.status + "</span></td>"));
        u.append($("<td>" + t.approval.approve_date + "</td>"));
        u.append($("<td>" + t.approval.atasan.nama + "</td>"));
        u.append($("<td>" + (t.approval.keterangan || "-") + "</td>").addClass("text-base-content/70"));

        let actionTd = $("<td>").addClass("space-x-1 space-y-1");

        let l = $("<button>");
        l.addClass("btn btn-error btn-xs gap-1"),
            l.attr("onclick", "deleteCuti(" + t.id + ")"),
            l.html("<i class='fas fa-trash'></i> Batalkan");

        let p = $("<button>");
        p.addClass("btn btn-primary btn-xs gap-1"),
            p.attr("onclick", "cetakSuratCuti(" + t.id + ")"),
            p.html("<i class='fa-solid fa-envelope-open-text'></i> Cetak");

        if ("Menunggu" == t.approval.status) {
            actionTd.append(p, l);
        } else if (["Disetujui", "Ditolak", "Perubahan"].includes(t.approval.status)) {
            actionTd.append(p);
        }
        u.append(actionTd);

        let lampiranTd = $("<td>");
        if (null != t.lampiran) {
            let lampBtn = $("<button>");
            lampBtn.addClass("btn btn-info btn-xs gap-1 text-white"),
                lampBtn.attr("onclick", "downloadLampiran('" + t.lampiran.file + "')"),
                lampBtn.html("<i class='fa-solid fa-download'></i> File");
            lampiranTd.append(lampBtn);
        } else {
            lampiranTd.text("-");
        }
        u.append(lampiranTd);

        $("tbody").append(u);
    }
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
    getRiwayatCuti($("#tahun").val());
});

$("#tahun").change(function () {
    let a = $(this).val(); $("tbody > tr").remove();
    getRiwayatCuti(a);
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