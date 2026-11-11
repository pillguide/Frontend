import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let server;
let authApi;
let http;
let authStorage;
const originalFetch = globalThis.fetch;
const originalStorage = globalThis.localStorage;

before(async () => {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  });
  authApi = await server.ssrLoadModule('/src/features/auth/api/authApi.ts');
  http = await server.ssrLoadModule('/src/api/http.ts');
  ({ authStorage } = await server.ssrLoadModule('/src/utils/authStorage.ts'));
});

after(async () => {
  globalThis.fetch = originalFetch;
  globalThis.localStorage = originalStorage;
  await server?.close();
});

test('browser verifier binds the code challenge and exchange request', async () => {
  const { verifier, challenge } = await authApi.createOAuthVerifierAndChallenge();
  assert.match(verifier, /^[A-Za-z0-9_-]{43}$/);
  const expected = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)))
    .toString('base64url');
  assert.equal(challenge, expected);

  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({ success: true, data: { accessToken: 'access', refreshToken: 'refresh' } });
  };
  const tokens = await authApi.exchangeOAuthCode('one-time-code', verifier);
  assert.deepEqual(tokens, { accessToken: 'access', refreshToken: 'refresh' });
  assert.equal(sent.url, '/api/v1/auth/exchange');
  assert.deepEqual(JSON.parse(sent.init.body), { code: 'one-time-code', verifier });
});

test('logout waits for rotation and sends the latest refresh token', async () => {
  authStorage.setTokens('old-access', 'old-refresh');
  let resolveReissue;
  let reissueStarted;
  const reissueReady = new Promise((resolve) => { reissueStarted = resolve; });
  let logoutToken;
  let reissueCount = 0;
  globalThis.fetch = async (url, init) => {
    if (url === '/api/v1/auth/reissue') {
      reissueCount++;
      reissueStarted();
      return new Promise((resolve) => { resolveReissue = resolve; });
    }
    if (url === '/api/v1/auth/logout') {
      logoutToken = init.headers['X-Refresh-Token'];
      return new Response(null, { status: 200 });
    }
    return Response.json({ success: false, message: 'expired' }, { status: 401 });
  };

  const failedRequest = http.apiRequest('/protected').catch(() => undefined);
  await reissueReady;
  const signingOut = authApi.logout();
  const concurrentRequest = http.apiRequest('/protected').catch(() => undefined);
  await concurrentRequest;
  assert.equal(reissueCount, 1, 'a new reissue must not start during logout');
  assert.equal(logoutToken, undefined, 'logout must wait for the ongoing rotation');

  resolveReissue(Response.json({ success: true, data: {
    accessToken: 'new-access', refreshToken: 'new-refresh',
  } }));
  await signingOut;
  await failedRequest;
  assert.equal(logoutToken, 'new-refresh');
  assert.equal(reissueCount, 1);
});

test('failed server logout preserves local credentials', async () => {
  authStorage.setTokens('keep-access', 'keep-refresh');
  globalThis.fetch = async () => new Response(null, { status: 500 });
  await assert.rejects(authApi.logout());
  assert.equal(authStorage.getAccessToken(), 'keep-access');
  assert.equal(authStorage.getRefreshToken(), 'keep-refresh');
});
