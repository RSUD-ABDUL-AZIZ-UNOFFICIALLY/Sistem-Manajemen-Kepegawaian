// get no_rawat from pathurl
let data = sessionStorage.getItem("px-igd");
console.log(data);

//encode no_rawat
let raw_data = JSON.parse(data);
$('#no_rawat').val(raw_data.no_rawat);
$('#nm_px').val(raw_data.pasien.nm_pasien);
$('#no_rm').val(raw_data.pasien.no_rkm_medis);
$('#tgl_lahir').val(raw_data.pasien.tgl_lahir);
