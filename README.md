# Portfolio Website (Vite + React)

A modern, animated personal portfolio with a **built-in WordPress-style admin panel** —
edit every section, recolor the theme, and reorder content without touching code.

## Highlights
- **Vite + React + Tailwind + Framer Motion**
- **Spinning globe.gl hero** (dotted world map, animated arcs/rings) rising from the bottom as a background horizon
- **Reactive magnetic buttons**, custom trailing cursor, scroll-progress bar, scroll-reveal animations
- **Data-driven content** — one source of truth in `src/content/defaultContent.js`
- **Admin panel** at `#/admin` — edit Hero/About/Services/Skills/Portfolio/Contact/Footer, theme colors & fonts, custom CSS, import/export

## Run locally
```bash
npm install
npm run dev      # http://localhost:5178
```

## Editing content
1. Open the site and go to **`/#/admin`** (or click the small gear, bottom-left).
2. Password: **`kamiladminkerja2026`** (change it under **Advanced → Change admin password**).
3. Edit anything — changes save to this browser (localStorage) instantly.

## Publishing on GitHub Pages
Browser edits are local to your machine. To publish your content to visitors:
1. In the admin panel: **Advanced → Download content.json**.
2. Put that file in **`public/content.json`**, commit and push.
3. On load, the site reads `public/content.json`; your local edits act as a working draft on top.

### Build & deploy
```bash
npm run build    # outputs to dist/
```
- If deploying to a **project** page (`username.github.io/repo`), set `base: "/repo/"` in `vite.config.js`.
- For a **user/root** page (`username.github.io`), leave `base: "/"`.
- Push `dist/` to your Pages branch (or use the `gh-pages` package / a GitHub Action).

## Notes
- The admin password is a **client-side** gate (a light lock, not real security) — fine for a personal site.
- The globe reads the accent color at load; changing the accent in the Theme tab re-colors it on the next reload.
