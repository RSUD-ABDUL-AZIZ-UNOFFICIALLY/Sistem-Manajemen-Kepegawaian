/* UI enhancements only; OTP delivery and login submission remain handled by existing app scripts. */
(() => {
  'use strict';

  const phoneInput = document.getElementById('phone');
  const otpInput = document.getElementById('otp');
  const yearOutput = document.getElementById('currentYear');
  const installModal = document.getElementById('installModal');
  const openInstallModal = document.getElementById('openInstallModal');
  const closeInstallModal = document.getElementById('closeInstallModal');
  const cancelInstall = document.getElementById('cancelInstall');

  if (yearOutput) yearOutput.textContent = String(new Date().getFullYear());

  // Keep the phone number as a string so a leading zero is never lost.
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const start = phoneInput.selectionStart;
      const previousLength = phoneInput.value.length;
      phoneInput.value = phoneInput.value.replace(/[^0-9+]/g, '').replace(/(?!^)[+]/g, '').slice(0, 16);
      const nextLength = phoneInput.value.length;
      if (typeof start === 'number' && phoneInput === document.activeElement) {
        const nextPosition = Math.max(0, start - (previousLength - nextLength));
        try { phoneInput.setSelectionRange(nextPosition, nextPosition); } catch (_) { /* Some mobile browsers do not support selection on tel inputs. */ }
      }
    });
  }


  const showInstallDialog = () => {
    if (!installModal) return;
    if (typeof installModal.showModal === 'function') {
      if (!installModal.open) installModal.showModal();
    } else {
      installModal.setAttribute('open', 'open');
    }
  };
  const hideInstallDialog = () => {
    if (!installModal) return;
    if (typeof installModal.close === 'function' && installModal.open) installModal.close();
    else installModal.removeAttribute('open');
  };

  openInstallModal?.addEventListener('click', showInstallDialog);
  closeInstallModal?.addEventListener('click', hideInstallDialog);
  cancelInstall?.addEventListener('click', hideInstallDialog);
  installModal?.addEventListener('click', (event) => {
    // Clicks on the native dialog surface outside the content close the modal.
    if (event.target === installModal) hideInstallDialog();
  });
  installModal?.addEventListener('cancel', () => {
    // Preserve the browser's native Escape-key behavior.
  });
})();
