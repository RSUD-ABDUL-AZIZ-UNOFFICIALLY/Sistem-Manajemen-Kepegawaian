async function profilepic() {
    let a = sessionStorage.getItem("img");
    if (a === null) {
        try {
            const res = await fetch("/api/getPic", { method: "GET" });
            if (!res.ok) throw new Error("Network response was not ok");

            const data = await res.json();

            if (data && data.data && data.data.url) {
                sessionStorage.setItem("img", data.data.url);
                document.getElementById("imgUser").src = data.data.url + "?w=500&h=500";

                let fetchImg = await fetch(data.data.url + "?w=500&h=500");
                let blob = await fetchImg.blob();

                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        sessionStorage.setItem("imgProfile", reader.result); // simpan base64
                        console.log("✅ Gambar tersimpan di localStorage");
                        resolve();
                    };
                    reader.readAsDataURL(blob);
                });
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    } else {
        let dataURL = sessionStorage.getItem("imgProfile");
        if (!dataURL) {
            document.getElementById("imgUser").src = a + "?w=500&h=500";
        } else {
            document.getElementById("imgUser").src = dataURL;
        }
    }
}

function queryselec() {
    let a = location.href;
    // Ganti .nav-link menjadi .menu-link (Sesuai class DaisyUI yang kita buat)
    let e = document.querySelectorAll(".menu-link");

    // Memberikan style active pada link yang sedang diakses
    for (let l = 0; l < e.length; l++) {
        if (e[l].href === a) {
            e[l].classList.add("active", "bg-base-200");
        }
    }

    // Fungsi helper untuk membuka <details> DaisyUI
    const openMenu = (id) => {
        let el = document.getElementById(id);
        if (el) {
            // Karena DaisyUI menggunakan <details>, kita buka dengan atribut 'open'
            let details = el.tagName === 'DETAILS' ? el : el.querySelector('details');
            if (details) details.open = true;
        }
    };

    // Deteksi URL untuk membuka parent menu
    if (a.includes("profile") || a.includes("account") || a.includes("document") || a.includes("salary")) openMenu("documen");
    if (a.includes("cuti") || a.includes("aprovecuti")) openMenu("cuti");
    if (a.includes("daily") || a.includes("approvement") || a.includes("monthly") || a.includes("Report")) openMenu("laporan");
    if (a.includes("helpdeskadmin") || a.includes("contact") || a.includes("kepegawaian")) openMenu("admin");
    if (a.includes("presensi") || a.includes("absen") || a.includes("attendence")) openMenu("absen");
    if (a.includes("simrs") || a.includes("regis")) openMenu("simrs");
}

async function cekElemnet() {
    let a = sessionStorage.getItem("elemnet");
    if (a == null) {
        try {
            // Ganti \$.ajax dengan fetch API
            const response = await fetch("/api/contact/menu", { method: "GET" });
            const data = await response.json();

            a = encode(JSON.stringify(data.data));
            sessionStorage.setItem("elemnet", a);
        } catch (error) {
            console.error("Gagal mengambil menu:", error);
        }
    }
    menuAkses();
    queryselec();
}

