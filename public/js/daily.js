$( document ).ready(function() {

    $('#Progress').submit(function(event) {
        event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru

        let data = {
            rak: $('#InputActivities').val(),
            tgl: $('#Tanggal').val(),
            volume : $('#InputVolume').val(),
            satuan : $('#Unit').val(),
            waktu : $('#InputCompletion').val()
        };
        console.log(data);
        
    
        $.ajax({
          url: '/api/progress',
            method: 'POST',
            data: data,
          success: function(response) {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
              text: 'Kegiatan berhasil disimpan',
                showConfirmButton: false,
              timer: 2000
              })
              $("#InputActivities").val("");
              $("#InputVolume").val("");
              $("#InputCompletion").val("");
                return;
          },
          error: function(error) {
            // console.log(error);
          }
        });
      });
});