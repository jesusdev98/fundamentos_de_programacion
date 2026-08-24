import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createSandboxDocument, serializeForInlineScript } from "../lib/sandbox-document.ts";
import { isSandboxConnected, isSandboxReady, isSandboxResult, normalizeOutput, PARENT_WATCHDOG_MS, runtimeValidation, SANDBOX_DOCUMENT_OPTIONS, scheduleWatchdog, validateExerciseResult, validateTestResults, WORKER_TIMEOUT_MS } from "../lib/sandbox.ts";
import type { SandboxRunResult } from "../types/sandbox.ts";

const result: SandboxRunResult = { version: 1, type: "result", nonce: "n", runId: "r", messages: [{ kind: "log", text: "  Hola   mundo " }], tests: [{ id: "t", label: "test", passed: true }], timedOut: false };
const sandboxOptions = SANDBOX_DOCUMENT_OPTIONS;

test("sandbox protocol rejects mismatched identity and normalizes output", () => {
  assert.equal(isSandboxResult(result, "n", "r"), true);
  assert.equal(isSandboxResult(result, "other", "r"), false);
  assert.deepEqual(normalizeOutput(result.messages), ["Hola mundo"]);
  assert.deepEqual(normalizeOutput([{ kind: "warn", text: "ignore" }, { kind: "error", text: "ignore" }, { kind: "result", text: "  cinco   elementos " }]), ["cinco elementos"]);
  for (const malformed of [null, false, "result", {}, { ...result, messages: null }, { ...result, tests: null }, { ...result, timedOut: "false" }, { ...result, runId: "other" }]) {
    assert.equal(isSandboxResult(malformed, "n", "r"), false);
  }
});

test("sandbox handshake validates version, nonce and connection identity", () => {
  assert.equal(isSandboxReady({ version: 1, type: "ready", nonce: "n" }, "n"), true);
  assert.equal(isSandboxReady({ version: 1, type: "ready", nonce: "other" }, "n"), false);
  assert.equal(isSandboxConnected({ version: 1, type: "connected", nonce: "n", connectionId: "c" }, "n", "c"), true);
  assert.equal(isSandboxConnected({ version: 1, type: "connected", nonce: "n", connectionId: "old" }, "n", "c"), false);
  for (const malformed of [null, false, "ready", {}, { version: 2, type: "ready", nonce: "n" }, { version: 1, type: "other", nonce: "n" }]) assert.equal(isSandboxReady(malformed, "n"), false);
  for (const malformed of [null, false, "connected", {}, { version: 2, type: "connected", nonce: "n", connectionId: "c" }, { version: 1, type: "other", nonce: "n", connectionId: "c" }]) assert.equal(isSandboxConnected(malformed, "n", "c"), false);
});

test("exercise validation handles output, tests, errors and timeout", () => {
  assert.equal(validateExerciseResult({ kind: "output", expected: ["Hola mundo"] }, result), true);
  assert.equal(validateExerciseResult({ kind: "tests", tests: [{ id: "t", label: "test", expression: "true", assertion: "truthy" }] }, result), true);
  assert.equal(runtimeValidation({ kind: "typescript", assertions: "type A = true" }), undefined);
  assert.deepEqual(runtimeValidation({ kind: "typescript", runtime: { kind: "output", expected: ["Hola mundo"] } }), { kind: "output", expected: ["Hola mundo"] });
  assert.equal(validateExerciseResult({ kind: "typescript", assertions: "type A = true" }, { ...result, messages: [], tests: [] }), true);
  assert.equal(validateExerciseResult({ kind: "typescript", runtime: { kind: "output", expected: ["Hola mundo"] } }, result), true);
  assert.equal(validateExerciseResult({ kind: "output", expected: ["otro"] }, result), false);
  assert.equal(validateExerciseResult({ kind: "output", expected: ["Hola    mundo"] }, result), true);
  assert.equal(validateExerciseResult({ kind: "output", expected: ["Hola mundo", "extra"] }, result), false);
  assert.equal(validateExerciseResult({ kind: "output", expected: ["Hola mundo"] }, { ...result, timedOut: true }), false);
  assert.equal(validateExerciseResult({ kind: "output", expected: [] }, { ...result, messages: [{ kind: "error", text: "ReferenceError" }] }), false);
});

test("watchdog scheduling is testable without waiting", () => {
  let fired = false;
  let observedDelay = 0;
  const fakeSchedule = (handler: () => void, delay: number) => { observedDelay = delay; handler(); return 7 as unknown as ReturnType<typeof setTimeout>; };
  scheduleWatchdog(() => { fired = true; }, fakeSchedule);
  assert.equal(fired, true);
  assert.equal(observedDelay, PARENT_WATCHDOG_MS);
  assert.equal(PARENT_WATCHDOG_MS > WORKER_TIMEOUT_MS, true);
});

test("watchdog uses the platform scheduler by default", async () => {
  await new Promise<void>((resolve) => {
    const timer = scheduleWatchdog(resolve);
    clearTimeout(timer);
    resolve();
  });
});

