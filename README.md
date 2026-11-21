# AfterGlowAve

Author: Dr. Chantell McDowell

## Working static preview

This repository now includes:

- `index.html`: responsive landing page with working navigation to cities and the arcade.
- `cities.html`: alphabetically sorted sample directory with country filter and live city/state search.
- `arcade.html`: playable, local two-player tic-tac-toe, reset button, and two-dice roller.
- `assets/aga-neon.webp`: logo.

## Run

Open `index.html` in your browser, or run `python3 -m http.server 8000` from the repository directory and open `http://localhost:8000`.

## Validated

Checked that all HTML documents contain syntactically valid inline JavaScript and that every internal link on all three pages resolves to an existing repository file or in-page anchor. Interactive UI behavior has not been exercised in a real browser.

## Not ready for production launch

This repository does not contain a full-stack application. User registration, private accounts, payments, video calls, online multiplayer games, and hosted virtual rooms are **not implemented** in these files. The city listings are sample directory entries, not live rooms.

Before launching the full app: add and security-review its actual source, configure secure authentication, video and payment providers, implement server-side purchase checks, enable account moderation/reporting, run end-to-end browser and API tests, and deploy to a suitable HTTPS host. Do not place production credentials in GitHub.
