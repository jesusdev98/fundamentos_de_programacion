import type { TypeScriptCompileRequest, TypeScriptCompileResult, TypeScriptDiagnostic, TypeScriptVirtualFile } from "@/types/typescript-runner";
import type { ConsoleMessage } from "@/types/sandbox";

export const TYPESCRIPT_RUNNER_VERSION = 1 as const;
export const TYPESCRIPT_COMPILER_VERSION = "5.9.3";
export const TYPESCRIPT_STABLE_VERSION = "7.0.2";
export const TYPESCRIPT_COMPILER_TIMEOUT_MS = 10_000;

export function createTypeScriptCompileRequest(runId: string, code: string, assertions = "", files: readonly TypeScriptVirtualFile[] = [], emit = true): TypeScriptCompileRequest {
  return { version: TYPESCRIPT_RUNNER_VERSION, type: "compile", runId, code, assertions, files, emit };
}

export function isTypeScriptCompileResult(value: unknown, runId: string): value is TypeScriptCompileResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<TypeScriptCompileResult>;
  return result.version === TYPESCRIPT_RUNNER_VERSION && result.type === "result" && result.runId === runId && result.compilerVersion === TYPESCRIPT_COMPILER_VERSION && Array.isArray(result.diagnostics) && result.diagnostics.every(isDiagnostic) && (result.emittedCode === undefined || typeof result.emittedCode === "string");
}

function isDiagnostic(value: unknown): value is TypeScriptDiagnostic {
  if (!value || typeof value !== "object") return false;
  const diagnostic = value as Partial<TypeScriptDiagnostic>;
  return typeof diagnostic.code === "number" && (diagnostic.category === "error" || diagnostic.category === "warning") && typeof diagnostic.message === "string" && (diagnostic.file === undefined || typeof diagnostic.file === "string") && (diagnostic.line === undefined || typeof diagnostic.line === "number") && (diagnostic.character === undefined || typeof diagnostic.character === "number");
}

export function diagnosticText(diagnostic: TypeScriptDiagnostic): string {
  const location = diagnostic.file && diagnostic.line !== undefined && diagnostic.character !== undefined ? ` ${diagnostic.file}:${diagnostic.line}:${diagnostic.character}` : "";
  return `TS${diagnostic.code}${location} - ${diagnostic.message}`;
}

export function diagnosticMessages(diagnostics: readonly TypeScriptDiagnostic[]): readonly ConsoleMessage[] {
  return diagnostics.map((diagnostic) => ({ kind: diagnostic.category === "error" ? "error" : "warn", text: diagnosticText(diagnostic) }));
}
