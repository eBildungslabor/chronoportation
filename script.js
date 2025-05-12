// --- 1) Konfiguration ---
const config = {
  // Video-URL (extern oder lokal)
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  // Footer-Sprungmarken
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ],
  // Overlays: Bild und Countdown
  overlays: [
    // Bild bei 20s, 10s lang, Video läuft weiter
    { time:20,  duration:10, type:'image',     src:'bild1.jpg', pauseVideo:false },
    // Countdown bei 50s, 60s lang, Video pausiert
    {
      time:      50,
      duration:  60,
      type:      'countdown',
      text:      'Tausche dich mit Nebensitzer für eine Minute aus!',
      pauseVideo:true
    }
  ]
};

// --- 2) State & Refs ---
let mainVideo,
    countdownContainer,
    countdownTimer,
    footerNav;

let countdownInterval = null;
let overlayTimeoutId  = null;
let overlayCountdownId= null;
let _overlayIndex     = 0;

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  // DOM-Referenzen
  mainVideo         = document.getElementById('mainVideo');
  countdownContainer= document.getElementById('countdownContainer');
  countdownTimer    = document.getElementById('countdownTimer');
  footerNav         = document.getElementById('footerNav');

  // Video laden
  mainVideo.src = config.videoSrc;
  mainVideo.load();

  // Footer-Buttons anlegen
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

  // Konfetti nur beim ersten Play
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount:150, spread:60, origin:{ y:0.6 } });
  }, { once:true });

  // Overlays prüfen
  mainVideo.addEventListener('timeupdate', checkOverlays);
});

// --- 3) Alle Prozesse stoppen ---
function stopAll() {
  // Countdown anhalten
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdownContainer.classList.add('hidden');

  // Video pausieren
  if (!mainVideo.paused) mainVideo.pause();

  // Overlays zurücksetzen
  const overlayEl = document.getElementById('videoOverlay');
  overlayEl.classList.add('hidden');
  if (overlayTimeoutId)   clearTimeout(overlayTimeoutId);
  if (overlayCountdownId) clearInterval(overlayCountdownId);
  overlayTimeoutId    = null;
  overlayCountdownId  = null;
  _overlayIndex       = 0;
}

// --- 4) Start mit Countdown ---
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

function runCountdown(sec, callback) {
  let rem = sec;
  countdownTimer.textContent = formatTime(rem);
  countdownInterval = setInterval(() => {
    rem--;
    if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
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
  Array.from(footerNav.children).forEach(b => {
    b.classList.toggle('active', Number(b.dataset.time) === sec);
  });
}

// --- 7) Overlay-Logik ---
function checkOverlays() {
  if (_overlayIndex >= config.overlays.length) return;
  const o = config.overlays[_overlayIndex];
  if (mainVideo.currentTime >= o.time) {
    showOverlay(o);
    _overlayIndex++;
  }
}

function showOverlay(o) {
  const overlayEl      = document.getElementById('videoOverlay');
  const overlayContent = document.getElementById('overlayContent');
  overlayContent.innerHTML = '';

  if (o.type === 'image') {
    const img = document.createElement('img');
    img.src = o.src;
    img.style.maxWidth  = '80%';
    img.style.maxHeight = '80%';
    overlayContent.appendChild(img);

  } else if (o.type === 'countdown') {
    const div = document.createElement('div');
    div.innerHTML = `
      <h1>${o.text}</h1>
      <div id="overlayTimer" class="timer">${formatTime(o.duration)}</div>
    `;
    overlayContent.appendChild(div);
  }

  overlayEl.classList.remove('hidden');
  if (o.pauseVideo) mainVideo.pause();

  if (o.type === 'countdown') {
    let rem = o.duration;
    const tm = document.getElementById('overlayTimer');
    overlayCountdownId = setInterval(() => {
      rem--;
      if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
      tm.textContent = formatTime(rem);
      if (rem <= 0) {
        clearInterval(overlayCountdownId);
        overlayCountdownId = null;
        overlayEl.classList.add('hidden');
        if (o.pauseVideo) mainVideo.play().catch(console.warn);
      }
    }, 1000);

  } else {
    overlayTimeoutId = setTimeout(() => {
      overlayEl.classList.add('hidden');
      if (o.pauseVideo) mainVideo.play().catch(console.warn);
    }, o.duration * 1000);
  }
}

// --- 8) Utility: Sekunden → "MM:SS" ---
function formatTime(total) {
  const m = String(Math.floor(total/60)).padStart(2,'0');
  const s = String(total % 60).padStart(2,'0');
  return `${m}:${s}`;
}
