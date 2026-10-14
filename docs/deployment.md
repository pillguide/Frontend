# Deployment routing

Vercel's Git integration deploys `main` to Production and other branches/PRs to Preview.

| Vercel environment | Same-origin API proxy destination |
|---|---|
| Production | `https://api.pillguide.site` |
| Preview | `https://dev-api.pillguide.site` |

`npm run build:vercel` builds Vite and generates `.vercel/output/config.json` using the deployment's `VERCEL_ENV`. Vercel consumes this Build Output API v3 artifact, including the static assets and proxy rules. Both Vite builds set `import.meta.env.PROD` to true, so that flag cannot distinguish Preview from Production. The API response header `X-PillGuide-Environment` identifies the generated environment for verification.

`/api/*`, `/oauth2/*`, and `/login/oauth2/*` pass through Vercel to Cloudflare, then the matching EC2/k3s namespace. Other paths use the SPA fallback. API responses are not cached. Keep `VITE_API_URL` and `VITE_API_BASE_URL` unset in Vercel so browser requests stay same-origin instead of bypassing the proxy.

Backend CI maps Backend `develop` to `manifest/main:dev/deployment.yaml` and Backend `main` to `manifest/main:production/deployment.yaml`. Spring activation is a separate step; API 503 responses are expected while the Deployment has zero replicas. Preview OAuth requires an allowed callback URL before real login can work.
