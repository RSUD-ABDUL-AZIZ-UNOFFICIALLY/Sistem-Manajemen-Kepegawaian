let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth();
let typeJdlDns = [];
let jnsDNS = [];
let departemen = "";

const periodeInput = document.getElementById("periode");
const departemenSelect = document.getElementById("departemen");

// Inisialisasi Nilai Default
periodeInput.value = `${year}-${String(month + 1).padStart(2, '0')}`;
departemenSelect.innerHTML = `<option value=''>Pilih Bidang / Departemen</option>`;

// Fetch Data Departemen
fetch("/api/presensi/departemen")
    .then(response => response.json())
    .then(data => {
        if (data && data.data) {
            data.data.forEach(v => {
                departemenSelect.insertAdjacentHTML("beforeend", `<option value='${v.dep}'>${v.departemen.bidang}</option>`);
            });
        }
    })
    .catch(error => console.error('Error fetching departemen data:', error));

// Event Listeners
periodeInput.addEventListener("change", function () {
    let periode = this.value;
    getTabel(periode);
});

departemenSelect.addEventListener("change", function () {
    departemen = this.value;
    getTabel(periodeInput.value);
});

async function getAnggota(dep) {
    try {
        // Ambil Jenis DNS
        const resJns = await fetch(`/api/presensi/jnsdns?dep=${dep}`);
        if (!resJns.ok) throw await resJns.json();
        const dataJns = await resJns.json();

        jnsDNS = dataJns.data.map(item => item.type);
        jnsDNS.push("jamKerja");

        // Ambil Data Anggota
        const resAnggota = await fetch(`/api/presensi/anggota?dep=${dep}&periode=${periodeInput.value}`);
        if (!resAnggota.ok) throw await resAnggota.json();
        return await resAnggota.json();

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.message || "Terjadi kesalahan saat mengambil data anggota"
        });
        return null;
    }
}

async function updateJamkerja(nik) {
    try {
        const res = await fetch(`/api/presensi/anggota?dep=${departemen}&periode=${periodeInput.value}&nik=${nik}`);
        if (!res.ok) throw await res.json();
        return await res.json();
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.message || "Gagal memperbarui jam kerja"
        });
        return null;
    }
}

async function getTabel(periode) {
    let id_departemen = departemenSelect.value;

    if (id_departemen === '') {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Mohon pilih Bidang / Departemen terlebih dahulu",
        });
        return false;
    }

    let responseData = await getAnggota(id_departemen);
    if (!responseData || !responseData.data) return;

    let anggota = responseData.data;

    let dataTable = anggota.map(a => {
        let data = { nama: a.nama, nik: a.nik };
        let countDNS = {};
        let jamKerja = 0;

        a.jadwal?.forEach((j, idx) => {
            let type = j.dnsType?.type || "";
            if (j.dnsType && j.dnsType.hours) jamKerja += j.dnsType.hours;
            data[(idx + 1).toString()] = type;

            if (type) {
                countDNS[type] = (countDNS[type] || 0) + 1;
            }
        });

        // Tambahkan total ke data
        jnsDNS.forEach(jns => {
            data["Total " + jns] = countDNS[jns] || 0;
        });
        data["Total jamKerja"] = jamKerja;

        return data;
    });

    let date = new Date(periode);
    let selectedYear = date.getFullYear();
    let selectedMonth = date.getMonth();
    let jumlahHari = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    let namaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
    let columns = [{ title: "Nama", field: "nama", width: 200, frozen: true }];

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
        let currentDate = new Date(selectedYear, selectedMonth, i);
        let hari = namaHari[currentDate.getDay()];
        columns.push({
            title: `${hari}, ${i}`,
            field: `${i}`,
            editor: "list",
            editorParams: {
                values: jnsDNS,
                elementAttributes: {
                    readonly: true,
                    tabindex: "-1",
                    inputmode: "none",
                }
            },
            cellEdited: async function (cell) {
                let row = cell.getRow();
                let data = row.getData();
                let value = cell.getValue();
                let day = cell.getField();

                if (parseInt(day) < 10) day = "0" + day;

                // Pastikan fungsi ini tersedia secara global di script Anda
                if (typeof updrateJadwal === "function") {
                    updrateJadwal(data.nik, `${periode}-${day}`, `${value}-${id_departemen}`);
                }

                // Hitung ulang total di baris
                let jamkerjaRes = await updateJamkerja(data.nik);
                let newTotals = {};
                jnsDNS.forEach(jns => { newTotals[`Total ${jns}`] = 0; });

                for (let i = 1; i <= jumlahHari; i++) {
                    let val = data[i.toString()];
                    if (val && jnsDNS.includes(val)) {
                        newTotals[`Total ${val}`]++;
                    }
                }
                if (jamkerjaRes && jamkerjaRes.data) {
                    newTotals["Total jamKerja"] = jamkerjaRes.data.totalJam;
                }
                row.update(newTotals);

                // Update baris total bawah per jenis
                jnsDNS.forEach(jns => {
                    let totalRow = table.getRows().find(r => r.getData().nama === `Total ${jns}`);
                    if (totalRow) {
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

            },
            minWidth: 80,
            responsive: 2
        });
    }

    jnsDNS.forEach(jns => {
        columns.push({ title: `${jns}`, field: `Total ${jns}`, minWidth: 80 });
    });

    let table = new Tabulator("#tableJadwaldns", {
        data: dataTable,
        columns: columns,
        layout: "fitDataStretch",
        height: "500px",
        rowFormatter: function (row) {
            let data = row.getData();
            // Memberikan highlight pada baris Total agar mudah dibedakan
            if (data.nama && data.nama.startsWith("Total ")) {
                row.getElement().style.backgroundColor = "#e0f2fe"; // Tailwind sky-100
                row.getElement().style.fontWeight = "bold";
            }
        }
    });

    document.getElementById("download-xlsx").addEventListener("click", function () {
        table.download("xlsx", "Data_Jadwal_Absen.xlsx", { sheetName: "Jadwal" });
    });
}