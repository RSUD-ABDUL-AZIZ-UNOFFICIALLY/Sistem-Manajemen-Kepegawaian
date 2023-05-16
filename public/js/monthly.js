function hapus(data, id) {
  // kode yang akan dijalankan saat tombol diklik

    $.ajax({
      url: "/api/monthly?id=" + data,
      method: "delete",
      success: function (response) {
        console.log(response);
        var rows = $("tbody > tr");
        rows.eq(id).remove();
      },
      error: function (error) {
        // console.log(error);
      },
    });
  let monthly = $("#InputTanggal").val();
  getScore(monthly);
}

function getScore(monthly) {
  $.ajax({
    url: "/api/monthly/score?date=" + monthly,
    method: "GET",
    success: function (response) {
      console.log(response);
      $("#capaian").text(response.data.capaian);
      $("#kategori").text(response.data.kategori);
      $("#tpp").text(response.data.tpp);
    },
  });
}
function getTabel(newDateValue) {
  console.log(newDateValue);
  $.ajax({
    url: "/api/monthly?date=" + newDateValue,
    method: "GET",
    success: function (response) {
      console.log(response);
      var rows = $("tbody > tr");
      rows.remove();
      for (var i = 0; i < response.data.length; i++) {
        var row = $("<tr>");
        row.append($("<td>" + i + "</td>"));
        row.append($("<td>" + response.data[i].day + "</td>"));
        row.append($("<td>" + response.data[i].rak + "</td>"));
        row.append($("<td>" + response.data[i].volume + "</td>"));
        row.append($("<td>" + response.data[i].satuan + "</td>"));
        row.append($("<td>" + response.data[i].waktu + "</td>"));
        row.append(
          $(
            "<td>" +
              '<button type="button" class="btn btn-outline-danger"  onclick="hapus(' +
              response.data[i].id +
              "," +
              i +
              ')"><i class="fa fa-trash"></i></button>' +
              // ' <button type="button" class="btn btn-success toastrDefaultSuccess"><i class="fa fa-edit"></i></button>' +
              "</td>"
          )
        );
        $("tbody").append(row);
      }
    },
    error: function (error) {
      // console.log(error);
    },
  });
}
// Listen for change event on the date input field
$("#InputTanggal").on("change", function () {
  // Get the new value of the input field
  var newDateValue = $(this).val();
  getTabel(newDateValue);
  getScore(newDateValue);
});
$(document).ready(function () {
  let monthly = $("#InputTanggal").val();
  // GET TABEL
  getTabel(monthly);
  // GET SCORE
  getScore(monthly);
});

function cetak() {
  let monthly = $("#InputTanggal").val();
  window.open("/api/report?date=" + monthly, "_blank");
}