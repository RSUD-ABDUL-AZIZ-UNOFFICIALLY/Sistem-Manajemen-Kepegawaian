let periode = new Date().toISOString().slice(0, 4);
getTabel(periode)
$("#periodeTahun").val(periode);
$("#periodeTahun").on("change", function (data) {
    // console.log("periode tahun berubah");
    // console.log($(this).val());
    getTabel($(this).val());
});

async function getTabel(periode) {
    console.log("periode tahun", periode);
    $('#tableCuti').DataTable().destroy();
    $('#tableCuti').DataTable({
        "ajax": {
            "url": "/api/cuti/approve/all?tahun=" + periode,
            "type": "GET",
        },
        "columns": [{
            "data": "id"
        },
        {
            "data": "data_cuti.createdAt",
            "render": function (data) {
                return moment(data).format('YYYY-MM-DD HH:mm');
            }
        },
        {
            "data": "name_user"
        },
        {
            "data": "departemen"
        },
        {
            "data": "type_cuti"
        },
        {
            "data": "tgl_cuti",
        },
        {
            "data": "cuti_diambil"
        },
        {
            "data": "sisa_cuti"
        },
        {
            "data": "data_cuti.keterangan"
        },
        {
            "data": "approve_date",
            "render": function (data) {
                return moment(data).format('YYYY-MM-DD HH:mm');
            }
        },
        {
            "data": "name_atasan"
        },
        {
            "data": "tembusan"
        },
        {
            "data": "keterangan"
        }]
    });

}
