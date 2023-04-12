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
        text: 'Phone number must be at least 10 characters!',
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
        console.log(response);
        // Tampilkan pesan sukses dari response API menggunakan SweetAlert2
        swal.fire({
          icon: 'success',
          title: response.message,
          text: 'You have successfully logged in.',
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

    // Cek OTP yang dimasukkan
    // Jika OTP sesuai, maka login berhasil
    // Jika OTP tidak sesuai, maka login gagal
    // if (otp === '123456') { // Ganti dengan kode OTP yang sesuai
    //   swal.fire({
    //     icon: 'success',
    //     title: 'Welcome, ' + phone + '!',
    //     text: 'You have successfully logged in.',
    //   }).then(() => {
    //     // Redirect ke halaman setelah login berhasil
    //     window.location.href = 'dashboard.html';
    //   });
    // } else {
    //   swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Incorrect OTP!',
    //   });
    // }
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
  