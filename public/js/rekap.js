document.addEventListener('DOMContentLoaded', () => {
  getRekap();

  const inputIds = ['InputTanggal', 'satusPNS', 'satusPPPK', 'satusPPPKPW', 'satusNonASN'];

  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', getRekap);
    }
  });

  if (typeof $ !== 'undefined') {
    $('#departemen').on('change', getRekap);
  } else {
    document.getElementById('departemen')?.addEventListener('change', getRekap);
  }
});

// ... (Bagian EventListener di atas tetap sama) ...

async function getRekap() {
  const monthly = document.getElementById("InputTanggal").value;
  const dep = document.getElementById("departemen").value;
  const satusPNS = document.getElementById("satusPNS").checked;
  const satusPPPK = document.getElementById("satusPPPK").checked;
  const satusPPPKPW = document.getElementById("satusPPPKPW").checked;
  const satusNonASN = document.getElementById("satusNonASN").checked;

  const params = new URLSearchParams({
    date: monthly,
    dep: dep,
    satusPNS: satusPNS,
    satusPPPK: satusPPPK,
    satusPPPKPW: satusPPPKPW,
    satusNonASN: satusNonASN
  });

  const tbody = document.querySelector("#tbReport tbody");
  const mobileContainer = document.getElementById("mobileReport");

  // TAMPILKAN EFEK LOADING SAAT MENGAMBIL DATA DI KEDUA TAMPILAN
  const loadingState = `
        <tr>
            <td colspan="8" class="text-center py-12">
                <span class="loading loading-dots loading-lg text-primary"></span>
                <p class="mt-3 text-base-content/60 font-medium animate-pulse">Memuat data rekapitulasi...</p>
            </td>
        </tr>
    `;
  const mobileLoadingState = `
        <div class="flex flex-col items-center justify-center py-12">
            <span class="loading loading-dots loading-lg text-primary"></span>
            <p class="mt-3 text-base-content/60 font-medium animate-pulse">Memuat data rekapitulasi...</p>
        </div>
    `;

  tbody.innerHTML = loadingState;
  mobileContainer.innerHTML = mobileLoadingState;

  try {
    const response = await fetch(`/api/monthly/report?${params.toString()}`);
    if (!response.ok) throw new Error("Gagal mengambil data rekapitulasi");

    const result = await response.json();

    // Bersihkan kontainer
    tbody.innerHTML = "";
    mobileContainer.innerHTML = "";

    if (result.data && result.data.length > 0) {
      result.data.forEach((item, index) => {
        let rowClass = "";
        let cardClass = "";
        let statusBadge = "";

        // Menentukan warna dan badge berdasarkan status
        if (item.state == 0) {
          rowClass = "bg-rose-50/50 hover:bg-rose-100/70 text-rose-900";
          cardClass = "border-l-4 border-l-error";
          statusBadge = `<span class="badge badge-error badge-sm text-white font-medium border-0 shadow-sm">Belum dikirim</span>`;
        } else if (item.state == 1) {
          rowClass = "bg-amber-50/50 hover:bg-amber-100/70 text-amber-900";
          cardClass = "border-l-4 border-l-warning";
          statusBadge = `<span class="badge badge-warning badge-sm text-white font-medium border-0 shadow-sm">Belum Disetujui</span>`;
        } else if (item.state == 2) {
          rowClass = "bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900";
          cardClass = "border-l-4 border-l-success";
          let bosName = item.bos && item.bos.nama ? item.bos.nama : '';
          statusBadge = `<span class="badge badge-success badge-sm text-white font-medium border-0 shadow-sm" title="Disetujui oleh: ${bosName}">Disetujui</span>`;
        } else {
          rowClass = "hover:bg-base-200/60";
          cardClass = "border-l-4 border-l-base-300";
          statusBadge = `<span class="badge badge-ghost badge-sm shadow-sm">Status Tidak Diketahui</span>`;
        }

        const delayAnim = `${index * 0.05}s`;

        // --- 1. RENDER UNTUK DESKTOP (TABEL) ---
        const tr = document.createElement("tr");
        tr.className = `${rowClass} transition-colors border-b border-base-200/50 row-animate`;
        tr.style.animationDelay = delayAnim;

        tr.innerHTML = `
                    <td class="text-center font-medium">${index + 1}</td>
                    <td class="font-semibold">${item.nama || '-'}</td>
                    <td class="text-base-content/70">${item.nip || '-'}</td>
                    <td class="text-sm">${item.jab || '-'}</td>
                    <td class="text-center font-bold text-primary">${item.capaian || 0}</td>
                    <td class="text-center"><span class="badge badge-ghost badge-sm">${item.kategori || '-'}</span></td>
                    <td class="text-right font-medium">${item.tpp || 0}</td>
                    <td class="text-center whitespace-normal">${statusBadge}</td>
                `;
        tbody.appendChild(tr);


        // --- 2. RENDER UNTUK MOBILE (CARD) ---
        const card = document.createElement("div");
        card.className = `card bg-base-100 shadow-sm border border-base-200 row-animate ${cardClass}`;
        card.style.animationDelay = delayAnim;

        card.innerHTML = `
                    <div class="card-body p-4 gap-3">
                        <div class="flex justify-between items-start gap-2">
                            <div class="overflow-hidden">
                                <h3 class="font-bold text-sm truncate text-base-content">${item.nama || '-'}</h3>
                                <p class="text-xs text-base-content/60 mt-0.5">${item.nip || '-'}</p>
                            </div>
                            <div class="shrink-0 mt-0.5">${statusBadge}</div>
                        </div>
                        
                        <div class="text-xs text-base-content/80 line-clamp-2">
                            <span class="font-semibold">Jabatan:</span> ${item.jab || '-'}
                        </div>
                        
                        <div class="divider my-0 opacity-50"></div>
                        
                        <div class="grid grid-cols-3 gap-2 divide-x divide-base-200">
                            <div class="text-center px-1">
                                <div class="text-[10px] uppercase font-bold text-base-content/50 mb-1">Capaian</div>
                                <div class="font-bold text-primary text-sm">${item.capaian || 0} <span class="text-[10px] font-normal">mnt</span></div>
                            </div>
                            <div class="text-center px-1">
                                <div class="text-[10px] uppercase font-bold text-base-content/50 mb-1">Kategori</div>
                                <div><span class="badge badge-ghost badge-xs mt-0.5">${item.kategori || '-'}</span></div>
                            </div>
                            <div class="text-center px-1">
                                <div class="text-[10px] uppercase font-bold text-base-content/50 mb-1">TPP</div>
                                <div class="font-bold text-sm text-base-content/80">${item.tpp || 0}</div>
                            </div>
                        </div>
                    </div>
                `;
        mobileContainer.appendChild(card);
      });

    } else {
      // Tampilan kosong (Empty State)
      const emptySvg = `
                <div class="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Tidak ada data rekapitulasi.
                </div>
            `;
      tbody.innerHTML = `<tr class="animate-fade-in-up"><td colspan="8" class="text-center py-12 text-base-content/60 font-medium">${emptySvg}</td></tr>`;
      mobileContainer.innerHTML = `<div class="py-10 text-base-content/60 font-medium text-center animate-fade-in-up">${emptySvg}</div>`;
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);

    // Tampilan Error
    const errorSvg = `
            <div class="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Gagal mengambil data.
            </div>
        `;
    tbody.innerHTML = `<tr class="animate-fade-in-up"><td colspan="8" class="text-center py-10 text-error font-medium">${errorSvg}</td></tr>`;
    mobileContainer.innerHTML = `<div class="py-10 text-error font-medium text-center animate-fade-in-up">${errorSvg}</div>`;
  }
}