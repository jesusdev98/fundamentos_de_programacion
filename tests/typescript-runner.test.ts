import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createTypeScriptCompileRequest, diagnosticMessages, diagnosticText, isTypeScriptCompileResult, TYPESCRIPT_COMPILER_TIMEOUT_MS, TYPESCRIPT_COMPILER_VERSION, TYPESCRIPT_RUNNER_VERSION, TYPESCRIPT_STABLE_VERSION } from "../lib/typescript-runner.ts";

test("TypeScript runner constants and requests are pinned", () => {
  assert.equal(TYPESCRIPT_RUNNER_VERSION, 1);
  assert.equal(TYPESCRIPT_COMPILER_VERSION, "5.9.3");
  assert.equal(TYPESCRIPT_STABLE_VERSION, "7.0.2");
  assert.equal(TYPESCRIPT_COMPILER_TIMEOUT_MS, 10_000);
  assert.deepEqual(createTypeScriptCompileRequest("run", "const x = 1"), { version: 1, type: "compile", runId: "run", code: "const x = 1", assertions: "", files: [], emit: true });
  assert.equal(createTypeScriptCompileRequest("type", "", "type A = true", [{ name: "/a.ts", content: "" }], false).emit, false);
});

test("TypeScript result guard rejects malformed compiler boundaries", () => {
  const valid = { version: 1, type: "result", runId: "run", compilerVersion: "5.9.3", diagnostics: [], emittedCode: "const x = 1;" };
  assert.equal(isTypeScriptCompileResult(null, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, version: 2 }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, type: "ready" }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, runId: "other" }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, compilerVersion: "7.0.2" }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: {} }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [null] }, "run"), false);
  const diagnostic = { code: 2322, category: "error", message: "incompatible" };
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, code: "2322" }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, category: "info" }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, message: 2 }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, file: 2 }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, line: "1" }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, diagnostics: [{ ...diagnostic, character: "1" }] }, "run"), false);
  assert.equal(isTypeScriptCompileResult({ ...valid, emittedCode: 3 }, "run"), false);
  assert.equal(isTypeScriptCompileResult(valid, "run"), true);
  assert.equal(isTypeScriptCompileResult({ ...valid, emittedCode: undefined, diagnostics: [{ ...diagnostic, category: "warning", file: "/main.ts", line: 1, character: 2 }] }, "run"), true);
});

test("TypeScript diagnostics become readable sandbox messages", () => {
  const located = { code: 2322, category: "error" as const, message: "No se puede asignar", file: "/main.ts", line: 2, character: 3 };
  const global = { code: 2318, category: "warning" as const, message: "Falta un tipo global" };
  assert.equal(diagnosticText(located), "TS2322 /main.ts:2:3 - No se puede asignar");
  assert.equal(diagnosticText(global), "TS2318 - Falta un tipo global");
  assert.deepEqual(diagnosticMessages([located, global]), [{ kind: "error", text: diagnosticText(located) }, { kind: "warn", text: diagnosticText(global) }]);
});

test("TypeScript compiler Worker uses the official in-memory program pipeline", () => {
  const source = readFileSync("public/typescript-compiler-worker.js", "utf8");
  assert.match(source, /importScripts\("\/typescript-compiler-5\.9\.3\.js"\)/);
  assert.match(source, /ts\.createProgram/);
  assert.match(source, /ts\.getPreEmitDiagnostics/);
  assert.match(source, /program\.emit/);
  assert.match(source, /resolveModuleNames/);
  assert.doesNotMatch(source, /transpileModule|fetch\(|@typescript\/vfs|Babel|Sucrase/);
});
