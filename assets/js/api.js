/**
 * api.js
 *
 * Client for the alquran.cloud REST API v1.
 * Responses are cached in memory to minimise redundant network requests
 * within a single session.
 */

const API_BASE = 'https://api.alquran.cloud/v1';
const _cache   = Object.create(null);

/**
 * Fetches a URL, returns parsed JSON data, and caches the result.
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
async function apiFetch(url) {
  if (_cache[url] !== undefined) return _cache[url];
  const res  = await fetch(url);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`API error ${json.code}: ${json.status}`);
  _cache[url] = json.data;
  return json.data;
}

/**
 * Fetches the Arabic text and English translation for a verse.
 *
 * @param {number} verseNumber - Global verse number (1–6236)
 * @returns {Promise<{ arabic: object, english: object }>}
 */
async function fetchVerse(verseNumber) {
  const data = await apiFetch(
    `${API_BASE}/ayah/${verseNumber}/editions/quran-uthmani,en.sahih`
  );
  return { arabic: data[0], english: data[1] };
}
