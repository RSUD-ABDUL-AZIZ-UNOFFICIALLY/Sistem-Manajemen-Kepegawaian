async function editJadwal(name, nik, date, typeDns) {
    $('#editJadwalLabel').text(name);
    $("#sectionjnsDns option[value='" + typeDns + "']").prop('selected', true);
    $('#tgl').val(date);
    $("#sectionjnsDns").val(typeDns);
    $('#nik').val(nik);
    $('#editJadwal').modal('show');
}
async function saveJadwal() {
    let nik = $('#nik').val();
    let date = $('#tgl').val();
    let typeDns = $('#sectionjnsDns').val();
    let jadwal = {
        nik: nik,
        typeDns: typeDns,
        date: date
    }
    console.log(jadwal);
    $.ajax({
        url: "/api/presensi/anggota",
        method: "POST",
        data: jadwal,
        success: function (data) {
            getTabel($("#periode").val());
            Swal.fire(data.message, 'data berhasil diubah', 'success')
        },
        error: function (data) {
            Swal.fire(data.responseJSON.message, data.responseJSON.data, 'error')
        }
    });
}
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

async function updrateJadwal(nik, date, typeDns) {
    let jadwal = {
        nik: nik,
        typeDns: typeDns,
        date: date
    }
    $.ajax({
        url: "/api/presensi/anggota",
        method: "POST",
        data: jadwal,
        success: function (data) {
            Toast.fire({
                icon: "success",
                title: data.message
            });
        },
        error: function (data) {
            Swal.fire(data.responseJSON.message, data.responseJSON.data, 'error')
            getTabel($("#periode").val());
        }
    });

}