function QRUser(message) {
    new QRCode("qrcodeUser", {
        text: message,
        width: 90,
        height: 90,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
}
function QRAtasan(message) {
    let qrCodeA = new QRCodeStyling({
        width: 120,
        height: 120,
        type: "svg",
        data: message,
        image: "/asset/img/Lambang_KotaSingkawang.webp",
        dotsOptions: {
            color: "#000000",
            type: "rounded",
        },
    });
    qrCodeA.append(document.getElementById("qrcodeAtasan"));
}

let params = (new URL(document.location)).searchParams;
let query = params.get("periode");
let decoded = JSON.parse(atob(query));

async function getQR() {
    await $.ajax({
        url: "/api/monthly/signaute?periode=" + decoded.periode + "&nik=" + decoded.nik,
        method: "GET",
        success: function (response) {
            // console.log(response);
            if (response.data.stausUser) {
                let message = response.data.aprovUser.user.nama + " telah membuat laporan periode " + decoded.periode + " Pada tanggal " + response.data.aprovUser.date;
                QRUser(message);
            }
            if (response.data.stausAtasan) {
                let message = response.data.aprovAtasan.atasan.nama + " telah menyetujui laporan periode " + decoded.periode + " Pada tanggal " + response.data.aprovAtasan.date;
                $("#nameAtasan").text(response.data.aprovAtasan.atasan.nama);
                $("#nipAtasan").text("NIP. " + response.data.aprovAtasan.atasan.nip);
                QRAtasan(message);
            }
        }
    });

}


$(document).ready(async function () {
    getQR()
    setTimeout(function () {
        window.print();
    }, 3000);


});
