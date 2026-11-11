import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
let server, medicationApi, memberApi, authStorage, dates, stats, reminder;
const original = { fetch: globalThis.fetch, localStorage: globalThis.localStorage, window: globalThis.window };
const values = new Map();
before(async () => {
  globalThis.localStorage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  globalThis.window = new EventTarget();
  server = await createServer({ configFile: false, server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom" });
  ({ medicationApi } = await server.ssrLoadModule("/src/features/intake/api/medicationApi.ts"));
  ({ memberApi } = await server.ssrLoadModule("/src/features/user/api/memberApi.ts"));
  ({ authStorage } = await server.ssrLoadModule("/src/utils/authStorage.ts"));
  dates = await server.ssrLoadModule("/src/features/intake/utils/date.ts");
  stats = await server.ssrLoadModule("/src/features/intake/hooks/useIntakeStats.ts");
  reminder = await server.ssrLoadModule("/src/features/alarm/api/reminderApi.ts");
});
after(async () => { Object.assign(globalThis, original); await server.close(); });
test("auth transitions notify once while token refresh does not reset state", () => {
  values.clear(); let count = 0; const handler = () => count++;
  window.addEventListener("auth-change", handler);
  const jwt = (sub, nonce) => `header.${Buffer.from(JSON.stringify({ sub, nonce })).toString("base64url")}.signature`;
  authStorage.setTokens(jwt("1", 1), "r1"); authStorage.setTokens(jwt("1", 2), "r2"); authStorage.clear(); authStorage.clear();
  window.removeEventListener("auth-change", handler);
  assert.equal(count, 2); assert.equal(authStorage.isLoggedIn(), false);
  authStorage.setTokens(jwt("1", 3), "r3");
  const first = authStorage.sessionIdentity();
  localStorage.setItem("accessToken", jwt("2", 4));
  assert.notEqual(authStorage.sessionIdentity(), first);
  assert.equal(authStorage.sessionIdentity(), "member:2");
});
test("profile reads real data and updates only requested fields", async () => {
  authStorage.setTokens("token", "refresh"); let calls = [];
  globalThis.fetch = async (url, init) => { calls.push({ url, init }); return Response.json({ success: true, data: { name: "사용자", gender: null, birthDate: null, email: null } }); };
  const profile = await memberApi.me();
  assert.deepEqual(profile, { name: "사용자", gender: null, birthDate: "", email: "" });
  await memberApi.update({ name: "새 이름" });
  assert.equal(calls[0].url, "/api/v1/member/me");
  assert.equal(calls[1].init.method, "PUT"); assert.deepEqual(JSON.parse(calls[1].init.body), { name: "새 이름" });
});
test("medication checks use dose id and errors are propagated", async () => {
  let call; globalThis.fetch = async (url, init) => { call = { url, init }; return Response.json({ success: true, data: { id: 71 } }); };
  await medicationApi.check(71, true);
  assert.equal(call.url, "/api/v1/medication/records/71/check"); assert.deepEqual(JSON.parse(call.init.body), { taken: true });
  globalThis.fetch = async () => Response.json({ success: false, message: "failed" }, { status: 500 });
  await assert.rejects(medicationApi.check(71, false));
});
test("server schedule keeps dose and reminder identities distinct", () => {
  const item = stats.toScheduledDose({ id: 71, reminderId: 5, medicationName: "약", dosage: "1정", scheduledAt: "2026-11-12T08:30:00", memo: null, status: "TAKEN", takenAt: "2026-11-12T08:31:00" });
  assert.equal(item.doseId, 71); assert.equal(item.alarm.id, 5); assert.equal(item.taken, true); assert.equal(item.alarm.hour, 8);
});
test("Korean day and Monday week start remain correct at UTC boundary", () => {
  const now = dates.koreaToday(new Date("2026-11-11T15:01:00Z"));
  assert.equal(dates.toDateKey(now), "2026-11-12"); assert.equal(dates.toDateKey(dates.startOfWeek(now)), "2026-11-09");
});

test("reminder start date follows Seoul across UTC and Pacific date boundaries", () => {
  assert.equal(reminder.todayString(new Date("2026-11-11T15:01:00Z")), "2026-11-12");
  assert.equal(reminder.todayString(new Date("2026-11-12T07:59:00Z")), "2026-11-12");
  assert.equal(reminder.todayString(new Date("2026-11-12T15:00:00Z")), "2026-11-13");
});
test("next dose refresh is scheduled once after its Seoul time boundary", () => {
  const before = Date.parse("2026-11-12T00:29:30Z");
  assert.equal(stats.doseRefreshDelay("2026-11-12T09:30:00", before), 31_000);
  assert.equal(stats.doseRefreshDelay("2026-11-12T09:30:00", before + 60_000), 0);
});
