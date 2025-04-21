const depSelect = document.getElementById('dep');
depSelect.innerHTML = '<option value="">Pilih Departemen</option>';

fetch('/api/presensi/departemen')
    .then(response => response.json())
    .then(data => {
        data.data.forEach(v => {
            const option = document.createElement('option');
            option.value = v.dep;
            option.textContent = v.departemen.bidang;
            depSelect.appendChild(option);
        });
    });

document.getElementById('libur').addEventListener('change', function() {
    const jamMulai = document.getElementById('jamMulai');
    const jamTelat = document.getElementById('jamTelat');
    const pulangCepat = document.getElementById('pulangCepat');
    const pulangTelat = document.getElementById('pulangTelat');
    if (this.checked) {
        console.log('Libur checkbox is checked.');
        jamMulai.removeAttribute('required');
        jamTelat.removeAttribute('required');
        pulangCepat.removeAttribute('required');
        pulangTelat.removeAttribute('required');
    
    } else {
        console.log('Libur checkbox is unchecked.');
        jamMulai.setAttribute('required', 'required');
        jamTelat.setAttribute('required', 'required');
        pulangCepat.setAttribute('required', 'required');
        pulangTelat.setAttribute('required', 'required');
        // Add additional logic for when the checkbox is unchecked
    }
});

document.getElementById('formSetJadwal').addEventListener('submit', e => {
    e.preventDefault();
    const form = document.getElementById('formSetJadwal');

    // Ambil nilai dari input
    const departemen = form.querySelector('[id="dep"]').value;
    const jnsDNS = form.querySelector('[name="jnsDNS"]').value;
    const jamMulai = form.querySelector('[name="jamMulai"]').value;
    const jamTelat = form.querySelector('[name="jamTelat"]').value;
    const pulangCepat = form.querySelector('[name="pulangCepat"]').value;
    const pulangTelat = form.querySelector('[name="pulangTelat"]').value;
    const libur = form.querySelector('#libur').checked;

    // Ambil semua option yang dipilih dari <select multiple>
    const hariSelect = document.getElementById('hari');
    const selectedHari = Array.from(hariSelect.selectedOptions).map(option => option.value);

    // Buat payload
    const data = {
        departemen,
        jnsDNS,
        jamMulai,
        jamTelat,
        pulangCepat,
        pulangTelat,
        libur,
        hari: selectedHari
    };
console.log(data);
    // Kirim ke backend via fetch POST
    try {
        const response = fetch('/api/presensi/jnsdns', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        response.then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Network response was not ok');
            }
        }).then(res => {
            console.log(res);
            // alert('Data berhasil disimpan.');
        }).catch(error => {
            console.error('Gagal kirim data:', error);
            // alert('Terjadi kesalahan saat menyimpan data.');
        });
        
    } catch (err) {
        console.error('Gagal kirim data:', err);
        // alert('Terjadi kesalahan saat menyimpan data.');
    }


});
document.getElementById('dep').addEventListener('change', function () {
    const selectedDep = this.value;
    console.log('Selected Departemen:', selectedDep);
    fetch('/api/presensi/jnsdns?dep=' + selectedDep)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tableJadwal tbody');
            console.log(tbody);
            // tbody.innerHTML = ''; // bersihkan dulu
            tbody.innerHTML = ''; // bersihkan dulu
            data.data.forEach(item => {
                console.log(item);
                const tr = document.createElement('tr');

                tr.className = !item.state ? 'bg-red-100 text-gray-500 italic' : '';

                tr.innerHTML = `
                    <td class="p-3">${item.type}</td>
                    <td class="p-3">${item.slug}</td>
                    <td class="p-3">${item.state ? 'Libur' : 'Dinas'}</td>
                    <td class="p-3">${item.day}</td>
                    <td class="p-3">${item.start_max}</td>
                    <td class="p-3">${item.start_min}</td>
                    <td class="p-3">${item.end_min}</td>
                    <td class="p-3">${item.end_max}</td>
          
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching schedule data:', error);
        });



});

