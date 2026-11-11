# aditya-me13.github.io

Personal portfolio of **Aditya Mehta**: built from scratch with React, Vite, TypeScript and Framer Motion.

## Edit content
All text, links and placeholders live in **`src/data/profile.ts`**.
Placeholders at the top of the file (`PLACEHOLDER_…`) render as disabled “Coming soon” buttons or are hidden until you fill them in:

- `DEGREE_URL`, `TRANSCRIPT_URL`: Google Drive share links (set to “Anyone with the link can view”)
- `CURRENT_ROLE`: title, team, location and start date at Barclays

Static files (résumé, certificates, photo, `/survey`) live in `public/` and are served as is.

## Develop
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build → dist/
npm run preview   # serve dist/
```

## Deploy
Every push to `master` builds and deploys through `.github/workflows/deploy.yml`.
One-time setup: **GitHub → Settings → Pages → Source → GitHub Actions**.

## Features
- Interactive “market data” canvas hero that reacts to the cursor
- ⌘K / Ctrl-K / `/` command palette: jump to sections, open projects and documents, copy email, toggle theme
- Filterable projects, linked to skills (click a skill to filter projects)
- Scroll-driven experience timeline, animated CPI counter, tabbed leadership roles
- Dark and light themes, respects `prefers-reduced-motion`, responsive down to 360px
- `404.html` redirects old Jekyll URLs (`/Internships/`, `/Projects/…`, `/pors/` …) to the new sections
