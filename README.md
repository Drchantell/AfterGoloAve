# AfterGlowAve

Author: Dr. Chantell McDowell

## Current features

This repository contains a responsive landing page, a searchable alphabetical sample city directory, an arcade with local tic-tac-toe and dice, and a **Node.js + SQLite account API**. Registration, sign-in, sign-out, saved favorite cities, and safety-report submission are implemented in source code.

Member video calls, live multiplayer rooms, billing/subscriptions, email verification, password recovery, moderation dashboard, and app-store builds **are not implemented**. Do not sell memberships or advertise real member-to-member video calls before those features are integrated and tested.

## Run locally

Install Node.js 22.13 or newer (which includes `node:sqlite`), then:

```bash
npm start
```

Visit http://localhost:3000. **Use this URL, not a double-clicked `file://` page, for accounts and saved cities.** The backend creates its local database in `data/afterglow.sqlite`.

```bash
npm test
```

Tests are provided for health, page routes, account registration and sign-in, saved cities, safety reports, and sign-out. Tests create a temporary SQLite database. **These automated tests have been added but have not yet been executed against a running Node server in this session.** A static syntax check passed for all HTML scripts, the Node server and test script.

## Production checklist

Use a managed HTTPS host that supports long-running Node.js services and a persistent private data volume. A static GoDaddy website upload alone will not serve the account API. Configure:

```text
NODE_ENV=production
PUBLIC_ORIGIN=https://afterglowave.com
DATABASE_PATH=/private-volume/afterglow.sqlite
PORT=3000
```

Use the actual final domain and filesystem path from your host; do not copy the example path blindly. Put the Node service behind a properly configured HTTPS reverse proxy. Set up backups and restricted administrative access to stored safety reports. Review rate-limiting and abuse prevention for multi-instance deployments. Obtain an external security review before collecting real user data.

Additional production requirements: verified adult access/age safeguards, email verification, password reset, account deletion/data export, privacy policy and terms, consent and blocking/reporting workflows, active moderation and escalation, payments with verified server-side webhooks, video service and permissions, end-to-end automated browser tests, and app-store compliance review.

## Files

- `index.html`: landing and navigation
- `cities.html`: alphabetical searchable location directory (illustrative locations)
- `arcade.html`: local games
- `account.html`: member portal and reports
- `server.cjs`: same-origin HTTP API with SQLite and salted password hashing
- `test/api.test.cjs`: test cases
- `assets/aga-neon.webp`: logo

No payment credentials or production secrets belong in this public repository.
