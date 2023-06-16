$(document).ready(function () {
  let periode = $("#InputTanggal").val();
  console.log(periode);
  // GET TABEL
  getTabel(periode);
});
function getTabel(periode) {
  $.ajax({
    url: "/api/monthly/approvement?periode=" + periode,
    method: "GET",
    success: function (response) {
      var rows = $("tbody > tr");
      for (var i = 0; i < response.data.length; i++) {
        var nomor = i + 1;
        if (response.data[i].state == 0) {
          var row = $("<tr class='table-danger'>");
        } else {
          if (response.data[i].aprovement == null) {
            var row = $("<tr class='table-warning'>");
          } else {
            var row = $("<tr class='table-success'>");
          }
        }
        row.append($("<td>" + nomor + "</td>"));
        row.append($("<td>" + response.data[i].nama + "</td>"));
        row.append($("<td>" + response.data[i].capaian + "</td>"));
        row.append($("<td>" + response.data[i].kategori + "</td>"));
        row.append($("<td>" + response.data[i].status + "</td>"));
        if (response.data[i].state == 0) {
          row.append($("<td>" + "Belum di Upload" + "</td>"));
        } else {
          if (response.data[i].aprovement == null) {
            // row.append($("<td>" + "Belum di Approve" + "</td>"));
            row.append($("<td>" + '<button type="button" class="btn btn-info"><i class="far fa-solid fa-file-signature nav-icon"></i>Menyetujui</button>' + "</td>"));
          } else {
            row.append($("<td>" + '<button type="button" class="btn btn-info" onclick="preview('+ response.data[i].nik +')"><i class="fa-solid fa-signature"></i>Telah disetujui</button>' + "</td>"));
          }
        }

        $("tbody").append(row);
      }
    },
  });
}

function preview(nik){
    let periode = $("#InputTanggal").val();
    console.log(periode);
    let data = JSON.stringify({    
        periode: periode,
        nik: nik,
    });
    console.log(data);
    let queryString = btoa(data);
    console.log(queryString);
    window.location.href = "/api/report/preview?periode=" + queryString;
    console.log(nik);
}