test("test result validation requires exact authoritative identities", () => {
  const expected = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
  const valid = [{ id: "a", label: "A", passed: true }, { id: "b", label: "B", passed: true }];
  assert.equal(validateTestResults(expected, valid), true);
  assert.equal(validateTestResults(expected, [{ label: "A", passed: true } as never, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ id: "x", label: "A", passed: true }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [valid[0], valid[0]]), false);
  assert.equal(validateTestResults(expected, [...valid, { id: "x", label: "X", passed: true }]), false);
  assert.equal(validateTestResults(expected, [valid[0]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], label: "falsa" }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], passed: false }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], actual: 1 as never }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], actual: "observado" }, valid[1]]), true);
  assert.equal(validateTestResults(expected, [{ ...valid[0], id: 1 as never }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], label: 1 as never }, valid[1]]), false);
  assert.equal(validateTestResults(expected, [{ ...valid[0], passed: "yes" as never }, valid[1]]), false);
});

test("student return values and legacy binding names cannot replace trusted recorder results", () => {
  const document = createSandboxDocument("nonce", sandboxOptions);
  const forged = { ...result, messages: [], tests: [{ passed: true }] } as unknown as SandboxRunResult;
  assert.equal(validateExerciseResult({ kind: "tests", tests: [{ id: "t", label: "test", expression: "true", assertion: "truthy" }] }, forged), false);
  assert.match(document, /const capability = randomHex\(32\)/);
  assert.match(document, /const recorderName = '\$rec_' \+ randomHex\(16\)/);
  assert.match(document, /const execute = new AsyncFunction\(recorderName, tokenName, body\)/);
  assert.match(document, /request\.code \+ '[^']*' \+ harness/);
  assert.match(document, /async function \(\) \{ "use strict"/);
  assert.match(document, /tests: finishRecording\(\)/);
  for (const legacyName of ["__record", "__token", "__deepEqual", "__serialize"]) assert.equal(document.includes(legacyName), false);
});

test("sandbox document contains the required isolation defenses", () => {
  const document = createSandboxDocument("nonce", sandboxOptions);
  for (const fragment of ["default-src 'none'", "connect-src 'none'", "worker-src blob:", "new Worker", "worker.terminate", "URL.revokeObjectURL", "fetchLater", "XMLHttpRequest", "SharedWorker", "sendBeacon", "event.source !== parent", "request.nonce !== NONCE", "connected", "capturesExpression", "add('result'", "cryptoRandom", "nativePostMessage", "finishRecording", "NativeBoolean", "objectIs"]) assert.match(document, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  const csp = document.match(/Content-Security-Policy" content="([^"]+)/)?.[1] ?? "";
  const scriptSrc = csp.match(/script-src ([^;]+)/)?.[1] ?? "";
  assert.equal(scriptSrc.includes("blob:"), false);
  assert.equal(scriptSrc.includes("data:"), false);
  assert.equal(scriptSrc.includes("http:"), false);
  assert.match(csp, /worker-src blob:/);
  assert.match(document, /\['fetch',[^\]]*'Blob'[^\]]*'FileReader'[^\]]*'webkitURL'\]/);
  assert.match(document, /defineProperty\(URL, 'createObjectURL'/);
  assert.doesNotMatch(document, /'\n/);
});

test("inline script serialization neutralizes HTML termination, quotes and Unicode separators", () => {
  const nonce = '</script><script>globalThis.pwned=true</script>"\'\u2028\u2029';
  const encoded = serializeForInlineScript(nonce);
  const document = createSandboxDocument(nonce, sandboxOptions);
  assert.equal(Function(`"use strict"; return (${encoded});`)(), nonce);
  assert.equal(encoded.includes("<"), false);
  assert.equal(encoded.includes("'"), false);
  assert.equal(encoded.includes("\u2028"), false);
  assert.equal(encoded.includes("\u2029"), false);
  assert.match(encoded, /\\"/);
  assert.equal(document.includes(nonce), false);
  assert.equal(document.includes("<script>globalThis.pwned"), false);
  assert.equal(document.match(/<\/script>/g)?.length, 1);
});

test("React sandbox cleanup cancels active work and releases browser resources", () => {
  const component = readFileSync(new URL("../components/playground/SandboxPlayground.tsx", import.meta.url), "utf8");
  for (const fragment of ["watchdogRef.current", "mountedRef.current = false", "window.clearTimeout(watchdogRef.current)", "pendingRef.current = null", "candidatePort?.close()", "portRef.current?.close()", 'window.removeEventListener("message", receive)', "SANDBOX_DOCUMENT_OPTIONS", "setSandboxReady(false)", "setSandboxReady(true)", "ready={sandboxReady && !busy}"]) assert.match(component, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(component, /if \(settled \|\| !mountedRef\.current\) return/);
  assert.doesNotMatch(component, /createSandboxDocument\(nonce, \{/);
});
