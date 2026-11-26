document.addEventListener("DOMContentLoaded", () => {
    let date = new Date();
    let todayStr = date.toISOString().split('T')[0];

    let tglAwal = document.getElementById("tanggalAwal");
    let tglAkhir = document.getElementById("tanggalAkhir");

    tglAwal.value = todayStr;
    tglAkhir.value = todayStr;
    tglAkhir.setAttribute('max', todayStr);
});

async function cari() {
    let departemen = document.getElementById("departemen").value;

    if (departemen === '') {
        Swal.fire({
            icon: "warning",
            title: "Oops.",
            text: "Mohon pilih Bidang / Departemen terlebih dahulu di panel Jadwal.",
        });
        return false;
    }

    let tglAwal = document.getElementById("tanggalAwal").value;
    let tglAkhir = document.getElementById("tanggalAkhir").value;
    let listContainer = document.getElementById("listKehadiran");

    listContainer.innerHTML = `<div class="text-center py-8 text-primary"><span class="loading loading-spinner loading-md"></span> Memuat data...</div>`;

    try {
        const response = await fetch(`/api/presensi/attendance?dep=${departemen}&start=${tglAwal}&end=${tglAkhir}`, {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            listKehadiran(data.data);
        } else {
            console.error("Error fetching data:", response.status);
            listContainer.innerHTML = `<div class="text-center text-error py-4">Gagal memuat data.</div>`;
        }
    } catch (error) {
        console.error("Error:", error);
        listContainer.innerHTML = `<div class="text-center text-error py-4">Terjadi kesalahan koneksi.</div>`;
    }
}

function listKehadiran(data) {
    let listContainer = document.getElementById("listKehadiran");

    if (!data || data.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center py-10 bg-base-200/50 rounded-xl border border-base-200 border-dashed">
                <i class="fas fa-inbox text-3xl text-base-content/30 mb-3 block"></i>
                <p class="text-sm font-medium text-base-content/60">Tidak ada data kehadiran pada rentang tanggal tersebut.</p>
            </div>`;
        return;
    }

    listContainer.innerHTML = "";

    for (let d of data) {
        let cekIn = '';
        let cekOut = '';

        // --- LOGIKA CEK IN ---
        if (!d.absen.cekIn) {
            cekIn = `<span>Masuk: <strong class="text-error">--:--</strong></span>
                     <span class="text-error text-xs font-semibold">(Tidak Absen)</span>`;
        } else if (d.absen.statusIn === 'Masuk Terlambat') {
            cekIn = `<span>Masuk: <strong class="text-error">${d.absen.cekIn}</strong></span>
                     <span class="text-error text-xs font-semibold">(${d.absen.keteranganIn})</span>`;
        } else if (d.absen.statusIn === 'Masuk Tepat Waktu' || d.absen.statusIn === 'Masuk Cepat') {
            cekIn = `<span>Masuk: <strong class="text-base-content">${d.absen.cekIn}</strong></span>
                     <span class="text-success text-xs font-semibold">(${d.absen.statusIn})</span>`;
        }

        // --- LOGIKA CEK OUT ---
        if (!d.absen.cekOut) {
            cekOut = `<span>Pulang: <strong class="text-error">--:--</strong></span>
                      <span class="text-error text-xs font-semibold">(Tidak Absen)</span>`;
        } else if (d.absen.statusOut === 'Pulang Cepat') {
            cekOut = `<span>Pulang: <strong class="text-error">${d.absen.cekOut}</strong></span>
                      <span class="text-error text-xs font-semibold">(${d.absen.keteranganOut})</span>`;
        } else if (d.absen.statusOut === 'Pulang Tepat Waktu' || d.absen.statusOut === 'Pulang Terlambat') {
            cekOut = `<span>Pulang: <strong class="text-base-content">${d.absen.cekOut}</strong></span>
                      <span class="text-success text-xs font-semibold">(${d.absen.statusOut})</span>`;
        }

        // --- RENDER HTML COMPONENT (DaisyUI Card) ---
        let itemHTML = `
        <div class="card bg-base-100 border border-base-200 shadow-sm hover:border-primary/50 transition-colors">
            <div class="card-body p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <!-- Info Pegawai & Jadwal -->
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-sm font-semibold text-base-content/70">
                            <i class="fas fa-calendar-alt mr-1"></i> ${d.date}
                        </span>
                        <span class="badge badge-primary badge-sm shadow-sm">${d.dnsType?.type || '-'}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-base-content flex items-center gap-2 mb-2">
                        <i class="fas fa-user-circle text-base-content/40 text-xl"></i> ${d.user?.nama || '-'}
                    </h3>
                    
                    <div class="space-y-1 mt-2">
                        <p class="text-xs text-base-content/60 flex items-start gap-2">
                            <i class="fas fa-location-dot mt-0.5 text-center w-4"></i> 
                            <span><strong class="font-medium">Lokasi Masuk:</strong> ${d.absen.loactionIn || '-'}</span>
                        </p>
                        <p class="text-xs text-base-content/60 flex items-start gap-2">
                            <i class="fas fa-location-dot mt-0.5 text-center w-4"></i> 
                            <span><strong class="font-medium">Lokasi Pulang:</strong> ${d.absen.loactionOut || '-'}</span>
                        </p>
                    </div>
                </div>

                <!-- Status Check In / Check Out -->
                <div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 border-base-200 pt-3 lg:pt-0">
                    <div class="bg-base-200/50 rounded-lg p-3 flex flex-col justify-center min-w-[160px]">
                        <div class="flex items-center gap-2 text-sm text-base-content mb-1">
                            <i class="fas fa-sign-in-alt text-warning"></i>
                            ${cekIn}
                        </div>
                    </div>
                    
                    <div class="bg-base-200/50 rounded-lg p-3 flex flex-col justify-center min-w-[160px]">
                        <div class="flex items-center gap-2 text-sm text-base-content mb-1">
                            <i class="fas fa-sign-out-alt text-success"></i>
                            ${cekOut}
                        </div>
                    </div>
                </div>

            </div>
        </div>
        `;

        listContainer.insertAdjacentHTML("beforeend", itemHTML);
    }
}