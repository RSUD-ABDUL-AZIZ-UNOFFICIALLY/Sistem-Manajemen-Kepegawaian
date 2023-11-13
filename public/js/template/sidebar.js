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

// tambah menu di sidebar id laporan menggunakan jquery