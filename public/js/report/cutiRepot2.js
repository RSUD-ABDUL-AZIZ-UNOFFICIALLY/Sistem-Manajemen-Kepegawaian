
function QRAtasan(message) {
    let qrCodeA = new QRCodeStyling({
        width: 150,
        height: 130,
        type: "canvas",
        imageOptions: {
            crossOrigin: "Anonymous",
            withCredentials: false,
            quality: 1,
            scale: 4
        },
        data: message,
        image: "/asset/img/Lambang_KotaSingkawang.webp",
        dotsOptions: {
            color: "#000000",
            type: "rounded",
        },
    });
    qrCodeA.append(document.getElementById("qrcodeAtasan"));
}
function QRDirector(message) {
    let qrCodeY = new QRCodeStyling({
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
    qrCodeY.append(document.getElementById("qrcodeDirector"));
}
function QRUser(message) {
    let qrCodeU = new QRCodeStyling({
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
    qrCodeU.append(document.getElementById("qrcodeUser"));
}

let signature = getCookie('sigrnature');

//decode url signature
signature = decodeURIComponent(signature);
$(document).ready(async function () {
    console.log("ready!");
    QRAtasan(signature);
    QRUser(window.location.href);
    setTimeout(function () {
        window.print();
    }, 2500);

});