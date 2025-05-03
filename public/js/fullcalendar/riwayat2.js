let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let periodeElement = document.getElementById("periode");
let periode = periodeElement.value = year + "-" + (month < 10 ? "0" + month : month);


// console.log(year + "-" + (month < 10 ? "0" + month : month));
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