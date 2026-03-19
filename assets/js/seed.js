/**
 * seed.js
 *
 * Deterministic, non-repeating verse selection.
 *
 * Each visitor is assigned a persistent numeric seed stored in localStorage.
 * On each visit, a year-keyed shuffle of all 6,236 verse indices is generated
 * using the mulberry32 PRNG. The day of the year determines which index is
 * served, ensuring no repetition within a 365-day window.
 */

const TOTAL_VERSES = 6236;
const STORAGE_KEY  = 'odov_seed';

/**
 * Mulberry32 seeded pseudo-random number generator.
 *
 * @param {number} seed
 * @returns {function(): number} Returns values in [0, 1)
 */
function createRng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle using a seeded RNG.
 *
 * @param {number[]} arr
 * @param {number} seed
 * @returns {number[]}
 */
function seededShuffle(arr, seed) {
  const rng = createRng(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Returns a persistent numeric user seed. Creates and stores one if absent.
 *
 * @returns {number}
 */
function getUserSeed() {
  let seed = localStorage.getItem(STORAGE_KEY);
  if (!seed) {
    seed = String(Math.floor(Math.random() * 9999999));
    localStorage.setItem(STORAGE_KEY, seed);
  }
  return Number(seed);
}

/**
 * Returns the 1-based day of year for a given date.
 *
 * @param {Date} [date]
 * @returns {number}
 */
function getDayOfYear(date = new Date()) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((date - yearStart) / 86400000);
}

/**
 * Returns today's verse number (1-indexed, alquran.cloud global numbering).
 *
 * @returns {number}
 */
function getDailyVerseNumber() {
  const shuffleSeed = getUserSeed() ^ (new Date().getFullYear() * 7919);
  const indices = Array.from({ length: TOTAL_VERSES }, (_, i) => i + 1);
  const shuffled = seededShuffle(indices, shuffleSeed);
  return shuffled[(getDayOfYear() - 1) % 365];
}

/**
 * Returns a random verse number, excluding the one currently displayed.
 *
 * @param {number} exclude - Verse number to skip
 * @returns {number}
 */
function getRandomVerseNumber(exclude) {
  let n;
  do { n = Math.floor(Math.random() * TOTAL_VERSES) + 1; } while (n === exclude);
  return n;
}
