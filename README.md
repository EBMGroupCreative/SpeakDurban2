# Learn to Speak Durban

Campaign microsite for Gateway. A public service by Gateway.

## Run locally
Any static server works (the JSX files are loaded over HTTP, so opening index.html straight from disk won't work):

```
npx serve .
# or
python3 -m http.server 8000
```

## Deploy to GitHub Pages
1. Create a new repo and push the contents of this folder to the `main` branch (index.html at the repo root).
2. Repo → Settings → Pages → Source: "Deploy from a branch", Branch: `main`, folder `/ (root)`.
3. The site goes live at `https://<user>.github.io/<repo>/`.

## Routes
First visit lands on `#enrol` (email capture). `#enrol` · `#home` · `#dict` · `#exam` · `#exam/pass` · `#exam/fail` · `#act` · `#act/error` · `#act/game-01` … `#act/game-06` (full-screen games) · `#merch` · `#submit` · `#study` · `#card`

## Campaign layouts
`/campaign.html` — billboards, supersites, IG posts & stories, display banners (source: `templates/campaign/Campaign.dc.html`, styled by `_ds_bundle.js` + `styles.css`).

## Structure
- `index.html` — app entry, hash routing, mobile layout under 760px
- `styles.css` → `tokens/` — colours, type, spacing, surfaces, @font-face
- `assets/fonts/` — Switzer, IBM Plex Mono, Geist Pixel (licences included)
- `js/lsd-components.js` — compiled design-system components (Button, Window, SpecCard…)
- `js/*.jsx` — screens (lowercase filenames); `js/data.js` — dictionary, exam, leaderboard, merch copy

## Notes
- Study Pack downloads are mocked. For real offline use, add a service worker that pre-caches the site plus the PDF/MP3 packs.
- Enrolment and word submissions are mocked (saved to localStorage). Wire the marked `POST` spots in `js/Enrol.jsx` and `js/SubmitWord.jsx` to your CRM / form endpoint.
- React + Babel load from unpkg and JSX compiles in the browser. Fine for a campaign/prototype; for production, precompile with Vite or esbuild.
- Gateway logo is a placeholder box (Shell.jsx → Footer). Halftone areas use tonal placeholders; pass `src` to `Halftone` to use real photos.
