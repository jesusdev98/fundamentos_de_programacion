import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createPythonRunRequest, isPythonInitializationError, isPythonReadyMessage, isPythonResultMessage, PYODIDE_INDEX_URL, PYODIDE_MODULE_URL, PYODIDE_VERSION, PYTHON_EXECUTION_TIMEOUT_MS, PYTHON_INITIALIZATION_TIMEOUT_MS, PYTHON_RUNNER_VERSION, PYTHON_VERSION, pythonFailureResult, pythonSandboxResult } from "../lib/python-runner.ts";

test("Python runner constants and request identity are pinned", () => {
  assert.equal(PYTHON_RUNNER_VERSION, 1);
  assert.equal(PYODIDE_VERSION, "314.0.4");
  assert.equal(PYTHON_VERSION, "3.14.2");
  assert.equal(PYODIDE_MODULE_URL, "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/pyodide.mjs");
  assert.equal(PYODIDE_INDEX_URL, "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/");
  assert.equal(PYTHON_INITIALIZATION_TIMEOUT_MS, 30_000);
  assert.equal(PYTHON_EXECUTION_TIMEOUT_MS, 2_500);
  assert.deepEqual(createPythonRunRequest("run-1", "print(1)", []), { version: 1, type: "run", runId: "run-1", code: "print(1)", tests: [] });
});

test("Python worker message guards reject every malformed boundary", () => {
  assert.equal(isPythonReadyMessage(null), false);
  assert.equal(isPythonReadyMessage({ version: 2, type: "ready", pythonVersion: "3.14.2" }), false);
  assert.equal(isPythonReadyMessage({ version: 1, type: "result", pythonVersion: "3.14.2" }), false);
  assert.equal(isPythonReadyMessage({ version: 1, type: "ready", pythonVersion: "3.14.1" }), false);
  assert.equal(isPythonReadyMessage({ version: 1, type: "ready", pythonVersion: "3.14.2" }), true);
  assert.equal(isPythonResultMessage(null, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 2, type: "result", runId: "run-1", messages: [], tests: [] }, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 1, type: "ready", runId: "run-1", messages: [], tests: [] }, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 1, type: "result", runId: "other", messages: [], tests: [] }, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 1, type: "result", runId: "run-1", messages: {}, tests: [] }, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 1, type: "result", runId: "run-1", messages: [], tests: {} }, "run-1"), false);
  assert.equal(isPythonResultMessage({ version: 1, type: "result", runId: "run-1", messages: [], tests: [] }, "run-1"), true);
  assert.equal(isPythonInitializationError(null), false);
  assert.equal(isPythonInitializationError({ version: 2, type: "initialization-error", message: "x" }), false);
  assert.equal(isPythonInitializationError({ version: 1, type: "ready", message: "x" }), false);
  assert.equal(isPythonInitializationError({ version: 1, type: "initialization-error", message: 1 }), false);
  assert.equal(isPythonInitializationError({ version: 1, type: "initialization-error", message: "x" }), true);
});

test("Python worker results adapt to shared sandbox validation", () => {
  const message = { version: 1, type: "result", runId: "run-1", messages: [{ kind: "log", text: "5" }], tests: [] } as const;
  assert.deepEqual(pythonSandboxResult(message), { version: 1, type: "result", nonce: "python", runId: "run-1", messages: message.messages, tests: [], timedOut: false });
  assert.equal(pythonSandboxResult(message, true).timedOut, true);
  assert.deepEqual(pythonFailureResult("run-2", "fallo", true), { version: 1, type: "result", nonce: "python", runId: "run-2", messages: [{ kind: "error", text: "fallo" }], tests: [], timedOut: true });
});

test("Python worker source pins Pyodide and enforces the browser-only boundary", () => {
  const source = readFileSync("public/python-worker.mjs", "utf8");
  assert.match(source, /pyodide\/v314\.0\.4\/full\/pyodide\.mjs/);
  assert.match(source, /self\.onmessage/);
  assert.match(source, /setStdout/);
  assert.match(source, /setStderr/);
  assert.match(source, /input\(\) no está disponible/);
  assert.match(source, /"fetch"[\s\S]*"XMLHttpRequest"[\s\S]*"WebSocket"[\s\S]*"EventSource"/);
  assert.doesNotMatch(source, /loadPackagesFromImports|micropip/);
});
