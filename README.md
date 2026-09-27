
# Daniel Nyamongo — Portfolio

A single-page portfolio site built with React (via in-browser Babel — no build tooling required) and plain CSS.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page shell only — meta tags, font/CDN links, and the two `<script>` tags that load `style.css` and `script.js`. No styling or logic lives here anymore. |
| `style.css` | All visual styling: color tokens (light/dark theme), typography, layout grids, responsive breakpoints, buttons, cards, forms. |
| `script.js` | All behavior: the React components (`Header`, `Hero`, `About`, `Skills`, `Projects`, `Contact`, etc.), the theme toggle, mobile nav, project filtering, and contact-form validation. |

Splitting these apart (instead of one big HTML file) is standard practice because it separates three different concerns — **structure** (HTML), **presentation** (CSS), and **behavior** (JS) — so each can be edited, cached, and reasoned about independently. It also makes `style.css` easy to hand to a designer, or `script.js` easy to hand to another developer, without either needing to touch the other.

## Why the CSS is structured the way it is

- **CSS custom properties (`--bg`, `--accent`, etc.)** on `:root` instead of hard-coded colors, so the whole site's palette — including the light/dark theme swap — is controlled from one place.
- **`rem`/`clamp()`/`min()`/`vw`-based sizing** instead of fixed pixels wherever a value should scale with the viewport (headings, section padding, the profile-photo ring, the floating code card), so text and spacing shrink gracefully on small screens instead of overflowing.
- **Mobile-first breakpoints** at 560px, 640px, 820px, 880px, and 900px, matching where this specific layout actually breaks (3-column grids to 2 to 1, the nav collapsing to a hamburger, the hero stacking) rather than generic device-width guesses.
- **A safety net** (`overflow-x:hidden` on `html`/`body`, `max-width:100%` on media) so no single element can force horizontal scrolling on a phone.

## How to run it

Because `script.js` is loaded as an **external** `text/babel` script, the browser needs to fetch it over HTTP — opening `index.html` by double-clicking it (`file://...`) will fail in most browsers due to local-file CORS restrictions. Serve the folder instead:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed `localhost` URL.

## Known placeholders to replace before publishing

- Profile photo (currently a text placeholder in the hero)
- Project cards, GitHub stats, and commit counts are mock data
- Work-experience bullet points and location are placeholders