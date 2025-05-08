document.addEventListener('DOMContentLoaded', () => {
  let runThrough = false;           // Steuerung: Flow (true) vs. manuelle Navi (false)
  const sections = document.querySelectorAll('.section');
  const navButtons = {
    startSection:       document.getElementById('navStart'),
    halloSection:       document.getElementById('navHallo'),
    einstiegSection:    document.getElementById('navEinstieg'),
    impulsSection:      document.getElementById('navImpuls'),
    vorstellungSection: document.getElementById('navVorstellung'),
    abschlussSection:   document.getElementById('navAbschluss')
  };

  // 1) Aufruf aus Start-Buttons
  window.startPresentation = seconds => {
    runThrough = (seconds > 0);
    // Umschalten: Auswahl verstecken, Countdown einblenden (nur im Start-Section)
    document.getElementById('selectionContainer').style.display = 'none';
    document.getElementById('countdownContainer').classList.add('active');

    if (seconds > 0) {
      startCountdown(seconds, () => {
        // nach Countdown direkt in „Hallo“
        activateSection('halloSection');
        startSectionSequence('halloSection');
      });
    } else {
      // ohne Countdown direkt „Hallo“
      activateSection('halloSection');
      startSectionSequence('halloSection');
    }
  };

  // 2) Footer-Navigation
  window.activateSection = sectionId => {
    runThrough = false;                  // manuelles Springen bricht Flow ab
    showSection(sectionId);
    // beim manuellen Springen startet der Bereich sofort:
    startSectionSequence(sectionId);
  };

  // allgemeines Umschalten & Button-Highlight
  function showSection(id) {
    sections.forEach(s => s.classList.remove('active'));
    Object.values(navButtons).forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (navButtons[id]) navButtons[id].classList.add('active');

    // Falls wir zurück auf Start springen: Rücksetzen
    if (id === 'startSection') {
      document.getElementById('selectionContainer').style.display = '';
      document.getElementById('countdownContainer').classList.remove('active');
    }
  }

  // 3) Countdown
  function startCountdown(seconds, onEnd) {
    let rem = seconds;
    const el = document.getElementById('countdownTimer');
    el.textContent = formatTime(rem);
    const iv = setInterval(() => {
      rem--;
      if (rem <= 0) {
        clearInterval(iv);
        onEnd();
      } else {
        el.textContent = formatTime(rem);
      }
    }, 1000);
  }

  // 4) Bereichs-Sequenz
  function startSectionSequence(sectionId) {
    switch (sectionId) {
      case 'halloSection':       handleHallo();       break;
      case 'einstiegSection':    handleEinstieg();    break;
      case 'impulsSection':      handleImpuls();      break;
      case 'vorstellungSection': handleVorstellung(); break;
      case 'abschlussSection':   handleAbschluss();   break;
      default: break;
    }
  }

  // --- 4.1 HALLO ---
  function handleHallo() {
    const wrap = document.querySelector('#halloSection .video-wrapper');
    wrap.innerHTML = '';

    // a) Video1
    const v1 = document.createElement('video');
    v1.src = 'video1.mp4';
    v1.playsInline = true;
    wrap.appendChild(v1);
    v1.play().catch(() => {});

    // Konfetti beim Start
    confetti({ particleCount: 250, spread: 70, origin: { y: 0.6 } });

    // b) Nach Ende Video1 → Ortseinblendung 15s
    v1.onended = () => {
      showLocation(() => {
        // c) Video2
        const v2 = document.createElement('video');
        wrap.innerHTML = '';
        v2.src = 'video2.mp4';
        v2.playsInline = true;
        wrap.appendChild(v2);
        v2.play().catch(() => {});
        // d) nach Ende → weiter im Flow
        v2.onended = () => {
          if (runThrough) {
            activateSection('einstiegSection');
            startSectionSequence('einstiegSection');
          }
        };
      });
    };
  }

  // Location-Screen für 15 Sekunden
  function showLocation(onDone) {
    showSection('halloSection');
    const txt = document.getElementById('halloSection')
                  .querySelector('h1, p, video-wrapper')
                  || document.querySelector('#locationText');
    // wir wechseln hier nur visuell – deshalb ein Delay
    setTimeout(() => {
      onDone();
    }, 15000);
  }

  // --- 4.2 EINSTIEG ---
  function handleEinstieg() {
    const wrap = document.querySelector('#einstiegSection .video-wrapper');
    wrap.innerHTML = '';
    const v4 = document.createElement('video');
    v4.src = 'video4.mp4';
    v4.playsInline = true;
    wrap.appendChild(v4);
    v4.play().catch(() => {});
    v4.onended = () => {
      showTimerOverlay('einstiegSection', 'Wie definiert ihr KI?', 300, () => {
        if (runThrough) {
          activateSection('impulsSection');
          startSectionSequence('impulsSection');
        }
      });
    };
  }

  // --- 4.3 IMPULS ---
  function handleImpuls() {
    const wrap = document.querySelector('#impulsSection .video-wrapper');
    wrap.innerHTML = '';
    const v5 = document.createElement('video');
    v5.src = 'video5.mp4';
    v5.playsInline = true;
    wrap.appendChild(v5);
    v5.play().catch(() => {});
    v5.onended = () => {
      showTimerOverlay('impulsSection', 'Sucht Euch eine These und bearbeitet sie!', 300, () => {
        if (runThrough) {
          activateSection('vorstellungSection');
          startSectionSequence('vorstellungSection');
        }
      });
    };
  }

  // Universelle Aufgaben-Einblendung
  function showTimerOverlay(sectionId, text, secs, done) {
    showSection(sectionId);
    const ov = document.createElement('div');
    ov.className = 'overlay active';
    ov.innerHTML = `
      <div>
        <h1>Aufgabe:</h1>
        <p>${text}</p>
        <div class="timer">${formatTime(secs)}</div>
      </div>`;
    document.getElementById(sectionId).appendChild(ov);

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

  // --- 4.4 VORSTELLUNG ---
  function handleVorstellung() {
    const wrap = document.querySelector('#vorstellungSection .video-wrapper');
    wrap.innerHTML = '';
    const v6 = document.createElement('video');
    v6.src = 'video6.mp4';
    v6.playsInline = true;
    wrap.appendChild(v6);
    v6.play().catch(() => {});
    v6.onended = () => {
      runOverlaySteps([
        { text: 'Erste Person bitte bereit machen', secs: 15 },
        { text: 'Erste Vorstellung!', secs: 60 },
        { text: 'Zweite Person bitte bereit machen', secs: 15 },
        { text: 'Zweite Vorstellung!', secs: 60 },
        { text: 'Dritte Person bitte bereit machen', secs: 15 },
        { text: 'Dritte Vorstellung!', secs: 60 }
      ], () => {
        if (runThrough) {
          activateSection('abschlussSection');
          startSectionSequence('abschlussSection');
        }
      });
    };
  }

  function runOverlaySteps(steps, done) {
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
      document.getElementById('vorstellungSection').appendChild(ov);

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

  // --- 4.5 ABSCHLUSS ---
  function handleAbschluss() {
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
      // neuer Applaus-Sound hier, falls gewünscht
    };
  }

  // Hilfsfunktion mm:ss
  function formatTime(secs) {
    const m = String(Math.floor(secs/60)).padStart(2,'0');
    const s = String(secs%60).padStart(2,'0');
    return `${m}:${s}`;
  }
});
