// 1) Konfiguration
const config = {
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ]
  // overlays später hier ergänzen...
};

// 2) State & Refs
let mainVideo,
    countdownContainer, countdownTimer,
    footerNav,
    overlayEl, overlayContent,
    countdownInterval = null;

// 3) Init
document.addEventListener('DOMContentLoaded', () => {
  mainVideo          = document.getElementById('mainVideo');
  countdownContainer = document.getElementById('countdownContainer');
  countdownTimer     = document.getElementById('countdownTimer');
  footerNav          = document.getElementById('footerNav');
  overlayEl          = document.getElementById('videoOverlay');
  overlayContent     = document.getElementById('overlayContent');

  // **Wichtig**: Video-URL direkt am <video> setzen
  mainVideo.src = config.videoSrc;
  mainVideo.load();

  // Footer Buttons
  for (const btn of config.footers) {
    const b = document.createElement('button');
    b.textContent  = btn.label;
    b.dataset.time = btn.time;
    b.onclick      = () => {
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
  }, { once:true });
});

// 4) Stoppe alle Prozesse
function stopAll() {
  if (countdownInterval) clearInterval(countdownInterval);
  countdownContainer.classList.add('hidden');
  if (!mainVideo.paused) mainVideo.pause();
  overlayEl.classList.remove('active');
}

// 5) Start-Flow
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

function runCountdown(sec, cb) {
  let rem = sec;
  countdownTimer.textContent = formatTime(rem);
  countdownInterval = setInterval(() => {
    rem--;
    if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
    if (rem < 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      cb();
    } else {
      countdownTimer.textContent = formatTime(rem);
    }
  }, 1000);
}

// 6) Video & Footer
function showVideoSection() {
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');
}

function playVideoAt(sec) {
  mainVideo.currentTime = sec;
  mainVideo.play().catch(console.warn);
}

function highlightFooter(sec) {
  for (const b of footerNav.children) {
    b.classList.toggle('active', Number(b.dataset.time) === sec);
  }
}

// 7) Utility
function formatTime(s) {
  const m = String(Math.floor(s/60)).padStart(2,'0');
  const ss= String(s%60).padStart(2,'0');
  return `${m}:${ss}`;
}
