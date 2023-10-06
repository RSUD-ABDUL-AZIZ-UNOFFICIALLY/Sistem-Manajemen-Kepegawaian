const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
// crate date format yyyy-mm
if (month < 10) {
    month = "0" + month;
}
if (day < 10) {
    day = "0" + day;
}
$("#riwayatDate").val(`${year}-${month}`);

$(document).ready(function () {
    let monthly = $("#riwayatDate").val();
    // GET TABEL
    getTabel(monthly);
  });

$("#riwayatDate").on("change", function () {
    // Get the new value of the input field
    var newDateValue = $(this).val();
    getTabel(newDateValue);
});
function getTabel(newDateValue) {

    $.ajax({
      url: "/api/complaint/all?date=" + newDateValue,
      method: "GET",
      success: function (response) {
        let rows = $("tbody > tr");
        rows.remove();
        for (let i = 0; i < response.data.length; i++) {
          let nomor = i+1
          // convert datetime to wib
            let date = new Date(response.data[i].createdAt);
            let dateWib = date.toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            });
            let lastStatus = response.data[i].Tikets[response.data[i].Tikets.length - 1]
          let row = $("<tr>");
          row.append($("<td>" + nomor + "</td>"));
          row.append($("<td>" + dateWib + "</td>"));
          row.append($("<td>" + response.data[i].noTiket + "</td>"));
          row.append($("<td>" + response.data[i].kendala + "</td>"));
          row.append($("<td>" + response.data[i].topic + "</td>"));
          row.append($("<td>" + response.data[i].departemen.bidang + "</td>"));
          row.append($("<td>" + lastStatus.status + "</td>"));
          row.append(
            $(
              "<td>" +
                '<a type="button" href="/api/complaint/updateTiket?id='+ response.data[i].noTiket +'" class="btn btn-outline-info"  ><i class="fa fa-eye"></i> Lihat Status </a>' +
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