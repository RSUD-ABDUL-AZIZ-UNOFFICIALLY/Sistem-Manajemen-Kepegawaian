async function editJadwal(name, nik, date, typeDns) {
    console.log(name, nik, date, typeDns);
    $('#editJadwalLabel').text(name);
    // let datenow = new Date(Date.parse(date) + 86400000).toISOString().slice(0, 10);
    let datenow = new Date(date).toISOString().slice(0, 10);
    $('#tgl').val(date);
    $("#select").val(typeDns);
    $('#nik').val(nik);
    $('#editJadwal').modal('show');
}
async function saveJadwal() {
    let nik = $('#nik').val();
    let date = $('#tgl').val();
    let typeDns = $('#select').val();
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