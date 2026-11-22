import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
let server, scanApi, scanDraft;
const fetchOriginal = globalThis.fetch;
const storageOriginal = globalThis.localStorage;
const createOriginal = URL.createObjectURL;
const revokeOriginal = URL.revokeObjectURL;
before(async () => {
  globalThis.localStorage = {
    getItem: (k) => (k === "accessToken" ? "token" : null),
    setItem() {},
    removeItem() {},
  };
  server = await createServer({
    configFile: false,
    server: { middlewareMode: true, ws: false },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: "custom",
  });
  ({ scanApi } = await server.ssrLoadModule(
    "/src/features/medicine/api/scanApi.ts",
  ));
  ({ scanDraft } = await server.ssrLoadModule(
    "/src/features/medicine/scanDraft.ts",
  ));
});
after(async () => {
  globalThis.fetch = fetchOriginal;
  globalThis.localStorage = storageOriginal;
  URL.createObjectURL = createOriginal;
  URL.revokeObjectURL = revokeOriginal;
  await server.close();
});
test("scan sends file and stable request id as multipart", async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, init };
    return Response.json({ success: true, data: { sessionId: 1 } });
  };
  const file = new File(["photo"], "p.png", { type: "image/png" });
  await scanApi.scan(file, "request-id");
  assert.equal(sent.url, "/api/v1/scan");
  assert.equal(sent.init.body.get("file"), file);
  assert.equal(sent.init.body.get("requestId"), "request-id");
  assert.equal(sent.init.headers.has("Content-Type"), false);
  assert.equal(sent.init.headers.get("Authorization"), "Bearer token");
  await scanApi.scan(file, "request-id");
  assert.equal(sent.init.body.get("file"), file);
  assert.equal(sent.init.body.get("requestId"), "request-id");
});
/** 응답을 abort 될 때까지 붙잡아 두는 fetch. 호출에 쓰인 signal을 돌려준다 */
function hangingFetch() {
  const seen = {};
  globalThis.fetch = (url, init) =>
    new Promise((_, reject) => {
      seen.signal = init.signal;
      init.signal.addEventListener("abort", () =>
        reject(new DOMException("aborted", "AbortError")),
      );
    });
  return seen;
}
test("clearing draft aborts the running scan, drops its result and revokes preview", async () => {
  let revoked = [];
  URL.createObjectURL = () => "blob:preview";
  URL.revokeObjectURL = (url) => revoked.push(url);
  const first = new File(["a"], "a.png");
  scanDraft.select(first);
  const id = scanDraft.get().requestId;
  assert.equal(scanDraft.get().file, first);
  const seen = hangingFetch();
  const running = scanDraft.start();
  assert.equal(scanDraft.get().status, "analyzing");
  scanDraft.clear();
  await running;
  assert.equal(seen.signal.aborted, true);
  assert.equal(scanDraft.get().result, null);
  assert.equal(scanDraft.get().status, "idle");
  assert.deepEqual(revoked, ["blob:preview"]);
  scanDraft.select(new File(["b"], "b.png"));
  assert.notEqual(scanDraft.get().requestId, id);
  scanDraft.clear();
});
test("failed scan keeps the photo for retry; 409 blocks same-photo retry", async () => {
  URL.createObjectURL = () => "blob:preview";
  URL.revokeObjectURL = () => {};
  scanDraft.select(new File(["a"], "a.png"));
  globalThis.fetch = async () =>
    Response.json({ success: false, message: "x" }, { status: 500 });
  await scanDraft.start();
  assert.equal(scanDraft.get().status, "failed");
  assert.equal(scanDraft.get().conflict, false);
  assert.ok(scanDraft.get().file);
  globalThis.fetch = async () =>
    Response.json({ success: false, message: "x" }, { status: 409 });
  await scanDraft.start();
  assert.equal(scanDraft.get().status, "failed");
  assert.equal(scanDraft.get().conflict, true);
  scanDraft.clear();
});
import { test as routeTest } from "node:test";
routeTest(
  "current result detail preserves draft on back; unrelated route leaves flow",
  async () => {
    const { isScanDraftRoute } = await server.ssrLoadModule(
      "/src/features/medicine/scanDraft.ts",
    );
    URL.createObjectURL = () => "blob:preview";
    URL.revokeObjectURL = () => {};
    scanDraft.select(new File(["a"], "a.png"));
    globalThis.fetch = async () =>
      Response.json({
        success: true,
        data: { sessionId: 1, drugs: [{ drugId: 7, detectionId: 42 }] },
      });
    await scanDraft.start();
    assert.equal(scanDraft.get().status, "idle");
    scanDraft.setSelected([42]);
    assert.deepEqual(scanDraft.get().selected, [42]);
    assert.equal(isScanDraftRoute("/medicine/single/7", scanDraft.get()), true);
    assert.equal(isScanDraftRoute("/scan/result", scanDraft.get()), true);
    assert.equal(isScanDraftRoute("/scan/camera", scanDraft.get()), true);
    assert.equal(
      isScanDraftRoute("/medicine/single/8", scanDraft.get()),
      false,
    );
    assert.equal(isScanDraftRoute("/mypage", scanDraft.get()), false);
    scanDraft.clear();
  },
);
