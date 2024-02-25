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
            <ul class="list-unstyled mb-0">
                        <li class="p-2 border-bottom">
                          <a href="/api/complaint/updateTiket?id=${element.noTiket}" class="d-flex justify-content-between">
                            <div class="d-flex flex-row">
                              <img src="${element.pic.url}" alt="avatar"
                                class="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60">
                              <div class="pt-1">
                                <p class="fw-bold mb-0">${element.nama}</p>
                                <p class="small text-muted">${element.kendala}</p>
                                <p class="small text-muted mb-2">ID Tiket : ${element.noTiket}</p>
                              </div>
                            </div>
                            <div class="pt-1">
                              <p class="small text-muted mb-1">${dateWib}</p>
                              <span class="badge bg-danger float-end">${lastStatus.status}</span>
                            </div>
                          </a>
                        </li>
                      </ul>
            `
          );


        }
      },
      error: function (error) {
        // console.log(error);
      },
    });
  }