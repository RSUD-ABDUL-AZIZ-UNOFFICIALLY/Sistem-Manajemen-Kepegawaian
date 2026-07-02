document.addEventListener('DOMContentLoaded', () => {
  let dateInput = new Date();
  const dateControl = document.querySelector('input[type="date"]');
  dateControl.value = dateInput.toISOString().split('T')[0];
  console.log(dateInput.toISOString().split('T')[0]);

  const progressForm = document.getElementById('Progress');
  // Pastikan form ada di DOM sebelum menambahkan event listener
  if (progressForm) {
    progressForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Mencegah form submit default

    // Mengambil referensi elemen input
    const inputActivities = document.getElementById('InputActivities');
    const tanggal = document.getElementById('Tanggal');
    const inputVolume = document.getElementById('InputVolume');
    const unit = document.getElementById('Unit');
    const inputCompletion = document.getElementById('InputCompletion');

    const payload = {
      rak: inputActivities.value,
      tgl: tanggal.value,
      volume: inputVolume.value,
      satuan: unit.value,
      waktu: inputCompletion.value
    };

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
          // Gunakan application/json jika backend menerima JSON.
          // Jika backend stricly expect x-www-form-urlencoded (seperti default $.ajax), 
          // ubah header ini dan gunakan new URLSearchParams(payload).toString() pada body.
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // fetch tidak otomatis melempar error untuk status HTTP 4xx/5xx seperti $.ajax,
        // jadi kita perlu cek response.ok secara manual.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // const responseData = await response.json(); // Jika perlu membaca response body dari API

        // Menampilkan SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Succeed',
          text: 'Kegiatan berhasil disimpan',
          showConfirmButton: false,
          timer: 2000
        });

      // Reset field form
      inputActivities.value = "";
      inputVolume.value = "";
      inputCompletion.value = "";

    } catch (error) {
      // block error dari try-catch ini mencakup kegagalan network atau error dari throw di atas
      // console.error('Error submitting progress:', error);
    }
  });
}
});