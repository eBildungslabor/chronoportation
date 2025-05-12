// --- 1) Konfiguration ---
const config = {
  // Kann lokal (z.B. 'video1.mp4') oder extern sein:
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  // Footer-Buttons springen auf diese Zeitpunkte (in Sekunden)
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ]
  // Overlays / Interaktionen fügen wir später hier hinzu
};

// --- 2) State & DOM-Refs ---
let countdownInterval = null;
let mainVideo, videoSource,
    countdownContainer, countdownTimer,
    footerNav;

// Nach Laden des DOM initialisieren
document.addEventListener('DOMContentLoaded', () => {
  // Refs
  mainVideo         = document.getElementById('mainVideo');
  videoSource       = document.getElementById('videoSource');
  countdownContainer= document.getElementById('countdownContainer');
  countdownTimer    = document.getElementById('countdownTimer');
  footerNav         = document.getElementById('footerNav');

  // Video-Quelle setzen & laden
  videoSource.src = config.videoSrc;
  mainVideo.load();

  // Footer-Buttons generieren
  for (const btn of config.footers) {
    const b = document.createElement('button');
    b.textContent      = btn.label;
    b.dataset.time     = btn.time;
    b.onclick          = () => {
      stopAll();
      showVideoSection();
      playVideoAt(btn.time);
      highlightFooter(btn.time);
    };
    footerNav.appendChild(b);
  }

  // Einmalig Konfetti beim ersten Play
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount:150, spread:60, origin:{ y:0.6 } });
  }, { once: true });
});

// --- 3) Helfer: Prozesse stoppen ---
function stopAll() {
  // Countdown anhalten
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  // Video pausieren
  if (!mainVideo.paused) {
    mainVideo.pause();
  }
}

// --- 4) Start-Logik mit Countdown ---
function startPresentation(delaySec) {
  stopAll();
  // Auswahl verbergen, Countdown einblenden
  document.getElementById('selectionContainer').classList.add('hidden');
  countdownContainer.classList.remove('hidden');

  if (delaySec > 0) {
    runCountdown(delaySec, () => {
      countdownContainer.classList.add('hidden');
      showVideoSection();
      playVideoAt(0);
    });
  } else {
    countdownContainer.classList.add('hidden');
    showVideoSection();
    playVideoAt(0);
  }
}

// Countdown-Funktion (Gong bei 2 s)
function runCountdown(sec, onFinish) {
  let rem = sec;
  countdownTimer.textContent = formatTime(rem);
  countdownInterval = setInterval(() => {
    rem--;
    if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
    if (rem < 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      onFinish();
    } else {
      countdownTimer.textContent = formatTime(rem);
    }
  }, 1000);
}

// --- 5) Video-Section anzeigen & Footer aktivieren ---
function showVideoSection() {
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');
}

// --- 6) Video steuern & Footer hervorheben ---
function playVideoAt(seconds) {
  mainVideo.currentTime = seconds;
  mainVideo.play().catch(console.warn);
}

function highlightFooter(sec) {
  for (const btn of footerNav.children) {
    btn.classList.toggle('active', Number(btn.dataset.time) === sec);
  }
}

// Hilfsfunktion: Sekunden → "MM:SS"
function formatTime(total) {
  const m = String(Math.floor(total/60)).padStart(2,'0');
  const s = String(total % 60).padStart(2,'0');
  return `${m}:${s}`;
}
