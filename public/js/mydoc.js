let token = null
async function getToken() {
    const url = "/api/auth/token";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        token = result.token
    } catch (error) {
        console.error(error.message);
    }
}
getToken()
document.addEventListener('DOMContentLoaded', function () {
    const modalUploadArea = document.getElementById('modalUploadArea');
    const modalFileInput = document.getElementById('modalFileInput');
    let selectedFile = null;

    if (modalUploadArea) {
        // Drag and drop for modal
        modalUploadArea.addEventListener('dragover', function (e) {
            e.preventDefault();
            modalUploadArea.classList.add('border-indigo-400', 'bg-indigo-50');
        });

        modalUploadArea.addEventListener('dragleave', function (e) {
            e.preventDefault();
            modalUploadArea.classList.remove('border-indigo-400', 'bg-indigo-50');
        });

        modalUploadArea.addEventListener('drop', function (e) {
            e.preventDefault();
            modalUploadArea.classList.remove('border-indigo-400', 'bg-indigo-50');
            if (e.dataTransfer.files.length > 0) {
                handleModalFile(e.dataTransfer.files[0]);
                // Set to input
                modalFileInput.files = e.dataTransfer.files;
            }
        });
    }

    if (modalFileInput) {
        modalFileInput.addEventListener('change', function () {
            if (this.files.length > 0) {
                handleModalFile(this.files[0]);
            }
        });
    }

    function handleModalFile(file) {
        if (file) {
            selectedFile = file;
            document.getElementById('selectedFileName').textContent = file.name + ' (' + formatFileSize(file.size) + ')';
            document.getElementById('modalSelectedFile').classList.remove('hidden');
        }
    }

    window.clearModalFile = function () {
        selectedFile = null;
        if (modalFileInput) modalFileInput.value = '';
        document.getElementById('modalSelectedFile').classList.add('hidden');
    };

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});

// Modal Management Functions
window.closeAddDocumentModal = function () {
    document.getElementById('addDocumentModal').classList.add('hidden');
};


// Show document fields based on type
function showDocumentFields() {
    const docType = document.getElementById('documentType').value;


    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
        const formControls = section.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            control.disabled = true; // Nonaktifkan agar tidak divalidasi oleh browser
        });
    });

    // Show selected section
    if (docType) {
        const section = document.getElementById(docType + '-fields');
        console.log(section);
        if (section) {
            section.classList.add('active');
            section.classList.remove('hidden');
            // Aktifkan kembali input, select, dan textarea pada section ini
            const formControls = section.querySelectorAll('input, select, textarea');
            formControls.forEach(control => {
                control.disabled = false;
            });
        }
    }
}

// Open add document modal
function openAddDocumentModal(preselectedType = '') {
    // Clear form
    document.getElementById('addDocumentForm').reset();
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.add('hidden');
    });
    if (window.clearModalFile) window.clearModalFile();

    // Preselect document type if provided
    if (preselectedType) {
        document.getElementById('documentType').value = preselectedType;
        showDocumentFields();
    }

    document.getElementById('addDocumentModal').classList.remove('hidden');
}

// Check seumur hidup function
function berlakuSeumurHidup(type) {
    let inputId = type === 'STR' ? 'expiryDateSTR' : 'expiryDateSTRE';
    const expiryInput = document.getElementById(inputId);

    if (expiryInput) {
        if (expiryInput.disabled) {
            expiryInput.disabled = false;
            expiryInput.value = '';
        } else {
            expiryInput.value = '9999-12-31';
            expiryInput.disabled = true;
            showToast('success', 'Telah diset berlaku seumur hidup');
        }
    }
}

// Save document
async function saveDocument() {
    const docType = document.getElementById('documentType').value;
    if (!docType) {
        Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Pilih jenis dokumen terlebih dahulu!', confirmButtonText: 'OK' });
        return;
    }

    // Get visible section
    const formActive = document.querySelector('.form-section.active');

    let selectedFile = document.getElementById('modalFileInput').files[0];

    // Validation
    let requiredNumber = formActive.querySelectorAll('[required-number]');
    function isDigitsOnly(value) {
        return /^\d+$/.test(String(value).trim());
    }

    for (let i = 0; i < requiredNumber.length; i++) {
        let val = requiredNumber[i].value;
        if (val !== '' && !isDigitsOnly(val)) {
            let fieldName = requiredNumber[i].placeholder || 'ini';
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Kolom ' + fieldName + ' harus berupa angka!',
                confirmButtonText: 'OK'
            });
            return;
        }
    }

    let requiredFields = formActive.querySelectorAll('[required]');
    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].value.trim() === '') {
            Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Semua form yang ada tanda (*) wajib diisi!', confirmButtonText: 'OK' });
            return;
        }
    }

    if (!selectedFile) {
        Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Pilih file untuk diupload!', confirmButtonText: 'OK' });
        return;
    }

    Swal.fire({
        title: 'Sedang memproses...',
        html: 'Mohon tunggu hingga selesai',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        let dataFile = {};
        const inputs = formActive.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.value) {
                dataFile[input.name] = input.value;
            }
        });

        let catatanElem = document.getElementById('catatan');
        if (catatanElem) dataFile['catatan'] = catatanElem.value;

        // Post file 
        let filedoc = new FormData();
        filedoc.append('file', selectedFile);

        let myHeaders = new Headers();
        if (token) myHeaders.append("Authorization", "Bearer " + token);

        let response = await fetch('https://api.spairum.my.id/api/cdn/upload/dir/file?file=' + docType, {
            method: 'POST',
            headers: myHeaders,
            body: filedoc
        });

        if (!response.ok) throw new Error('Gagal upload file');

        let result = await response.json();
        dataFile['file'] = result.data.url;
        dataFile['document_type'] = docType;

        let docResponse = await fetch('/api/document/' + docType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(dataFile)
        });

        if (!docResponse.ok) throw new Error('Gagal simpan data dokumen');

        let docResult = await docResponse.json();

        Swal.close();
        showToast('success', 'Dokumen berhasil disimpan');
        closeAddDocumentModal();
        getDocuments();

        // Optional Reload:
        // const table = $('#documentsTable').DataTable();
        // table.ajax.reload();

    } catch (error) {
        console.error('Error:', error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Terjadi kesalahan: ' + error.message
        });
        showToast('error', 'Dokumen gagal disimpan!');
    }
}

// Show toast notification
function showToast(type, message) {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'danger' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    const icon = type === 'success' ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></path></svg>' : type === 'danger' ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></path></svg>' : type === 'warning' ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></path></svg>' : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0zm5 0a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd"/></path></svg>';

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 ${bgColor} text-white rounded-lg shadow-lg p-4 max-w-xs transition duration-300 transform translate-y-0 opacity-100`;
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            ${icon}
            <span class="text-sm font-medium">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
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
        text: 'Apakah Anda yakin ingin menghapus dokumen ' + jenisDokumen + ' ini?',
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