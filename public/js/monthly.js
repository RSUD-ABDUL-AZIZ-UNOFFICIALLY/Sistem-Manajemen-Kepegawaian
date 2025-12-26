$(document).ready(function () {
  let monthly = $("#InputTanggal").val();
  // GET TABEL
  getTabel(monthly);
  // GET SCORE
  getScore(monthly);
});
function hapus(data, id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
       $.ajax({
      url: "/api/monthly/activity?id=" + data,
      method: "delete",
      success: function (response) {
        // let rows = $("tbody > tr");
        // rows.eq(id).remove();
        getTabel(monthly);
        getScore(monthly);
      },
      error: function (error) {
        // console.log(error);
      },
    });
    }
  })
   
  let monthly = $("#InputTanggal").val();
  getScore(monthly);
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return null; // or handle the error as needed
  }
}
async function badgeStatus(monthly) {
  let status = await fetchData("/api/v2/monthly?date=" + monthly);
  let stt = document.getElementById('status');
  console.log(status);
  stt.innerHTML = status.data.status;
  stt.className = 'badge rounded-pill ml-2 ' + status.data.className;
  return true

}
async function getScore(monthly) {
  let cekPeriode = await fetchData("/api/monthly/periode?date=" + monthly);
  let status = await fetchData("/api/v2/monthly?date=" + monthly);
  badgeStatus(monthly);
  if (cekPeriode === null) {
    let score = await fetchData("/api/monthly/score?date=" + monthly);
    if (score) {
      // $("#capaian").text(score.data.capaian);
      // $("#kategori").text(score.data.kategori);
      // $("#tpp").text(score.data.tpp);
      let summary = document.getElementById('summary');
      return summary.innerHTML = `
    <div class="row">
      <div class="col-sm-6">
        Pencapaian Kinerja Bulanan
      </div>
      <div class="col-sm-5">
        Menit<span id="capaian" class="float-left">${score.data.capaian}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        Kategori
      </div>
      <div class="col-sm-5">
        <span id="kategori" class="float-left">${score.data.kategori}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        Tambahan Penghasilan Pegawai
      </div>
      <div class="col-sm-5">
        <span id="tpp" class="float-left">${score.data.tpp}</span>
      </div>
    </div>
    <hr>
          <div class="row no-print">
        <div class="col-12">
          <button type="button" class="btn btn-success float-right" onclick="submit()">
            <i class="fa-regular fa-paper-plane"></i> Kirim
          </button>
          <button type="button" class="btn btn-primary float-right" style="margin-right: 5px" onclick="cetak()">
            <i class="fas fa-print"></i> Mencetak
          </button>
        </div>
      </div>
    `;
    } else {
      console.error("Failed to fetch score data.");
    }
  }
  else {
    console.log(cekPeriode);
    let summary = document.getElementById('summary');
    return summary.innerHTML = `
    <div class="row">
      <div class="col-sm-6">
        Capaian Kinerja / Jumlah WK yang sudah divalidasi dalam 1 bulan
      </div>
      <div class="col-sm-5">
        <span class="float-left">${cekPeriode.data.capaian} Menit</span>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-sm-6">
        Jumlah HK dalam 1 bulan
      </div>
      <div class="col-sm-5">
        <span class="float-left">${cekPeriode.data.days} HK</span>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-sm-6">
        Jumlah WK pelaporan aktivitas dalam 1 hari
      </div>
      <div class="col-sm-5">
        <span class="float-left">${cekPeriode.data.wk}</span>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-sm-6">
        Persentasi Produktivitas Kerja
      </div>
      <div class="col-sm-5">
        <span class="float-left">${cekPeriode.data.tpp} %</span>
      </div>
    </div>
    <hr>
    <div class="row no-print">
        <div class="col-12">
          <button type="button" class="btn btn-success float-right" onclick="submit2()">
            <i class="fa-regular fa-paper-plane"></i> Kirim
          </button>
          <button type="button" class="btn btn-primary float-right" style="margin-right: 5px" onclick="cetak()">
            <i class="fas fa-print"></i> Mencetak
          </button>
        </div>
      </div>
      <hr>
    `;
  }


}
function getTabel(newDateValue) {

  $.ajax({
    url: "/api/monthly?date=" + newDateValue,
    method: "GET",
    success: function (response) {
      let rows = $("tbody > tr");
      rows.remove();
      for (let i = 0; i < response.data.length; i++) {
        let nomor = i + 1
        let row = $("<tr>");
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
  let newDateValue = $(this).val();
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
      Swal.fire({
        icon: 'success',
        title: response.message,
        text: response.data,
      })
    },
    error: function (error) {
      console.log(error);
    },
  });
    return;
}
function submit2() {
  let monthly = $("#InputTanggal").val();
  // ajax post
  $.ajax({
    url: "/api/v2/monthly",
    method: "POST",
    data: {
      monthly: monthly,
    },
    success: function (response) {
      Swal.fire({
        icon: 'success',
        title: response.message,
        text: response.data,
      })
      badgeStatus(monthly);
    },
    error: function (error) {
      console.log(error);
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
      console.log(error);
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
      Swal.fire({
          icon: 'success',
          title: 'Succeed',
          text: 'Progres berhasil dikirim ke atasan anda',
        })
        $("#InputActivities").val("");
        $("#InputVolume").val("");
        $("#InputCompletion").val("");
          return;
    },
    error: function(error) {
      console.log(error);
    }
  });
});

