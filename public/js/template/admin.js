
const cookieName = "status";
const cookieExists = getCookie(cookieName);
console.log(cookieExists);
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
const urlParams = window.location.protocol + "//" + window.location.host + "" + window.location.pathname + window.location.search

async function tracker() {
  let bat = '';
  try {
    bat = await navigator.getBattery();
  } catch (err) {
    console.log(err);
  }
  // get parameter from url


  let ip = await getIP();
  $.ajax({
    url: "/api/tracker",
    method: "POST",
    data: {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      os: navigator.platform,
      ip: ip.ip,
      as: ip.asn,
      isp: ip.org,
      city: ip.city,
      batteryLevel: bat.level,
      visite: localStorage.getItem("visite"),
      state: urlParams,
    },
    success: function (data) {

    }
  });
}

function getIP() {
  return $.ajax({
    url: "https://ipapi.co/json",
    method: "GET",
    success: function (data) {
    }
  });
}

console.log(window.location.pathname);
const cookieTracker = getCookie('tracker');
if (!cookieTracker) {
  // document.cookie = "tracker=true; max-age=20; path=/";
  document.cookie = `tracker=true; max-age=15; path=${window.location.pathname}`;
  tracker();
}

const cookieToken = getCookie('profile');
if (cookieToken) {
  let cookieTokenValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("profile"))
    .split("=")[1];
  let parser = decodeURIComponent(cookieTokenValue);
  let decodedData = window.atob(parser);
  let data = JSON.parse(decodedData);
  imgUser = document.getElementById("imgUser");
  imgUser.src = data.url;
}


// function setOnline() {
//   let id = localStorage.getItem("dataIDUser");
//   let name = localStorage.getItem("dataIDname");
//   return $.ajax({
//     url: "https://cdn.spairum.biz.id/api/ls/update/lpkp?id=" + id + "&name=" + name,
//     method: "GET",
//   });
// }
// setOnline();
// setInterval(setOnline, 5000);

