// get no_rawat from pathurl
let data = sessionStorage.getItem("px-igd");

//encode no_rawat
let raw_data = JSON.parse(data);

let token = getCookie('token');
let urlSIMRS = decodeURIComponent(getCookie('urlSIMRS'));

$('#no_rawat').val(raw_data.no_rawat);
$('#nm_px').val(raw_data.pasien.nm_pasien);
$('#no_rm').val(raw_data.pasien.no_rkm_medis);
$('#tgl_lahir').val(raw_data.pasien.tgl_lahir);

function getTindakan() {
    $.ajax({
        url: `${urlSIMRS}/api/ralan/pemeriksaan?no_rawat=${raw_data.no_rawat}`,
        type: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function (result) {
            console.log(result.data);
            let tindakan = result.data;
            let html = '';
            let i = 64;
            tindakan.forEach(e => {
                i++;
                let letter = String.fromCharCode(i);
                html += `<a data-toggle="collapse" href="#${letter}" role="button"
                aria-expanded="true" aria-controls="${letter}"
                class="btn btn-primary btn-block py-2 shadow-sm with-chevron mt-2">
                <p class="d-flex align-items-center justify-content-between mb-0 px-3 py-2"><strong>${e.pegawai.nama}</strong>${e.tgl_perawatan} | ${e.jam_rawat}<i class="fa fa-angle-down"></i></p>
                </a>
            <div id="${letter}" class="collapse shadow-sm ">
                <div class="card">
                    <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <strong>Suhu</strong> : ${e.suhu_tubuh} <small>°C</small>
                        </div>
                        <div class="col">
                            <strong>Tensi</strong> : ${e.tensi} <small>mmHg</small>
                        </div>
                        <div class="col">
                            <strong> SpO2 </strong> : ${e.spo2} <small>%</small>
                        </div>
                        <div class="col">
                            <strong> GCS </strong> : ${e.gcs} (${e.kesadaran})
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <strong> Nadi </strong> : ${e.nadi} <small>bpm</small>
                        </div>
                        <div class="col">
                            <strong> BB </strong> : ${e.berat} <small>kg</small>
                        </div>
                        <div class="col">
                            <strong> TB </strong> : ${e.tinggi} <small>cm</small>
                        </div>
                         <div class="col">
                            <strong> LP </strong> : ${e.lingkar_perut} <small>cm</small>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <strong> Respirasi </strong> : ${e.respirasi} <small>/menit</small>
                         </div>
                        <div class="col">
                            <strong> Alergi </strong> : ${e.alergi}
                        </div>
                    </div>
                    <hr>

                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Keluhan</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.keluhan}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Pemeriksaan</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.pemeriksaan}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Rencana tindak lanjut</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.rtl}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Penilaian</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.penilaian}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Instruksi</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.instruksi}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">Evaluasi</label>
                             <textarea disabled class="form-control" id="exampleFormControlTextarea1" rows="3">${e.evaluasi}</textarea>
                        </div>
                    </div>
                </div>
            </div>
            `
            });
            $('#rtt').append(html);
        }
    });
}

getTindakan();