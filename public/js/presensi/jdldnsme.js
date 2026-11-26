
async function fetchJadwalDns(periode) {
    try {
        const response = await fetch(`/api/presensi/jdldnsall?periode=${periode}`, {
            method: "GET",
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
document.getElementById('jadwalDNSModal').addEventListener('click', async function () {
    let listJadwal = document.getElementById('jadwal-list');
    let shiftList = document.getElementById('shift-list');
    listJadwal.innerHTML = ''; // Clear previous content
    shiftList.innerHTML = ''; // Clear previous content
    let periode = document.getElementById('periode').value;
    let jadwalPeriode = document.getElementById('jadwalPeriode');
    jadwalPeriode.innerHTML = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(periode));
    dataJadwal = await fetchJadwalDns(periode);
    let x = 1;
    let colorShift = [];
    dataJadwal.list.forEach(item => {
        // Create jadwal card
        if (item.state == 0) {
            const shiftListDns = document.createElement('span');
            shiftListDns.className = 'badge shift-bg-libur';
            shiftListDns.textContent = item.type;
            shiftList.appendChild(shiftListDns);
        }
        else {
            const shiftListDns = document.createElement('span');
            shiftListDns.className = 'badge shift-bg-' + x;
            shiftListDns.textContent = item.type;
            shiftList.appendChild(shiftListDns);
            colorShift.push({
                state: item.type,
                type: x
            });

        }
        x++;
    });
    dataJadwal.data.forEach(item => {
        // Create jadwal card
        if (item.dnsType.state == 0) {
            const shiftListDns = document.createElement('div');
            shiftListDns.className = 'card jadwal-card shift-libur';
            shiftListDns.innerHTML = `
                          <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="flex-grow-1"> 
                                        <p class="mb-0 fw-bold fs-6 text-dark">${item.date}</p>
                                    </div>
                                    <div class="text-end ms-2"> 
                                        <span class="badge shift-bg-libur me-1">${item.dnsType.type}</span>
                                        <span class="text-muted small d-block d-sm-inline">(${item.dnsType.start_min} - ${item.dnsType.end_min})</span> 
                                    </div>
                                </div>
                            </div>`;
            listJadwal.appendChild(shiftListDns);
        }
        else {
            const shiftListDns = document.createElement('div');
            let findShift = colorShift.find(x => x.state == item.dnsType.type);
            shiftListDns.className = 'card jadwal-card shift-' + findShift.type;
            shiftListDns.innerHTML = `
                          <div class="card-body p-3">
                                <div class="d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="flex-grow-1"> 
                                        <p class="mb-0 fw-bold fs-6 text-dark">${item.date}</p>
                                    </div>
                                    <div class="text-end ms-2"> 
                                        <span class="badge shift-bg-${findShift.type} me-1">${item.dnsType.type}</span>
                                        <span class="text-muted small d-block d-sm-inline">(${item.dnsType.start_min} - ${item.dnsType.end_min})</span> 
                                    </div>
                                </div>
                            </div>`;
            listJadwal.appendChild(shiftListDns);
        }
    });
});