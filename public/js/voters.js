function formatPegawai(data) {
    if (!data.id) return data.text;
    return $(`
    <span style="display:flex;align-items:center;">
      <img src="${data.foto}">
      ${data.text}
    </span>
  `);
}

$(document).ready(function () {
$.ajax({
    url: '/api/voters/cek',
    method: 'GET',
    success: function (response) {
        if (response.error == false) {
            const modal = new bootstrap.Modal(document.getElementById('modalPegawaiTeladan'));
            modal.show(); 
        }

    }
})
    
  
    // Initialize Select2 when modal is fully visible
    $('#modalPegawaiTeladan').on('shown.bs.modal', function () {
        $('#selectPegawaiL').select2({
            dropdownParent: $('#modalPegawaiTeladan'), // << WAJIB kalau Select2 di dalam modal
            placeholder: 'Ketik nama pegawai...',
            minimumInputLength: 1,
            ajax: {
                url: '/api/voters/participants', // GANTI KE API ANDA
                dataType: 'json',
                delay: 300,
                data: params => ({ name: params.term, gender: 'Laki-laki' }),
                processResults: data => ({
                    results: data.data.map(p => ({
                        id: p.nik,
                        nik: p.nik,
                        text: p.nama,
                        foto: p.profile.url
                    }))
                })
            },
            templateResult: formatPegawai,
            templateSelection: formatPegawai,
            width: '100%'
        });
        $('#selectPegawaiP').select2({
            dropdownParent: $('#modalPegawaiTeladan'), // << WAJIB kalau Select2 di dalam modal
            placeholder: 'Ketik nama pegawai...',
            minimumInputLength: 1,
            ajax: {
                url: '/api/voters/participants', // GANTI KE API ANDA
                dataType: 'json',
                delay: 300,
                data: params => ({ name: params.term, gender: 'Perempuan' }),
                processResults: data => ({
                    results: data.data.map(p => ({
                        id: p.nik,
                        nik: p.nik,
                        text: p.nama,
                        foto: p.profile.url
                    }))
                })
            },
            templateResult: formatPegawai,
            templateSelection: formatPegawai,
            width: '100%'
        });
    });

});
function simpanPegawaiTeladan() {
    const nikPegawaiL = $('#selectPegawaiL').select2('data')[0];
    const nikPegawaiP = $('#selectPegawaiP').select2('data')[0];
    console.log(nikPegawaiL);
    console.log(nikPegawaiP);
    if (!nikPegawaiL || !nikPegawaiP) {
        Swal.fire({
            title: 'Oops...',
            text: 'Harap mengisi nama pegawai Laki-laki dan Perempuan yang akan dijadikan teladan!',
            icon: 'warning',
            confirmButtonText: 'OK'
        })
    }
    else {
        Swal.fire({
            title: 'Anda yakin ingin memilih pegawai ini?',
            text: 'Pilihan anda tidak dapat diubah!',
            showCancelButton: true,
            confirmButtonText: 'Ya, memilih',
            cancelButtonText: 'Tidak',
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/api/voters/vote',
                    method: 'POST',
                    data: { nikL: nikPegawaiL.nik, nikP: nikPegawaiP.nik },
                    success: function (data) {
                        if (data.message === 'success') {
                            Swal.fire({
                                title: 'Berhasil',
                                text: 'Terima kasih telah memilih',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            }).then(function () {
                                const modal = bootstrap.Modal.getInstance(
                                    document.getElementById('modalPegawaiTeladan')
                                );
                                modal.hide();
                            });
                        } else {
                            Swal.fire({
                                title: 'Gagal',
                                text: 'Data gagal disimpan!',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(xhr.responseText);
                        Swal.fire({
                            title: 'Gagal',
                            text: 'Data gagal disimpan!',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                });

            }
        });
    }
    

    // if (!nikPegawai || !tanggal || !jumlah) {
    //     alert('Harap mengisi semua data yang diperlukan!');
    //     return;
    // }

}

