// --- 1) Konfiguration ---
const config = {
  videoSrc: 'https://ebildungslabor.de/slides/video.mp4',
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ],
  overlays: [
    { time:20,  duration:10, type:'image',        src:'bild1.jpg', pauseVideo:false },
    { time:50,  duration:60, type:'countdown', text:'Tausche dich mit Nebensitzer für eine Minute aus!', pauseVideo:true }
  ]
};

// --- 2) State & DOM-Referenzen ---
let mainVideo,
    videoSource,
    countdownContainer,
    countdownTimer,
    footerNav;

let countdownInterval = null;
let overlayTimeoutId  = null;
let overlayCountdownId= null;
let _overlayIndex     = 0;

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  mainVideo          = document.getElementById('mainVideo');
  videoSource        = document.getElementById('videoSource');
  countdownContainer = document.getElementById('countdownContainer');
  countdownTimer     = document.getElementById('countdownTimer');
  footerNav          = document.getElementById('footerNav');

  // **Wichtig**: Video-Quelle setzen & laden
  videoSource.src = config.videoSrc;
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

  // Einmalig Konfetti beim ersten Play
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount:150, spread:60, origin:{ y:0.6 } });
  }, { once:true });

  // Overlay-Trigger
  mainVideo.addEventListener('timeupdate', checkOverlays);
});

// --- 3) Alle Prozesse stoppen ---
function stopAll() {
  // Countdown
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  countdownContainer.classList.add('hidden');

  // Video
  if (!mainVideo.paused) mainVideo.pause();

  // Overlays
  const overlayEl = document.getElementById('videoOverlay');
  overlayEl.classList.add('hidden');
  if (overlayTimeoutId)   clearTimeout(overlayTimeoutId);
  if (overlayCountdownId) clearInterval(overlayCountdownId);
  overlayTimeoutId   = null;
  overlayCountdownId = null;
  _overlayIndex      = 0;
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
    if (rem === 2) {
      new Audio('gong.mp3').play().catch
