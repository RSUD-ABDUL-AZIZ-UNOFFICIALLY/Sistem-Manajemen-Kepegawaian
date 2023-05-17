const currentLocation = location.href;
const menuItem = document.querySelectorAll(".nav-link");
const menuLength = menuItem.length;
for (let i = 0; i < menuLength; i++) {
  if (menuItem[i].href === currentLocation) {
    menuItem[i].className = "nav-link active";
  }
}
// Membaca semua cookie
const allCookies = document.cookie;

// Memeriksa keberadaan cookie tertentu
function checkCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return true; // Cookie ditemukan
    }
  }
  return false; // Cookie tidak ditemukan
}

// Contoh penggunaan
const cookieName = "status";
const cookieExists = checkCookie(cookieName);
if (cookieExists) {
  // get the cookie value
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("status"))
    .split("=")[1];
  const decodedCookie = decodeURIComponent(cookieValue);

  const decodedData = window.atob(decodedCookie);
  const data = JSON.parse(decodedData);

  const path = window.location.pathname;
  if (path != "/profile") {
    Swal.fire({
      icon: data.status,
      title: data.title,
      text: data.pesan,
      confirmButtonText: "OK",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = data.url;
      }
    });
  }
}
