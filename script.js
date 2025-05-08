document.addEventListener('DOMContentLoaded', () => {
  let runThrough = false;
  const sections = document.querySelectorAll('.section');
  const navButtons = {
    startSection:       document.getElementById('navStart'),
    halloSection:       document.getElementById('navHallo'),
    einstiegSection:    document.getElementById('navEinstieg'),
    impulsSection:      document.getElementById('navImpuls'),
    vorstellungSection: document.getElementById('navVorstellung'),
    abschlussSection:   document.getElementById('navAbschluss')
  };

  // Aufruf durch Start-Buttons
  window.goTo = (target, seconds) => {
    runThrough = (target === 'countdown');
    if (target === 'countdown') {
      activateRaw('startSection', 'countdownSection');
      startCountdown(seconds);
    } else {
      activateSection(target + 'Section');
    }
  };

  // Aufruf durch Footer-Navi
  window.activateSection = (sectionId) => {
    runThrough = false;
    activateRaw(null, sectionId);
    startSectionSequence(sectionId);
  };

  // Sektion zeigen / Footer-Button highlighten
  function activateRaw(fromId, toId) {
    sections.forEach(s => s.classList.remove('active'));
    Object.values(navButtons).forEach(b => b.classList.remove('active'));
    if (fromId) document.getElementById(fromId).classList.remove('active');
    const sec = document.getElementById(toId);
    sec.classList.add('active');
    if (navButtons[toId]) navButtons[toId].classList.add('active');
  }

  // Countdown-Logik
  function startCountdown(seconds) {
    let rem = seconds;
    const el = document.getElementById('countdownTimer');
    el.textContent = formatTime(rem);
    const iv = setInterval(() => {
      rem--;
      if (rem <= 0) {
        clearInterval(iv);
        activateRaw('countdownSection', 'halloSection');
        startSectionSequence('halloSection');
      } else {
        el.textContent = formatTime(rem);
      }
    }, 1000);
  }

  // Hauptsequenz je Sektion
  function startSectionSequence(id) {
    switch (id) {
      case 'halloSection':       handleHalloSection(); break;
      case 'einstiegSection':    handleEinstiegSection(); break;
      case 'impulsSection':      handleImpulsSection(); break;
      case 'vorstellungSection': handleVorstellungSection(); break;
      case 'abschlussSection':   handleAbschlussSection(); break;
      default: break;
    }
  }

  // === HALLO (1) ===
  function handleHalloSection() {
    const wrap = document.querySelector('#halloSection .video-wrapper');
    const ov   = document.getElementById('halloOverlay');
    wrap.innerHTML = '';

    // a) Video1 + Konfetti + Overlay
    const v1 = document.createElement('video');
    v1.src = 'video1.mp4';
    v1.playsInline = true;
    wrap.appendChild(v1);
    v1.play().catch(() => {});
    confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
    document.getElementById('currentTime').textContent     = new Date().toLocaleTimeString();
    document.getElementById('currentLocation').textContent = 'Ort: Berlin, Deutschland';
    ov.classList.add('active');

    // b) nach 15s Overlay aus + Video2
    setTimeout(() => {
      ov.classList.remove('active');
      playVideo2();
    }, 15000);
  }

  function playVideo2() {
    const wrap = document.querySelector('#halloSection .video-wrapper');
    wrap.innerHTML = '';
    const v2 = document.createElement('video');
    v2.src = 'video2.mp4';
    v2.playsInline = true;
    wrap.appendChild(v2);
    v2.play().catch(() => {});
    v2.onended = showIframeThenVideo3;
  }

  function showIframeThenVideo3() {
    const sec = document.getElementById('halloSection');
    const ov  = document.createElement('div');
    ov.className = 'overlay active';
    ov.innerHTML = '<iframe src="#" class="iframe-placeholder"></iframe>';
    sec.appendChild(ov);

    setTimeout(() => {
      ov.remove();
      playVideo3WithFade();
    }, 5000);
  }

  function playVideo3WithFade() {
    const wrap = document.querySelector('#halloSection .video-wrapper');
    wrap.innerHTML = '';
    wrap.style.opacity = 0;
    wrap.style.transition = 'opacity 1s';

    const v3 = document.createElement('video');
    v3.src = 'video3.mp4';
    v3.playsInline = true;
    wrap.appendChild(v3);

    requestAnimationFrame(() => wrap.style.opacity = 1);
    v3.play().catch(() => {});
    v3.onended = () => {
      wrap.style.opacity = 0;
      wrap.ontransitionend = () => {
        if (runThrough) {
          activateRaw('halloSection', 'einstiegSection');
          startSectionSequence('einstiegSection');
        }
      };
    };
  }

  // === EINSTIEG (2) ===
  function handleEinstiegSection() {
    const wrap = document.querySelector('#einstiegSection .video-wrapper');
    wrap.innerHTML = '';
    const v4 = document.createElement('video');
    v4.src = 'video4.mp4';
    v4.playsInline = true;
    wrap.appendChild(v4);
    v4.play().catch(() => {});
    v4.onended = () => {
      showAufgabeOverlay('einstiegOverlay', 300, () => {
        if (runThrough) {
          activateRaw('einstiegSection', 'impulsSection');
          startSectionSequence('impulsSection');
        }
      });
    };
  }

  // === IMPULS (3) ===
  function handleImpulsSection() {
    const wrap = document.querySelector('#impulsSection .video-wrapper');
    wrap.innerHTML = '';
    const v5 = document.createElement('video');
    v5.src = 'video5.mp4';
    v5.playsInline = true;
    wrap.appendChild(v5);
    v5.play().catch(() => {});
    v5.onended = () => {
      showAufgabeOverlay('impulsOverlay', 300, () => {
        if (runThrough) {
          activateRaw('impulsSection', 'vorstellungSection');
          startSectionSequence('vorstellungSection');
        }
      });
    };
  }

  // generischer Aufgaben-Overlay
  function showAufgabeOverlay(id, secs, done) {
    const ov = document.getElementById(id);
    const tm = ov.querySelector('.timer');
    let r = secs;
    tm.textContent = formatTime(r);
    ov.classList.add('active');

    const iv = setInterval(() => {
      r--;
      tm.textContent = formatTime(r);
      if (r <= 30) tm.classList.add('countdown-large','blink');
      if (r <= 0) {
        clearInterval(iv);
        ov.classList.remove('active');
        done();
      }
    }, 1000);
  }

  // === VORSTELLUNG (4) ===
  function handleVorstellungSection() {
    const wrap = document.querySelector('#vorstellungSection .video-wrapper');
    wrap.innerHTML = '';
    const v6 = document.createElement('video');
    v6.src = 'video6.mp4';
    v6.playsInline = true;
    wrap.appendChild(v6);
    v6.play().catch(() => {});
    v6.onended = () => {
      runOverlaySteps([
        { id: 'vorstellungStep1', secs: 15 },
        { id: 'vorstellungStep2', secs: 60 },
        { id: 'vorstellungStep3', secs: 15 },
        { id: 'vorstellungStep4', secs: 60 },
        { id: 'vorstellungStep5', secs: 15 },
        { id: 'vorstellungStep6', secs: 60 }
      ], () => {
        if (runThrough) {
          activateRaw('vorstellungSection', 'abschlussSection');
          startSectionSequence('abschlussSection');
        }
      });
    };
  }

  function runOverlaySteps(steps, allDone) {
    let i = 0;
    function next() {
      if (i > 0) document.getElementById(steps[i-1].id).classList.remove('active');
      if (i >= steps.length) return allDone();
      const s = steps[i++];
      const el = document.getElementById(s.id);
      const tm = el.querySelector('.timer');
      let r = s.secs;
      tm.textContent = formatTime(r);
      el.classList.add('active');

      const iv = setInterval(() => {
        r--;
        tm.textContent = formatTime(r);
        if (r <= (s.secs === 60 ? 60 : 30)) tm.classList.add('countdown-large','blink');
        if (r <= 0) {
          clearInterval(iv);
          next();
        }
      }, 1000);
    }
    next();
  }

  // === ABSCHLUSS (5) ===
  function handleAbschlussSection() {
    const wrap = document.querySelector('#abschlussSection .video-wrapper');
    wrap.innerHTML = '';
    const v7 = document.createElement('video');
    v7.src = 'video7.mp4';
    v7.playsInline = true;
    wrap.appendChild(v7);
    v7.play().catch(() => {});
    v7.onended = () => {
      const ov = document.getElementById('abschlussOverlay');
      ov.classList.add('active');
      confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
      // Applaus: falls du applause.mp3 hinzufügst:
      // new Audio('applause.mp3').play();
    };
  }

  // Helfer
  function formatTime(secs) {
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    return `${m}:${s}`;
  }
});
