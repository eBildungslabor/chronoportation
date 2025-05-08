// script.js
document.addEventListener('DOMContentLoaded', () => {
  let runThrough = false;  // true nach Start-Countdown, false nach manueller Navi

  const sections = document.querySelectorAll('.section');
  const navButtons = {
    startSection:       document.getElementById('navStart'),
    halloSection:       document.getElementById('navHallo'),
    einstiegSection:    document.getElementById('navEinstieg'),
    impulsSection:      document.getElementById('navImpuls'),
    vorstellungSection: document.getElementById('navVorstellung'),
    abschlussSection:   document.getElementById('navAbschluss')
  };

  // =============== START-BUTTONS ===============
  window.goTo = (target, seconds) => {
    runThrough = (target === 'countdown');
    if (target === 'countdown') {
      // Countdown-Flow starten
      activateRaw('startSection', 'countdownSection');
      startCountdown(seconds);
    } else {
      // Sofort-Flow: direkt in die Ziel-Sektion
      activateSection(target + 'Section');
    }
  };

  // =============== FOOTER-NAVI ===============
  window.activateSection = (sectionId) => {
    runThrough = false;  // Manueller Sprung unterbricht Durchlauf
    activateRaw(null, sectionId);
    // dann Sequenz dieser Sektion starten
    startSectionSequence(sectionId);
  };

  // Gemeinsame Aktivierungs-Logik
  function activateRaw(fromId, toId) {
    sections.forEach(s => s.classList.remove('active'));
    Object.values(navButtons).forEach(b => b.classList.remove('active'));

    if (fromId) document.getElementById(fromId).classList.remove('active');
    const sec = document.getElementById(toId);
    sec.classList.add('active');

    if (navButtons[toId]) navButtons[toId].classList.add('active');
  }

  // =============== COUNTDOWN ===============
  function startCountdown(seconds) {
    let remaining = seconds;
    const timerEl = document.getElementById('countdownTimer');
    timerEl.textContent = formatTime(remaining);

    const iv = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(iv);
        // Countdown vorbei → automatisch in Hallo-Sektion
        activateRaw('countdownSection', 'halloSection');
        startSectionSequence('halloSection');
      } else {
        timerEl.textContent = formatTime(remaining);
      }
    }, 1000);
  }

  // =============== SEQUENZ-START ===============
  function startSectionSequence(sectionId) {
    switch (sectionId) {
      case 'halloSection':
        handleHalloSection();
        break;
      case 'einstiegSection':
        handleEinstiegSection();
        break;
      case 'impulsSection':
        handleImpulsSection();
        break;
      case 'vorstellungSection':
        handleVorstellungSection();
        break;
      case 'abschlussSection':
        handleAbschlussSection();
        break;
      default:
        break;
    }
  }

  // =============== HALLO-SEKTION ===============
  function handleHalloSection() {
    const wrapper = document.querySelector('#halloSection .video-wrapper');
    const overlay = document.getElementById('halloOverlay');
    wrapper.innerHTML = '';
    // 1) Video1
    const v1 = document.createElement('video');
    v1.id = 'video1';
    v1.src = 'video1.mp4';
    v1.playsInline = true;
    wrapper.appendChild(v1);
    v1.play().catch(() => {});
    // Konfetti + Zeit/Ort-Overlay
    confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
    document.getElementById('currentTime').textContent     = new Date().toLocaleTimeString();
    document.getElementById('currentLocation').textContent = 'Ort: Berlin, Deutschland';
    overlay.classList.add('active');
    // nach 15s Overlay aus & Video2 starten
    setTimeout(() => {
      overlay.classList.remove('active');
      playVideo2();
    }, 15000);
  }

  function playVideo2() {
    const wrapper = document.querySelector('#halloSection .video-wrapper');
    wrapper.innerHTML = '';
    // 2) Video2
    const v2 = document.createElement('video');
    v2.id = 'video2';
    v2.src = 'video2.mp4';
    v2.playsInline = true;
    wrapper.appendChild(v2);
    v2.play().catch(() => {});
    v2.onended = showIframeThenVideo3;
  }

  function showIframeThenVideo3() {
    // 3) Iframe-Overlay
    const sec = document.getElementById('halloSection');
    const ov = document.createElement('div');
    ov.className = 'overlay active';
    ov.innerHTML = '<iframe src="#" class="iframe-placeholder"></iframe>';
    sec.appendChild(ov);
    setTimeout(() => {
      ov.remove();
      playVideo3WithFade();
    }, 5000);
  }

  function playVideo3WithFade() {
    const wrapper = document.querySelector('#halloSection .video-wrapper');
    wrapper.innerHTML = '';
    // fade-out vorher sicherstellen
    wrapper.style.opacity = 0;
    wrapper.style.transition = 'opacity 1s';
    // 4) Video3
    const v3 = document.createElement('video');
    v3.id = 'video3';
    v3.src = 'video3.mp4';
    v3.playsInline = true;
    wrapper.appendChild(v3);
    // fade-in
    requestAnimationFrame(() => { wrapper.style.opacity = 1; });
    v3.play().catch(() => {});
    v3.onended = () => {
      // fade-out
      wrapper.style.opacity = 0;
      wrapper.ontransitionend = () => {
        // Ende Hallosektion → ggf. weiter
        if (runThrough) {
          activateRaw('halloSection', 'einstiegSection');
          startSectionSequence('einstiegSection');
        }
      };
    };
  }

  // =============== EINSTIEG-SEKTION ===============
  function handleEinstiegSection() {
    const wrapper = document.querySelector('#einstiegSection .video-wrapper');
    wrapper.innerHTML = '';
    const v4 = document.createElement('video');
    v4.id = 'video4';
    v4.src = 'video4.mp4';
    v4.playsInline = true;
    wrapper.appendChild(v4);
    v4.play().catch(() => {});
    v4.onended = () => {
      showAufgabeOverlay(
        'einstiegOverlay',
        300,
        () => {
          if (runThrough) {
            activateRaw('einstiegSection', 'impulsSection');
            startSectionSequence('impulsSection');
          }
        }
      );
    };
  }

  // =============== IMPULS-SEKTION ===============
  function handleImpulsSection() {
    const wrapper = document.querySelector('#impulsSection .video-wrapper');
    wrapper.innerHTML = '';
    const v5 = document.createElement('video');
    v5.id = 'video5';
    v5.src = 'video5.mp4';
    v5.playsInline = true;
    wrapper.appendChild(v5);
    v5.play().catch(() => {});
    v5.onended = () => {
      showAufgabeOverlay(
        'impulsOverlay',
        300,
        () => {
          if (runThrough) {
            activateRaw('impulsSection', 'vorstellungSection');
            startSectionSequence('vorstellungSection');
          }
        }
      );
    };
  }

  // Zweck: Generische Overlay-Aufgabe mit Timer
  function showAufgabeOverlay(overlayId, seconds, onComplete) {
    const ov = document.getElementById(overlayId);
    const timerEl = ov.querySelector('.timer');
    let remaining = seconds;
    timerEl.textContent = formatTime(remaining);
    ov.classList.add('active');
    const iv = setInterval(() => {
      remaining--;
      timerEl.textContent = formatTime(remaining);
      if (remaining <= 30) {
        timerEl.classList.add('countdown-large', 'blink');
      }
      if (remaining <= 0) {
        clearInterval(iv);
        ov.classList.remove('active');
        onComplete();
      }
    }, 1000);
  }

  // =============== VORSTELLUNG-SEKTION ===============
  function handleVorstellungSection() {
    const wrapper = document.querySelector('#vorstellungSection .video-wrapper');
    wrapper.innerHTML = '';
    const v6 = document.createElement('video');
    v6.id = 'video6';
    v6.src = 'video6.mp4';
    v6.playsInline = true;
    wrapper.appendChild(v6);
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

  // Schrittweises Overlay mit Timer
  function runOverlaySteps(steps, allDone) {
    let idx = 0;
    function next() {
      if (idx > 0) {
        document.getElementById(steps[idx-1].id).classList.remove('active');
      }
      if (idx >= steps.length) {
        allDone();
        return;
      }
      const step = steps[idx];
      const el = document.getElementById(step.id);
      const timerEl = el.querySelector('.timer');
      let remaining = step.secs;
      timerEl.textContent = formatTime(remaining);
      el.classList.add('active');

      const iv = setInterval(() => {
        remaining--;
        timerEl.textContent = formatTime(remaining);
        if (remaining <= (step.secs === 60 ? 60 : 30)) {
          timerEl.classList.add('countdown-large', 'blink');
        }
        if (remaining <= 0) {
          clearInterval(iv);
          idx++;
          next();
        }
      }, 1000);
    }
    next();
  }

  // =============== ABSCHLUSS-SEKTION ===============
  function handleAbschlussSection() {
    const wrapper = document.querySelector('#abschlussSection .video-wrapper');
    wrapper.innerHTML = '';
    const v7 = document.createElement('video');
    v7.id = 'video7';
    v7.src = 'video7.mp4';
    v7.playsInline = true;
    wrapper.appendChild(v7);
    v7.play().catch(() => {});
    v7.onended = () => {
      const ov = document.getElementById('abschlussOverlay');
      ov.classList.add('active');
      // Konfetti noch einmal
      confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
      // optional: Applaus-Audio abspielen, wenn verfügbar
      // const applause = new Audio('applause.mp3'); applause.play();
    };
  }

  // =============== HILFSFUNKTION ===============
  function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }
});