function menuAkses() {
    let a = JSON.parse(decode(sessionStorage.getItem("elemnet")));

    // Ambil elemen parent
    const navbar = document.getElementById("navbar");
    const ulCuti = document.getElementById("ul_cuti");
    const ulLaporan = document.getElementById("ul_laporan");
    const ulAbsen = document.getElementById("ul_absen");

    // Jika user adalah bos (bos == 1)
    if (a[0].bos == 1) {
        if (ulCuti) ulCuti.insertAdjacentHTML("beforeend", '<li><a href="/aprovecuti" class="menu-link"><i class="fas fa-bed w-4 text-xs"></i> Persetujuan Cuti</a></li>');
        if (ulLaporan) ulLaporan.insertAdjacentHTML("beforeend", '<li><a href="/approvement" class="menu-link"><i class="fas fa-file-contract w-4 text-xs"></i> Persetujuan Laporan</a></li>');
        if (ulAbsen) ulAbsen.insertAdjacentHTML("beforeend", '<li><a href="/presensi" class="menu-link"><i class="fa-solid fa-person-chalkboard w-4 text-xs"></i> Jadwal Absen</a></li>');
    }

    let t = a[1].menu;

    // Jika memiliki menu admin
    if (t.includes("admin")) {
        const adminMenu = `
            <li id="admin" name="admin">
                <details>
                    <summary class="font-medium"><i class="fas fa-tachometer-alt w-5 text-center"></i> Menu Admin</summary>
                    <ul id="ul_admin" name="ul_admin" class="before:w-[1px]"></ul>
                </details>
            </li>`;
        navbar.insertAdjacentHTML("beforeend", adminMenu);

        const ulAdmin = document.getElementById("ul_admin");

        if (t.includes("cuti") && ulCuti) ulCuti.insertAdjacentHTML("beforeend", '<li><a href="/aprovecuti/admin" class="menu-link"><i class="fas fa-book-bookmark w-4 text-xs"></i> Recapitulasi Cuti</a></li>');
        if (t.includes("contact") && ulAdmin) ulAdmin.insertAdjacentHTML("beforeend", '<li><a href="/contact" class="menu-link"><i class="far fa-address-book w-4 text-xs"></i> Contact</a></li>');
        if (t.includes("helpdesk") && ulAdmin) ulAdmin.insertAdjacentHTML("beforeend", '<li><a href="/helpdeskadmin" class="menu-link"><i class="fas fa-hand-holding-hand w-4 text-xs"></i> Admin Helpdesk</a></li>');
        if (t.includes("kepegawaian") && ulAdmin) ulAdmin.insertAdjacentHTML("beforeend", '<li><a href="/kepegawaian" class="menu-link"><i class="fas fa-user-nurse w-4 text-xs"></i> Admin Kepegawaian</a></li>');
    }

    // Jika memiliki menu simrs
    if (t.includes("simrs")) {
        const simrsMenu = `
            <li id="simrs" name="simrs">
                <details>
                    <summary class="font-medium"><i class="fa-regular fa-hospital w-5 text-center"></i> Menu SIMRS</summary>
                    <ul id="ul_simrs" name="ul_simrs" class="before:w-[1px]"></ul>
                </details>
            </li>`;
        navbar.insertAdjacentHTML("beforeend", simrsMenu);

        const ulSimrs = document.getElementById("ul_simrs");
        if (t.includes("rm") && ulSimrs) ulSimrs.insertAdjacentHTML("beforeend", '<li><a href="/simrs/regis" class="menu-link"><i class="fas fa-hospital-user w-4 text-xs"></i> Registrasi Pasien</a></li>');
    }

    // Jika memiliki adminAttendence
    if (t.includes('adminAttendence') && ulAbsen) {
        ulAbsen.insertAdjacentHTML("beforeend", '<li><a href="/presensi/attendence" class="menu-link"><i class="fa-solid fa-calendar-check w-4 text-xs"></i> Attendence</a></li>');
    }

    // Append menu statis Helpdesk & Logout
    navbar.insertAdjacentHTML("beforeend", `
        <div class="divider my-1"></div>
        <li id="helpdesk" name="helpdesk"><a href="/helpdesk" class="menu-link"><i class="fa-solid fa-bug text-warning w-5 text-center"></i> Helpdesk</a></li>
        <li><a href="#" onclick="performLogout(event)" class="menu-link text-error"><i class="fa-solid fa-right-from-bracket w-5 text-center"></i> Logout</a></li>
    `);
}

// Inisialisasi
profilepic();
cekElemnet();

async function performLogout(event) {
    if (event) event.preventDefault(); // Mencegah pindah URL jika ada href="#"
    // 1. Kirim sinyal ke Service Worker untuk wipe out dynamic cache
    await clearAllCaches();
    // 3. Redirect user ke halaman login
    window.location.href = '/logout';
}

async function clearAllCaches() {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('Semua cache Service Worker berhasil dihapus.');
        } catch (error) {
            console.error('Gagal menghapus cache:', error);
        }
    }
}