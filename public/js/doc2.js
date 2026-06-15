const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    if (dateStr.startsWith('9999')) return 'Seumur Hidup';
    const date = new Date(dateStr);
    // if (dateStr.length === 7) return dateStr;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    // return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Fungsi Render Detail sesuai Tipe
const getDocumentDetails = (doc) => {
    let detailsHtml = '';
    // Konfigurasi CSS untuk baris label-value agar rapi seperti tabel
    const rowClass = 'flex flex-col sm:flex-row sm:gap-2 text-xs mb-1';
    const labelClass = 'text-gray-500 w-36 shrink-0';
    const valueClass = 'text-gray-800 font-medium';

    const renderRow = (label, value) => {
        if (!value) return '';
        return `<div class="${rowClass}"><span class="${labelClass}">${label}</span><span class="${valueClass}">${value}</span></div>`;
    };

    switch (doc.document_type) {
        case 'kompetensi':
            detailsHtml += renderRow('Tingkat Pendidikan', doc.education_level);
            detailsHtml += renderRow('Institusi', doc.institution);
            detailsHtml += renderRow('Tahun Lulus', formatDate(doc.graduation_date));
            break;
        case 'sip':
        case 'str':
            detailsHtml += renderRow('Profesi', doc.profession);
            detailsHtml += renderRow(doc.document_type === 'sip' ? 'No. SIP' : 'No. STR', doc.sip_number || doc.str_number);
            if (doc.issuer) detailsHtml += renderRow('Penerbit', doc.issuer);
            detailsHtml += renderRow('Masa Berlaku', `${formatDate(doc.issue_date)} s/d ${formatDate(doc.expiry_date)}`);
            break;
        case 'sk':
            detailsHtml += renderRow('Nama/Ket. SK', doc.other_description);
            detailsHtml += renderRow('Nomor SK', doc.number_sk);
            detailsHtml += renderRow('Tgl Dokumen', formatDate(doc.document_date));
            detailsHtml += renderRow('Penerbit', doc.document_issuer);
            break;
        case 'dokumen_penilaian_kinerja':
        case 'dokumen_uraian_tugas':
        case 'lainnya':
            detailsHtml += renderRow(doc.document_type === 'dokumen_penilaian_kinerja' ? 'Nama Dokumen' : (doc.document_type === 'dokumen_uraian_tugas' ? 'Jabatan' : 'Dokumen'), doc.other_description || doc.document_name);
            detailsHtml += renderRow('Periode / Tgl', formatDate(doc.document_date));
            detailsHtml += renderRow('Penerbit', doc.document_issuer);
            break;
        case 'sertifikat':
            detailsHtml += renderRow('Nama Sertifikat', doc.certificate_name);
            detailsHtml += renderRow('Tgl Pelatihan', formatDate(doc.training_date));
            break;
        case 'kk':
            detailsHtml += renderRow('No. KK', doc.kk_number);
            detailsHtml += renderRow('Kepala Keluarga', doc.kk_head_name);
            detailsHtml += renderRow('Anggota Keluarga', doc.family_members ? `${doc.family_members} Orang` : '');
            detailsHtml += renderRow('Alamat', doc.kk_address);
            break;
        case 'ktp':
            detailsHtml += renderRow('NIK', doc.ktp_number);
            detailsHtml += renderRow('Nama Lengkap', doc.ktp_name);
            detailsHtml += renderRow('Alamat', doc.ktp_address);
            break;
        case 'npwp':
            detailsHtml += renderRow('No. NPWP', doc.npwp_number);
            detailsHtml += renderRow('Nama Wajib Pajak', doc.taxpayer_name);
            break;
        case 'cv':
            detailsHtml += renderRow('Versi CV', doc.cv_version);
            detailsHtml += renderRow('Deskripsi', doc.cv_description);
            break;
        case 'kontrak':
            detailsHtml += renderRow('Jenis Kontrak', doc.contract_type?.toUpperCase());
            detailsHtml += renderRow('Jabatan', doc.position);
            detailsHtml += renderRow('Masa Kontrak', `${formatDate(doc.contract_start)} s/d ${formatDate(doc.contract_end)}`);
            break;
        default:
            detailsHtml += renderRow('Tipe Dokumen', doc.document_type);
            break;
    }

    if (doc.catatan) {
        detailsHtml += `<div class="${rowClass} mt-1.5"><span class="${labelClass}">Catatan</span><span class="text-orange-600 italic break-words">${doc.catatan}</span></div>`;
    }

    return detailsHtml;
};
const editDocument = (id) => {
    const doc = documentsData.find(d => d._id === id);
    if (!doc) return;

    // 1. Reset form dan set tipe dokumen
    const form = document.getElementById('editDocumentForm');
    form.reset();

    document.getElementById('edit_id').value = doc._id;
    document.getElementById('edit_documentType').value = doc.document_type;
    document.getElementById('edit_documentType').disabled = true;


    // 2. Tampilkan bagian form yang sesuai dengan tipe
    showFormSection(doc.document_type);

    // 3. Isi otomatis data lama ke dalam input form
    Object.keys(doc).forEach(key => {
        console.log(key);
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            // Formatting untuk date agar sesuai dengan value input type="date"
            let val = doc[key];
            if (input.type === 'date' && val) {
                val = val.split('T')[0]; // Ambil YYYY-MM-DD
                if (val.startsWith('9999')) val = '9999-12-31'; // Jika seumur hidup bisa dikosongkan/diatur logicnya
                // if (val.startsWith('9999')) input.disabled = true;
            }
            if (input.type === 'month' && val) {
                val = val.substring(0, 7); // Ambil YYYY-MM
            }
            input.value = val;
        }
    });

    // 4. Tampilkan Modal
    document.getElementById('editModal').classList.remove('hidden');
};

