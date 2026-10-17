async function fetchData(url, method = 'GET', body = null) {
    try {
        let options = { method: method };
        if (body) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return null;
    }
}

const inputTanggal = document.getElementById('InputTanggal');
const tbBody = document.getElementById('tableBody');
const cardList = document.getElementById('mobileCardList');
const loadingIndicator = document.getElementById('loadingIndicator');

document.addEventListener('DOMContentLoaded', () => {
    const month = new Date().getMonth() + 1;
    inputTanggal.value = `${new Date().getFullYear()}-${month < 10 ? '0' + month : month}`;

    let monthly = inputTanggal.value;
    getTabel(monthly);
    getScore(monthly);
});

inputTanggal.addEventListener('change', function () {
    getTabel(this.value);
    getScore(this.value);
});

async function badgeStatus(monthly) {
    let status = await fetchData("/api/v2/monthly?date=" + monthly);
    let stt = document.getElementById('status');
    if (status && status.data) {
        stt.innerHTML = status.data.status;
        // Mengkonversi class ke standar DaisyUI Badge (contoh: bg-success diganti jadi badge-success)
        let badgeClass = status.data.className.replace('bg-', 'badge-').replace('text-white', '');
        stt.className = `badge ${badgeClass} text-xs font-semibold py-3 px-3 transition-colors ml-2`;
    }
    return true;
}

async function getScore(monthly) {
    let cekPeriode = await fetchData("/api/monthly/periode?date=" + monthly);
    badgeStatus(monthly);

    let summaryContainer = document.getElementById('summary');
    summaryContainer.style.opacity = 0;

    if (cekPeriode === null) {
        let score = await fetchData("/api/monthly/score?date=" + monthly);
        if (score) {
            // Menggunakan komponen STATS DaisyUI
            summaryContainer.innerHTML = `
                <div class="stats stats-vertical lg:stats-horizontal shadow-sm border border-base-200 w-full mb-6">
                    <div class="stat place-items-center">
                        <div class="stat-title">Pencapaian Bulanan</div>
                        <div class="stat-value text-primary">${score.data.capaian}</div>
                        <div class="stat-desc font-semibold">Menit</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">Kategori</div>
                        <div class="stat-value text-secondary">${score.data.kategori}</div>
                    </div>
                    <div class="stat place-items-center">
                        <div class="stat-title">Produktivitas TPP</div>
                        <div class="stat-value text-accent">${score.data.tpp}</div>
                    </div>
                </div>
                <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-base-200">
                    <button class="btn btn-outline" onclick="cetak()"><i class="fas fa-print"></i> Cetak</button>
                    <button class="btn btn-primary text-white" onclick="submit()"><i class="fas fa-paper-plane"></i> Kirim Laporan</button>
                </div>
            `;
        }
    } else {
        // Menggunakan komponen STATS DaisyUI
        summaryContainer.innerHTML = `
            <div class="stats stats-vertical lg:stats-horizontal shadow-sm border border-base-200 w-full mb-6 bg-base-100">
                <div class="stat">
                    <div class="stat-title">Capaian Valid</div>
                    <div class="stat-value text-primary">${cekPeriode.data.capaian}</div>
                    <div class="stat-desc font-bold">Menit</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Hari Kerja (HK)</div>
                    <div class="stat-value">${cekPeriode.data.days}</div>
                    <div class="stat-desc font-bold">HK</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Jam Laporan/Hari</div>
                    <div class="stat-value">${cekPeriode.data.workday}</div>
                    <div class="stat-desc font-bold">Jam</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Produktivitas TPP</div>
                    <div class="stat-value text-accent">${cekPeriode.data.tpp}%</div>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-base-200">
                <button class="btn btn-outline" onclick="cetak()"><i class="fas fa-print"></i> Cetak</button>
                <button class="btn btn-primary text-white" onclick="submit2()"><i class="fas fa-paper-plane"></i> Kirim Laporan</button>
            </div>
        `;
    }

    setTimeout(() => { summaryContainer.style.opacity = 1; }, 50);
}

