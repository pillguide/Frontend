import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

const configUrl = new URL('../vercel.ts', import.meta.url).href;
const proxyPaths = ['/api/:path*', '/oauth2/:path*', '/login/oauth2/:path*'];

// Each import gets a fresh process so environment selection cannot reuse a module cache.
function loadConfig(environment) {
  const env = { ...process.env };
  delete env.VERCEL_ENV;
  if (environment !== undefined) env.VERCEL_ENV = environment;
  return JSON.parse(execFileSync(process.execPath, [
    '--input-type=module',
    '--eval',
    `import { config } from ${JSON.stringify(configUrl)}; console.log(JSON.stringify(config));`,
  ], { env, encoding: 'utf8' }));
}

for (const [environment, origin] of [
  ['production', 'https://api.pillguide.site'],
  ['preview', 'https://dev-api.pillguide.site'],
  ['development', 'https://dev-api.pillguide.site'],
  [undefined, 'https://dev-api.pillguide.site'],
]) {
  test(`${environment ?? 'unset'} routes API and OAuth traffic before the SPA fallback`, () => {
    const { rewrites } = loadConfig(environment);
    const fallbackIndex = rewrites.findIndex(({ source }) => source === '/(.*)');
    assert.ok(fallbackIndex >= 0, 'Client-side deep links need a SPA fallback');
    assert.equal(rewrites[fallbackIndex].destination, '/index.html');
    for (const path of proxyPaths) {
      const index = rewrites.findIndex(({ source }) => source === path);
      assert.ok(index >= 0 && index < fallbackIndex, `${path} must precede the SPA fallback`);
      assert.equal(rewrites[index].destination, `${origin}${path}`);
    }
  });
}

for (const environment of ['production', 'preview']) {
  test(`${environment} disables caching for API and OAuth responses`, () => {
    const { headers } = loadConfig(environment);
    for (const path of proxyPaths) {
      const rule = headers.find(({ source }) => source === path);
      assert.ok(rule, `${path} needs response headers`);
      const values = Object.fromEntries(rule.headers.map(({ key, value }) => [key.toLowerCase(), value]));
      assert.equal(values['cache-control'], 'no-store');
      assert.equal(values['x-vercel-enable-rewrite-caching'], '0');
      assert.equal(values['x-pillguide-environment'], environment);
    }
  });
}
