// ------------------------------------------------------
// Globale Funktion für die Startseite
// ------------------------------------------------------
window.startCountdown = function(seconds) {
  // Noch einmal kurz prüfen, dass seconds eine Zahl ist
  if (isNaN(seconds) || seconds < 0) {
    console.error("Ungültiger Countdown-Wert:", seconds);
    return;
  }
  // Weiterleiten auf die Countdown-Seite mit Parameter
  window.location.href = `countdown.html?timer=${seconds}`;
};

// ------------------------------------------------------
// Countdown-Logik für countdown.html
// ------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return; // nur ausführen auf countdown.html

  const params = new URLSearchParams(window.location.search);
  let remaining = parseInt(params.get('timer'), 10);
  if (isNaN(remaining) || remaining < 0) {
    return window.location.href = 'vortrag-teil1.html';
  }

  // Sekunden in mm:ss umwandeln
  const format = secs => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  timerEl.textContent = format(remaining);
  const tick = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(tick);
      window.location.href = 'vortrag-teil1.html';
    } else {
      timerEl.textContent = format(remaining);
    }
  }, 1000);
});

