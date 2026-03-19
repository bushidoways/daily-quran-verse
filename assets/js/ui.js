/**
 * ui.js
 *
 * DOM manipulation, render helpers, and particle background.
 */

// ── DOM helpers ──────────────────────────────────────────────────────────────

function $(id) {
  return document.getElementById(id);
}

const STATE_IDS = ['state-loading', 'state-main', 'state-error'];

/**
 * Shows the specified state panel and hides the others.
 *
 * @param {'state-loading'|'state-main'|'state-error'} id
 */
function showState(id) {
  STATE_IDS.forEach(s => $(s).classList.toggle('hidden', s !== id));
}

// ── Render ────────────────────────────────────────────────────────────────────

/**
 * Populates the main verse view with API data.
 *
 * @param {{ arabic: object, english: object }} verse
 * @param {boolean} [animate=false]
 */
function renderVerse({ arabic, english }, animate = false) {
  $('surah-name').textContent  = `${arabic.surah.name}  ${arabic.surah.englishName}`;
  $('verse-ref').textContent   = `${arabic.surah.number}:${arabic.numberInSurah}`;
  $('arabic').textContent      = arabic.text;
  $('translation').textContent = english.text;
  $('date-label').textContent  = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (animate) {
    ['arabic', 'translation'].forEach(id => {
      const el = $(id);
      el.classList.remove('fade-up');
      void el.offsetWidth; // force reflow
      el.classList.add('fade-up');
    });
  }
}

// ── Particles ─────────────────────────────────────────────────────────────────

/**
 * Generates floating ambient particles and appends them to the container.
 */
function initParticles() {
  const container = $('particles');
  const fragment  = document.createDocumentFragment();

  for (let i = 0; i < 28; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size   = Math.random() * 3.5 + 1;
    const drift  = ((Math.random() - 0.5) * 90).toFixed(1);
    const isGold = Math.random() > 0.65;
    const color  = isGold ? '201,168,76' : '82,183,136';
    const opacity = (Math.random() * 0.35 + 0.1).toFixed(2);

    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `--drift:${drift}px`,
      `animation-duration:${(Math.random() * 14 + 10).toFixed(1)}s`,
      `animation-delay:-${(Math.random() * 14).toFixed(1)}s`,
      `background:rgba(${color},${opacity})`,
    ].join(';');

    fragment.appendChild(p);
  }

  container.appendChild(fragment);
}
