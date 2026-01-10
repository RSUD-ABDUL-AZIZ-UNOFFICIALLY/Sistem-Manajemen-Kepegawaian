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

        let lisTiket = $("#list-tiket");
        lisTiket.empty();
        for (const element of response.data) {

          // convert datetime to wib
          let date = new Date(element.createdAt);
            let dateWib = date.toLocaleString("id-ID", {
              timeZone: "Asia/Jakarta",
            });
          let lastStatus = element.Tikets[element.Tikets.length - 1];
          lisTiket.append(
            `
            <div class="mb-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <a href="/api/complaint/updateTiket?id=${element.noTiket}" class="block p-4 md:p-5 hover:bg-gray-50">
                <!-- Mobile Layout -->
                <div class="md:hidden">
                  <div class="flex items-center gap-3 mb-3">
                    <img 
                      src="${element.pic.url}" 
                      alt="avatar ${element.nama}"
                      class="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow shrink-0"
                    >
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-900 text-base truncate">${element.nama}</h3>
                      <p class="text-xs text-gray-500">Tiket: ${element.noTiket}</p>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mb-3 line-clamp-2">${element.kendala}</p>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">${dateWib}</span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${lastStatus.status === 'Selesai' ? 'bg-green-100 text-green-800' :
              lastStatus.status === 'Proses' ? 'bg-blue-100 text-blue-800' :
                lastStatus.status === 'Tutup' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
            }">
                      ${lastStatus.status}
                    </span>
                  </div>
                </div>

                <!-- Desktop Layout -->
                <div class="hidden md:flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <!-- Left Section: User Info -->
                  <div class="flex items-center gap-4 flex-1">
                    <img 
                      src="${element.pic.url}" 
                      alt="avatar ${element.nama}"
                        class="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-md shrink-0"
                    >
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-gray-900 text-lg truncate">${element.nama}</h3>
                      <p class="text-sm text-gray-600 mt-1 line-clamp-1">${element.kendala}</p>
                      <p class="text-xs text-gray-500 mt-2 font-mono bg-gray-100 px-2 py-1 rounded inline-block">Tiket: ${element.noTiket}</p>
                    </div>
                  </div>

                  <!-- Right Section: Date & Status -->
                  <div class="flex flex-col items-end gap-3 md:border-l md:border-gray-200 md:pl-4">
                    <span class="text-xs text-gray-500 font-medium">${dateWib}</span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${lastStatus.status === 'Selesai' ? 'bg-green-100 text-green-800' :
              lastStatus.status === 'Proses' ? 'bg-blue-100 text-blue-800' :
                lastStatus.status === 'Tutup' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
            }">
                      ${lastStatus.status}
                    </span>
                  </div>
                </div>
              </a>
            </div>
            `
          );


        }
      },
      error: function (error) {
        // console.log(error);
      },
    });
  }