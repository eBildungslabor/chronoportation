// --- 1) Konfiguration ---
const config = {
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ],
  overlays: [
    // Bild-Overlay bei 0:20 für 10 s, Video läuft weiter
    { time: 20,  duration: 10, type: 'image',    src: 'bild1.jpg', pauseVideo: false },
    // Countdown-Overlay bei 0:50 für 60 s, Video pausiert
    {
      time:       50,
      duration:   60,
      type:       'countdown',
      text:       'Tausche dich mit Nebensitzer für eine Minute aus!',
      pauseVideo: true
    }
  ]
};

// --- 2) State & DOM-Refs ---
let mainVideo,
    countdownEl, cdTimer,
    footerNav,
    overlayEl, overlayContent;

let countdownInterval = null;
let overlayTimeoutId   = null;
let overlayCountdownId = null;
let _overlayIndex      = 0;

document.addEventListener('DOMContentLoaded', () => {
  // DOM-Referenzen
  mainVideo      = document.getElementById('mainVideo');
  countdownEl    = document.getElementById('countdown');
  cdTimer        = document.getElementById('cdTimer');
  footerNav      = document.getElementById('footerNav');
  overlayEl      = document.getElementById('videoOverlay');
  overlayContent = document.getElementById('overlayContent');

  // Video-Quelle setzen
  mainVideo.src = config.videoSrc;

  // Footer-Buttons generieren
  for (const btn of config.footers) {
    const b = document.createElement('button');
    b.textContent = btn.label;
    b.onclick     = () => seekTo(btn.time);
    footerNav.appendChild(b);
  }

  // Overlay-Trigger
  mainVideo.addEventListener('timeupdate', checkOverlays);

  // 1× Konfetti beim ersten Play
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount: 150, spread: 60, origin: { y: 0.6 } });
  }, { once: true });
});

// --- 3) Stoppe alle Prozesse beim Neuanfang ---
function stopAll() {
  // Stoppe Start-Countdown
  if (countdownInterval) clearInterval(countdownInterval);
  countdownEl.classList.add('hidden');

  // Stoppe Video
  if (!mainVideo.paused) mainVideo.pause();

  // Stoppe Overlay-Timer
  if (overlayTimeoutId) clearTimeout(overlayTimeoutId);
  if (overlayCountdownId) clearInterval(overlayCountdownId);

  // Overlay verbergen & zurücksetzen
  overlayEl.classList.remove('active');
  _overlayIndex = 0;
}

// --- 4) Start-Präsentation / Countdown ---
function startPresentation(seconds) {
  stopAll();
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');

  if (seconds > 0) {
    countdownEl.classList.remove('hidden');
    startCountdown(seconds, () => {
      countdownEl.classList.add('hidden');
      playVideo(0);
    });
  } else {
    playVideo(0);
  }
}

function startCountdown(sec, onEnd) {
  let rem = sec;
  cdTimer.textContent = formatTime(rem);
  countdownInterval = setInterval(() => {
    rem--;
    if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
    if (rem < 0) {
      clearInterval(countdownInterval);
      onEnd();
    } else {
      cdTimer.textContent = formatTime(rem);
    }
  }, 1000);
}

// --- 5) Video-Steuerung & Footer-Jump ---
function playVideo(startTime) {
  mainVideo.currentTime = startTime;
  mainVideo.play().catch(console.warn);
}

function seekTo(sec) {
  stopAll();
  playVideo(sec);
}

// --- 6) Overlay-Logik ---
function checkOverlays() {
  if (_overlayIndex >= config.overlays.length) return;
  const o = config.overlays[_overlayIndex];
  if (mainVideo.currentTime >= o.time) {
    showOverlay(o);
    _overlayIndex++;
  }
}

function showOverlay(o) {
  // Inhalt vorbereiten
  overlayContent.innerHTML = '';
  if (o.type === 'image') {
    const img = document.createElement('img');
    img.src = o.src;
    img.style.maxWidth  = '80%';
    img.style.maxHeight = '80%';
    overlayContent.appendChild(img);
  } else if (o.type === 'countdown') {
    const cont = document.createElement('div');
    cont.innerHTML = `
      <h1>${o.text}</h1>
      <div id="overlayTimer" class="timer">${formatTime(o.duration)}</div>
    `;
    overlayContent.appendChild(cont);
  }

  // Overlay zeigen & ggf. Video pausieren
  overlayEl.classList.add('active');
  if (o.pauseVideo) mainVideo.pause();

  // Ablauf
  if (o.type === 'countdown') {
    let rem = o.duration;
    const tm = document.getElementById('overlayTimer');
    overlayCountdownId = setInterval(() => {
      rem--;
      if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
      tm.textContent = formatTime(rem);
      if (rem <= 0) {
        clearInterval(overlayCountdownId);
        overlayEl.classList.remove('active');
        if (o.pauseVideo) mainVideo.play().catch(console.warn);
      }
    }, 1000);
  } else {
    overlayTimeoutId = setTimeout(() => {
      overlayEl.classList.remove('active');
      if (o.pauseVideo) mainVideo.play().catch(console.warn);
    }, o.duration * 1000);
  }
}

// --- 7) Utility: mm:ss ---
function formatTime(s) {
  const m   = String(Math.floor(s/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  return `${m}:${sec}`;
}
