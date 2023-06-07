$(document).ready(function () {
    getRekap();
    console.log(satusPPPK)
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
              row.append($("<td>" + nomor + "</td>"));
              row.append($("<td>" + response.data[i].nama + "</td>"));
              row.append($("<td>" + response.data[i].nip + "</td>"));
              row.append($("<td>" + response.data[i].jab + "</td>"));
              row.append($("<td>" + response.data[i].capaian + "</td>"));
              row.append($("<td>" + response.data[i].kategori + "</td>"));
              row.append($("<td>" + response.data[i].tpp + "</td>"));
              $("tbody").append(row);
            }
            },
        error: function (error) {
            // console.log(error);
        }
    });

    // $('#tbReport').DataTable();
  }