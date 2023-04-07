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
    
    // Validasi input field
    if (!phone || !otp) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'All fields are required!',
      });
      return;
    }
    if (phone.length < 10) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Phone number must be at least 10 characters!',
      });
      return;
    }

    // Cek OTP yang dimasukkan
    // Jika OTP sesuai, maka login berhasil
    // Jika OTP tidak sesuai, maka login gagal
    if (otp === '123456') { // Ganti dengan kode OTP yang sesuai
      swal.fire({
        icon: 'success',
        title: 'Welcome, ' + phone + '!',
        text: 'You have successfully logged in.',
      }).then(() => {
        // Redirect ke halaman setelah login berhasil
        window.location.href = 'dashboard.html';
      });
    } else {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Incorrect OTP!',
      });
    }
  });

  // button send-otp click function
  $('#send-otp').on('click', function() {
    const phone = $('#phone').val();
    // Validasi input field
    if (phone.length < 10) {
      swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Phone number must be at least 10 characters!',
      });
      return;
    }
    // Tampilkan SweetAlert2 loading
    swal.fire({
      title: 'Sending OTP...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        swal.showLoading();
      },
    });
    // Kirim data ke API
    $.ajax({
      url: hostwa +'/api/wa/send',
      method: 'POST',
      headers: {
        "Authorization": "Bearer "+token,
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        "message": "Kode OTP Anda adalah 123456",
        "telp": phone
      }),
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
  
  $(document).ready(function() {
    // Mengirim data login ke API saat form login disubmit
    $('#login-form').submit(function(e) {
      e.preventDefault();
      $.ajax({
        url: 'login.php', // Ubah dengan nama file PHP Anda
        method: 'POST',
        dataType: 'json',
        data: $(this).serialize(),
        success: function(response) {
          // Tampilkan pesan sukses dari response API menggunakan SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.message,
            showConfirmButton: false,
            timer: 2000
          });
          // Redirect ke halaman dashboard atau halaman setelah login berhasil
          setTimeout(function() {
            window.location.href = 'dashboard.html'; // Ubah dengan halaman Anda setelah login berhasil
          }, 2000);
        },
        error: function(xhr, status, error) {
          // Tampilkan pesan error dari response API menggunakan SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: xhr.responseJSON.message
          });
        }
      });
    });
  });