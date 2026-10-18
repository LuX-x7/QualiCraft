/* Passwords stay in the HTTPS form request; never browser storage or logs. */
document.querySelectorAll('form[data-auth]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const status = document.getElementById('auth-status');
    const button = form.querySelector('button');
    button.disabled = true;
    status.textContent = 'Connecting…';
    try {
      const body = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/auth/' + form.dataset.auth, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body), credentials: 'same-origin',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Please try again.');
      form.reset();
      window.location.assign('/w?lang=en');
    } catch (error) {
      status.textContent = error.message || 'Could not connect. Please try again.';
      button.disabled = false;
    }
  });
});
