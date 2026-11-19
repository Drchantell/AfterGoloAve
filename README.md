# AfterGlowAve.com

Author Dr. Chantell McDowell

A standalone virtual-city dating experience with browser-based city guides and
games, an account interface, and a same-origin Node.js API backed by SQLite.

## Run and edit

Download and extract `AfterGlowAve-Full-Stack.zip`. Open the extracted folder
in VS Code and use that folder for the commands and paths below. This repository
currently contains the website entry page. The ZIP contains the full-stack source.

Use Node.js 24 or newer. From this folder run `npm start`, then visit
`http://localhost:3000`. Run `npm test` to exercise the HTTP API against a fresh,
temporary on-disk database. No dependency installation is required.

| What to edit | File |
| --- | --- |
| Home, navigation, and branding | `public/index.html`, `public/styles.css` |
| Virtual cities and soundtracks | `public/cities.js`, `public/assets/` |
| City pages, communities, couples' games and testimonials | `public/app.js` |
| Arcade | `public/arcade.html`, `public/arcade.js` |
| Registration, sign-in, private profiles and saved cities | `public/account.html`, `public/account.js` |
| API and database schema | `server.cjs` |

Import `postman/AfterGlowAve.postman_collection.json`. Leave the cookie jar
enabled and run the requests in order against a development copy. The tests
create a synthetic member, exercise account and location endpoints, and sign
out at the end. The synthetic member remains in the development database.

## Launch on HTTPS

Use a Node.js 24+ web service with a persistent private directory and a single
app instance. Serve the frontend and API from this same service. A static-only
upload or a PHP-only hosting plan cannot run the Node process. Confirm Node
runtime and persistent storage support on your hosting plan before pointing the
domain at it.

Configure `NODE_ENV=production`, set `PUBLIC_ORIGIN` to the exact HTTPS origin
members will visit, and set `DATABASE_PATH` to a filename on the persistent
private volume, outside `public/`. For example, use
`PUBLIC_ORIGIN=https://afterglowave.com` and
`DATABASE_PATH=/var/data/afterglow.sqlite` if those match your deployment.
The service uses the host's `PORT` or defaults to 3000. Start it with
`npm start`, then verify `/api/health` and exercise sign-up, sign-in and
saved cities over HTTPS before sharing the site. Keep database backups private.

The database stores a display name, email, salted scrypt password hash, session
hashes, saved virtual cities, and submitted testimonials. It does not request a
street address, exact location, or date of birth. Members confirm they are 18+
when signing up. Testimonials are held privately in the database. The original
PHP submission handler is kept as reference for locating historical submissions
and is outside the Node public directory.

The video lounge uses a local camera preview and demo guests. Member-to-member
video, subscription payments, email verification and password reset are outside
this build.
