let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth();
let typeJdlDns = [];
let jnsDNS = [];
let departemen = "";
$("#periode").val(year + "-" + ("0" + (month + 1)).slice(-2));
$("#departemen").append("<option value=''>Pilih Departemen</option>");
fetch("/api/presensi/departemen")
    .then(response => response.json())
    .then(data => {
        data.data.forEach(v => {
            $("#departemen").append(`<option value='${v.dep}'>${v.departemen.bidang}</option>`);
        });
    })
    .catch(error => console.error('Error fetching departemen data:', error));
$("#periode").on("change", function () {
    let periode = $(this).val();
    getTabel(periode);
});
$("#departemen").on("change", function () {
    departemen = $(this).val();
    getTabel($("#periode").val());
});

async function getAnggota(dep) {
   await $.ajax({
        url: "/api/presensi/jnsdns?dep=" + dep,
        method: "GET",
        success: function (data) {
           jnsDNS = data.data.map(item => item.type);
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
    anggota= anggota.data
    let dataTable = anggota.map(a => {
        let data = { nama: a.nama,nik: a.nik };
        let countDNS = {}; 

        a.jadwal?.forEach((j, idx) => {
            let type = j.dnsType?.type || "";
            data[(idx + 1).toString()] = type;

            if (type) {
                countDNS[type] = (countDNS[type] || 0) + 1;
            }
        });

        // Tambahkan total ke data
        jnsDNS.forEach(jns => {
            data["Total " + jns] = countDNS[jns] || 0;
        });

        return data;
    });
    let date = new Date(periode);
    let year = date.getFullYear();
    let month = date.getMonth();
    let jumlahHari = new Date(year, month + 1, 0).getDate();

    let namaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
    let columns = [{ title: "Nama", field: "nama", width: '25px', frozen: true }];

    // Tambahkan baris total per jenis jnsDNS
    jnsDNS.forEach(jns => {
        let totalRow = { nama: `Total ${jns}` };
        for (let i = 1; i <= jumlahHari; i++) {
            let col = i.toString();
            let count = dataTable.reduce((acc, row) => row[col] === jns ? acc + 1 : acc, 0);
            totalRow[col] = count;
        }
        dataTable.push(totalRow);
    });

    for (let i = 1; i <= jumlahHari; i++) {
        let currentDate = new Date(year, month, i);
        let hari = namaHari[currentDate.getDay()];
        columns.push({
            title: `${hari}, ${i}`, field: `${i}`, editor: "list", editorParams: {
                values: jnsDNS,
               
            },
            cellEdited: function (cell) {
                let row = cell.getRow();
                let data = row.getData();
                let value = cell.getValue();
                let day = cell.getField();
                if (day < 10) day = "0" + day;
                updrateJadwal(data.nik, `${periode}-${day}`, `${value}-${id_departemen}`);
                // Hitung ulang total di baris
                let newTotals = {};
                jnsDNS.forEach(jns => { newTotals[`Total ${jns}`] = 0; });
                for (let i = 1; i <= jumlahHari; i++) {
                    let val = data[i.toString()];
                    if (val && jnsDNS.includes(val)) {
                        newTotals[`Total ${val}`]++;
                    }
                }
                row.update(newTotals);

                // === Update baris total bawah per jenis ===
                jnsDNS.forEach(jns => {
                    let totalRow = table.getRows().find(r => r.getData().nama === `Total ${jns}`);
                    if (totalRow) {
                        let totalData = totalRow.getData();
                        let updatedTotals = {};
                        for (let i = 1; i <= jumlahHari; i++) {
                            let col = i.toString();
                            let count = table.getData().filter(r =>
                                !r.nama.startsWith("Total ") && r[col] === jns
                            ).length;
                            updatedTotals[col] = count;
                        }
                        totalRow.update(updatedTotals);
                    }
                });
                
            }, width: '14px' });
        // columns.push({ title: `${hari}, ${i}`, field: `nik`, width: '15px' });
    }
    jnsDNS.forEach(jns => {
        columns.push({ title: `${jns}`, field: `Total ${jns}`, width: '15px' });
    });


    let table = new Tabulator("#tableJadwaldns", {
        data: dataTable,
        columns: columns,
        layout: "fitDataStretch",
        height: "500px", // ini penting untuk mengaktifkan scroll
        rowFormatter: function (row) {
            let data = row.getData();
            if (data.nama.startsWith("Total ")) {
                row.getElement().style.backgroundColor = "#f0f8ff";
                row.getElement().style.fontWeight = "bold";
            }
        }
    });
    document.getElementById("download-xlsx").addEventListener("click", function () {
        table.download("xlsx", "data_Absen.xlsx", { sheetName: "" });
    });
}
