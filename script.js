// --- 1) Konfiguration ---
const config = {
  // Video-URL (extern oder lokal)
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  // Footer-Sprungmarken
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ]
};

// --- 2) State & DOM-Referenzen ---
let mainVideo, videoSource;
let countdownContainer, countdownTimer;
let footerNav;
let countdownInterval = null;

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  // Refs holen
  mainVideo         = document.getElementById('mainVideo');
  videoSource       = document.getElementById('videoSource');
  countdownContainer= document.getElementById('countdownContainer');
  countdownTimer    = document.getElementById('countdownTimer');
  footerNav         = document.getElementById('footerNav');

  // Video-Quelle setzen und laden
  videoSource.src = config.videoSrc;
  mainVideo.load();

  // Footer-Buttons erzeugen
  for (const btn of config.footers) {
    const b = document.createElement('button');
    b.textContent        = btn.label;
    b.dataset.time       = btn.time;
    b.onclick            = () => {
      stopAll();
      showVideoSection();
      playVideoAt(btn.time);
      highlightFooter(btn.time);
    };
    footerNav.appendChild(b);
  }

  // Einmalig Konfetti beim ersten Play-Event
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

// Countdown-Funktion (Gong bei 2 s vor Ende)
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

// --- 5) Video-Section & Footer einblenden ---
function showVideoSection() {
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');
}

// --- 6) Video steuern & Footer hervorheben ---
function playVideoAt(sec) {
  mainVideo.currentTime = sec;
  mainVideo.play().catch(console.warn);
}

function highlightFooter(sec) {
  for (const b of footerNav.children) {
    b.classList.toggle('active', Number(b.dataset.time) === sec);
  }
}

// --- 7) Utility: Sekunden → "MM:SS" ---
function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2,'0');
  const s = String(total % 60).padStart(2,'0');
  return `${m}:${s}`;
}
