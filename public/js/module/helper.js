function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (!localStorage.getItem("visite")) {
    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4').then(FingerprintJS => FingerprintJS.load())
    // // Get the visitor identifier when you need it.
    fpPromise
        .then(fp => fp.get())
        .then(result =>
            localStorage.setItem("visite", result.visitorId),
            document.cookie = `visite=result.visitorId;`
        );
} else {
    document.cookie = "visite=" + localStorage.getItem("visite") + ";";
}




async function fetchData() {
    try {
        let dataSession = sessionStorage.getItem("session");
        if (!dataSession) {
            let response = await fetch('/api/session');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            sessionStorage.setItem("session", "true");
        }


        console.log("Data berhasil diambil:", data);
    } catch (error) {
        console.error("Gagal mengambil data:", error.message);
    }
}

fetchData();
