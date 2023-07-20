const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
// crate date format yyyy-mm
if (month < 10) {
    month = "0" + month;
}
if (day < 10) {
    day = "0" + day;
}
$("#riwayatDate").val(`${year}-${month}`);

$('#lapor').submit(function(event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru
    let data = {
        kendala: $('#kendala').val(),
        dep: $('#departemen').val(),
        topic: $('#topic').val(),
    };
    $.ajax({
        url: '/api/complaint',
        method: 'POST',
        data: data,
        success: function(response) {
        console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
                text: 'Laporan berhasil di sampaikan',
                showConfirmButton: false,
                timer: 2000
            })
            $("#kendala").val("");
            return;
        },
        error: function(error) {
            // console.log(error);
        }
    });
});