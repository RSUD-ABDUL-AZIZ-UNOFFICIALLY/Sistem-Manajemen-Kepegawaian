
function QRAtasan(message) {
    let qrCodeA = new QRCodeStyling({
        width: 150,
        height: 130,
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
// getURL 


async function getQR() {
    // await $.ajax({
    //     url: "/api/monthly/signaute?periode=" + decoded.periode + "&nik=" + decoded.nik,
    //     method: "GET",
    //     success: function (response) {
    //         // console.log(response);
    //         if (response.data.stausUser) {
    //             let message = response.data.aprovUser.user.nama + " telah membuat laporan periode " + decoded.periode + " Pada tanggal " + response.data.aprovUser.date;
    //             QRUser(message);
    //         }
    //         if (response.data.stausAtasan) {
    //             let message = response.data.aprovAtasan.atasan.nama + " telah menyetujui laporan periode " + decoded.periode + " Pada tanggal " + response.data.aprovAtasan.date;
    //             $("#nameAtasan").text(response.data.aprovAtasan.atasan.nama);
    //             $("#nipAtasan").text("NIP. " + response.data.aprovAtasan.atasan.nip);
    //             QRAtasan(message);
    //         }
    //     }
    // });

}
console.log(window.location.href);

$(document).ready(async function () {
    console.log("ready!");
    QRAtasan(window.location.href);
    // setTimeout(function () {
    //     window.print();
    // }, 3000);


});
