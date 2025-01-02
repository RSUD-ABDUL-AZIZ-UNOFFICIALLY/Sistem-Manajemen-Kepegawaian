
// Update clock
function updateClock() {
    let date = new Date();
    let t = date.toLocaleTimeString();
    let dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let year = date.toLocaleDateString('id-ID', { year: 'numeric' });
    let dayNumber = date.toLocaleDateString('id-ID', { day: 'numeric' });
    $("#day").text(dayName[date.getDay()]);
    $("#month").text(monthName[date.getMonth()]);
    $("#year").text(year);
    $("#dayNumber").text(dayNumber);
    let h = date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    $("#time").text(t);
    $("#date").text(dayName[date.getDay()] + ", " + dayNumber + " " + monthName[date.getMonth()] + " " + year);
}
setInterval(updateClock, 1000);
// Update Date
function geoFindMe() {

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let accuracyInMeter = position.coords.accuracy;
        // console.log(`${accuracyInMeter} meters`);

        $("#posisi").text(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
        // console.log(`${latitude},${longitude}`);
        geoIn = `${latitude},${longitude}`
        geoOut = `${latitude},${longitude}`

        $.ajax({
            url: "/api/presensi/getlocation",
            method: "POST",
            data: {
                latitude: latitude,
                longitude: longitude
            },
            success: function (response) {
                $("#posisi").text(response.data.location);
                // console.log(response.data);
                if (response.data.status) {
                    posisi = 1;
                } else {
                    posisi = 0;
                }
            },
            error: function (error) {
                console.log(error);
                posisi = false;
            }
        })
    }

    function error() {
        $("#posisi").text("GPS tidak di aktifkan");
        posisi = false;
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Mohon aktifkan lokasi anda",
            buttons: false,
            confirmButtonText: "OK",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false, // Tidak memungkinkan untuk mengklik luar jendela SweetAlert
            allowEscapeKey: false,   // Tidak memungkinkan untuk menutup dengan tombol "Esc"
            allowEnterKey: false,
        });

        navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            if (result.state === 'granted') {
                geoFindMe();
            } else if (result.state === 'prompt') {
                result.onchange = function () {
                    if (result.state === 'granted') {
                        geoFindMe();
                    }
                }
            }
        });
    }

    if (!navigator.geolocation) {
        $("#posisi").text("Perangakat tidak mendukung geolocation");
    } else {
        // $("#posisi").text("Loading...");
        navigator.geolocation.getCurrentPosition(success, error);
    }
    setTimeout(() => {
        geoFindMe();
    }, 25000);
}
geoFindMe();
async function getStatus() {
    try {
        // Mengambil objek battery
        const battery = await navigator.getBattery();

        // Cek level baterai (nilai antara 0.0 dan 1.0)
        // console.log("Battery level: " + Math.round(battery.level * 100) + "%");
        $('#baterai').text(Math.round(battery.level * 100) + "%");
        if (battery.level < 0.5) {
            $('#bateraiicon').attr('class', 'fa-solid fa-battery-quarter');
        } else if (battery.level < 0.8) {
            $('#bateraiicon').attr('class', 'fa-solid fa-battery-half');
        } else {
            $('#bateraiicon').attr('class', 'fa-solid fa-battery-three-quarters');
        }

        // Cek apakah sedang charging
        // console.log("Is charging: " + battery.charging);
        if (battery.charging) {

            $('#bateraichager').attr('class', "fa-solid fa-bolt");
        } else {
            $('#bateraiicon').attr('class', 'fa-solid fa-battery-three-quarters');
        }
    } catch (error) {
        console.error("Error fetching battery status:", error);
    }
}
getStatus();

async function pingLocalDevice(ip) {
    const startTime = Date.now();
    wifi = 0;
    try {
        const response = await fetch(`http://${ip}`, { method: 'GET', cache: 'no-cache', signal: AbortSignal.timeout(2000) });
        if (response.ok) {
            const endTime = Date.now();
            const pingTime = endTime - startTime;
            // console.log(`Ping to ${ip}: ${pingTime} ms`);
            $('#wifi').text('Dalam Jaringan');
            wifi = 1;
        } else {
            $('#wifi').text('Diluar Jaringan');
            wifi = 0;
        }
    } catch (error) {

        $('#wifi').text('Diluar Jaringan');
        wifi = 0;
        // console.log(`Ping to ${ip} failed: ${error.message}`);
    }
    setTimeout(() => {
        pingLocalDevice('10.60.0.161:8080');
    }, 10000);
}

// Contoh penggunaan dengan alamat IP lokal
pingLocalDevice('10.60.0.161:8080');