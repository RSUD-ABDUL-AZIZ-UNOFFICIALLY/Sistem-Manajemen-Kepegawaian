$(document).ready(function () {
    findUsers("")
});
async function findUsers(nama) {
    $.ajax({
        url: '/api/contact/user?search=' + nama,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            cardUser(data.data)
        }
    });
}
// onChange cariRekan
$('#cariRekan').on('keyup', function () {
    let nama = $(this).val();
    if (nama.length % 3 == 0) {
        console.log(nama.length)
        $('#layout').empty();
        findUsers(nama)
    }

});
async function cardUser(datas) {

    $.each(datas, function (index, item) {
        var cardHtml = `
              <div class="col">
                <div class="card">
                    <img src="${item.url}" loading="lazy" class="card-img-top" alt="${item.nama}">
                    <div class="card-body">
                       <h5 class="card-title">${item.nama}</h5>
                       <p class="card-text"><small class="text-muted">${item.departemen}</small></p>
                       <div class="row">
                          <div class="col-3">
                            <p class="card-text">Jabatan</p>
                          </div>
                          <div class="col-1">
                            <p class="card-text">:</p>
                          </div>
                          <div class="col-8">
                            <p class="card-text">${item.jab}</p>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-3">
                            <p class="card-text">NIK</p>
                          </div>
                          <div class="col-1">
                            <p class="card-text">:</p>
                          </div>
                          <div class="col-8">
                            <p class="card-text">${item.nik}</p>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-3">
                            <p class="card-text">NoHp</p>
                          </div>
                          <div class="col-1">
                            <p class="card-text">:</p>
                          </div>
                          <div class="col-8">
                            <p class="card-text">${item.wa}</p>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-3">
                            <p class="card-text">Email</p>
                          </div>
                          <div class="col-1">
                            <p class="card-text">:</p>
                          </div>
                          <div class="col-8">
                            <p class="card-text">${item.email}</p>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
            `;
        $('#layout').append(cardHtml);
    });
}