// ==========================================
// DAISYUI + VANILLA JS REFACTOR
// ==========================================

async function lihat() {
    try {
        const response = await fetch("/api/template", { method: "GET" });
        const result = await response.json();

        // Update Title Modal
        document.getElementById("templateModalLabel").innerHTML = "Lihat Template " + result.data.nama;

        // Bersihkan list sebelum render ulang
        const listGroup = document.getElementById("list-group");
        listGroup.innerHTML = "";

        // Render List jika ada
        if (result.data && result.data.template) {
            listTemplate(result.data.template);
        }

        // Tampilkan Modal DaisyUI (menggunakan method native .showModal())
        document.getElementById("templateModal").showModal();

    } catch (error) {
        console.error("Gagal load template:", error);
        document.getElementById("list-group").innerHTML = "";
    }
}

function listTemplate(data) {
    const listGroup = document.getElementById("list-group");
    listGroup.innerHTML = ""; // Kosongkan UL

    let html = "";
    data.forEach(element => {
        // Menggunakan Tailwind classes untuk layout Card List
        // Ditambahkan event.stopPropagation() pada tombol hapus agar tidak memicu preview() saat diklik
        html += `
        <li id="tpl-${element.id}" 
            class="flex justify-between items-center bg-base-100 p-3 rounded-lg border border-base-200 hover:border-primary cursor-pointer transition-all shadow-sm group" 
            onclick="preview('${element.id}')">
            
            <div class="flex-1">
                <div class="font-bold text-base-content">${element.kegiatan}</div>
                <div class="text-sm text-base-content/70">${element.satuan}</div>
            </div>
            
            <button type="button" class="btn btn-error btn-sm btn-square opacity-80 hover:opacity-100 transition-opacity" 
                onclick="hapus(event, '${element.id}')" title="Hapus Template">
                <i class="fa-regular fa-trash-can text-white"></i>
            </button>
        </li>`;
    });

    listGroup.innerHTML = html;
}

async function hapus(event, dataId) {
    // PENTING: Mencegah event klik "bocor" ke tag <li> (yang memicu fungsi preview)
    event.stopPropagation();

    try {
        const response = await fetch(`/api/template?id=${dataId}`, { method: "DELETE" });

        if (response.ok) {
            Swal.fire({
                icon: "success",
                title: "Berhasil dihapus",
                showConfirmButton: false,
                timer: 1500
            });

            // Hapus elemen dari DOM secara langsung (tanpa perlu reload dari server)
            const item = document.getElementById(`tpl-${dataId}`);
            if (item) item.remove();
        }
    } catch (error) {
        console.error("Gagal menghapus:", error);
    }
}

async function simpan() {
    const waktuInput = parseInt(document.getElementById("InputCompletion").value);
    const volumeInput = parseInt(document.getElementById("InputVolume").value);
    const kegiatan = document.getElementById("InputActivities").value;
    const satuan = document.getElementById("Unit").value;

    let payload = {
        kegiatan: kegiatan,
        satuan: satuan
    };

    if (!isNaN(waktuInput)) payload.waktu = waktuInput;
    if (!isNaN(volumeInput)) payload.volume = volumeInput;

    if (kegiatan !== "") {
        try {
            // Ubah \$.ajax POST menjadi fetch
            const response = await fetch("/api/template", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire({ icon: "success", title: result.data ? result.data.title : "Berhasil Disimpan" });
            } else {
                Swal.fire({ icon: "error", title: response.statusText || "Gagal menyimpan" });
            }
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            Swal.fire({ icon: "error", title: "Terjadi kesalahan koneksi" });
        }
    } else {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "Kegiatan kerja tidak boleh kosong!"
        });
    }
}

async function preview(dataId) {
    try {
        const response = await fetch(`/api/template?id=${dataId}`, { method: "GET" });
        const result = await response.json();

        if (result.data) {
            addPreview(result.data);
        }
    } catch (error) {
        console.error("Gagal load preview:", error);
    }

    // Tutup Modal setelah item dipilih
    document.getElementById("templateModal").close();
}

function addPreview(data) {
    document.getElementById("InputActivities").value = data.kegiatan || "";
    document.getElementById("InputVolume").value = data.volume || "";
    document.getElementById("Unit").value = data.satuan || "-";
    document.getElementById("InputCompletion").value = data.waktu || "";
}