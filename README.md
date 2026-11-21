# AfterGlowAve

Author: Dr. Chantell McDowell

## Current repository

This GitHub repository contains a **static landing-page preview** of AfterGlowAve:

- `index.html` — responsive landing page, visible sections, and working in-page navigation
- `assets/aga-neon.webp` — logo and favicon

The source files for the described full-stack app (games, member accounts, Node.js backend, database, video calls, and payments) are **not present in this repository**. Do not treat the landing page as proof those features are live.

## Preview locally

Open `index.html` in a browser, or from the repository folder run `python3 -m http.server 8000` and open `http://localhost:8000`.

## Link checks

All visible navigation links point to existing section IDs: `#home`, `#experience`, `#membership`, `#about`, and `#main`. The calls to action go to the Experience and Membership sections. No disabled placeholder purchase or registration buttons are displayed.

## Next integration step

Commit the complete full-stack source after reviewing it for security and secrets. Run its API, browser, payment, and multiplayer tests separately before deploying to the production domain.
