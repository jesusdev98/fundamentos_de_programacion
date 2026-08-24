import type { ExerciseTest } from "@/types/learning";
import type { PythonInitializationError, PythonReadyMessage, PythonResultMessage, PythonRunRequest } from "@/types/python-runner";
import type { SandboxRunResult } from "@/types/sandbox";

export const PYTHON_RUNNER_VERSION = 1 as const;
export const PYODIDE_VERSION = "314.0.4";
export const PYTHON_VERSION = "3.14.2";
export const PYODIDE_MODULE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;
export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
export const PYTHON_INITIALIZATION_TIMEOUT_MS = 30_000;
export const PYTHON_EXECUTION_TIMEOUT_MS = 2_500;

export function createPythonRunRequest(runId: string, code: string, tests: readonly ExerciseTest[]): PythonRunRequest {
  return { version: PYTHON_RUNNER_VERSION, type: "run", runId, code, tests };
}

export function isPythonReadyMessage(value: unknown): value is PythonReadyMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PythonReadyMessage>;
  return candidate.version === PYTHON_RUNNER_VERSION && candidate.type === "ready" && candidate.pythonVersion === PYTHON_VERSION;
}

export function isPythonResultMessage(value: unknown, runId: string): value is PythonResultMessage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PythonResultMessage>;
  return candidate.version === PYTHON_RUNNER_VERSION && candidate.type === "result" && candidate.runId === runId && Array.isArray(candidate.messages) && Array.isArray(candidate.tests);
}

export function isPythonInitializationError(value: unknown): value is PythonInitializationError {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PythonInitializationError>;
  return candidate.version === PYTHON_RUNNER_VERSION && candidate.type === "initialization-error" && typeof candidate.message === "string";
}

export function pythonSandboxResult(message: PythonResultMessage, timedOut = false): SandboxRunResult {
  return { version: 1, type: "result", nonce: "python", runId: message.runId, messages: message.messages, tests: message.tests, timedOut };
}

export function pythonFailureResult(runId: string, text: string, timedOut: boolean): SandboxRunResult {
  return { version: 1, type: "result", nonce: "python", runId, messages: [{ kind: "error", text }], tests: [], timedOut };
}
