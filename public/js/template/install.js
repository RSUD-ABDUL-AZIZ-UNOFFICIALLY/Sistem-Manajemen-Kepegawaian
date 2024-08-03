let deferredPrompt;
const installModal = new bootstrap.Modal(document.getElementById('installModal'));

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    // Menampilkan modal secara otomatis
    installModal.show();

    const installButton = document.getElementById('installButton');
    installButton.addEventListener('click', () => {
        installApp();
    });
});

function installApp() {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('Aplikasi diinstal');
        } else {
            console.log('Pengguna menolak untuk menginstal aplikasi');
        }
        deferredPrompt = null;
        // Menyembunyikan modal setelah proses instalasi selesai
        installModal.hide();
    });
}
console.log("Halo");