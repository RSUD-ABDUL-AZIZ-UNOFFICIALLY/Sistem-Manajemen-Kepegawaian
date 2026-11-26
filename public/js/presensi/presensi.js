
let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth();
let typeJdlDns = [];
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
    for (let dns of typeJdlDns) {
        headCol.append("<th>" + dns.type + "</th>");
    }


    for (const element of anggota.data) {
        let row = $("<tr>");
        row.append("<td>" + element.nama + "</td>");
        for (let x of element.jadwal) {
            let value = `<button type="button" class="btn btn-primary " onclick="editJadwal('${element.nama}','${element.nik}', '${x.date}', '${x.typeDns}')">Edit</button>`
            let value2 = `<p class="text-center">${x.dnsType.type}</p>`
            row.append($("<td>" + value + value2 + "</td>"));
        }
        let MapJadwal = element.jadwal.reduce((acc, curr) => {
            if (!acc[curr.typeDns]) {
                acc[curr.typeDns] = []
            }
            acc[curr.typeDns].push(curr)
            return acc
        }, {})
        for (let dns of typeJdlDns) {
            row.append($(`<td> ${MapJadwal[dns.slug] == undefined ? 0 : MapJadwal[dns.slug].length} </td >`));
            $("tbody").append(row);
        }
    }
    $("tfoot > tr").remove();
    for (let dns of typeJdlDns) {
        let rowL = $("<tr>");
        console.log(dns);
        rowL.append("<td>" + dns.type + "</td>");
        for (let i = 0; i < jumlahHari; i++) {
            let x = [];
            for (const element of anggota.data) {
                x.push(element.jadwal[i].typeDns);
            }
            let countX = x.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            rowL.append($(`<td>${countX[dns.slug] == undefined ? 0 : countX[dns.slug]}</td>`));

        }
        $("tfoot").append(rowL);
    }
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
    await $.ajax({
        url: "/api/presensi/jnsdns?dep=" + dep,
        method: "GET",
        success: function (data) {
            typeJdlDns = data.data
            $("#sectionjnsDns").find('option').remove().end();
            for (let i of typeJdlDns) {
                $("#sectionjnsDns").append("<option value='" + i.slug + "'>" + i.type + "</option>");
            }
        },
        error: function (error) {
            console.log(error)
            return Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.responseJSON.message
            })
        }
    })
    return await $.ajax({
        url: "/api/presensi/anggota?dep=" + dep + "&periode=" + $("#periode").val(),
        method: "GET",
        success: function (data) {
            return data.data;
        },
        error: function (error) {
            console.log(error)
            return Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.responseJSON.message
            })
        }
    })

}
