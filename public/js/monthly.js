function hapus(data, id) {
  // kode yang akan dijalankan saat tombol diklik
  console.log('Data yang dikirimkan: ' + data);
  
  $.ajax({
    url: '/api/monthly?id=' + data,
      method: 'delete',
    success: function(response) {
      console.log(response);
      var rows = $("tbody > tr");
      rows.eq(id).remove();
    },
    error: function(error) {
      // console.log(error);
    }
  });
  // remove row from table by index id
  // var total = 0;
  // var tdNilai = document.querySelectorAll("#tabel-data td:nth-child(6)");
  // for (var i = 0; i < tdNilai.length; i++) {
  //   total += parseInt(tdNilai[i].textContent);
  //   console.log(tdNilai[i].textContent);
  // }
  
  // Menampilkan total pada kolom "Total"
  // var kolomTotal = document.querySelector("#total-nilai");
  // kolomTotal.textContent = total;
}
$(document).ready(function () {
  let monthly = $("#InputTanggal").val();
  console.log(monthly);

  $.ajax({
    url: '/api/monthly?date=' + monthly,
      method: 'GET',
    success: function(response) {
      console.log(response);
      var rows = $("tbody > tr");
      rows.remove();
      for (var i = 0; i < response.data.length; i++) {
        var row = $("<tr>");
        row.append($("<td>" + i + "</td>"));
        row.append($("<td>" + response.data[i].tgl + "</td>"));
        row.append($("<td>" + response.data[i].rak + "</td>"));
        row.append($("<td>" + response.data[i].volume + "</td>"));
        row.append($("<td>" + response.data[i].satuan + "</td>"));
        row.append($("<td>" + response.data[i].waktu + "</td>"));
        row.append($("<td>" + '<button type="button" class="btn btn-outline-danger"  onclick="hapus('+response.data[i].id+','+ i+')"><i class="fa fa-trash"></i></button>'+' <button type="button" class="btn btn-success toastrDefaultSuccess"><i class="fa fa-edit"></i></button>' + "</td>"));       
        $("tbody").append(row);
      }
    },
    error: function(error) {
      // console.log(error);
    }
  });
  // Listen for change event on the date input field
  $("#InputTanggal").on("change", function () {
    // Get the new value of the input field
    var newDateValue = $(this).val();
    $.ajax({
      url: '/api/monthly?date=' + newDateValue,
        method: 'GET',
      success: function(response) {
        console.log(response);
        var rows = $("tbody > tr");
        rows.remove();
        for (var i = 0; i < response.data.length; i++) {
          var row = $("<tr>");
          row.append($("<td>" + i + "</td>"));
          row.append($("<td>" + response.data[i].tgl + "</td>"));
          row.append($("<td>" + response.data[i].rak + "</td>"));
          row.append($("<td>" + response.data[i].volume + "</td>"));
          row.append($("<td>" + response.data[i].satuan + "</td>"));
          row.append($("<td>" + response.data[i].waktu + "</td>"));
          row.append($("<td>" + '<button type="button" class="btn btn-outline-danger"><i class="fa fa-trash"></i></button>'+' <button type="button" class="btn btn-success" data-toggle="modal" data-target="#modal-default"><i class="fa fa-pencil"></i></button>' + "</td>"));
          $("tbody").append(row);
        }
        
      },
      error: function(error) {
        // console.log(error);
      }
    });
    
    // $('#myModal').on('shown.bs.modal', function () {
    //   $('#myInput').trigger('focus')
    // })
  });
});
