let dateNow = new Date();
let year = dateNow.getFullYear();
let month = dateNow.getMonth() + 1;
let periodeElement = document.getElementById("periode");
let periode = periodeElement.value = year + "-" + (month < 10 ? "0" + month : month);


// console.log(year + "-" + (month < 10 ? "0" + month : month));
getRiwayat(periode)
recapAbsen(periode);
getRiwayatLembur(periode);

// Event listener untuk perubahan nilai pada elemen dengan id 'periode'
document.getElementById("periode").addEventListener("change", function () {
    console.log(this.value);
    getRiwayat(this.value);
    recapAbsen(this.value);
    getRiwayatLembur(this.value);
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
async function getRiwayatLembur(date) {
    try {
        let token = getCookie("token");
        token = token.split('.')
        let idData = atob(token[1]);
        idData = JSON.parse(idData);
        // console.log(idData)
        let nik = idData.id
        // console.log(nik);
        const response = await fetch(`/api/presensi/attendance/overtime?periode=${date}&nik=${nik}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            listRiwayatLembur(data.data);
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
// 1. Fungsi Menghitung Durasi Lembur (Otomatis handle beda hari / lewat tengah malam)
function hitungDurasi(masuk, pulang) {
    if (!masuk || !pulang) return "Belum Selesai/Data Tidak Lengkap";

    const [jamM, mntM, dtkM] = masuk.split(':').map(Number);
    const [jamP, mntP, dtkP] = pulang.split(':').map(Number);

    let totalDetikMasuk = (jamM * 3600) + (mntM * 60) + dtkM;
    let totalDetikPulang = (jamP * 3600) + (mntP * 60) + dtkP;

    // Jika jam pulang lebih kecil dari jam masuk, berarti pulang di hari berikutnya
    if (totalDetikPulang < totalDetikMasuk) {
        totalDetikPulang += 24 * 3600; // Tambah 24 jam (dalam detik)
    }

    let selisih = totalDetikPulang - totalDetikMasuk;

    const jam = Math.floor(selisih / 3600);
    const menit = Math.floor((selisih % 3600) / 60);
    const detik = selisih % 60;

    return `${jam} Jam ${menit} Menit ${detik} Detik`;
}

// 2. Fungsi Menggabungkan Data (Beda hari ditarik ke tanggal awal)
function gabungkanDataLembur(rawData) {
    // Sortir dari tanggal terlama ke terbaru agar mudah divalidasi ke hari berikutnya
    let sorted = [...rawData].sort((a, b) => new Date(a.date) - new Date(b.date));
    let result = [];

    for (let i = 0; i < sorted.length; i++) {
        let current = { ...sorted[i] };

        // Cek jika masuk ada, tapi pulang null
        if (current.lembur_masuk && !current.lembur_pulang) {
            // Cek apakah data besoknya ada dan hanya berisi jam pulang
            if (i + 1 < sorted.length) {
                let next = sorted[i + 1];
                let diffTime = new Date(next.date) - new Date(current.date);
                let diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays === 1 && !next.lembur_masuk && next.lembur_pulang) {
                    current.lembur_pulang = next.lembur_pulang;
                    current.lokasi_pulang = next.lokasi_pulang;
                    // Skip data besoknya karena sudah digabung ke hari ini
                    i++;
                }
            }
        }

        current.durasi = hitungDurasi(current.lembur_masuk, current.lembur_pulang);
        result.push(current);
    }

    // Kembalikan urutan descending (terbaru di atas)
    return result.reverse();
}

// 3. Render ke Template HTML
function formatTanggal(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function listRiwayatLembur(data) {
    const renderList = () => {
        const dataBersih = gabungkanDataLembur(data);
        const totalDurasi = hitungTotalLembur(dataBersih);
        document.getElementById('totalDurasi_lembur').innerHTML = totalDurasi;
        return dataBersih.map((d) => {
            return `
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
          <div class="flex justify-between items-center mb-2">
             <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded">Lembur</span>
             <span class="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-0.5 rounded shadow-sm">⏱ ${d.durasi}</span>
          </div>
          <div class="mb-3 font-medium text-gray-700">${formatTanggal(d.date)}</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p class="text-sm text-left text-gray-600">Masuk: <span class="font-medium text-gray-800">${d.lembur_masuk || "-"}</span></p>
              <p class="text-xs text-left font-medium text-gray-600 mt-1">Lokasi: <span class="text-gray-800">${d.lokasi_masuk || "-"}</span></p>
            </div>
            <div>
              <p class="text-sm text-left text-gray-600">Pulang: <span class="font-medium text-gray-800">${d.lembur_pulang || "-"}</span></p>
              <p class="text-xs text-left font-medium text-gray-600 mt-1">Lokasi: <span class="text-gray-800">${d.lokasi_pulang || "-"}</span></p>
            </div>
          </div>
        </div>
        `;
        }).join('');
    };

    // Insert ke container HTML
    document.getElementById('listKehadiran_lembur').innerHTML = renderList();

}
function hitungTotalLembur(dataArray) {
    let totalDetikKeseluruhan = 0;

    dataArray.forEach(d => {
        if (d.lembur_masuk && d.lembur_pulang) {
            const [jamM, mntM, dtkM] = d.lembur_masuk.split(':').map(Number);
            const [jamP, mntP, dtkP] = d.lembur_pulang.split(':').map(Number);

            let totalDetikMasuk = (jamM * 3600) + (mntM * 60) + dtkM;
            let totalDetikPulang = (jamP * 3600) + (mntP * 60) + dtkP;

            if (totalDetikPulang < totalDetikMasuk) {
                totalDetikPulang += 24 * 3600;
            }

            totalDetikKeseluruhan += (totalDetikPulang - totalDetikMasuk);
        }
    });

    const jam = Math.floor(totalDetikKeseluruhan / 3600);
    const menit = Math.floor((totalDetikKeseluruhan % 3600) / 60);
    const detik = totalDetikKeseluruhan % 60;

    return `${jam} Jam ${menit} Menit`;
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