let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let periodeElement = document.getElementById("periode");
let periode = periodeElement.value = year + "-" + (month < 10 ? "0" + month : month);


// console.log(year + "-" + (month < 10 ? "0" + month : month));
getRiwayat(periode)
recapAbsen(periode);

// Event listener untuk perubahan nilai pada elemen dengan id 'periode'
document.getElementById("periode").addEventListener("change", function () {
    console.log(this.value);
    getRiwayat(this.value);
    recapAbsen(this.value);
});

// Fungsi async untuk mengambil data riwayat
async function getRiwayat(date) {
    try {
        const response = await fetch(`/api/presensi/riwayat?periode=${date}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
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

    const listContainer = document.getElementById("listKehadiran");
    listContainer.innerHTML = ""; // Mengosongkan elemen
    if (data.length == 0){
        listContainer.innerHTML = "<p class='text-sm text-gray-500'>Tidak ada data.</p>";
    }

    for (let d of data) {
        // Menentukan nilai default jika tidak ada data
     
        const tanggal = new Date(d.date).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        const itemHTML = `
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5  rounded">${d.Jnsdn.type}</span>
            <div class="mb-2 font-medium text-gray-700">${tanggal}</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p class="text-sm text-left text-gray-600">Masuk: <span class="font-medium text-gray-800">${d.cekIn ? d.cekIn : "-"}</span></p>
                ${getStatusMasuk(d.statusIn)}
                <p class="text-xs text-left font-medium">Lokasi:${d.loactionIn ? d.loactionIn : "-"}</p>
                 <p class="text-xs text-left font-medium">Ket:${d.keteranganIn ? d.keteranganIn : "-"}</p>
              </div>
              <div>
                <p class="text-sm text-left text-gray-600">Pulang: <span class="font-medium text-gray-800">${d.cekOut ? d.cekOut : "-"}</span></p>
                ${getStatusPulang(d.statusOut)}
                 <p class="text-xs text-left font-medium">Lokasi:${d.loactionOut ? d.loactionOut : "-"}</p>
                 <p class="text-xs text-left font-medium">Ket:${d.keteranganOut ? d.keteranganOut : "-"}</p>
              </div>
            </div>
          </div>
        `;
        listContainer.innerHTML += itemHTML;
    }
}

function getStatusMasuk(stt) {
    if (stt == 'Masuk Terlambat') {
        return `<p class="text-xs text-left text-yellow-600">${stt}</p>`;
    }
    return `<p class="text-xs text-left text-green-600">${stt ? stt : "-"}</p>`;
}

function getStatusPulang(stt) {
    if (stt == 'Pulang Cepat') {
        return `<p class="text-xs text-left text-red-600">${stt}</p>`;
    }
    return `<p class="text-xs text-left text-green-600">${stt ? stt : "-"}</p>`;
}

async function recapAbsen(date) {
    try {
        const response = await fetch(`/api/presensi/recap?periode=${date}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            recap(data.data);
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
async function recap(data) {
    console.log(data);
    const hariKerjaElement = document.getElementById("hariKerja");
    hariKerjaElement.textContent = 0;
    hariKerjaElement.textContent = data.hariKerja ? data.hariKerja : "-";
    const totalLibur = document.getElementById("totalLibur");
    totalLibur.textContent = 0;
    totalLibur.textContent = data.libur ? data.libur : "-";
    const LisLibur = document.getElementById("listLibur");
    LisLibur.innerHTML = ""; // Mengosongkan elemen
    Object.entries(data.typeLibur).forEach(([key, value]) => {
        const itemHTML = `
          <li>${key} : ${value}</li>
        `;
        LisLibur.innerHTML += itemHTML;
    });
    const masukTepatWaktu = document.getElementById("masukTepatWaktu");
    masukTepatWaktu.textContent = 0;
    masukTepatWaktu.textContent = data.masukTepatWaktu ? data.masukTepatWaktu : "-";
    const terlambatMasuk = document.getElementById("terlambatMasuk");
    terlambatMasuk.textContent = 0;
    terlambatMasuk.textContent = data.telatmasuk ? data.telatmasuk : "0";
    const pulangTepatWaktu = document.getElementById("pulangTepatWaktu");
    pulangTepatWaktu.textContent = 0;
    pulangTepatWaktu.textContent = data.pulangTepatWaktu ? data.pulangTepatWaktu : "-";
    const cepatPulang = document.getElementById("cepatPulang");
    cepatPulang.textContent = 0;
    cepatPulang.textContent = data.cepatPulang ? data.cepatPulang : "0";
    const tidakAbsenMasuk = document.getElementById("tidakAbsenMasuk");
    tidakAbsenMasuk.textContent = 0;
    tidakAbsenMasuk.textContent = data.tidakAbsenMasuk ? data.tidakAbsenMasuk : "-";
    const tidakAbsenPulang = document.getElementById("tidakAbsenPulang");
    tidakAbsenPulang.textContent = 0;
    tidakAbsenPulang.textContent = data.tidakAbsenPulang ? data.tidakAbsenPulang : "-";
    const tidakAbsen = document.getElementById("tidakAbsen");
    tidakAbsen.textContent = 0;
    tidakAbsen.textContent = data.tidakAbsen ? data.tidakAbsen : "-";


}