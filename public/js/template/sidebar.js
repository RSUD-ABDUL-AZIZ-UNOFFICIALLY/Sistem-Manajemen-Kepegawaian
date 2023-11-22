
function queryselec(){
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
    if (
      currentLocation.includes("cuti") ||
      currentLocation.includes("aprovecuti")
    ) {
      $("#cuti").addClass("menu-open");
    }
    if (
      currentLocation.includes("daily") ||
      currentLocation.includes("approvement") ||
      currentLocation.includes("monthly") ||
      currentLocation.includes("Report")
    ) {
      $("#laporan").addClass("menu-open");
    }
}

function cekElemnet() {
  let elemnet = sessionStorage.getItem("elemnet");
  if (elemnet == null) {
    $.ajax({
      url: "/api/contact/menu",
      method: "GET",
      success: function (data) {
        console.log(data.data);
        elemnet = encode(JSON.stringify(data.data));
        sessionStorage.setItem("elemnet", elemnet);
      },
    });
  }
  menuAkses();
  queryselec();
}
cekElemnet();


function menuAkses() {
  let elemnet = sessionStorage.getItem("elemnet");
  let parser = JSON.parse(decode(elemnet));
  console.log(parser);
  let listPersetujuanCuti = $(`
    <ul class="nav nav-treeview">
                        <li class="nav-item">
                            <a href="/aprovecuti" class="nav-link">
                                <i class="far fa-solid fa-bed nav-icon"></i>
                                <p>Persetujuan Cuti</p>
                            </a>
                        </li>
                    </ul>
     `);
    let listPersetujuanLPKP = $(`
    <li class="nav-item ">
    <a href="/approvement" class="nav-link">
        <i class="far fa-solid fa-file-contract nav-icon"></i>
        <p>Persetujuan Laporan</p>
    </a>
</li>  `);
let barAdmin = $(`
<li class="nav-item" id="admin" name="admin">
                    <a href="#" class="nav-link">
                        <i class="nav-icon fas fa-tachometer-alt"></i>
                        <p>
                            Menu Admin
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview"id="ul_Admin" name="ul_Admin" >
                    </ul>
                    </li>
`);
  if (parser[0].bos == true) {
    $("#cuti").append(listPersetujuanCuti);
    $("#ul_laporan").append(listPersetujuanLPKP);
  }
  let menu = parser[1].menu;
  console.log($("#navbar"));
    if (menu.includes("admin")) {
        $("#navbar").append(barAdmin);
    }

}
