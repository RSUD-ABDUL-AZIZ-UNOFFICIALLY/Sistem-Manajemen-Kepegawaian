$('#periode').on('change', function () {
    let periode = $(this).val();
    console.log(periode);
    let nik = $('#nik').val();

    if (nik == "") {
        return Swal.fire({
            title: 'Peringatan',
            text: 'Masukan data User terlebih dahulu',
            icon: 'warning',
        });

    } else {
        $.ajax({
            url: `/api/presensi/riwayat/${nik}?periode=${periode}`,
            method: 'GET',
        })
            .then(res => {
                let data = res.data;
                listKehadiran(data);
            })
            .catch(err => {
                console.error(err);
            });
    }

    // getTabel(periode);
    // getRekap();
});
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

async function listKehadiran(data) {
    console.log(data);
    const listContainer = document.getElementById("listKehadiran");
    listContainer.innerHTML = ""; // Mengosongkan elemen
    if (data.length == 0) {
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