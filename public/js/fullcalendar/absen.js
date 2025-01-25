
// Update clock
function updateClock() {
    let date = new Date();
    let t = date.toLocaleTimeString();
    let dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let year = date.toLocaleDateString('id-ID', { year: 'numeric' });
    let dayNumber = date.toLocaleDateString('id-ID', { day: 'numeric' });
    let h = date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    $("#day").text(dayName[date.getDay()]);
    $("#month").text(monthName[date.getMonth()]);
    $("#year").text(year);
    $("#dayNumber").text(dayNumber);
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
        console.log(`${accuracyInMeter} meters`);

        $("#posisi").text(`Latitude: ${latitude} °, Longitude: ${longitude} °`);
        // console.log(`${latitude},${longitude}`);
        geoIn = `${latitude},${longitude}`
        geoOut = `${latitude},${longitude}`

        // $.ajax({
        //     url: "/api/presensi/getlocation",
        //     method: "POST",
        //     data: {
        //         latitude: latitude,
        //         longitude: longitude
        //     },
        //     success: function (response) {
        //         $("#posisi").text(response.data.location);
        //         // console.log(response.data);
        //         if (response.data.status) {
        //             posisi = 1;
        //         } else {
        //             posisi = 0;
        //         }
        //     },
        //     error: function (error) {
        //         console.log(error);
        //         posisi = false;
        //     }
        // })
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
    console.log(navigator.geolocation)

    if (!navigator.geolocation) {
        $("#posisi").text("Perangakat tidak mendukung geolocation");
    } else {
        $("#posisi").text("Loading...");
        // navigator.geolocation.success(success, error);
    }
    setTimeout(() => {
        geoFindMe();
    }, 25000);
}
// geoFindMe();
let lastPosition = null;

navigator.geolocation.watchPosition(
    (position) => {
        console.log(`L ${position.coords.latitude}, ${position.coords.longitude}`);
        if (lastPosition) {
            const distance = calculateDistance(
                lastPosition.latitude,
                lastPosition.longitude,
                position.coords.latitude,
                position.coords.longitude
            );

            const timeDiff = (position.timestamp - lastPosition.timestamp) / 1000; // Dalam detik
            const speed = distance / (timeDiff / 3600); // Kecepatan dalam km/jam

            if (speed > 150) { // Kecepatan tidak realistis
                console.log("Kemungkinan fake GPS terdeteksi.");
                $("#posisi").text("Kemungkinan fake GPS terdeteksi.");
                geoIn = undefined
                geoOut = undefined
            } else {
                console.log("Pergerakan normal.");
                console.log(position)
                geoIn = `${position.coords.latitude},${position.coords.longitude}`
                geoOut = `${position.coords.latitude},${position.coords.longitude}`
                $.ajax({
                    url: "/api/presensi/getlocation",
                    method: "POST",
                    data: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    success: function (response) {
                        $("#posisi").text(response.data.location);
                        loactionIn = response.data.location
                        console.log(response.data);
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
        }

        lastPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
        };
    },
    (error) => {
        console.error("Gagal memantau lokasi:", error);
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
            confirmButtonText: `<a href="https://api.whatsapp.com/send?phone=62895321701798&text=Bagaimana%20cara%20aktifkan%20lokasi%20GPS%20saya%20${idData.nama}" class="text-white">OK</a>`,
        });
    },
    (options) => {
        options.enableHighAccuracy = true;
        options.timeout = 5000;
        options.maximumAge = 0;
    }
);
if (!navigator.geolocation) {
    $("#posisi").text("Perangakat tidak mendukung geolocation");
} else {
    $("#posisi").text("Loading...");
    function success(position) {
        console.log(`x ${position}, ${position.coords.longitude}`);
        $.ajax({
            url: "/api/presensi/getlocation",
            method: "POST",
            data: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            success: function (response) {
                $("#posisi").text(response.data.location);
                loactionIn = response.data.location
                console.log(response.data);
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

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    let options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    }
    navigator.geolocation.getCurrentPosition(success, error, options);
    // navigator.geolocation.getCurrentPosition(success, error);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius Bumi dalam kilometer
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

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
        const response = await fetch(`https://${ip}`, { method: 'GET', cache: 'no-cache', signal: AbortSignal.timeout(2000) });
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
        pingLocalDevice('api.rsudaa.singkawangkota.go.id/ping');
    }, 10000);
}

// Contoh penggunaan dengan alamat IP lokal
pingLocalDevice('api.rsudaa.singkawangkota.go.id/ping');

function getLocalIP(callback) {
    const pc = new RTCPeerConnection(); // Membuat koneksi WebRTC
    const noop = () => { };
    pc.createDataChannel(""); // Membuat channel dummy
    pc.createOffer()
        .then(offer => pc.setLocalDescription(offer)) // Set local description
        .catch(noop);

    pc.onicecandidate = (event) => {
        if (!event || !event.candidate) return;
        const candidate = event.candidate.candidate;

        // Ekstrak IP dari ICE candidate
        const ipRegex = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
        const ip = candidate.match(ipRegex);
        console.log(ip);
        if (ip) {
            callback(ip[0]); // Panggil callback dengan IP
        }
        pc.close(); // Tutup koneksi setelah mendapatkan IP
    };
}

// Contoh penggunaan:
console.log("IP lokal Anda:");
getLocalIP((ip) => {

    console.log("IP lokal Anda:", ip);
});
