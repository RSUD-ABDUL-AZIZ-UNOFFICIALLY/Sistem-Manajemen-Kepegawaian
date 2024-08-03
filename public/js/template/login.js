 // SweetAlert2 arrow function
 const swal = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    buttonsStyling: false,
  });

  // Form submit function
  $('form').on('submit', function(event) {
    event.preventDefault();
    const phone = $('#phone').val();
    const otp = $('#otp').val();
    
    if (phone.length < 10) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nomor Whatsapp minimal harus 10 karakter!',
      });
      return;
    }
    // ajax request /api/verify-otp
    $.ajax({
      url: '/api/verify-otp',
      method: 'POST',
      data: {
        phone: phone,
        otp: otp,
      },
      success: function(response) {
        swal.fire({
          icon: 'success',
          title: response.message,
          text: 'Anda telah berhasil masuk.',
        }).then(() => {
          // Redirect ke halaman setelah login berhasil
          window.location.href = '/daily';
        });
      },
      error: function(xhr, status, error) {
        // Tampilkan pesan error dari response API menggunakan SweetAlert2
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: xhr.responseJSON.message,
        });
      },
    });
  });

  // button send-otp click function
  $('#send-otp').on('click', function() {
    const phone = $('#phone').val();
    // Validasi input field
    if (phone.length < 10) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nomor Whatsapp minimal harus 10 karakter!',
      });
      return;
    }
    // Tampilkan SweetAlert2 loading
    $(this).prop('disabled', true); // Menonaktifkan tombol
    setTimeout(function () {
      $('button').prop('disabled', false); // Mengaktifkan tombol setelah 30 detik
    }, 30000);
    swal.fire({
      title: 'Sedang mengirim OTP',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });
    // Kirim data ke API
    $.ajax({
      url: '/api/send-otp',
      method: 'POST',
      data: {
        phone: phone,
      },
      success: function(response) {
        // Tampilkan pesan sukses dari response API menggunakan SweetAlert2
        swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message,
        });
      },
      error: function(xhr, status, error) {
        // Tampilkan pesan error dari response API menggunakan SweetAlert2
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: xhr.responseJSON.message,
        });
      },
    });
  });
  // Remove all saved data from sessionStorage
sessionStorage.clear();
