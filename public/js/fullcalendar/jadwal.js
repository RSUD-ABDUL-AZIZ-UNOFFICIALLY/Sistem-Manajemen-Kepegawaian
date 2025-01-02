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
    visitIdOut,
    dataPostAbsen;
const visitLocal = localStorage.getItem("visite");
if (visitLocal) {
    visitIdIn = visitLocal;
    visitIdOut = visitLocal;
} else {
    visitIdIn = "";
    visitIdOut = "";
}
// console.log(getCookie("token"))
let token = getCookie("token");
token = token.split('.')
let idData = atob(token[1]);
idData = JSON.parse(idData);
console.log(idData)


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
        if (response.data.dnsType.state == 0) {
            Swal.fire({
                icon: "info",
                title: "Anda hari ini " + response.data.dnsType.type,
                text: "",
                buttons: false,
                confirmButtonText: "OK",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
            })
            $('#checkin').prop('disabled', true);
            // $('#checkout').prop('disabled', true);
        }

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

let intervalId = null;
function check(state) {
    if (posisi === false) {
        return window.location.href = '/absen';
    }
    dataPostAbsen = {
        state: state,
        type: typeDns,
        date: date,
        geoIn: geoIn,
        wifi: wifi,
        posisi: posisi,
        visitIdIn: visitIdIn
    }

    video.addEventListener('play', startDetection);
    // Inisialisasi
    loadModels().then(startVideo);


    $('#faceReactionLabel').text('Arahkan Kamera Wajah')
    $('#faceReaction').modal('show');
}
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const snapshot = document.getElementById('snapshot');

// Variabel untuk mencegah pengambilan gambar berulang terlalu cepat
let lastCaptureTime = 0;
const captureInterval = 2000; // Waktu minimal antara capture (ms)

// Muat model Face API
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.0.1/model');
}

// Mulai kamera
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Kamera diakses');
        console.log(stream);
        video.srcObject = stream;
    } catch (error) {
        console.error('Error mengakses kamera:', error);
    }
}

// Deteksi wajah
async function detectFaces() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas, detections);

    // Jika wajah terdeteksi, lakukan auto-capture
    if (detections.length > 0) {
        const currentTime = Date.now();
        if (currentTime - lastCaptureTime > captureInterval) {
            autoCapture();
            lastCaptureTime = currentTime;
        }
    }
}

// Fungsi untuk auto-capture
function autoCapture() {
    const imageData = canvas.toDataURL('image/png'); // Gambar dalam format Base64
    snapshot.src = imageData; // Tampilkan hasil snapshot
    // console.log('Gambar diambil otomatis:', imageData);

    // Kirim gambar ke server
    sendImageToServer(imageData);
}

// Fungsi untuk mengirim gambar ke server menggunakan AJAX
function sendImageToServer(imageData) {
    const base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');
    // Konversi Base64 menjadi Blob
    const blob = base64ToBlob(base64Data, 'image/jpeg');
    $.ajax({
        url: "https://fr.spairum.my.id/api/cdn/upload/fr/recognition?metadata=0_" + idData.id + ".json",
        method: "GET",
        success: function (response) {
            console.log(response);
            // let data = response.data;
            matchFR(blob)

        },
        error: function (error) {
            console.log(error);
            sendRecognition(blob)

        },
    });
}


$('#faceReaction').on('hidden.bs.modal', function () {
    video.pause();
    video.srcObject = null;
    stopDetection()
});

function startDetection() {
    if (!intervalId) {
        intervalId = setInterval(detectFaces, 100);
        console.log('Deteksi wajah dimulai');
    }
}

// Fungsi untuk menghentikan deteksi
function stopDetection() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Deteksi wajah dihentikan');
    }
}

async function sendRecognition(img) {
    let form = new FormData();
    form.append("image", img, idData.nama + '.jpg');
    form.append("nik", idData.id);
    form.append("name", idData.nama);

    let settings = {
        url: "https://fr.spairum.my.id/api/cdn/upload/fr/recognition",
        method: "POST",
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form
    };

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        console.log(response)
    });
}

async function matchFR(img) {
    let form = new FormData();
    form.append("image", img, idData.nama + '.jpg');
    form.append("nik", idData.id);
    form.append("metadata", '0_' + idData.id + '.json');

    let settings = {
        url: "https://fr.spairum.my.id/api/cdn/upload/fr/recognition",
        method: "PUT",
        processData: false,
        mimeType: "multipart/form-data",
        contentType: false,
        data: form
    };

    $.ajax(settings).done(function (response) {
        response = JSON.parse(response);
        console.log(response.output)
        if (response.output != undefined) {
            if (response.output.data) {
                console.log(response.output.data)
                console.log(dataPostAbsen)
                $.ajax({
                    url: "/api/presensi/absen",
                    method: "POST",
                    data: dataPostAbsen,
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
                stopDetection();
                $('#faceReaction').modal('hide');
            }
        }
// stopDetection();
// $('#faceReaction').modal('hide');
    });
}

// Fungsi untuk mengonversi Base64 ke Blob
function base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}
navigator.permissions.query({ name: 'camera' })
    .then((permissionStatus) => {
        console.log('Kamera izin status:', permissionStatus.state); // granted, denied, atau prompt
        if (permissionStatus.state === 'denied') {
            alert('Izinkan akses kamera di pengaturan browser Anda.');
            permissionStatus.onchange = () => {
                console.log('Kamera izin status berubah:', permissionStatus.state);
                if (permissionStatus.state === 'denied') {
                    alert('Izinkan akses kamera di pengaturan browser Anda.');
                } else if (permissionStatus.state === 'granted') {
                    console.log('Akses kamera telah diizinkan.');
                }
            };

        }
    });
async function detectCameras() {
    try {
        // Dapatkan daftar perangkat media
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);

        // Filter perangkat untuk jenis "videoinput" (kamera)
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(videoDevices);
        for (let e of videoDevices) {
            console.log(e.label);
            console.log(e.deviceId);
            console.log(e.kind);
            $('#cameraList').append(`<li>${e.label}</li>`);
        }
    } catch (error) {
        console.error('Error saat mendeteksi kamera:', error);
        document.getElementById('cameraCount').textContent = 'Tidak dapat mendeteksi kamera.';
    }
}

// Jalankan fungsi deteksi kamera
detectCameras();