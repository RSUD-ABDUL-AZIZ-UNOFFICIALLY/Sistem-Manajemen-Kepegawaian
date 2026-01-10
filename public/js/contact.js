$(document).ready(function () {
  findUsers("");
  // Update stats on page load
  updateStats();
});

async function findUsers(nama) {
    $.ajax({
        url: '/api/contact/user?search=' + nama,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data);
          if (data.data.length === 0) {
            $('#layout').empty();
            $('#emptyState').removeClass('hidden');
          } else {
            $('#emptyState').addClass('hidden');
            cardUser(data.data);
          }
        }
    });
}

// onChange cariRekan
$('#cariRekan').on('keyup', function () {
    let nama = $(this).val();
  if (nama.length % 3 == 0 || nama.length === 0) {
    console.log(nama.length);
        $('#layout').empty();
    findUsers(nama);
    }
});

function updateStats() {
  $.ajax({
    url: '/api/contact/user',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      let members = data.data || [];
      let depts = new Set(members.map(m => m.departemen)).size;
      let positions = new Set(members.map(m => m.jab)).size;

      $('#totalMembers').text(members.length);
      $('#totalDepts').text(depts);
      $('#totalPositions').text(positions);
    }
  });
}

async function cardUser(datas) {
    $.each(datas, function (index, item) {
        var cardHtml = `
            <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <!-- Photo Section with Click to Expand -->
                <div class="relative group overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 h-48 md:h-56 cursor-pointer" onclick="openPhotoModal('${item.url}', '${item.nama}')">
                    <img src="${item.url}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="${item.nama}">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div class="bg-white bg-opacity-95 px-4 py-2 rounded-lg text-sm font-semibold text-gray-800 shadow-lg">
                            <i class="fas fa-expand"></i> Lihat Penuh
                        </div>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="p-4 md:p-6">
                    <!-- Name and Department -->
                    <div class="mb-4">
                        <h3 class="text-lg md:text-xl font-bold text-gray-900">${item.nama}</h3>
                        <p class="text-sm text-blue-600 font-semibold mb-2">${item.jab}</p>
                        <div class="flex items-center gap-2">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                <i class="fas fa-building mr-1"></i> ${item.departemen}
                            </span>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-4">
                        <!-- Information Items -->
                        <div class="space-y-3 mb-5">
                            <!-- Jabatan Badge -->
                            <div class="flex items-center gap-3">
                                <div class="shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-briefcase text-purple-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-500 font-medium">Posisi</p>
                                    <p class="text-sm font-semibold text-gray-800 truncate">${item.jab}</p>
                                </div>
                            </div>

                            <!-- NIK -->
                            <div class="flex items-center gap-3">
                                <div class="shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-id-card text-green-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-500 font-medium">NIK</p>
                                    <p class="text-sm font-semibold text-gray-800 font-mono">${item.nik}</p>
                                </div>
                            </div>

                            <!-- NoHp -->
                            <div class="flex items-center gap-3">
                                <div class="shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-phone text-green-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-500 font-medium">No WhatsApp</p>
                                    <p class="text-sm font-semibold text-blue-600 truncate">${item.wa}</p>
                                </div>
                            </div>

                            <!-- Email -->
                            <div class="flex items-center gap-3">
                                <div class="shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-envelope text-orange-600"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-500 font-medium">Email</p>
                                    <p class="text-sm font-semibold text-blue-600 truncate">${item.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact Buttons -->
                    <div class="flex gap-2 mt-6">
                        <a href="https://wa.me/+62${item.wa.replace(/\D/g, '').replace(/^0/, '')}" target="_blank" class="flex-1 bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg">
                            <i class="fab fa-whatsapp"></i> <span class="hidden sm:inline">Chat</span>
                        </a>
                        <a href="mailto:${item.email}" class="flex-1 bg-linear-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold py-2.5 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg">
                            <i class="fas fa-envelope"></i> <span class="hidden sm:inline">Email</span>
                        </a>
                    </div>
                </div>
            </div>
        `;
        $('#layout').append(cardHtml);
    });

  // Add Photo Modal Event Listener
  $(document).on('click', '.photo-modal-close', function () {
    closePhotoModal();
  });
}

// Photo Modal Functions
function openPhotoModal(photoUrl, nama) {
  if ($('#photoModal').length === 0) {
    // Create modal if not exists
    const modalHtml = `
            <div id="photoModal" class="fixed inset-0 bg-black bg-opacity-75 z-50 items-center justify-center p-4" style="display: none;">
                <div class="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden">
                    <!-- Close Button -->
                    <button class="photo-modal-close absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-200 z-10" onclick="closePhotoModal()">
                        <i class="fas fa-times text-gray-800 text-xl"></i>
                    </button>

                    <!-- Image Container -->
                    <div class="bg-black flex items-center justify-center min-h-96">
                        <img id="modalPhotoImg" src="" alt="Photo" class="max-w-full max-h-96 object-contain">
                    </div>

                    <!-- Photo Name -->
                    <div class="p-4 bg-gray-50 border-t border-gray-200">
                        <p class="text-center text-gray-800 font-semibold" id="modalPhotoName"></p>
                    </div>
                </div>
            </div>
        `;
    $('body').append(modalHtml);
  }

  // Set photo and open modal
  $('#modalPhotoImg').attr('src', photoUrl);
  $('#modalPhotoName').text(nama);
  $('#photoModal').css('display', 'flex');
}

function closePhotoModal() {
  $('#photoModal').css('display', 'none');
}
