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

$('#lapor').submit(function(event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru
    let data = {
        kendala: $('#kendala').val(),
        dep: $('#departemen').val(),
        topic: $('#topic').val(),
    };
    $.ajax({
        url: '/api/complaint',
        method: 'POST',
        data: data,
        success: function(response) {
        console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Succeed',
                text: 'Laporan berhasil di sampaikan',
                showConfirmButton: false,
                timer: 2000
            })
            let date = new Date(response.data.createdAt);
            let dateWib = date.toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            });

            let rows = $("tbody > tr");
            let row = $("<tr>");
            row.append($("<td>" + rows.length + "</td>"));
            row.append($("<td>" + dateWib + "</td>"));
            row.append($("<td>" + response.data.noTiket + "</td>"));
            row.append($("<td>" + response.data.kendala + "</td>"));
            row.append($("<td>" + response.data.topic + "</td>"));
            row.append(
                $(
                  "<td>" +
                    '<button type="button" class="btn btn-outline-info"  onclick=lihat("'+ response.data.noTiket +'")><i class="fa fa-eye"></i> Lihat Status </button>' +
                    "</td>" 
                )
              );
            $("tbody").append(row);
            $("#kendala").val("");
            return;
        },
        error: function(error) {
            // console.log(error);
        }
    });
});

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
      url: "/api/complaint?date=" + newDateValue,
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
          let row = $("<tr>");
          row.append($("<td>" + nomor + "</td>"));
          row.append($("<td>" + dateWib + "</td>"));
          row.append($("<td>" + response.data[i].noTiket + "</td>"));
          row.append($("<td>" + response.data[i].kendala + "</td>"));
          row.append($("<td>" + response.data[i].topic + "</td>"));
          row.append(
            $(
              "<td>" +
                '<button type="button" class="btn btn-outline-info"  onclick=lihat("'+ response.data[i].noTiket +'")><i class="fa fa-eye"></i> Lihat Status </button>' +
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

  function lihat(noTiket) {
    console.log(noTiket);
    $.ajax({
        url: "/api/complaint/detail?tiket="+noTiket,
        method: "GET",
        success: function (response) {
            console.log(response);
            $('#statusModalLabel').html('Lihat Tiket ' + noTiket);
            try {
                $('#list-group').empty();
                listTiket(response.data);
            } catch (error) {
                console.log(error);
                $('#list-group').empty();
            }
        },
        error: function (error) {
            console.log(error);
        },
    });

    $('#statusModal').modal('show');
  }
  function listTiket(data) {
    console.log(data);
    let litst = $('#list-group');
    litst.empty();
    data.forEach((element) => {
        let date = new Date(element.createdAt);
            let dateWib = date.toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            });
        litst.append(
            '<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-start" id="' + element.id + '"' + '>' +
            '<div class="ms-2 me-auto">' +
            '<div class="fw-bold">' + element.keteranagn + '</div>' +
            element.nama + 
            '<br>' +
            dateWib +
            '</div>' +
            '<button type="button" class="btn btn-danger btn-sm" '+
            ')">'+element.status+'</i></button>' +
            "</li>"
        );
    }
    );
  }