$(document).ready(function () {
  let monthly = $("#InputTanggal").val();
  // GET TABEL
  getTabel(monthly);
  // GET SCORE
  getScore(monthly);
});
function hapus(data, id) {
  // kode yang akan dijalankan saat tombol diklik

    $.ajax({
      url: "/api/monthly/activity?id=" + data,
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
      // console.log(response);
      $("#capaian").text(response.data.capaian);
      $("#kategori").text(response.data.kategori);
      $("#tpp").text(response.data.tpp);
    },
  });
}
function getTabel(newDateValue) {
  // console.log(newDateValue);
  $.ajax({
    url: "/api/monthly?date=" + newDateValue,
    method: "GET",
    success: function (response) {
      var rows = $("tbody > tr");
      rows.remove();
      for (var i = 0; i < response.data.length; i++) {
        var nomor = i+1
        var row = $("<tr>");
        row.append($("<td>" + nomor + "</td>"));
        row.append($("<td>" + response.data[i].tgl + "</td>"));
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
              '<button type="button" class="btn btn-outline-success ml-2"  onclick="edit(' +
              response.data[i].id +
              "," +
              i +
              ')"><i class="fa fa-pencil"></i></button>' +
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

function cetak() {
  let monthly = $("#InputTanggal").val();
  window.open("/api/report?date=" + monthly, "_blank");
}

function submit() {
  let monthly = $("#InputTanggal").val();
// ajax post
  $.ajax({
    url: "/api/monthly",
    method: "POST",
    data: {
      monthly: monthly,
    },
    success: function (response) {
      // console.log(response);
      Swal.fire({
        icon: 'success',
        title: response.message,
        text: response.data,
      })
    },
    error: function (error) {
      // console.log(error);
    },
  });
    return;
}

function edit(data, id) {
  $.ajax({
    url: "/api/monthly/activity?id=" + data,
    method: "GET",
    success: function (response) {
      $("#InputTgl").val(response.data.tgl);
      $("#InputActivities").val(response.data.rak);
      $("#InputVolume").val(response.data.volume);
      $("#InputUnit").val(response.data.satuan);
      $("#InputCompletion").val(response.data.waktu);
      $("#InputId").val(response.data.id);
    },
    error: function (error) {
      // console.log(error);
    },
  });
  $('#exampleModal').modal('show');
  
}

$('#UpdateProgress').submit(function(event) {
  // event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru

  let data = {
    id: $('#InputId').val(),
    tgl: $('#InputTgl').val(),
    rak: $('#InputActivities').val(),
    volume : $('#InputVolume').val(),
    satuan : $('#InputUnit').val(),
    waktu : $('#InputCompletion').val()
  };
  console.log(data);

  $.ajax({
    url: '/api/monthly/activity',
      method: 'POST',
      data: data,
    success: function(response) {
      console.log(response);
      Swal.fire({
          icon: 'success',
          title: 'Succeed',
          text: 'Progress saved successfully',
        })
        $("#InputActivities").val("");
        $("#InputVolume").val("");
        $("#InputCompletion").val("");
          return;
    },
    error: function(error) {
      // console.log(error);
    }
  });
});

