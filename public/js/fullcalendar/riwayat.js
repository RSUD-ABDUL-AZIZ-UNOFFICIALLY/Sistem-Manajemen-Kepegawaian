let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let periodeElement = document.getElementById("periode");
let periode = periodeElement.value = year + "-" + (month < 10 ? "0" + month : month);


// console.log(year + "-" + (month < 10 ? "0" + month : month));
console.log(periode);
getRiwayat(periode)

// Event listener untuk perubahan nilai pada elemen dengan id 'periode'
document.getElementById("periode").addEventListener("change", function () {
    console.log(this.value);
    getRiwayat(this.value);
});

// Fungsi async untuk mengambil data riwayat
async function getRiwayat(date) {
    try {
        const response = await fetch(`/api/presensi/riwayat?periode=${date}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            listRiwayat(data.data);
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fungsi untuk memproses dan menampilkan daftar riwayat
function listRiwayat(data) {
    const absensiList = document.getElementById("absensi-list");
    absensiList.innerHTML = ""; // Mengosongkan elemen

    for (let d of data) {
        // Menentukan nilai default jika tidak ada data
        let cekOut = d.cekOut ? d.cekOut : "-";
        let statusOut = d.statusOut ? `(${d.statusOut})` : "";

        // Membuat elemen baru menggunakan template literal
        const newEntry = `
            <div class="d-flex justify-content-between align-items-center border-bottom">
                <div>
                    <strong>Tanggal:</strong> ${d.date}<br>
                    <strong>Jam Masuk:</strong> ${d.cekIn} <span class="text-muted">(${d.statusIn})</span><br>
                    <strong>Jam Pulang:</strong> ${cekOut} <span class="text-muted">${statusOut}</span>
                </div>
                <div>
                    <strong>CatatanIn:</strong> ${d.keteranganIn ? d.keteranganIn : "Tidak ada catatan"}<br>
                    <strong>CatatanOut:</strong> ${d.keteranganOut ? d.keteranganOut : "-"}<br>
                </div>
            </div>
        `;
        // Menambahkan elemen ke dalam daftar absensi
        absensiList.insertAdjacentHTML("beforeend", newEntry);
    }
}
