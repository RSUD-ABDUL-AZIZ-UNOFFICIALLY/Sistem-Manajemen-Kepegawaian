$( document ).ready(function() {
    $('#profil').submit(function(event) {
        event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru
  
        var form = $(this);
        let data = {
            nama: $('#nama').val(),
            nik: $('#nik').val(),
            dep : $('#departemen').val(),
            jab : $('#jab').val(),
            atasan : $('#atasan').val(),
            bos : $('#bos').val(),
            tgl_lahir: $('#tgl_lahir').val(),
            nip: $('#nip').val(),
        };
        console.log(data);
        if ($('#atasan').val() == "") {
            Swal.fire({
                icon: 'error',
                title: 'Wajib ada atasan',
              })
            return;
        }
  
  
        $.ajax({
          url: '/api/updateProfile',
            method: 'POST',
            data: data,
          success: function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil diubah',
              })
              return;
          },
          error: function(error) {
            // console.log(error);
          }
        });
      });
});