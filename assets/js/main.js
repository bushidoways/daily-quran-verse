/**
 * main.js
 *
 * Application entry point.
 * Coordinates initial verse loading and regenerate interaction.
 */

let currentVerseNumber = null;

// ── Load verse ────────────────────────────────────────────────────────────────

/**
 * Fetches and renders a verse by number.
 * On first load shows the loading state; on regenerate swaps content in place.
 *
 * @param {number} [verseNumber] - Defaults to today's daily verse
 */
async function loadVerse(verseNumber) {
  const n = verseNumber !== undefined ? verseNumber : getDailyVerseNumber();
  const isFirstLoad = currentVerseNumber === null;
  const btn = $('regen-btn');

  if (isFirstLoad) {
    showState('state-loading');
  } else {
    btn.disabled = true;
    btn.classList.add('spinning');
  }

  try {
    const verse = await fetchVerse(n);
    currentVerseNumber = n;
    renderVerse(verse, !isFirstLoad);
    showState('state-main');
  } catch (err) {
    console.error('Failed to load verse:', err);
    showState('state-error');
  } finally {
    if (!isFirstLoad) {
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('spinning');
      }, 400);
    }
  }
}

// ── Event listeners ───────────────────────────────────────────────────────────

$('regen-btn').addEventListener('click', () => {
  loadVerse(getRandomVerseNumber(currentVerseNumber));
});

$('retry-btn').addEventListener('click', () => loadVerse());

// ── Boot ──────────────────────────────────────────────────────────────────────

initParticles();
loadVerse();
