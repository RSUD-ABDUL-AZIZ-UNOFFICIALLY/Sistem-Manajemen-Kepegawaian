
let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth();
$("#periode").val(year + "-" + ("0" + (month + 1)).slice(-2));
async function getTabel(periode) {
    let id_departemen = $("#departemen").val();
    if (id_departemen == '') {
        Swal.fire({
            icon: "error",
            title: "Oops.",
            text: "Mohon pilih Bidang terlebih dahulu",
        });
        return false;
    }
    let anggota = await getAnggota(id_departemen);
    // console.log(anggota.data);
    $("tbody > tr > td").remove();
    $("thead > tr > th").remove();

    let year = new Date(periode).getFullYear();
    let month = new Date(periode).getMonth();

    let jumlahHari = new Date(year, month + 1, 0).getDate();
    // console.log(jumlahHari);
    let headCol = $("thead > tr");
    headCol.append("<th>Nama</th>");
    for (let i = 0; i < jumlahHari; i++) {
        let namaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
        headCol.append("<th>" + namaHari[new Date(year, month, i + 1).getDay()] + ", " + (i + 1) + "</th>");
    }
    headCol.append("<th>LIBUR</th>");
    headCol.append("<th>FULL TIME</th>");
    headCol.append("<th>PAGI</th>");
    headCol.append("<th>SIANG</th>");
    headCol.append("<th>MALAM</th>");


    for (let i = 0; i < anggota.data.length; i++) {
        let row = $("<tr>");
        row.append("<td>" + anggota.data[i].nama + "</td>");
        for (let x of anggota.data[i].jadwal) {
            let value = `<button type="button" class="btn btn-primary " onclick="editJadwal('${anggota.data[i].nama}','${anggota.data[i].nik}', '${x.date}', '${x.typeDns}')">Edit</button>`
            let value2 = `<p class="text-center">${x.dnsType.type}</p>`
            row.append($("<td>" + value + value2 + "</td>"));
        }
        let MapJadwal = anggota.data[i].jadwal.reduce((acc, curr) => {
            if (!acc[curr.typeDns]) {
                acc[curr.typeDns] = []
            }
            acc[curr.typeDns].push(curr)
            return acc
        }, {})
        row.append($(`<td> ${MapJadwal.L == undefined ? 0 : MapJadwal.L.length} </td>`));
        row.append($(`<td> ${MapJadwal.F5 == undefined ? 0 : MapJadwal.F5.length} </td>`));
        row.append($(`<td> ${MapJadwal.P == undefined ? 0 : MapJadwal.P.length} </td>`));
        row.append($(`<td> ${MapJadwal.S == undefined ? 0 : MapJadwal.S.length} </td>`));
        row.append($(`<td> ${MapJadwal.M == undefined ? 0 : MapJadwal.M.length} </td>`));
        $("tbody").append(row);
    }
    $("tfoot > tr").remove();
    let rowL = $("<tr>");
    rowL.append("<td>LIBUR</td>");
    let rowF5 = $("<tr>");
    rowF5.append("<td>FULL TIME</td>");
    let rowP = $("<tr>");
    rowP.append("<td>PAGI</td>");
    let rowS = $("<tr>");
    rowS.append("<td>SIANG</td>");
    let rowM = $("<tr>");
    rowM.append("<td>MALAM</td>");
    for (let i = 0; i < jumlahHari; i++) {
        let x = [];
        for (let j = 0; j < anggota.data.length; j++) {
            // console.log(anggota.data[j].jadwal[i].typeDns);
            x.push(anggota.data[j].jadwal[i].typeDns);
        }
        let countX = x.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});
        rowL.append($(`<td>${countX["L"] == undefined ? 0 : countX["L"]}</td>`));
        rowF5.append($(`<td>${countX["F5"] == undefined ? 0 : countX["F5"]}</td>`));
        rowP.append($(`<td>${countX["P"] == undefined ? 0 : countX["P"]}</td>`));
        rowS.append($(`<td>${countX["S"] == undefined ? 0 : countX["S"]}</td>`));
        rowM.append($(`<td>${countX["M"] == undefined ? 0 : countX["M"]}</td>`));
    }
    $("tfoot").append(rowL);
    $("tfoot").append(rowF5);
    $("tfoot").append(rowP);
    $("tfoot").append(rowS);
    $("tfoot").append(rowM);
}
$("#periode").on("change", function () {
    let periode = $(this).val();
    getTabel(periode);
});

$("#departemen").append("<option value=''>Pilih Departemen</option>");
$.ajax({
    url: "/api/presensi/departemen",
    method: "GET",
    success: function (data) {
        $.each(data.data, function (i, v) {
            $("#departemen").append("<option value='" + v.dep + "'>" + v.departemen.bidang + "</option>");
        });
    }
});
$("#departemen").on("change", function () {
    getTabel($("#periode").val());
});

async function getAnggota(dep) {
    return await $.ajax({
        url: "/api/presensi/anggota?dep=" + dep + "&periode=" + $("#periode").val(),
        method: "GET",
        success: function (data) {
            return data.data;
        },
        error: function (error) {
            return Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Data gagal diambil",
            })
        }
    })

}
