// In index.html aufgerufen:
function startCountdown(seconds) {
  window.location.href = `countdown.html?timer=${seconds}`;
}

// In countdown.html automatisch aufgerufen, sobald das Skript geladen wird:
document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;  // Nur auf der Countdown-Seite aktiv

  // Timer-Wert aus der URL holen
  const urlParams = new URLSearchParams(window.location.search);
  let remaining = parseInt(urlParams.get('timer'), 10);
  if (isNaN(remaining) || remaining < 0) {
    // Fehlerfall: direkt weiterleiten
    window.location.href = 'vortrag-teil1.html';
    return;
  }

  // Anzeigeformat mm:ss
  function format(mmss) {
    const m = Math.floor(mmss / 60).toString().padStart(2, '0');
    const s = (mmss % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Countdown starten
  timerEl.textContent = format(remaining);
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      // Weiterleitung, wenn Timer abgelaufen
      window.location.href = 'vortrag-teil1.html';
    } else {
      timerEl.textContent = format(remaining);
    }
  }, 1000);
});
