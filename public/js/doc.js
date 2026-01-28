$(document).ready(function () {
    // Initialize DataTable
    $('#documentsTable').DataTable({
        "ajax": {
            url: "/api/document/doc/all",
            dataSrc: function (json) {
                Swal.close(); // tutup loading setelah data diterima
                if (json.error) {
                    Swal.fire('Error', json.message, 'error');
                    return [];
                }
                return json.data.data;
            },
            error: function () {
                Swal.close();
                Swal.fire('Error', 'Gagal memuat data dari server', 'error');
            }
        },
        "columns": [
            { "data": null, "render": function (data, type, row, meta) { return meta.row + 1 } },
            { "data": "jenisDokumen",
                 "render":
                  function (data, type, row, meta)
                   { 
                      return `<span class="badge bg-${row.badge}">${data}</span>` 
                   } 
                },
            { "data": "detail", "render": function (data, type, row, meta) 
                { return `<strong>${row.detail}</strong><br>
                    <small class="text-muted">${row.subDetail}</small>`
                }},
            { "data": "Upload" },
            { "data": "status", "render": function (data, type, row, meta) { return `<span class="badge bg-${row.badge}">${data}</span>` } },
            { "data": "catatan" },
            {
                "data": "fileUrl", "render": function (data, type, row, meta) {
                    return ` <div class="btn-group btn-group-sm">
                                                    <button class="btn btn-info" onclick="previewDocument('${row.fileUrl}', '${row.jenisDokumen}-${row.detail}')" title="Preview">
                                                        <i class="fas fa-eye"></i>
                                                    </button>
                                                    <button class="btn btn-success" onclick="downloadDocument('${row.fileUrl}', '${row.jenisDokumen} - ${row.detail}')" title="Download">
                                                        <i class="fas fa-download"></i>
                                                    </button>
                                                    <button class="btn btn-warning" onclick="editDocument('${row.id}')" title="Edit">
                                                        <i class="fas fa-edit"></i>
                                                    </button>
                                                    <button class="btn btn-danger" onclick="deleteDocument('${row.id}')" title="Hapus">
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </div>` } },
        ],
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "searching": true,
        "ordering": true,
        "info": true,
        "paging": true,
        "pageLength": 10,
        "language": {
            "search": "Cari:",
            "lengthMenu": "Tampilkan _MENU_ data per halaman",
            "zeroRecords": "Tidak ada data yang ditemukan",
            "info": "Menampilkan halaman _PAGE_ dari _PAGES_",
            "infoEmpty": "Tidak ada data tersedia",
            "infoFiltered": "(difilter dari _MAX_ total data)",
            "paginate": {
                "first": "Pertama",
                "last": "Terakhir",
                "next": "Selanjutnya",
                "previous": "Sebelumnya"
            }
        }
    });

    // Modal file upload functionality
    const modalUploadArea = document.getElementById('modalUploadArea');
    const modalFileInput = document.getElementById('modalFileInput');
    let selectedFile = null;

    // Drag and drop for modal
    modalUploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        modalUploadArea.classList.add('dragover');
    });

    modalUploadArea.addEventListener('dragleave', function (e) {
        e.preventDefault();
        modalUploadArea.classList.remove('dragover');
    });

    modalUploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        modalUploadArea.classList.remove('dragover');
        handleModalFile(e.dataTransfer.files[0]);
    });

    modalFileInput.addEventListener('change', function () {
        if (this.files.length > 0) {
            handleModalFile(this.files[0]);
        }
    });

    function handleModalFile(file) {
        if (file) {
            selectedFile = file;
            document.getElementById('selectedFileName').textContent = file.name + ' (' + formatFileSize(file.size) + ')';
            document.getElementById('modalSelectedFile').style.display = 'block';
        }
    }

    window.clearModalFile = function () {
        selectedFile = null;
        modalFileInput.value = '';
        document.getElementById('modalSelectedFile').style.display = 'none';
    };

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Search functionality
    $('#searchInput').on('keyup', function () {
        const table = $('#documentsTable').DataTable();
        console.log(this.value);
        table.search(this.value).draw();
    });
  
});
async function statistik(id) {
    let data = await fetch(`/api/document/doc/all/`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
    document.getElementById('verifiedCount').innerHTML = data.data.record.verifiedCount;
    document.getElementById('pendingCount').innerHTML = data.data.record.pendingCount;
    document.getElementById('rejectedCount').innerHTML = data.data.record.rejectedCount;
    document.getElementById('totalDocuments').innerHTML = data.data.record.totalDocuments;
}
statistik();
async function deleteDocument(id) {
    // table.ajax.reload();
    await fetch(`/api/document/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const table = $('#documentsTable').DataTable();
    table.ajax.reload();
    statistik();
    showToast('success', id);
}
// Show document fields based on type
function showDocumentFields() {
    const docType = document.getElementById('documentType').value;

    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    if (docType) {
        const section = document.getElementById(docType + '-fields');
        if (section) {
            section.classList.add('active');
        }
    }
}

// Open add document modal
function openAddDocumentModal(preselectedType = '') {
    // Clear form
    document.getElementById('addDocumentForm').reset();
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    clearModalFile();

    // Preselect document type if provided
    if (preselectedType) {
        document.getElementById('documentType').value = preselectedType;
        showDocumentFields();
    }

    $('#addDocumentModal').modal('show');
}

// Save document
async function saveDocument() {
    const docType = document.getElementById('documentType').value;
    if (!docType) {
        // alert('Pilih jenis dokumen terlebih dahulu!');
        Swal.fire({
            icon: 'warning',
            title: 'Peringatan',
            text: 'Pilih jenis dokumen terlebih dahulu!',
            confirmButtonText: 'OK'
        });
        return;
    }
    const formActive = document.querySelector('.form-section.active');
    let selectedFile = document.getElementById('modalFileInput').files[0];
    let requiredNumber = formActive.querySelectorAll('[required-number]');
    function isDigitsOnly(value) {
        const v = String(value).trim();
        return /^\d+$/.test(v);
    }
    for (let i = 0; i < requiredNumber.length; i++) {
        if (!isDigitsOnly(requiredNumber[i].value)) {
            // alert('Semua bidang wajib diisi!');
            console.log(requiredNumber[i].placeholder + ' is not digits only');
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Kolom ' + requiredNumber[i].placeholder + ' harus berupa angka!',
                confirmButtonText: 'OK'
            });
            return;
        }
    }
    let requiredFields = formActive.querySelectorAll('[required]');
    for (let i = 0; i < requiredFields.length; i++) {
        if (requiredFields[i].value === '') {
            // alert('Semua bidang wajib diisi!');
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Semua form yang ada tanda (*) wajib diisi!',
                confirmButtonText: 'OK'
            });
            return;
        }
    }

    if (!selectedFile) {
        // alert('Pilih file untuk diupload!');
        Swal.fire({
            icon: 'warning',
            title: 'Peringatan',
            text: 'Pilih file untuk diupload!',
            confirmButtonText: 'OK'
        });
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


    // Collect form data
    // const formData = new FormData();
    // formData.append('document_type', docType);
    // formData.append('file', selectedFile);
    let dataFile ={}

    // Add specific fields based on document type
    const activeSection = document.querySelector('.form-section.active');
    if (activeSection) {
        const inputs = activeSection.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.value) {
                // formData.append(input.name, input.value);
                dataFile[input.name] = input.value
            }
        });
        dataFile['catatan'] = document.getElementById('catatan').value
      
        // post file 
        let filedoc = new FormData();
        filedoc.append('file', selectedFile);
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + getCookie("token"));;
        let response = await fetch('https://api.spairum.my.id/api/cdn/upload/dir/file?file=' + docType, {
            method: 'POST',
            headers: myHeaders,
            body: filedoc
        })

        let result = await response.json();
        dataFile['fileUrl'] = result.data.url; 

        await fetch('/api/document/' + docType, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getCookie('token')
            },
            body: JSON.stringify(dataFile)
        })
        .then(response => response.json())
        .then(result => {
            Swal.close(); // Tutup loading
            console.log('Success:', result);
            showToast('success', 'Dokumen berhasil disimpan dan sedang menunggu verifikasi!');
            $('#addDocumentModal').modal('hide');
            const table = $('#documentsTable').DataTable();
            table.ajax.reload();
            statistik();
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan: ' + error
            });
            showToast('error', 'Dokumen gagal disimpan!');
            // $('#addDocumentModal').modal('hide');
        });
        

    }

    // Add general notes
    // const notes = document.querySelector('textarea[name="notes"]').value;
    // if (notes) {
    //     formData.append('notes', notes);
    // }

    // Simulate save process
    // showToast('success', 'Dokumen berhasil disimpan dan sedang menunggu verifikasi!');
    // $('#addDocumentModal').modal('hide');

    // // Refresh table (in real implementation, this would reload data from server)
    // setTimeout(() => {
    //     location.reload();
    // }, 1500);
}

// Edit document
function editDocument(id, type) {
    // Populate edit modal with existing data
    // This would fetch data from server in real implementation
    showToast('info', 'Fitur edit dokumen akan segera tersedia');
}

// Preview document
function previewDocument(filename, type) {
    $('#previewModal').modal('show');

    setTimeout(() => {
        const extension = filename.split('.').pop().toLowerCase();
        let previewContent = '';

        if (extension === 'pdf') {
            previewContent = `
                <embed src="${filename}#toolbar=0" 
                       type="application/pdf" width="100%" height="600px" download="none" >
            `;
        } else if (['jpg', 'jpeg', 'png'].includes(extension)) {
            previewContent = `
                <img src="${filename}" 
                     class="img-fluid" alt="Preview">
            `;
        } else {
            previewContent = `
                <div class="alert alert-info">
                    <i class="fas fa-file-alt fa-3x mb-3"></i>
                    <h5>Preview tidak tersedia</h5>
                    <p>File: ${filename}</p>
                    <button class="btn btn-primary" onclick="downloadDocument('${filename}', '${type}')">
                        <i class="fas fa-download mr-2"></i>Download untuk melihat
                    </button>
                </div>
            `;
        }

        document.getElementById('previewContent').innerHTML = previewContent;
    }, 1000);
}

// Download document
function downloadDocument(url, filename) {
    // Logic to handle download
    const extention = url.split('/').pop().split('?')[0].split('.').pop(); // nama file tanpa query param

    showToast('info', 'Sedang mengunduh dokumen...');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mengunduh file');
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename + '.' + extention;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            showToast('success', 'Download selesai: ' + filename);
        })
        .catch(error => {
            console.error('Download error:', error);
            showToast('error', 'Download gagal: ' + error.message);
        });
    showToast('info', 'Mengunduh: ' + filename);
}

// Resubmit document
function resubmitDocument(id, type) {
    openAddDocumentModal(type);
}

// Show rejection reason
function showRejectionReason(id) {
    $('#rejectionReasonModal').modal('show');
}

// Check required documents
function checkRequiredDocuments() {
    $('#requiredDocumentsModal').modal('show');
}

// View pending documents
function viewPendingDocuments() {
    // Filter table to show only pending documents
    const table = $('#documentsTable').DataTable();
    table.search('pending').draw();
    showToast('info', 'Menampilkan dokumen yang sedang pending');
}

// Show toast notification
function showToast(type, message) {
    const bgColor = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : type === 'warning' ? 'bg-warning' : 'bg-info';
    const icon = type === 'success' ? 'fas fa-check' : type === 'danger' ? 'fas fa-times' : type === 'warning' ? 'fas fa-exclamation' : 'fas fa-info';

    const toast = $(`
        <div class="toast" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
            <div class="toast-header ${bgColor}">
                <i class="${icon} text-white mr-2"></i>
                <strong class="mr-auto text-white">Notifikasi</strong>
                <button type="button" class="ml-2 mb-1 btn-close" data-bs-dismiss="toast" aria-label="Close">
                </button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `);

    $('body').append(toast);

    const bsToast = new bootstrap.Toast(toast[0], { delay: 3000 });
    bsToast.show();

    toast.on('hidden.bs.toast', function () {
        $(this).remove();
    });
}

function downloadCurrentPreview() {
    // Logic to handle download
    const preview = document.getElementById('previewContent').querySelector('embed, img');

    if (!preview) {
        showToast('error', 'Tidak ada dokumen yang sedang di-preview');
        return;
    }

    const url = preview.src;
    const filename = url.split('/').pop().split('?')[0]; // nama file tanpa query param

    showToast('info', 'Sedang mengunduh dokumen...');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal mengunduh file');
            }
            return response.blob();
        })
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
            showToast('success', 'Download selesai: ' + filename);
        })
        .catch(error => {
            console.error('Download error:', error);
            showToast('error', 'Download gagal: ' + error.message);
        });

}
function berlakuSeumurHidup() {
    if ($('#expiryDate').is('disabled')) {
        $('#expiryDate').prop('disabled', false);
    }
    $('#expiryDate').val('9999-12-31');
    $('#expiryDate').prop('disabled', true);
    showToast('success', 'Berlaku seumur hidup');
}

