// SweetAlert2 arrow function
const swal = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary',
  },
  buttonsStyling: false,
});

// Pastikan DOM sudah dimuat
document.addEventListener('DOMContentLoaded', function () {

  // Form submit function
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const phone = document.getElementById('phone').value;
      const otp = document.getElementById('otp').value;

      if (phone.length < 10) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nomor Whatsapp minimal harus 10 karakter!',
        });
        return;
      }

      // Fetch request /api/verify-otp (pengganti $.ajax)
      fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          // Menyamakan format default $.ajax (form-urlencoded)
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          phone: phone,
          otp: otp,
        })
      })
        .then(async (response) => {
          // Handle error status (4xx, 5xx)
          if (!response.ok) {
            const errData = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server' }));
            throw errData;
          }
          return response.json();
        })
        .then((data) => {
          Swal.fire({
            icon: 'success',
            title: data.message,
            text: 'Anda telah berhasil masuk.',
          }).then(() => {
            // Redirect ke halaman setelah login berhasil
            let urlParams = new URLSearchParams(window.location.search);
            let redirectUrl = urlParams.get('redirect_url');
            console.log(redirectUrl);
            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              window.location.href = '/daily';
            }
          });
        })
        .catch((error) => {
        // Tampilkan pesan error dari response API menggunakan SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Terjadi kesalahan pada server',
          });
        });
    });
  }

  // button send-otp click function
  const sendOtpBtn = document.getElementById('send-otp');
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', function () {
      const phone = document.getElementById('phone').value;

      // Validasi input field
      if (phone.length < 10) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nomor Whatsapp minimal harus 10 karakter!',

        });
        return;
      }

      let userAgentData = navigator.userAgent;
      let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgentData);

      if (isMobile) {
        fetch("/api/mobile-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone,
          }),
        });
        fetch('/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          body: new URLSearchParams({
            phone: phone,
          })
        });

        // Asumsi variabel 'admin' dideklarasikan di scope global pada file sebelumnya
        const adminNumber = typeof admin !== 'undefined' ? admin : '';
        window.open('https://wa.me/+62' + adminNumber + '?text=OTP', '_blank');
        return;
      }

      // Tampilkan SweetAlert2 loading & nonaktifkan tombol
      this.disabled = true;

      // Mengaktifkan semua tombol setelah 30 detik
      setTimeout(function () {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => btn.disabled = false);
      }, 30000);

      fetch("/api/mobile-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phone,
        }),
      });

      Swal.fire({
        title: 'Sedang mengirim OTP',
        allowOutsideClick: false,
        didOpen: () => { // onBeforeOpen diubah menjadi didOpen (standar swal2 modern)
          swal.showLoading();
        },
      });

      // Kirim data ke API (pengganti $.ajax)
      fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          phone: phone,
        })
      })
        .then(async (response) => {
          if (!response.ok) {
            const errData = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server' }));
            throw errData;
          }
          return response.json();
        })
        .then((data) => {
        // Tampilkan pesan sukses dari response API menggunakan SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message
          });
        })
        .catch((error) => {
        // Tampilkan pesan error dari response API menggunakan SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Terjadi kesalahan pada server',
          });
        });
    });
  }
});

// Remove all saved data from sessionStorage
sessionStorage.clear();