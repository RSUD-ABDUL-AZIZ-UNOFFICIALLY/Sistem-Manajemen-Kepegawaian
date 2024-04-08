let now = new Date();
let day = ("0" + now.getDate()).slice(-2);
let month = ("0" + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + "-" + (month) + "-" + (day);
$('#tgl_reg').val(today);

let token = getCookie('token');
let urlSIMRS = decodeURIComponent(getCookie('urlSIMRS'));
getRegPasien(today, urlSIMRS, token);




function getRegPasien(tgl, urlSIMRS, token) {
    let dataTbPasien = $('#tb_pasien').dataTable({
        ajax: {
            url: `${urlSIMRS}/api/ralan/igd?from=${tgl}&until=${tgl}`,
            type: `GET`,
            headers: {
                Authorization: 'Bearer ' + token
            }
        },
        // ajax: '/api/simrs/reg/igd?tgl=' + tgl,
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
        let datastring =JSON.stringify(data);
        sessionStorage.setItem("px-igd", datastring);
        location.href = '/simrs/igd/menu';
    });
};

$('#tgl_reg').change(function () {
    getRegPasien($('#tgl_reg').val(), urlSIMRS, token);
});



