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
      idgrub: $('#grubtiket').val()
    };
    $.ajax({
        url: '/api/complaint',
        method: 'POST',
        data: data,
        success: function(response) {
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
          Swal.fire({
            icon: 'error',
            title: error.responseJSON.message,
            text: error.responseJSON.data,
            showConfirmButton: false,
            timer: 2000
          })

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
    $.ajax({
        url: "/api/complaint/detail?tiket="+noTiket,
        method: "GET",
        success: function (response) {
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
    let action = $('#action');
    action.empty();
    if (data.length == 1){
      action.append(
        '<button type="button" class="btn btn-outline-danger m-1 float-right" onclick="tutupTiket(\''+ data[0].noTiket +'\')"><i class="fa fa-times"></i> Tutup Tiket</button>' 
      );
    }
    action.append(
      // set btn di sebelah kiri footer modal
      '<button type="button" class="btn btn-outline-success float-right m-1" onclick="selesaiTiket(\''+ data[0].noTiket +'\')"><i class="fa fa-check"></i> Selesai Tiket</button>' 
    );
    // find status == selesai
    let selesai = data.find(element => element.status == 'Selesai');
    let tutup = data.find(element => element.status == 'Tutup');
    if (selesai != undefined || tutup != undefined){
      action.empty();
    }
  }

  function selesaiTiket(noTiket){
    $.ajax({
      url: "/api/complaint/status",
      method: "POST",
      data: {
        noTiket: noTiket,
        keteranagn: 'Masalah telah di selesaikan',
        status: 'Selesai'
      },
      success: function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Succeed',
          text: 'Tiket berhasil di selesaikan',
          showConfirmButton: false,
          timer: 2000
        })
        $('#statusModal').modal('hide');
        return;
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  function tutupTiket(noTiket){
    $.ajax({
      url: "/api/complaint/status",
      method: "POST",
      data: {
        noTiket: noTiket,
        keteranagn: 'Masalah di batalkan',
        status: 'Tutup'
      },
      success: function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Succeed',
          text: 'Tiket berhasil di tutup',
          showConfirmButton: false,
          timer: 2000
        })
        $('#statusModal').modal('hide');
        return;
      },
      error: function (error) {
        console.log(error);
      },
    });
  }