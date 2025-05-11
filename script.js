// --- 1) Konfiguration ---
const config = {
  videoSrc: 'video.mp4',
  footers: [
    { label: 'Minute 1', time: 60 },
    { label: 'Minute 2', time: 120 },
    { label: 'Minute 3', time: 180 }
  ],
  overlays: [
    // Bild bei 0:20 für 10s, Video läuft weiter
    { time: 20, duration:10, type:'image', src:'bild1.jpg', pauseVideo:false },
    // Countdown bei 0:50 für 60s, Video stoppt
    {
      time: 50,
      duration: 60,
      type: 'countdown',
      text: 'Gleich ist die Austauschzeit abgelaufen!',
      pauseVideo: true
    }
  ]
};

// --- 2) DOM-Refs & Initialisierung ---
let mainVideo, countdownEl, cdTimer, footerNav, overlayEl, overlayContent;
let _overlayIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  mainVideo      = document.getElementById('mainVideo');
  countdownEl    = document.getElementById('countdown');
  cdTimer        = document.getElementById('cdTimer');
  footerNav      = document.getElementById('footerNav');
  overlayEl      = document.getElementById('videoOverlay');
  overlayContent = document.getElementById('overlayContent');

  // Video-Quelle setzen
  mainVideo.src = config.videoSrc;

  // Footer-Buttons erzeugen
  for (const btn of config.footers) {
    const b = document.createElement('button');
    b.textContent = btn.label;
    b.onclick = () => seekTo(btn.time);
    footerNav.appendChild(b);
  }

  // Overlay-Trigger
  mainVideo.addEventListener('timeupdate', checkOverlays);

  // 1× Konfetti beim ersten Abspielen
  mainVideo.addEventListener('play', () => {
    confetti({ particleCount:150, spread:60, origin:{y:0.6} });
  }, { once:true });
});

// --- 3) Presentation-Steuerung ---  
function startPresentation(seconds) {
  // UI wechseln
  document.getElementById('startSection').classList.add('hidden');
  document.getElementById('videoSection').classList.remove('hidden');
  footerNav.classList.remove('hidden');

  // Countdown oder direkt Video
  if (seconds > 0) {
    countdownEl.classList.remove('hidden');
    startCountdown(seconds, () => {
      countdownEl.classList.add('hidden');
      playVideo();
    });
  } else {
    playVideo();
  }
}

// Countdown mit Gong bei 2s
function startCountdown(sec, callback) {
  let rem = sec;
  cdTimer.textContent = formatTime(rem);
  const iv = setInterval(() => {
    rem--;
    if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
    if (rem < 0) {
      clearInterval(iv);
      callback();
    } else {
      cdTimer.textContent = formatTime(rem);
    }
  }, 1000);
}

// Video starten
function playVideo() {
  mainVideo.currentTime = 0;
  mainVideo.play().catch(console.warn);
}

// Auf Footer-Seek
function seekTo(sec) {
  mainVideo.currentTime = sec;
  mainVideo.play().catch(console.warn);
  // Reset Overlays
  overlayEl.classList.remove('active');
  _overlayIndex = 0;
}

// --- 4) Overlay-Logik ---  
function checkOverlays() {
  if (_overlayIndex >= config.overlays.length) return;
  const o = config.overlays[_overlayIndex];
  if (mainVideo.currentTime >= o.time) {
    showOverlay(o);
    _overlayIndex++;
  }
}

function showOverlay(o) {
  overlayContent.innerHTML = '';

  // Inhalt einfügen
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

  // anzeigen & Video ggf. stoppen
  overlayEl.classList.add('active');
  if (o.pauseVideo) mainVideo.pause();

  // Ablauf
  if (o.type === 'countdown') {
    let rem = o.duration;
    const tm = document.getElementById('overlayTimer');
    const iv2 = setInterval(() => {
      rem--;
      if (rem === 2) new Audio('gong.mp3').play().catch(console.warn);
      tm.textContent = formatTime(rem);
      if (rem <= 0) {
        clearInterval(iv2);
        overlayEl.classList.remove('active');
        if (o.pauseVideo) mainVideo.play().catch(console.warn);
      }
    }, 1000);

  } else {
    setTimeout(() => {
      overlayEl.classList.remove('active');
      if (o.pauseVideo) mainVideo.play().catch(console.warn);
    }, o.duration * 1000);
  }
}

// --- Utility: mm:ss ---
function formatTime(s) {
  const m   = String(Math.floor(s/60)).padStart(2,'0');
  const sec = String(s%60).padStart(2,'0');
  return `${m}:${sec}`;
}
