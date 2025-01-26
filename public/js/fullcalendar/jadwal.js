let 
    date,
    cekIn,
    statusIn,
    keteranganIn,
    nilaiIn,
    geoIn,
    loactionIn,
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
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// console.log(getCookie("token"))
let token = getCookie("token");
token = token.split('.')
let idData = atob(token[1]);
idData = JSON.parse(idData);
console.log(idData)


fetch("/api/presensi/jdldns", {
    method: "GET",
})
    .then((response) => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    })
    .then((data) => {
        console.log(data.data);
        console.log(data.data.dnsType.type);

        // Perbarui teks elemen
        document.getElementById("Timecheckin").textContent = `${data.data.dnsType.start_min} - ${data.data.dnsType.start_max}`;
        document.getElementById("Timecheckout").textContent = `${data.data.dnsType.end_min} - ${data.data.dnsType.end_max}`;
        document.getElementById("jns_shift").textContent = data.data.dnsType.type;

        typeDns = data.data.typeDns;
        date = data.data.date;

        // Cek status
        if (data.data.dnsType.state === 0) {
            Swal.fire({
                icon: "info",
                title: `Anda hari ini ${data.data.dnsType.type}`,
                text: "",
                buttons: false,
                confirmButtonText: "OK",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
            });

            // Disable tombol checkin
            document.getElementById("checkin").disabled = true;
        }
    })
    .catch((error) => {
        if (error.json) {
            error.json().then((errorData) => {
                console.log(errorData.message);
                Swal.fire({
                    icon: "warning",
                    title: errorData.message,
                    text: errorData.data,
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
            });
        } else {
            console.error("Unexpected error:", error);
        }
    });

let intervalId = null;
function check(state) {
    if (posisi === false) {
        return window.location.href = '/absen';
    }
    if (geoIn === undefined) {
        return Swal.fire({
            icon: "warning",
            title: "Mohon tunggu...",
            text: "Sedang menunggu data GPS",
            buttons: false,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false, // Tidak memungkinkan untuk mengklik luar jendela SweetAlert
            allowEscapeKey: false,   // Tidak memungkinkan untuk menutup dengan tombol "Esc"
            allowEnterKey: false,
        })
    }
    dataPostAbsen = {
        state: state,
        type: typeDns,
        date: date,
        geoIn: geoIn,
        wifi: wifi,
        posisi: posisi,
        loactionIn: loactionIn,
        visitIdIn: visitIdIn
    }

    video.addEventListener('play', startDetection);
    // Inisialisasi
    loadModels().then(startVideo);


    document.getElementById("faceReactionLabel").textContent = "Arahkan Kamera Wajah";
    const faceReactionModal = new bootstrap.Modal(document.getElementById("faceReaction"));
    faceReactionModal.show();
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
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 1024 },
                facingMode: { ideal: "user" }
            }
        });
        console.log('Kamera diakses');
        console.log(stream);
        video.srcObject = stream;
    } catch (error) {
        console.error('Error mengakses kamera:', error);
    }
}
let camera = "user";
async function flipCamera() {
    if (camera === "user") {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 1024 },
                facingMode: { ideal: "environment" }
            }
        });
        console.log('Kamera diakses');
        console.log(stream);
        video.srcObject = stream;
        camera = "environment";
    } else {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 1024 },
                facingMode: { ideal: "user" }
            }
        });
        console.log('Kamera diakses');
        console.log(stream);
        video.srcObject = stream;
        camera = "user";
    }


}
// Deteksi wajah
async function detectFaces() {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, detections);

    // Jika wajah terdeteksi, lakukan auto-capture
    if (detections.length > 0) {

        const currentTime = Date.now();
        if (currentTime - lastCaptureTime > captureInterval) {
            console.log('Wajah terdeteksi');
            document.getElementById("ket").innerText = "";
            autoCapture();
            stopDetection();
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
    const base64Data = imageData.replace(/^data:image\/(png|jpeg);base64,/, "");

    // Konversi Base64 menjadi Blob
    const blob = base64ToBlob(base64Data, "image/jpeg");
    console.log('send');

    // Lakukan permintaan menggunakan fetch
    fetch(`https://fr.spairum.my.id/api/cdn/upload/fr/recognition?metadata=0_${idData.id}.json`, {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Panggil fungsi matchFR dengan blob
            matchFR(blob);
        })
        .catch((error) => {
            console.error("Error:", error);
            // Panggil fungsi sendRecognition dengan blob jika ada kesalahan
            sendRecognition(blob);
        });
}



document.getElementById("faceReaction").addEventListener("hidden.bs.modal", function () {
    video.pause();
    video.srcObject = null;
    console.log('Stop')
    stopDetection();
});

function startDetection() {
    if (!intervalId) {
        intervalId = setInterval(detectFaces, 1000);
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

    try {
        const response = await fetch("https://fr.spairum.my.id/api/cdn/upload/fr/recognition", {
            method: "POST",
            body: form,
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error("Error:", response.status, response.statusText);
        }
        startDetection()
    } catch (error) {
        console.error("Error:", error);
    }
}

async function matchFR(img) {
    let form = new FormData();
    form.append("image", img, idData.nama.replace(/[^\w]|_/g, "") + ".jpg");
    form.append("nik", idData.id);
    form.append("metadata", "0_" + idData.id + ".json");

    try {
        // Request untuk pengenalan wajah
        const response = await fetch("https://fr.spairum.my.id/api/cdn/upload/fr/recognition", {
            method: "PUT",
            body: form,
        });


        if (response.ok) {
            const result = await response.json();
            console.log(result);
            if (result.output !== undefined && result.output.data) {
                console.log(result.output.data);
                console.log(dataPostAbsen);

                // Request untuk absen
                document.getElementById("ket").innerText = `HI ${idData.nama}`;
                try {
                    const absenResponse = await fetch("/api/presensi/absen", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dataPostAbsen),
                    });

                    if (absenResponse.ok) {
                        const absenResult = await absenResponse.json();
                        console.log(absenResult);

                        Swal.fire({
                            icon: "success",
                            title: absenResult.message,
                            text: absenResult.data,
                        });

                        // Memperbarui riwayat setelah absen berhasil
                        getRiwayat(periode);
                    } else {
                        const errorData = await absenResponse.json();
                        Swal.fire({
                            icon: "warning",
                            title: errorData.message,
                            text: errorData.data,
                        });
                    }
                } catch (absenError) {
                    console.error("Error saat mengirim data absen:", absenError);
                }

                // Menghentikan deteksi dan menutup modal
                stopDetection();
                // document.getElementById("faceReaction").classList.remove("show");

                bootstrap.Modal.getInstance(document.getElementById('faceReaction')).hide()
            } else {
                startDetection()
                document.getElementById("ket").innerText = ` Mohon wajah anda tidak cocok dengan yang tersimpan di database, silahkan coba lagi.`;
            }
        } else {
            console.error("Error response:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
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

async function detectCameras() {
    try {
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
        console.log(stream);
        // await navigator.mediaDevices.getUserMedia({ video: false });
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            console.log('Kamera dihentikan');
        }
    } catch (error) {
        console.error('Error accessing the camera:', error);
        alert('Please allow camera access.');
    }
    // Stop the video stream


    try {
        // Dapatkan daftar perangkat media
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        // Filter perangkat untuk jenis "videoinput" (kamera)
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(videoDevices);

    } catch (error) {
        console.log(error);

    }
}

// Jalankan fungsi deteksi kamera
detectCameras();

