// script.js
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

  // Hilfsfunktion: stoppt und resettet alle Videos
  function stopAllVideos() {
    document.querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
  }

  // START-Flow: Klick auf „In X Min“ oder „Sofort“
  window.startPresentation = seconds => {
    stopAllVideos();
    runThrough = (seconds > 0);

    // Auswahl verbergen, Countdown einblenden
    document.getElementById('selectionContainer').style.display = 'none';
    document.getElementById('countdownContainer').classList.add('active');

    if (seconds > 0) {
      startCountdown(seconds, () => goToSection('halloSection'));
    } else {
      goToSection('halloSection');
    }
  };

  // Footer-Navigation
  window.activateSection = id => {
    stopAllVideos();
    runThrough = false;      // manueller Modus
    goToSection(id);
  };

  // Wechsel in eine Section (macht sie sichtbar + hebt Footer-Button hervor)
  function goToSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    Object.values(navButtons).forEach(b => b.classList.remove('active'));

    document.getElementById(id).classList.add('active');
    if (navButtons[id]) navButtons[id].classList.add('active');

    // Falls wir zurück zur Start-Section springen:
    if (id === 'startSection') {
      document.getElementById('selectionContainer').style.display = '';
      document.getElementById('countdownContainer').classList.remove('active');
    }

    // Starte die jeweilige Sektion
    startSectionSequence(id);
  }

  // Countdown für Start-Section
  function startCountdown(sec, callback) {
    let rem = sec;
    const el = document.getElementById('countdownTimer');
    el.textContent = formatTime(rem);
    const iv = setInterval(() => {
      rem--;
      if (rem <= 0) {
        clearInterval(iv);
        callback();
      } else {
        el.textContent = formatTime(rem);
      }
    }, 1000);
  }

  // Dispatcher, der je Section die richtige Routine anstößt
  function startSectionSequence(id) {
    switch (id) {
      case 'halloSection':       handleHallo();       break;
      case 'einstiegSection':    handleEinstieg();    break;
      case 'impulsSection':      handleImpuls();      break;
      case 'vorstellungSection': handleVorstellung(); break;
      case 'abschlussSection':   handleAbschluss();   break;
      default: break;
    }
  }

  // === Sektion „Hallo“ ===
  function handleHallo() {
    const wrap   = document.querySelector('#halloSection .video-wrapper');
    const ovTime = document.getElementById('timePlaceOverlay');
    const ovFrame= document.getElementById('iframeOverlay');
    [ovTime, ovFrame].forEach(o => o.classList.remove('active'));
    wrap.innerHTML = '';

    // a) video1.mp4 + Konfetti
    const v1 = document.createElement('video');
    v1.src = 'video1.mp4';
    v1.playsInline = true;
    wrap.appendChild(v1);

    v1.addEventListener('play', () => {
      confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
    }, { once: true });

    v1.play().catch(() => {});

    // b) Nach Ende von video1 → Ort/Time für 15s
    v1.onended = () => {
      document.getElementById('currentTime').textContent     = new Date().toLocaleTimeString();
      document.getElementById('currentLocation').textContent = 'Ort: Berlin, Deutschland';
      ovTime.classList.add('active');
      setTimeout(() => {
        ovTime.classList.remove('active');
        playVideo2();
      }, 15000);
    };

    // c) video2.mp4 abspielen
    function playVideo2() {
      wrap.innerHTML = '';
      const v2 = document.createElement('video');
      v2.src = 'video2.mp4';
      v2.playsInline = true;
      wrap.appendChild(v2);
      v2.play().catch(() => {});

      // d) Nach Ende → Iframe für 5s
      v2.onended = () => {
        ovFrame.classList.add('active');
        setTimeout(() => {
          ovFrame.classList.remove('active');
          playVideo3();
        }, 5000);
      };
    }

    // e) video3.mp4 mit Fade-Effekt
    function playVideo3() {
      wrap.style.opacity = 0;
      wrap.style.transition = 'opacity 1s';
      wrap.innerHTML = '';
      const v3 = document.createElement('video');
      v3.src = 'video3.mp4';
      v3.playsInline = true;
      wrap.appendChild(v3);
      requestAnimationFrame(() => wrap.style.opacity = 1);
      v3.play().catch(() => {});
      v3.onended = () => {
        wrap.style.opacity = 0;
        wrap.addEventListener('transitionend', () => {
          if (runThrough) goToSection('einstiegSection');
        }, { once: true });
      };
    }
  }

  // === Sektion „Einstieg“ ===
  function handleEinstieg() {
    const wrap = document.querySelector('#einstiegSection .video-wrapper');
    wrap.innerHTML = '';
    const v4 = document.createElement('video');
    v4.src = 'video4.mp4';
    v4.playsInline = true;
    wrap.appendChild(v4);
    v4.play().catch(() => {});
    v4.onended = () => {
      showTask('einstiegSection', 'Wie definiert ihr KI?', 300, () => {
        if (runThrough) goToSection('impulsSection');
      });
    };
  }

  // === Sektion „Impuls“ ===
  function handleImpuls() {
    const wrap = document.querySelector('#impulsSection .video-wrapper');
    wrap.innerHTML = '';
    const v5 = document.createElement('video');
    v5.src = 'video5.mp4';
    v5.playsInline = true;
    wrap.appendChild(v5);
    v5.play().catch(() => {});
    v5.onended = () => {
      showTask('impulsSection', 'Sucht Euch eine These und bearbeitet sie!', 300, () => {
        if (runThrough) goToSection('vorstellungSection');
      });
    };
  }

  // Gemeinsame Funktion für Aufgaben-Overlays mit Timer
  function showTask(secId, text, secs, done) {
    const sec = document.getElementById(secId);
    const ov  = document.createElement('div');
    ov.className = 'overlay active';
    ov.innerHTML = `
      <div>
        <h1>Aufgabe:</h1>
        <p>${text}</p>
        <div class="timer">${formatTime(secs)}</div>
      </div>`;
    sec.appendChild(ov);

    let rem = secs;
    const tm = ov.querySelector('.timer');
    const iv = setInterval(() => {
      rem--;
      tm.textContent = formatTime(rem);
      if (rem <= 30) tm.classList.add('countdown-large','blink');
      if (rem <= 0) {
        clearInterval(iv);
        ov.remove();
        done();
      }
    }, 1000);
  }

  // === Sektion „Vorstellung“ ===
  function handleVorstellung() {
    const wrap = document.querySelector('#vorstellungSection .video-wrapper');
    wrap.innerHTML = '';
    const v6 = document.createElement('video');
    v6.src = 'video6.mp4';
    v6.playsInline = true;
    wrap.appendChild(v6);
    v6.play().catch(() => {});
    v6.onended = () => {
      const steps = [
        { text: 'Erste Person bitte bereit machen', secs: 15 },
        { text: 'Erste Vorstellung!', secs: 60 },
        { text: 'Zweite Person bitte bereit machen', secs: 15 },
        { text: 'Zweite Vorstellung!', secs: 60 },
        { text: 'Dritte Person bitte bereit machen', secs: 15 },
        { text: 'Dritte Vorstellung!', secs: 60 }
      ];
      runOverlaySteps('vorstellungSection', steps, () => {
        if (runThrough) goToSection('abschlussSection');
      });
    };
  }

  function runOverlaySteps(secId, steps, done) {
    const sec = document.getElementById(secId);
    let i = 0;
    function next() {
      if (i >= steps.length) return done();
      const s = steps[i++];
      const ov = document.createElement('div');
      ov.className = 'overlay active';
      ov.innerHTML = `
        <div>
          <p>${s.text}</p>
          <div class="timer">${formatTime(s.secs)}</div>
        </div>`;
      sec.appendChild(ov);

      let rem = s.secs;
      const tm = ov.querySelector('.timer');
      const iv = setInterval(() => {
        rem--;
        tm.textContent = formatTime(rem);
        if (rem <= 30) tm.classList.add('countdown-large','blink');
        if (rem <= 0) {
          clearInterval(iv);
          ov.remove();
          next();
        }
      }, 1000);
    }
    next();
  }

  // === Sektion „Abschluss“ ===
  function handleAbschluss() {
    const wrap = document.querySelector('#abschlussSection .video-wrapper');
    wrap.innerHTML = '';
    const v7 = document.createElement('video');
    v7.src = 'video7.mp4';
    v7.playsInline = true;
    wrap.appendChild(v7);
    v7.play().catch(() => {});
    v7.onended = () => {
      document.getElementById('abschlussOverlay').classList.add('active');
      confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });
    };
  }

  // Hilfsfunktion mm:ss
  function formatTime(secs) {
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    return `${m}:${s}`;
  }
});
