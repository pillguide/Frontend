# Deployment routing

Vercel's Git integration deploys `main` to Production and other branches/PRs to Preview.

| Vercel environment | Same-origin API proxy destination |
|---|---|
| Production | `https://api.pillguide.site` |
| Preview | `https://dev-api.pillguide.site` |

`vercel.ts` selects the destination using the deployment's `VERCEL_ENV`. Both Vite builds set `import.meta.env.PROD` to true, so that flag cannot distinguish Preview from Production.

`/api/*`, `/oauth2/*`, and `/login/oauth2/*` pass through Vercel to Cloudflare, then the matching EC2/k3s namespace. Other paths use the SPA fallback. API responses are not cached. Keep `VITE_API_URL` and `VITE_API_BASE_URL` unset in Vercel so browser requests stay same-origin instead of bypassing the proxy.

API responses include `X-PillGuide-Environment` for checking the deployment's selected environment. Preview URLs require Vercel authentication: a redirected HTTP 200 with title `Login – Vercel` is the protection page, not an application response. Verify with an authenticated browser or `vercel curl`; do not disable deployment protection.

Backend CI maps Backend `develop` to `manifest/main:dev/deployment.yaml` and Backend `main` to `manifest/main:production/deployment.yaml`. Each environment currently runs one Backend replica; brief API unavailability during replacement is accepted. Preview OAuth requires an allowed callback URL before real login can work.

## Build checks

Use Node.js 24 and run `npm ci`, then `npm run verify`. Verification runs ESLint, dependency-free Node tests for environment routing and proxy response headers, then the existing TypeScript/Vite build. `vercel.ts` sets the same command for Vercel builds, so a failed check stops that deployment. Push deployment behavior and branch targets remain unchanged; no manual approval is required.
