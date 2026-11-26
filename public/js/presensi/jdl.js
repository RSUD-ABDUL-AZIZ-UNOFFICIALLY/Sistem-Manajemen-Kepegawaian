fetch("/api/presensi/jdldns", {
    method: "GET",
})
    .then((response) => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    })
    .then((data) => {
        let typeShift = document.getElementById("typeShift");
        typeShift.innerHTML = data.data.dnsType.type;
        let MasukShift = document.getElementById("MasukShift");
        MasukShift.innerHTML = data.data.dnsType.start_min + " - " + data.data.dnsType.start_max;
        let PulangShift = document.getElementById("PulangShift");
        PulangShift.innerHTML = data.data.dnsType.end_min + " - " + data.data.dnsType.end_max;
    })