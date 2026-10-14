import type { VercelConfig } from '@vercel/config/v1';

// Evaluated for each deployment, including Preview builds (Vite PROD is true there too).
const apiOrigin = process.env.VERCEL_ENV === 'production'
  ? 'https://api.pillguide.site'
  : 'https://dev-api.pillguide.site';
const apiPaths = ['/api/:path*', '/oauth2/:path*', '/login/oauth2/:path*'];

export const config: VercelConfig = {
  framework: 'vite',
  rewrites: [
    ...apiPaths.map((source) => ({ source, destination: `${apiOrigin}${source}` })),
    { source: '/(.*)', destination: '/index.html' },
  ],
  headers: apiPaths.map((source) => ({
    source,
    headers: [
      { key: 'Cache-Control', value: 'no-store' },
      { key: 'x-vercel-enable-rewrite-caching', value: '0' },
    ],
  })),
};
