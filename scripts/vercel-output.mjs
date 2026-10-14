import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const environment = process.env.VERCEL_ENV ?? 'development';
if (!['production', 'preview', 'development'].includes(environment)) {
  throw new Error(`Unsupported Vercel environment: ${environment}`);
}
if (process.env.VERCEL && !process.env.VERCEL_ENV) {
  throw new Error('VERCEL_ENV must be exposed for deployment routing');
}
const apiOrigin = environment === 'production'
  ? 'https://api.pillguide.site'
  : 'https://dev-api.pillguide.site';
const output = new URL('../.vercel/output/', import.meta.url);
await mkdir(new URL('static/', output), { recursive: true });
await cp(new URL('../dist/', import.meta.url), new URL('static/', output), { recursive: true });

const config = {
  version: 3,
  routes: [
    {
      src: '^/((?:api|oauth2|login/oauth2)(?:/.*)?)$',
      dest: `${apiOrigin}/$1`,
      headers: {
        'Cache-Control': 'no-store',
        'x-vercel-enable-rewrite-caching': '0',
        'X-PillGuide-Environment': environment,
      },
    },
    { handle: 'filesystem' },
    { src: '/.*', dest: '/index.html' },
  ],
};
await writeFile(new URL('config.json', output), `${JSON.stringify(config, null, 2)}\n`);
console.log(`Vercel ${environment}: API proxy -> ${apiOrigin}; output ${fileURLToPath(output)}`);
