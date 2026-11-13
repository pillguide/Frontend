import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
let server, photoCrop;
before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom" });
  ({ photoCrop } = await server.ssrLoadModule("/src/features/medicine/utils/photoCrop.ts"));
});
after(async () => { await server.close(); });
test("display crop includes margin and is clamped to the original", () => {
  assert.deepEqual(photoCrop(1000, 2000, { width: 1000, height: 2000 }, [0, 0.25, 0.5, 0.75]),
    { left: 0, top: 400, width: 550, height: 1200 });
});
test("orientation mismatch and missing original metadata do not show an incorrect crop", () => {
  assert.equal(photoCrop(2000, 1000, { width: 1000, height: 2000 }, [0, 0, 1, 1]), null);
  assert.equal(photoCrop(1000, 2000, null, [0, 0, 1, 1]), null);
});
test("invalid or degenerate detection boxes are rejected", () => {
  for (const box of [null, [0, 1], [0.5, 0, 0.5, 1], [0, 0, NaN, 1], [-0.1, 0, 1, 1], [0, 0, 1, Infinity]])
    assert.equal(photoCrop(1000, 2000, { width: 1000, height: 2000 }, box), null);
});
