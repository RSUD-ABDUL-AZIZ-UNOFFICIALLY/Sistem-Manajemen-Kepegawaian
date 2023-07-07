$(document).ready(function () {
    getRekap();
    $("#satusNonASN").change(function() {
        getRekap();
      });
    $("#satusPPPK").change(function() {
        getRekap();
        });
    $("#satusPNS").change(function() {
        getRekap();
        });
    $("#departemen").change(function() {
        getRekap();
        });
    $("#InputTanggal").change(function() {
        getRekap();
      });
  });

  function getRekap(){
    let monthly = $("#InputTanggal").val();
    let dep = $("#departemen").val();
    let satusPNS = $("#satusPNS").prop("checked");
    let satusPPPK = $("#satusPPPK").prop("checked");
    let satusNonASN = $("#satusNonASN").prop("checked");
    $.ajax({
        url: "/api/monthly/report" + "?date=" + monthly + "&dep=" + dep + "&satusPNS=" + satusPNS + "&satusPPPK=" + satusPPPK + "&satusNonASN=" + satusNonASN,
        method: "GET",
        success: function (response) {
            var rows = $("tbody > tr");
            rows.remove();
            for (var i = 0; i < response.data.length; i++) {
              var nomor = i+1
              var row = $("<tr>"); 
              console.log(response.data[i]);
              if (response.data[i].state == 0) {
                 row = $("<tr class='table-danger'>"); 
              } else if (response.data[i].state == 1) {
                 row = $("<tr class='table-warning'>");
              } else if (response.data[i].state == 2) {
                    // row = $("<tr class='table-teal-400'>");
                    row = $("<tr class='table-success'>");
            }
              row.append($("<td>" + nomor + "</td>"));
              row.append($("<td>" + response.data[i].nama + "</td>"));
              row.append($("<td>" + response.data[i].nip + "</td>"));
              row.append($("<td>" + response.data[i].jab + "</td>"));
              row.append($("<td>" + response.data[i].capaian + "</td>"));
              row.append($("<td>" + response.data[i].kategori + "</td>"));
              row.append($("<td>" + response.data[i].tpp + "</td>"));
              if (response.data[i].state == 0) {
                row.append($("<td>" + "Belum di kirim" + "</td>"));
                } else if (response.data[i].state == 1) {
                row.append($("<td>" + "Belum Disetujui" + "</td>"));
                } else if (response.data[i].state == 2) {
                row.append($("<td>" + "Disetujui " + response.data[i].bos.nama + "</td>"));
                }
              $("tbody").append(row);
            }
            },
        error: function (error) {
            // console.log(error);
        }
    });

    // $('#tbReport').DataTable();
  }