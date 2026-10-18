/* Finite connection recovery for a sleeping demo, never a keep-alive loop. */
(() => {
  const status = document.getElementById('connection-status');
  const retry = document.getElementById('retry-connection');
  if (!status || !retry) return;
  let started = Date.now(), stopped = false;
  function unavailable() {
    stopped = true;
    status.textContent = 'The workbench is still unavailable. Try again, or open the worked example while the server recovers.';
    retry.hidden = false;
  }
  async function check() {
    if (stopped) return;
    if (Date.now() - started >= 120000) return unavailable();
    try {
      const response = await fetch('/api/workbench-status', {cache:'no-store', signal:AbortSignal.timeout(10000)});
      if (response.ok) {
        const result = await response.json();
        if (stopped) return;
        if (result.ready) { stopped = true; window.location.reload(); return; }
        if (result.retryable === false) return unavailable();
      }
    } catch { /* A temporary failure gets the same finite retry. */ }
    if (!stopped) setTimeout(check, 5000);
  }
  retry.addEventListener('click', () => {
    if (!stopped) return;
    started = Date.now(); stopped = false; retry.hidden = true;
    status.textContent = 'Connecting again. This page will continue automatically when the workbench is ready.';
    void check();
  });
  window.addEventListener('pagehide', () => { stopped = true; });
  void check();
})();
