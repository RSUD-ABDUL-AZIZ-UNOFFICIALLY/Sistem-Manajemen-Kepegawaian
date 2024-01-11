let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);
$('#tgl_reg').val(today);
getRegPasien(today);

function getRegPasien(tgl) {
    let dataTbPasien = $('#tb_pasien').dataTable({
        ajax: '/api/simrs/reg/igd?tgl=' + tgl,
        columns: [
            { data: 'no_rawat' },
            { data: 'tgl_registrasi' },
            { data: 'jam_reg' },
            { data: 'pasien.no_rkm_medis' },
            { data: 'pasien.nm_pasien' },
            { data: 'pasien.tgl_lahir' },
            { data: 'dokter.nm_dokter' },
        ],
        destroy: true,
        processing: true,
        paging: true,
        searching: true
    });
    dataTbPasien.on('click', 'tr', function () {
        let data = dataTbPasien.fnGetData(this);
        // let x = dataTbPasien.row(this).data();
        // console.log(x['pasien']['nm_pasien']);
        console.log(data.pasien.nm_pasien);
        // console.log(data);
        let encoded = btoa(JSON.stringify(data));
        location.href = '/simrs/igd/tindakan?data=' + encoded;
        swalNotif(data);
    });
};

$('#tgl_reg').change(function () {
    getRegPasien($('#tgl_reg').val());
});

function swalNotif(data) {
    console.log(data);
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Data berhasil disimpan',
        showConfirmButton: false,
        timer: 1500
    });
}

