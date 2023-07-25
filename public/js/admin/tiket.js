let id = $("#id").html();
lihat(id);
function lihat(noTiket) {
    $.ajax({
        url: "/api/complaint/detail?tiket="+noTiket,
        method: "GET",
        success: function (response) {
            try {
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
                    row.append($("<td>" + response.data[i].nama + "</td>"));
                    row.append($("<td>" + response.data[i].keteranagn + "</td>"));
                    row.append($("<td>" + response.data[i].status + "</td>"));
                    $("tbody").append(row);
                  }
                  let selesai = response.data.find(element => element.status == 'Selesai');
                  let tutup = response.data.find(element => element.status == 'Tutup');
                  if (selesai != undefined || tutup != undefined){
                    let tombol = $('#fsubmit');
                    tombol.attr('disabled', true);
                  }
            } catch (error) {
                console.log(error);
            }
        },
        error: function (error) {
            console.log(error);
        },
    });

  }

  $('#updateTiket').submit(function(event) {
    event.preventDefault(); // Mencegah form untuk melakukan submit pada halaman baru

    let data = {
        noTiket: id,
        keteranagn: $('#notes').val(),
        status: $('#status').val()
    };
    if ($('#notes').val() == "" || $('#status').val() == "") {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Kolom tidak boleh kosong',
            })  
    }
    if ($('#status').val() == "Selesai" || $('#status').val() == "Tutup") {
        let tombol = $('#fsubmit');
        tombol.attr('disabled', true);
    }
    
    $.ajax({
      url: '/api/complaint/status',
        method: 'POST',
        data: data,
      success: function(response) {
        console.log(response);
        let date = new Date(response.data.createdAt);
        let dateWib = date.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        });
        let rows = $("tbody > tr");
        let panjang = rows.length + 1;
        let row = $("<tr>");
                    row.append($("<td>" + panjang + "</td>"));
                    row.append($("<td>" + dateWib + "</td>"));
                    row.append($("<td>" + response.data.nama + "</td>"));
                    row.append($("<td>" + response.data.keteranagn + "</td>"));
                    row.append($("<td>" + response.data.status + "</td>"));
                    $("tbody").append(row);
        Swal.fire({
            icon: 'success',
            title: 'Succeed',
          text: 'Kegiatan berhasil disimpan',
            showConfirmButton: false,
          timer: 2000
          })
          $("#notes").val("");
            return;
      },
      error: function(error) {
        // console.log(error);
      }
    });
  });