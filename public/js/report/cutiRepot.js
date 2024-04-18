
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

$(document).ready(async function () {
    console.log("ready!");
    QRAtasan(window.location.href);
    setTimeout(function () {
        window.print();
    }, 2500);


});
