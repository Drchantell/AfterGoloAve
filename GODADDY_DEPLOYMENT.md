# Deploy AfterGlowAve on GoDaddy Node.js Hosting

Author: Dr. Chantell McDowell

This is the **Node.js application**, not a WordPress theme. Do not upload `server.cjs` or the complete repository into a WordPress post, page, plugin, or theme folder.

## GoDaddy setup (recommended)

1. Sign in to [GoDaddy Node.js Hosting](https://www.godaddy.com/hosting/nodejs) with the account that owns **afterglowave.com**.
2. Select **Connect GitHub**. Authorize the GitHub connection if asked.
3. Choose repository **Drchantell/AfterGoloAve** (the original repository has not yet been renamed), branch **main**, and name the application **AfterGlowAve**.
4. Select **Import & Deploy** to create the GoDaddy-hosted private preview.
5. Check the preview URL before publishing. At a minimum test the homepage, **Explore Cities**, **Arcade**, **My Account**, and `/api/health`. The health endpoint should respond with `{"ok":true,"service":"AGA"}`.
6. Read the **Runtime Logs** for startup failures. This code requires **Node.js 22.13 or newer** because it uses Node's built-in SQLite module; the GoDaddy Node.js 22 runtime is suitable if its minor version meets that minimum.
7. When the preview is acceptable and you have a qualifying Web Hosting plan with an available app slot, select **Publish to Live**. Under app **Settings**, attach the already-owned **afterglowave.com** domain. If GoDaddy controls DNS, its Node.js Hosting flow can update the domain mapping. Verify HTTPS and both `afterglowave.com` and `www.afterglowave.com` as applicable.
8. After domain activation, reload the domain in an incognito browser and ensure it shows AfterGlowAve, **not** the starter WordPress blog. Only after verifying the new app is live should you retire the starter WordPress site.

For GoDaddy UI references:
- [Node.js Hosting information and requirements](https://www.godaddy.com/help/what-is-nodejs-hosting-42915)
- [Connect a GitHub-hosted Node.js app](https://www.godaddy.com/help/deploy-my-cursor-or-claude-app-with-nodejs-hosting-42908)
- [Upload a ZIP instead](https://www.godaddy.com/help/upload-my-ai-generated-app-to-nodejs-hosting-42987)

**Do not use GoDaddy Website Builder or Managed WordPress as the deployment destination for this Node server.** If your GoDaddy account shows only a domain registration or WordPress hosting, you may need a Web Hosting plan with an available Node.js app slot; the domain registration alone does not provide application hosting. Review any payment before buying.

## Application configuration

GoDaddy imports the root `package.json`, which specifies:
- `main: server.cjs`
- `npm run build`: checks the server script syntax
- `npm start`: launches the server
- `PORT`: automatically provided by the host
- Node.js 22.13+

For previews you may leave `PUBLIC_ORIGIN` unset. In production, if you configure it, use exactly:
```
NODE_ENV=production
PUBLIC_ORIGIN=https://afterglowave.com
```
GoDaddy may set `NODE_ENV` for you; do not override a host-provided `PORT` value. `PUBLIC_ORIGIN` is optional at boot so the private HTTPS preview can start before a custom domain exists. If it is set to a production domain during preview, cross-origin POST requests on the preview address will be blocked by the security check.

## Member data and launch safety

This project currently uses **local SQLite** at `data/afterglow.sqlite`, or at `DATABASE_PATH` if supplied. GoDaddy's Node.js Hosting docs do not establish that this exact private directory survives deployments, restarts and rebuilds. Before collecting real member registrations or safety reports:
- Confirm a **private persistent database** path/service on your actual GoDaddy app and its backup/restore procedure. **Never** put password hashes, tokens, safety reports, or the SQLite DB in a publicly served `public/assets` folder.
- Verify logins persist after a redeploy and restart without making the database web-accessible.
- Add email verification, account deletion, password recovery, moderation, privacy policy, terms, and appropriate age safeguards, then security-test the production deployment.

**Current scope:** landing page, city search, two local arcade games, member accounts, saved cities, and safety reports in source. **Not yet implemented:** live member video calls, live multiplayer gaming, payment/subscription checkout, and production-ready account management. Do not charge for unavailable features.

## If you prefer ZIP upload

Use GitHub **Code → Download ZIP** from `Drchantell/AfterGoloAve`, then unzip it. Create a new ZIP containing the **files at the root** (starting with `package.json`, `server.cjs`, `index.html`, `assets/`, `play/`), not the outer `AfterGoloAve-main/` folder. Exclude `.git`, `node_modules`, `.env`, logs, and database files. Upload using GoDaddy Node.js Hosting's **Upload ZIP** option.

## Common troubleshooting

- **WordPress "Hello world!"** means the domain still points at the starter WordPress installation; connect the domain to the published Node.js app instead.
- **GoDaddy missing entry point/build script:** Pull the latest `main` branch; these required fields are included.
- **Startup failure "Cannot find module node:sqlite":** Check the runtime is Node 22.13+.
- **`/api/health` not found or errors:** Check the server logs, selected branch, and startup command.
- **Accounts work in preview but not on the live domain:** Check the HTTPS origin, session cookies, data storage and application logs.
- **Domain still displays old website:** Confirm the app is published and the domain is attached to that app. Allow for DNS/cache refresh; confirm the correct GoDaddy product has the domain assignment.

## Validation

In a supported Node.js environment run `npm run build` and `npm test`. GitHub Actions also runs browser tests. Check [AGA checks](https://github.com/Drchantell/AfterGoloAve/actions) for the latest results before publishing.
