let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let periode = $("#periode").val(year + "-" + (month < 10 ? "0" + month : month));

// console.log(year + "-" + (month < 10 ? "0" + month : month));
// console.log(periode.val());
getRiwayat(periode.val())

$('#periode').change(function () {
    console.log($(this).val());
    getRiwayat($(this).val());
});
async function getRiwayat(date) {
    $.ajax({
        url: "/api/presensi/riwayat?periode=" + date,
        method: "GET",
        success: function (response) {
            console.log(response);
            listRiwayat(response.data)
        },
        error: function (data) {
            console.log(data);
        }
    });
}
function listRiwayat(data) {
    $('#absensi-list').empty();
    for (let d of data) {
        // let cekIn = d.cekIn ? d.cekIn : "Belum Absen";
        let cekOut = d.cekOut ? d.cekOut : "-";
        let statusOut = d.statusOut ? "(" + d.statusOut + ")" : "";
        const newEntry = `
                    <div class="d-flex justify-content-between align-items-center border-bottom ">
                    <div>
                            <strong>Tanggal:</strong>${d.date}<br>
                            <strong>Jam Masuk:</strong> ${d.cekIn} <span class="text-muted">(${d.statusIn})</span><br>
                            <strong>Jam Pulang:</strong> ${cekOut} <span class="text-muted">${statusOut}</span>
                        </div>
                        <div>
                            <strong>CatatanIn:</strong> ${d.keteranganIn ? d.keteranganIn : "Tidak ada catatan"}<br>
                            <strong>CatatanIn:</strong> ${d.keteranganOut ? d.keteranganOut : "-"}<br>
                        </div>
                    </div>
                `;
        // Menambahkan elemen ke dalam daftar absensi
        $('#absensi-list').append(newEntry);

    }

}