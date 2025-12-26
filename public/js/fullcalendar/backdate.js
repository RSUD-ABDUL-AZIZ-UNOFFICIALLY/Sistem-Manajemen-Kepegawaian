async function findUsers(nama) {
    let data = $.ajax({
        url: '/api/contact/user?search=' + nama,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            return data;
        }
    });
    return data
}
$('#nama').on('keyup', async function () {
    let nama = $(this).val();
    let datas = await findUsers(nama);
    if (datas.data.length == 1) {
        let item = datas.data[0];
        $('#username').val(item.nama);
        $('#nik').val(item.fullnik);
        $('#departemen').val(item.departemen);
        $('#email').val(item.email);
        $('#noHp').val(item.noHp);
        $('#url').val(item.url);
        $('#tanggal').prop('disabled', false);

    }
});
async function attendence(tanggal) {

}
$('#tanggal').on('change', function () {
    let tanggal = $(this).val();
    let nik = $('#nik').val();
    $.ajax({
        url: `/api/presensi/riwayat/${nik}?periode=${tanggal}`,
        method: 'GET',
    })
        .then(res => {
            let data = res.data;
            $('#jamMasuk').val('--:--:--');
            $('#jamKeluar').val('--:--:--');
            $('#jamMasuk').prop('disabled', false);
            $('#jamKeluar').prop('disabled', false);
            $('#locatonIn').find('option').remove().end();
            $('#locatonOut').find('option').remove().end();
            // $('#locatonOut').val('sakit');
            if (data.length > 0) {
                if (data[0].cekIn == null) {
                    $('#locatonIn').append('<option value="LOBBY">LOBBY</option>');
                    $('#locatonIn').append('<option value="IGD">IGD</option>');
                    $('#locatonIn').append('<option value="Kelas 1">Kelas 1</option>');
                    $('#locatonIn').append('<option value="BANGSAL BEDAH">BANGSAL BEDAH</option>');
                    $('#locatonIn').append('<option value="Dinas Luar">Dinas Luar</option>');
                } else {
                    $('#jamMasuk').val(data[0].cekIn);
                    $('#locatonIn').append(`<option selected value="${data[0].loactionIn}">${data[0].loactionIn}</option>`);
                }
                if (data[0].cekOut == null) {
                    $('#locatonOut').append('<option value="LOBBY">LOBBY</option>');
                    $('#locatonOut').append('<option value="IGD">IGD</option>');
                    $('#locatonOut').append('<option value="Kelas 1">Kelas 1</option>');
                    $('#locatonOut').append('<option value="BANGSAL BEDAH">BANGSAL BEDAH</option>');
                    $('#locatonOut').append('<option value="Dinas Luar">Dinas Luar</option>');
                } else {
                    $('#jamKeluar').val(data[0].cekOut);
                    $('#locatonOut').append(`<option selected value="${data[0].loactionOut}">${data[0].loactionOut}</option>`);

                }
            } else {
                $('#locatonIn').append('<option value="LOBBY">LOBBY</option>');
                $('#locatonIn').append('<option value="IGD">IGD</option>');
                $('#locatonIn').append('<option value="Kelas 1">Kelas 1</option>');
                $('#locatonIn').append('<option value="BANGSAL BEDAH">BANGSAL BEDAH</option>');
                $('#locatonIn').append('<option value="Dinas Luar">Dinas Luar</option>');
                $('#locatonOut').append('<option value="LOBBY">LOBBY</option>');
                $('#locatonOut').append('<option value="IGD">IGD</option>');
                $('#locatonOut').append('<option value="Kelas 1">Kelas 1</option>');
                $('#locatonOut').append('<option value="BANGSAL BEDAH">BANGSAL BEDAH</option>');
                $('#locatonOut').append('<option value="Dinas Luar">Dinas Luar</option>');

            }
        })
        .catch(err => {
            console.error(err);
        });
})

document.getElementById('formPresensi').addEventListener('submit', (e) => {
    e.preventDefault();

    let nik = document.getElementById('nik').value;
    let tanggal = document.getElementById('tanggal').value;
    let jamMasuk = document.getElementById('jamMasuk').value;
    let jamKeluar = document.getElementById('jamKeluar').value;
    let locatonIn = document.getElementById('locatonIn').value;
    let locatonOut = document.getElementById('locatonOut').value;
    let data = JSON.stringify({
        nik: nik,
        tanggal: tanggal,
        jamMasuk: jamMasuk,
        jamKeluar: jamKeluar,
        locatonIn: locatonIn,
        locatonOut: locatonOut
    })
    fetch('/api/presensi/backdate/' + nik, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: data,
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                return Swal.fire({
                    title: 'Peringatan',
                    text: data.message,
                    icon: 'warning',
                });
            } else {
                return Swal.fire({
                    title: 'Berhasil',
                    text: data.message,
                    icon: 'success',
                });
            }
        })
        .catch(err => {
            console.error(err);
        });
});
