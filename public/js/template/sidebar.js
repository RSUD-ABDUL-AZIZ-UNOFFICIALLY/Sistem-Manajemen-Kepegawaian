async function profilepic() {
    let a = sessionStorage.getItem("img");
    null == a ? await $.ajax({
        url: "/api/getPic",
        method: "GET",
        success: function (a) {
            a && (sessionStorage.setItem("img", a.data.url), $("#imgUser").attr("src", a.data.url));
        },
        error: function (a) {
            console.log(a);
        }
    }) : $("#imgUser").attr("src", a);
}

function queryselec() {
    let a = location.href;
    let e = document.querySelectorAll(".nav-link");
    let n = e.length;
    for (let l = 0; l < n; l++) e[l].href === a && (e[l].className = "nav-link active");
    (a.includes("profile") || a.includes("account")) && $("#documen").addClass("menu-open"),
        (a.includes("cuti") || a.includes("aprovecuti")) && $("#cuti").addClass("menu-open"),
        (a.includes("daily") || a.includes("approvement") || a.includes("monthly") || a.includes("Report")) && $("#laporan").addClass("menu-open"),
        (a.includes("helpdeskadmin") || a.includes("contact")) && $("#admin").addClass("menu-open"),
        (a.includes("presensi") || a.includes("absen")) && $("#absen").addClass("menu-open"),
        (a.includes("simrs")) && $("#simrs").addClass("menu-open");
}

async function cekElemnet() {
    let a = sessionStorage.getItem("elemnet");
    null == a && await $.ajax({
        url: "/api/contact/menu",
        method: "GET",
        success: function (e) {
            a = encode(JSON.stringify(e.data)), sessionStorage.setItem("elemnet", a);
        }
    }), menuAkses(), queryselec();
}

function menuAkses() {
    let a = JSON.parse(decode(sessionStorage.getItem("elemnet")));
    let e = $('<ul class="nav nav-treeview" id="ul_cuti" name="ul_cuti"><li class="nav-item"><a href="/aprovecuti" class="nav-link"><i class="far fa-solid fa-bed nav-icon"></i><p>Persetujuan Cuti</p></a></li></ul>');
    let n = $('<li class="nav-item "><a href="/approvement" class="nav-link"><i class="far fa-solid fa-file-contract nav-icon"></i><p>Persetujuan Laporan</p></a></li>');
    let l = $('<li class="nav-item" id="admin" name="admin"><a href="#" class="nav-link"><i class="nav-icon fas fa-tachometer-alt"></i><p>Menu Admin<i class="right fas fa-angle-left"></i></p></a><ul class="nav nav-treeview"id="ul_admin" name="ul_admin" ></ul></li>');
    let i = $('<li class="nav-item"><a href="/contact" class="nav-link"><i class="far fa-regular fa-address-book nav-icon"></i><p>contact</p></a></li>');
    let s = $('<li class="nav-item">  <a href="/helpdeskadmin" class="nav-link"><i class="far fa-solid fa-hand-holding-hand nav-icon"></i><p>Admin Helpdesk</p></a></li>');
    let v = $('<li class="nav-item">  <a href="/kepegawaian" class="nav-link"><i class="far fa-solid fa-user-nurse nav-icon"></i><p>Admin kepegawaian</p></a></li>');
    let u = $('<li class="nav-item">  <a href="/aprovecuti/admin" class="nav-link"><i class="far fa-solid fa-book-bookmark nav-icon"></i><p>Recapitulasi Cuti</p></a></li>');
    let present = $('<li class="nav-item"><a href="/presensi" class="nav-link"><i class="fa-solid fa-person-chalkboard nav-icon"></i><p>Jadwal Absen</p></a></li>');
    let simrs = $('<li class="nav-item" id="simrs" name="simrs"><a href="#" class="nav-link"><i class="nav-icon fa-regular fa-hospital"></i><p>Menu simrs<i class="right fas fa-angle-left"></i></p></a><ul class="nav nav-treeview"id="ul_simrs" name="ul_simrs" ></ul></li>');
    let rm = $('<li class="nav-item">  <a href="/simrs/regis" class="nav-link"><i class="far fa-solid fa-hospital-user nav-icon"></i><p>Registrasi Pasien</p></a></li>');
    1 == a[0].bos && ($("#cuti").append(e),
        $("#ul_laporan").append(n)),
        $("#ul_absen").append(present);
    let t = a[1].menu;
    console.log(t),
    t.includes("admin") && ($("#navbar").append(l),
        t.includes("cuti") && $("#ul_cuti").append(u),
        t.includes("contact") && $("#ul_admin").append(i),
            t.includes("helpdesk") && $("#ul_admin").append(s),
            t.includes("kepegawaian") && $("#ul_admin").append(v)),

        t.includes("simrs") && $("#navbar").append(simrs),
        t.includes("rm") && $("#ul_simrs").append(rm),
        $("#navbar").append('<li class="nav-item" id="helpdesk" name="helpdesk">    <a href="/helpdesk" class="nav-link">        <i class="fa-solid fa-bug text-warning nav-icon"></i>        <p class="text">Helpdesk</p>    </a></li>'),
        $("#navbar").append('<li class="nav-item">    <a href="/logout" class="nav-link">        <i class="fa-solid fa-right-from-bracket text-danger nav-icon"></i>        <p class="text">Logout</p>    </a></li>    ');
}

profilepic(), cekElemnet();