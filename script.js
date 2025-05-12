// --- 1) Konfiguration ---
const config = {
  // Hier deine Video-URL (extern oder lokal)
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  // Fuß-Buttons springen zu diesen Sekunden
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ]
};

// --- 2) State & Refs ---
let mainVideo,
    countdownContainer, countdownTimer,
    footerNav,
    countdownInterval = null;

// Initialisieren nach DOM-Load
document.addEventListener('DOMContentLoaded', () => {
  mainVideo          = document.getElementById('mainVideo');
  countdownContainer = document.getElementById('countdownContainer');
  countdownTimer     = document.getElementById('countdownTimer');
  footerNav          = document.getElementById('footerNav');

  // Video-Quelle **direkt** setzen
  mainVideo.src = config.videoSrc;
  // Laden damit MIME & CORS geprüft werden
  mainVideo.load();

  // Footer-Buttons generieren
  config.footers.forEach(btn => {
    const b = document.createElement('button');
    b.textContent    = btn.label;
    b.dataset.time   = btn.time;
    b.onclick        = () => {
      stopAll();
      showVideoSection();
      playVideoAt(btn.time);
      highlightFooter(btn.time);
    };
    footerNav.appendChild(b);
  });

  // Einmalig: Konfetti beim ersten Play
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount:150, spread:60, origin:{ y:0.6 } });
  }, { once:true });
});

// --- 3) Hilfsfunktion: alles stoppen ---
function stopAll() {
  // Countdown stoppen
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdownContainer.classList.add('hidden');

  // Video pausieren
  if (!mainVideo.paused) {
    mainVideo.pause();
  }
}

// --- 4) Start-Präsentation mit Countdown ---
function startPresentation(delaySec) {
  stopAll();
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

// Countdown mit Gong bei 2 s
function runCountdown(sec, callback) {
  let rem = sec;
  countdownTimer.textContent = formatTime(rem);
  countdownInterval = setInterval(() => {
    rem--;
    if (rem === 2) {
      new Audio('gong.mp3').play().catch(console.warn);
    }
    if (rem < 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      callback();
    } else {
      countdownTimer.textContent = formatTime(rem);
    }
  }, 1000);
}

// --- 5) Video-Section & Footer anzeigen ---
function showVideoSection() {
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');
}

// --- 6) Video starten & Footer hervorheben ---
function playVideoAt(sec) {
  mainVideo.currentTime = sec;
  mainVideo.play().catch(console.warn);
}

function highlightFooter(sec) {
  Array.from(footerNav.children).forEach(b => {
    b.classList.toggle('active', Number(b.dataset.time) === sec);
  });
}

// --- 7) Utility: mm:ss ---
function formatTime(total) {
  const m = String(Math.floor(total/60)).padStart(2,'0');
  const s = String(total%60).padStart(2,'0');
  return `${m}:${s}`;
}
