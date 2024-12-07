let typeDns,
    date,
    cekIn,
    statusIn,
    keteranganIn,
    nilaiIn,
    geoIn,
    wifi,
    posisi,
    visitIdIn,
    cekOut,
    statusOut,
    keteranganOut,
    nilaiOut,
    geoOut,
    visitIdOut;
const visitLocal = localStorage.getItem("visite");
if (visitLocal) {
    visitIdIn = visitLocal;
    visitIdOut = visitLocal;
} else {
    visitIdIn = "";
    visitIdOut = "";
}


$.ajax({
    url: "/api/presensi/jdldns",
    method: "GET",
    success: function (response) {
        console.log(response.data);
        console.log(response.data.dnsType.type);
        $('#Timecheckin').text(response.data.dnsType.start_min + " - " + response.data.dnsType.start_max);
        $('#Timecheckout').text(response.data.dnsType.end_min + " - " + response.data.dnsType.end_max);
        $('#jns_shift').text(response.data.dnsType.type);
        typeDns = response.data.typeDns;
        date = response.data.date;

    },
    error: function (error) {
        console.log(error.responseJSON.message);
        Swal.fire({
            icon: "warning",
            title: error.responseJSON.message,
            text: error.responseJSON.data,
            buttons: false,
            confirmButtonText: "OK",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false, // Tidak memungkinkan untuk mengklik luar jendela SweetAlert
            allowEscapeKey: false,   // Tidak memungkinkan untuk menutup dengan tombol "Esc"
            allowEnterKey: false,
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/';
            }
        });
    },
})

function check(state) {
    if (posisi === false) {
        return window.location.href = '/absen';
    }
    let data = {

        state: state,
        type: typeDns,
        date: date,
        geoIn: geoIn,
        wifi: wifi,
        posisi: posisi,
        visitIdIn: visitIdIn
    }
    console.log(data)
    $.ajax({
        url: "/api/presensi/absen",
        method: "POST",
        data: data,
        success: function (response) {
            console.log(response);
            Swal.fire({
                icon: "success",
                title: response.message,
                text: response.data,
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         window.location.href = "/absen";
                //     }
            });
        },
        error: function (error) {
            console.log(error.responseJSON);
            Swal.fire({
                icon: "warning",
                title: error.responseJSON.message,
                text: error.responseJSON.data
                // }).then((result) => {
                //     if (result.isConfirmed) {
                //         window.location.href = "/absen";
                //     }
            });
        },
    });
}
