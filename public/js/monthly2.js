
async function fetchData(url, method = 'GET', body = null) {
    try {
        // DI PRODUKSI: Hapus baris apiCall ini, nyalakan blok fetch di bawahnya
        // return await apiCall(url, method, body);

       
        let options = { method: method };
        if(body) {
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

// DOM Elements
const inputTanggal = document.getElementById('InputTanggal');
const tbBody = document.getElementById('tableBody');
const cardList = document.getElementById('mobileCardList');
const loadingIndicator = document.getElementById('loadingIndicator');

// Saat halaman dimuat pertama kali (Pengganti $(document).ready)
document.addEventListener('DOMContentLoaded', () => {
    let monthly = inputTanggal.value;
    getTabel(monthly);
    getScore(monthly);
});

// Event listener saat bulan diubah
inputTanggal.addEventListener('change', function () {
    let newDateValue = this.value;
    getTabel(newDateValue);
    getScore(newDateValue);
});

// 1. Dapatkan Status Badge
async function badgeStatus(monthly) {
    let status = await fetchData("/api/v2/monthly?date=" + monthly);
    let stt = document.getElementById('status');
    if (status && status.data) {
        stt.innerHTML = status.data.status;
        stt.className = 'px-3 py-1 text-xs font-semibold rounded-full ml-2 transition-colors ' + status.data.className;
    }
    return true;
}

// 2. Dapatkan Skor/Summary (Diformat ulang dengan class Tailwind)
async function getScore(monthly) {
    let cekPeriode = await fetchData("/api/monthly/periode?date=" + monthly);
    let status = await fetchData("/api/v2/monthly?date=" + monthly); // Dipanggil untuk status

    badgeStatus(monthly); // update UI
    let summaryContainer = document.getElementById('summary');

    // ANIMASI MUNCUL
    summaryContainer.style.opacity = 0;

    if (cekPeriode === null) {
        let score = await fetchData("/api/monthly/score?date=" + monthly);
        if (score) {
            // Tampilan Jika Data Periode Null
            summaryContainer.innerHTML = `
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span class="text-sm font-medium text-slate-500">Pencapaian Bulanan</span>
                                <span class="text-lg font-bold text-slate-800">${score.data.capaian} Menit</span>
                            </div>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span class="text-sm font-medium text-slate-500">Kategori</span>
                                <span class="text-lg font-bold text-slate-800">${score.data.kategori}</span>
                            </div>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                <span class="text-sm font-medium text-slate-500">TPP</span>
                                <span class="text-lg font-bold text-slate-800">${score.data.tpp}</span>
                            </div>
                        </div>
                        <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                            <button type="button" class="px-5 py-2.5 text-sm font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex justify-center items-center gap-2" onclick="cetak()">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak
                            </button>
                            <button type="button" class="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-brand-700 transition-colors inline-flex justify-center items-center gap-2 shadow-sm" onclick="submit()">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> Kirim Laporan
                            </button>
                        </div>
                    `;
        }
    } else {
        // Tampilan Jika Data Periode Tersedia
        summaryContainer.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div class="p-5 bg-blue-50/50 rounded-xl border border-blue-100/50 flex flex-col gap-1">
                            <span class="text-xs font-semibold text-blue-600 uppercase tracking-wider">Capaian Valid Bulan Ini</span>
                            <span class="text-2xl font-bold text-slate-800">${cekPeriode.data.capaian} <span class="text-sm font-medium text-slate-500">Menit</span></span>
                        </div>
                        <div class="p-5 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex flex-col gap-1">
                            <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Jumlah Hari Kerja (HK)</span>
                            <span class="text-2xl font-bold text-slate-800">${cekPeriode.data.days} <span class="text-sm font-medium text-slate-500">HK</span></span>
                        </div>
                        <div class="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex flex-col gap-1">
                            <span class="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Jam Pelaporan / Hari</span>
                            <span class="text-2xl font-bold text-slate-800">${cekPeriode.data.workday} <span class="text-sm font-medium text-slate-500">Jam</span></span>
                        </div>
                        <div class="p-5 bg-purple-50/50 rounded-xl border border-purple-100/50 flex flex-col gap-1">
                            <span class="text-xs font-semibold text-purple-600 uppercase tracking-wider">Produktivitas Kerja</span>
                            <span class="text-2xl font-bold text-slate-800">${cekPeriode.data.tpp}%</span>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" class="px-5 py-2.5 text-sm font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors inline-flex justify-center items-center gap-2" onclick="cetak()">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Cetak
                        </button>
                        <button type="button" class="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-brand-700 transition-colors inline-flex justify-center items-center gap-2 shadow-sm" onclick="submit2()">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> Kirim Laporan
                        </button>
                    </div>
                `;
    }
    // Fade in kembali
    setTimeout(() => { summaryContainer.style.opacity = 1; summaryContainer.style.transition = "opacity 0.3s ease"; }, 50);
}

// 3. Render Tabel & Data
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
            const emptyHtml = `<tr><td colspan="7" class="px-6 py-12 text-center text-slate-500">Tidak ada aktivitas pada periode ini.</td></tr>`;
            tbBody.innerHTML = emptyHtml;
            cardList.innerHTML = `<div class="p-8 text-center text-slate-500">Tidak ada aktivitas pada periode ini.</div>`;
        } else {
            response.data.forEach((item, index) => {
                let nomor = index + 1;

                // -- Format Desktop --
                let tr = document.createElement('tr');
                tr.className = "hover:bg-slate-50/70 transition-colors group";
                tr.innerHTML = `
                            <td class="px-6 py-4 text-sm text-slate-700 text-center">${nomor}</td>
                            <td class="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">${formatDateId(item.tgl)}</td>
                            <td class="px-6 py-4 text-sm text-slate-800 font-medium">${item.rak}</td>
                            <td class="px-6 py-4 text-sm text-slate-700 text-center">${item.volume}</td>
                            <td class="px-6 py-4 text-sm text-center"><span class="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">${item.satuan}</span></td>
                            <td class="px-6 py-4 text-sm text-slate-700 text-center font-medium">${item.waktu}</td>
                            <td class="px-6 py-4 text-sm text-center">
                                <div class="flex items-center justify-center gap-2">
                                    <button type="button" onclick="edit(${item.id})" class="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" title="Edit">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                    <button type="button" onclick="hapus(${item.id})" class="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </td>
                        `;
                tbBody.appendChild(tr);

                // -- Format Mobile --
                let card = document.createElement('div');
                card.className = "p-4 hover:bg-slate-50/50 flex flex-col gap-3";
                card.innerHTML = `
                            <div class="flex justify-between items-start gap-3">
                                <div>
                                    <span class="text-xs font-semibold text-slate-500 block mb-1">${formatDateId(item.tgl)}</span>
                                    <h3 class="text-sm font-medium text-slate-800 leading-snug">${item.rak}</h3>
                                </div>
                                <div class="flex gap-2 shrink-0">
                                    <button onclick="edit(${item.id})" class="p-2 text-emerald-600 bg-emerald-50 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button>
                                    <button onclick="hapus(${item.id})" class="p-2 text-rose-600 bg-rose-50 rounded-lg"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center pt-2 border-t border-slate-100 border-dashed text-sm">
                                <div><span class="text-slate-400 text-xs">Vol:</span> <span class="font-medium text-slate-700">${item.volume} ${item.satuan}</span></div>
                                <div><span class="text-slate-400 text-xs">Waktu:</span> <span class="font-medium text-slate-700">${item.waktu} Mnt</span></div>
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

// 4. Aksi Hapus (Menggunakan SweetAlert2)
function hapus(id) {
    Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563eb',
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

// 5. Aksi Kirim Laporan
async function submit() {
    let monthly = inputTanggal.value;
    let response = await fetchData("/api/monthly", "POST", { monthly: monthly });
    if (response.message == 'success') {
        Swal.fire({ icon: 'success', title: response.message, text: response.data });
    }
}

async function submit2() {
    let monthly = inputTanggal.value;
    let response = await fetchData("/api/v2/monthly", "POST", { monthly: monthly });
    if (response.message == 'success') {
        Swal.fire({ icon: 'success', title: response.message, text: response.data });
        badgeStatus(monthly); // Refresh status
    }
}

// 6. Cetak (Membuka Tab Baru)
function cetak() {
    let monthly = inputTanggal.value;
    window.open("/api/report?date=" + monthly, "_blank");
    // Alert jika pop-up diblokir (opsional)
}

// 7. Aksi Edit & Modal
const modal = document.getElementById('exampleModal');

function openModal() {
    console.log('openModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

async function edit(id) {
    // Ambil data detail via API
    let response = await fetchData("/api/monthly/activity?id=" + id);
    
    console.log(response);
    if (response.message == 'success') {
        // Populate Form
        document.getElementById('InputId').value = response.data.id;
        document.getElementById('InputTgl').value = response.data.tgl;
        document.getElementById('InputActivities').value = response.data.rak;
        document.getElementById('InputVolume').value = response.data.volume;
        document.getElementById('InputUnit').value = response.data.satuan;
        document.getElementById('InputCompletion').value = response.data.waktu;
        
        // Show Modal
        openModal();
    }
}

// Menyimpan data Edit
async function submitEditForm() {
    // Validasi manual HTML5 karna kita bypass form submit bawaan
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

        // Refresh Tabel & Summary
        let monthly = inputTanggal.value;
        getTabel(monthly);
        getScore(monthly);
    }
}

function formatDateId(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long', // Menambahkan nama hari (Senin, Selasa, dst.)
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}