const currentLocation = location.href;
const menuItem = document.querySelectorAll(".nav-link");
const menuLength = menuItem.length;
for (let i = 0; i < menuLength; i++) {
    if (menuItem[i].href === currentLocation) {
        menuItem[i].className = "nav-link active";
    }
}
if (currentLocation.includes("profile")) {
    $("#documen").addClass("menu-open");
}
if (currentLocation.includes("cuti") || currentLocation.includes("aprovecuti")) {
    $("#cuti").addClass("menu-open");
}
if (currentLocation.includes("daily") || currentLocation.includes("approvement") || currentLocation.includes("monthly") || currentLocation.includes("Report")) {
    $("#laporan").addClass("menu-open");
}



// Contoh penggunaan dengan salt
const teksAsli = "Halo, ini adalah teks untuk diencode ke base64";

const base64EncodedWithSalt = encode(teksAsli);

console.log("Teks Asli:", teksAsli);
console.log("Salt:", salt);
console.log("Base64 Encoded with Salt:", base64EncodedWithSalt);
console.log("Base64 Decoded with Salt:", decode(base64EncodedWithSalt));