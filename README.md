# Daily Quran Verse

A lightweight, browser-based web application that delivers one Quran verse per day to each visitor. Verses are drawn from all 6,236 ayat and rotate daily without repetition over a 365-day window, uniquely sequenced per user. A regenerate button allows loading an additional random verse on demand.

No backend, no build step, no dependencies beyond a web browser.

---

## Features

- One verse per visitor per day, non-repeating over a 365-day window
- Unique per-user sequence derived from a persistent browser seed
- Arabic text with English translation (Sahih International)
- Regenerate button to load any additional random verse on demand
- Live data from the alquran.cloud public API with session-level response caching
- Animated ambient background with floating particles
- Responsive layout for desktop and mobile

---

## Project Structure

```
daily-quran-verse/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css       # All styles and animations
│   └── js/
│       ├── seed.js         # RNG, daily verse selection, and random verse
│       ├── api.js          # alquran.cloud API client with caching
│       ├── ui.js           # DOM helpers, renderer, and particles
│       └── main.js         # Application entry point
├── .gitignore
└── LICENSE
```

---

## Getting Started

Clone the repository and open `index.html` directly in a browser. No installation required.

```bash
git clone https://github.com/bushidoways/daily-quran-verse.git
cd daily-quran-verse
open index.html
```

For live reload during development, use any static file server:

```bash
npx serve .
# or
python3 -m http.server 3000
```

---

## How Verse Selection Works

Each visitor is assigned a random numeric seed stored in `localStorage` under the key `odov_seed`. On every visit, the application computes a year-keyed shuffled sequence of all 6,236 verse indices using a mulberry32 pseudo-random number generator (seeded with `userSeed XOR (year * 7919)`). The 1-based day of the year is used as an index into that sequence.

The result is a deterministic, personalized, non-repeating verse rotation. The sequence changes each calendar year.

Pressing "Another verse" loads a separately randomized verse that is excluded from the daily rotation logic.

---

## API Reference

Verse data is sourced from the [alquran.cloud API](https://alquran.cloud/api) (free, no authentication required).

| Endpoint | Content |
|---|---|
| `/v1/ayah/{n}/editions/quran-uthmani,en.sahih` | Arabic text and English translation (Sahih International) |

API responses are cached in memory for the duration of the session to avoid duplicate requests.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
