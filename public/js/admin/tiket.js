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
                  let status = response.data[i].status;
                  let statusColor = status === 'Selesai' ? 'bg-green-100 text-green-800' :
                    status === 'Proses' ? 'bg-blue-100 text-blue-800' :
                      status === 'Tutup' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800';

                  // Desktop Table Row
                  let row = $("<tr class='border-b border-gray-300 hover:bg-gray-50'>");
                  row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + nomor + "</td>"));
                  row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + dateWib + "</td>"));
                  row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + response.data[i].nama + "</td>"));
                  row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + response.data[i].keteranagn + "</td>"));
                  row.append($("<td class='border border-gray-300 px-4 py-3 text-sm'><span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold " + statusColor + "'>" + status + "</span></td>"));
                  $("#table-desktop").append(row);

                  // Mobile Card
                  let card = $(
                    `<div class='mb-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
                        <div class='flex justify-between items-start mb-3'>
                          <div>
                            <p class='text-xs text-gray-500 font-medium'>Tiket #` + nomor + `</p>
                            <h4 class='text-sm font-bold text-gray-900'>` + response.data[i].nama + `</h4>
                          </div>
                          <span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ` + statusColor + `'>` + status + `</span>
                        </div>
                        <p class='text-sm text-gray-600 mb-2 line-clamp-2'>` + response.data[i].keteranagn + `</p>
                        <p class='text-xs text-gray-500'>` + dateWib + `</p>
                      </div>`
                  );
                  $("#cards-mobile").append(card);
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
        let status = response.data.status;
        let statusColor = status === 'Selesai' ? 'bg-green-100 text-green-800' :
          status === 'Proses' ? 'bg-blue-100 text-blue-800' :
            status === 'Tutup' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800';
        let rows = $("#table-desktop > tr");
        let panjang = rows.length + 1;

        // Desktop Table Row
        let row = $("<tr class='border-b border-gray-300 hover:bg-gray-50'>");
        row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + panjang + "</td>"));
        row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + dateWib + "</td>"));
        row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + response.data.nama + "</td>"));
        row.append($("<td class='border border-gray-300 px-4 py-3 text-sm text-gray-800'>" + response.data.keteranagn + "</td>"));
        row.append($("<td class='border border-gray-300 px-4 py-3 text-sm'><span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold " + statusColor + "'>" + status + "</span></td>"));
        $("#table-desktop").append(row);

        // Mobile Card
        let card = $(
          `<div class='mb-4 bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
            <div class='flex justify-between items-start mb-3'>
              <div>
                <p class='text-xs text-gray-500 font-medium'>Tiket #` + panjang + `</p>
                <h4 class='text-sm font-bold text-gray-900'>` + response.data.nama + `</h4>
              </div>
              <span class='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ` + statusColor + `'>` + status + `</span>
            </div>
            <p class='text-sm text-gray-600 mb-2 line-clamp-2'>` + response.data.keteranagn + `</p>
            <p class='text-xs text-gray-500'>` + dateWib + `</p>
          </div>`
        );
        $("#cards-mobile").append(card);
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