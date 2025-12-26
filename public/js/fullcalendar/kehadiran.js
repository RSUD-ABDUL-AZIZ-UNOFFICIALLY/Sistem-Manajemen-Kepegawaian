
let date = new Date();
console.log(date);
let tanggalAwal = document.getElementById("tanggalAwal").value = date.toISOString().split('T')[0];
let tanggalAkhir = document.getElementById("tanggalAkhir").value = date.toISOString().split('T')[0];
document.getElementById("tanggalAkhir").setAttribute('max', date.toISOString().split('T')[0]);

async function cari(){
    console.log("cari");
 let departemen = $("#departemen").val();
 console.log(departemen);
 if (departemen == '') {
     Swal.fire({
         icon: "error",
         title: "Oops.",
         text: "Mohon pilih Bidang terlebih dahulu",
     });
     return false;
 }
    let tanggalAwal = document.getElementById("tanggalAwal").value;
    let tanggalAkhir = document.getElementById("tanggalAkhir").value;
    try {
        const response = await fetch(`/api/presensi/attendance?dep=${departemen}&start=${tanggalAwal}&end=${tanggalAkhir}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            listKehadiran(data.data);
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }

}
async function listKehadiran(data) {
    console.log(data);
   let listContainer = document.getElementById("listKehadiran");
    if (data.length == 0) {
        listContainer.innerHTML = "<p class='text-sm text-gray-500'>Tidak ada data.</p>";
    }
  
    listContainer.innerHTML = ""; 
    for (let d of data) {
        let cekIn
        let cekOut = '';
      
        if (d.absen.cekIn == null) {
            cekIn = `<span>Masuk: <strong class="text-red-800">--:--</strong></span>
            <span class="text-red-600">(Tidak Absen)</span>`
        }
        if (d.absen.statusIn == 'Masuk Terlambat') {
            cekIn = `<span>Masuk: <strong class="text-red-800">${d.absen.cekIn ? d.absen.cekIn : '--:--'}</strong></span>
            <span class="text-red-600">(${d.absen.keteranganIn})</span>`
        }
        if (d.absen.statusIn == 'Masuk Tepat Waktu') {
            cekIn = `<span>Masuk: <strong class="text-gray-800">${d.absen.cekIn ? d.absen.cekIn : '--:--'}</strong></span>
            <span class="text-green-600">(${d.absen.statusIn})</span>`
        }
        if (d.absen.statusIn == 'Masuk Cepat') {
            cekIn = `<span>Masuk: <strong class="text-gray-800">${d.absen.cekIn ? d.absen.cekIn : '--:--'}</strong></span>
            <span class="text-green-600">(${d.absen.statusIn})</span>`
        }
        if (d.absen.cekOut == null) {
            cekOut = `<span>Pulang: <strong class="text-red-800">--:--</strong></span>
            <span class="text-red-600">(Tidak Absen)</span>`
        }
        if (d.absen.statusOut == 'Pulang Cepat') {
            cekOut = `<span>Pulang: <strong class="text-red-800">${d.absen.cekOut ? d.absen.cekOut : '--:--'}</strong></span>
            <span class="text-red-600">(${d.absen.keteranganOut})</span>`
        }
        if (d.absen.statusOut == 'Pulang Tepat Waktu') {
            cekOut = `<span>Pulang: <strong class="text-gray-800">${d.absen.cekOut ? d.absen.cekOut : '--:--'}</strong></span>
            <span class="text-green-600">(${d.absen.statusOut})</span>`
        }
        if (d.absen.statusOut == 'Pulang Terlambat') {
            cekOut = `<span>Pulang: <strong class="text-gray-800">${d.absen.cekOut ? d.absen.cekOut : '--:--'}</strong></span>
            <span class="text-green-600">(${d.absen.statusOut})</span>`
        }

        let itemHTML = `
      <div class="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <!-- Tanggal dan Jenis Dinas -->
          <div class="flex items-center gap-2 mb-1">
            <p class="text-sm text-gray-600"><i class="fas fa-calendar-alt mr-1"></i> <span>${d.date}</span></p>
            <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded">${d.dnsType.type}</span>
          </div>
          <p class="text-lg font-semibold text-gray-700"><i class="fas fa-user mr-1 text-gray-500"></i> <span>${d.user.nama}</span></p>
          <p class="text-sm text-gray-500"><i class="fas fa-location-dot mr-1 text-gray-400"></i>Masuk  : ${d.absen.loactionIn ? d.absen.loactionIn : '-'}</p>
          <p class="text-sm text-gray-500"><i class="fas fa-location-dot mr-1 text-gray-400"></i>Pulang : ${d.absen.loactionOut ? d.absen.loactionOut : '-'}</p>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="fas fa-sign-in-alt text-yellow-500"></i>
            ${cekIn}
          
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <i class="fas fa-sign-out-alt text-green-500"></i>
            ${cekOut}
          </div>
        </div>
      </div>
      `;
        listContainer.innerHTML += itemHTML;
        
    }
   
}