async function getTabel(newDateValue) {
    loadingIndicator.classList.remove('hidden');
    loadingIndicator.classList.add('flex');
    tbBody.style.opacity = '0.5';
    cardList.style.opacity = '0.5';

    let response = await fetchData("/api/monthly?date=" + newDateValue);
    tbBody.innerHTML = "";
    cardList.innerHTML = "";

    if (response && response.data) {
        if (response.data.length === 0) {
            tbBody.innerHTML = `<tr><td colspan="7" class="px-6 py-12 text-center text-base-content/60">Tidak ada aktivitas pada periode ini.</td></tr>`;
            cardList.innerHTML = `<div class="p-8 text-center text-base-content/60">Tidak ada aktivitas pada periode ini.</div>`;
        } else {
            response.data.forEach((item, index) => {
                let nomor = index + 1;

                // Format Desktop DaisyUI
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-center font-medium">${nomor}</td>
                    <td class="whitespace-nowrap text-sm">${formatDateId(item.tgl)}</td>
                    <td class="font-medium">${item.rak}</td>
                    <td class="text-center">${item.volume}</td>
                    <td class="text-center"><span class="badge badge-ghost badge-sm">${item.satuan}</span></td>
                    <td class="text-center font-bold">${item.waktu}</td>
                    <td class="text-center">
                        <div class="join">
                            <button onclick="edit(${item.id})" class="btn btn-sm btn-square btn-ghost text-info" title="Edit"><i class="fas fa-edit"></i></button>
                            <button onclick="hapus(${item.id})" class="btn btn-sm btn-square btn-ghost text-error" title="Hapus"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                `;
                tbBody.appendChild(tr);

                // Format Mobile DaisyUI Card List
                let card = document.createElement('div');
                card.className = "p-4 hover:bg-base-200/50 flex flex-col gap-2";
                card.innerHTML = `
                    <div class="flex justify-between items-start gap-3">
                        <div>
                            <span class="text-xs font-semibold text-base-content/60 block">${formatDateId(item.tgl)}</span>
                            <h3 class="text-sm font-medium leading-snug mt-1">${item.rak}</h3>
                        </div>
                        <div class="join shrink-0 border border-base-300">
                            <button onclick="edit(${item.id})" class="btn btn-sm btn-square join-item text-info"><i class="fas fa-edit"></i></button>
                            <button onclick="hapus(${item.id})" class="btn btn-sm btn-square join-item text-error"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2 text-sm mt-1">
                        <div><span class="badge badge-ghost badge-sm">${item.volume} ${item.satuan}</span></div>
                        <div class="font-bold"><i class="far fa-clock text-base-content/60 mr-1"></i> ${item.waktu} Mnt</div>
                    </div>
                `;
                cardList.appendChild(card);
            });
        }
    }

    loadingIndicator.classList.add('hidden');
    loadingIndicator.classList.remove('flex');
    tbBody.style.opacity = '1';
    cardList.style.opacity = '1';
}

function hapus(id) {
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let response = await fetchData("/api/monthly/activity?id=" + id, "DELETE");
            if (response.message == 'success') {
                Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                let monthly = inputTanggal.value;
                getTabel(monthly);
                getScore(monthly);
            }
        }
    });
}

async function submit() {
    let monthly = inputTanggal.value;
    let response = await fetchData("/api/monthly", "POST", { monthly: monthly });
    if (response.message == 'success') Swal.fire({ icon: 'success', title: response.message, text: response.data });
}

async function submit2() {
    let monthly = inputTanggal.value;
    let response = await fetchData("/api/v2/monthly", "POST", { monthly: monthly });
    if (response.message == 'success') {
        Swal.fire({ icon: 'success', title: response.message, text: response.data });
        badgeStatus(monthly);
    }
}

function cetak() {
    window.open("/api/report?date=" + inputTanggal.value, "_blank");
}

// ---------------------------------------------
// FUNGSI MODAL DAISYUI NATIVE HTML5
// ---------------------------------------------
function openModal() {
    document.getElementById('exampleModal').showModal();
}

function closeModal() {
    document.getElementById('exampleModal').close();
}

async function edit(id) {
    let response = await fetchData("/api/monthly/activity?id=" + id);
    if (response.message == 'success') {
        document.getElementById('InputId').value = response.data.id;
        document.getElementById('InputTgl').value = response.data.tgl;
        document.getElementById('InputActivities').value = response.data.rak;
        document.getElementById('InputVolume').value = response.data.volume;
        document.getElementById('InputUnit').value = response.data.satuan;
        document.getElementById('InputCompletion').value = response.data.waktu;
        openModal();
    }
}

async function submitEditForm() {
    const form = document.getElementById('UpdateProgress');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    let data = {
        id: document.getElementById('InputId').value,
        tgl: document.getElementById('InputTgl').value,
        rak: document.getElementById('InputActivities').value,
        volume: document.getElementById('InputVolume').value,
        satuan: document.getElementById('InputUnit').value,
        waktu: document.getElementById('InputCompletion').value
    };

    let response = await fetchData("/api/monthly/activity", "POST", data);
    if (response.message == 'success') {
        closeModal();
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Progres berhasil diperbarui',
            timer: 2000,
            showConfirmButton: false
        });

        let monthly = inputTanggal.value;
        getTabel(monthly);
        getScore(monthly);
    }
}

function formatDateId(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}