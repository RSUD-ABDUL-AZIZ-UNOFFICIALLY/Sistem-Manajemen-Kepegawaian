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

window.closeEditDocumentModal = function () {
    document.getElementById('editDocumentModal').classList.add('hidden');
};

window.closePreviewModal = function () {
    document.getElementById('previewModal').classList.add('hidden');
};

window.closeRejectionReasonModal = function () {
    document.getElementById('rejectionReasonModal').classList.add('hidden');
};

window.closeRequiredDocumentsModal = function () {
    document.getElementById('requiredDocumentsModal').classList.add('hidden');
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
    let inputId = type === 'STR' ? 'expiryDateSTR' : 'expiryDate';
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

        // Asumsi fungsi getCookie sudah ada di sistem / file lain
        let token = typeof getCookie === 'function' ? getCookie("token") : "";
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
        showToast('success', 'Dokumen berhasil disimpan dan sedang menunggu verifikasi!');
        closeAddDocumentModal();

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