// --- Logika Tutup Modal ---
const closeEditModal = () => {
    document.getElementById('editModal').classList.add('hidden');
};


// --- Logika Simpan Perubahan Form ---
const saveEdit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const dataObj = Object.fromEntries(formData.entries());

    console.log('Data yang akan disimpan:', dataObj);
    fetch('/api/document', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data yang dikirim ke server:', data);
            getDocuments();

        })
        .catch(error => {
            console.error('Error:', error);
        });

    // --- DI SINI ANDA BISA MEMASUKKAN AJAX/FETCH UNTUK UPDATE KE SERVER API ---
    // alert(`Berhasil menyimpan perubahan untuk ID:\n${dataObj._id}`);


    closeEditModal();
    // renderDocuments(); // Panggil ulang ini jika state array documentsData berhasil di-update
};


// --- Logika Tampil/Sembunyikan Field Khusus ---
const showFormSection = (type) => {
    const docType = document.getElementById('edit_documentType').value;

    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
        const formControls = section.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            control.disabled = true; // Nonaktifkan agar tidak divalidasi oleh browser
        });
    });

    // Show selected section
    if (docType) {
        const section = document.getElementById(docType + '-fieldsEdit');
        if (section) {
            section.classList.remove('hidden');
            section.classList.add('active');
            const formControls = section.querySelectorAll('input, select, textarea');
            formControls.forEach(control => {
                control.disabled = false;
            });
        }
    }
};



const deleteDocument = (id, jenisDokumen) => {
    // Logika web app Anda (misal panggil endpoint DELETE)
    Swal.fire({
        title: 'Konfirmasi',
        text: 'Apakah Anda yakin ingin menghapus dokumen '+jenisDokumen+' ini?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal'
    }).then((result) => {
    if (result.isConfirmed) {
        $.ajax({
        url: '/api/document/' + id,
        method: 'DELETE',
        success: function (response) {
            getDocuments();
        },
        error: function (error) {
            console.log(error);
        }
    })
    }
    });
};

// Fungsi Render Utama
const renderDocuments = (documentsData) => {
    const container = document.getElementById('document-grid');
    container.innerHTML = '';
    const rowsHtml = documentsData.map(doc => {
        return `
                <div class="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 hover:bg-indigo-50/40 transition-colors duration-200 group">
                    
                    <!-- Kolom 1: Tipe Dokumen (Mobile Header & Desktop Col) -->
                    <div class="md:col-span-3 lg:col-span-2 flex justify-between md:block items-center">
                        <span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold uppercase tracking-widest border border-indigo-100 inline-block">
                            ${doc.document_type.replace(/_/g, ' ')}
                        </span>
                    </div>

                    <!-- Kolom 2: Detail Informasi -->
                    <div class="md:col-span-5 lg:col-span-6 flex-1">
                        ${getDocumentDetails(doc)}
                        <div class="text-[11px] text-gray-400 mt-2.5">
                            <span class="inline-flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Diunggah: ${formatDate(doc.createdAt)}
                            </span>
                        </div>
                    </div>

                    <!-- Kolom 4: Aksi (Lihat, Edit, Hapus) -->
                    <div class="md:col-span-2 lg:col-span-2 flex items-start justify-end gap-1.5 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
                        
                        <!-- Lihat Dokumen -->
                        <a href="${doc.file}" target="_blank" rel="noopener noreferrer" title="Lihat/Unduh"
                           class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </a>
                        
                        <!-- Edit Dokumen -->
                        <button onclick="editDocument('${doc._id}')" title="Edit"
                           class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                        </button>
                        
                        <!-- Hapus Dokumen -->
                        <button onclick="deleteDocument('${doc._id}', '${doc.document_type}')" title="Hapus"
                           class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>

                    </div>
                </div>
            `;
    }).join('');

    container.innerHTML = rowsHtml;
};

let documentsData;
// Jalankan render
// document.addEventListener('DOMContentLoaded', renderDocuments);
async function getDocuments() {
    let data = await fetch('/api/document');
    data = await data.json();
    documentsData = data.data;
    console.log(data);
    renderDocuments(data.data);
}
getDocuments();