import type { ExerciseValidation, RuntimeValidation } from "@/types/learning";
import type { ConsoleMessage, SandboxRunResult, SandboxTestResult } from "@/types/sandbox";

export const SANDBOX_VERSION = 1 as const;
export const WORKER_TIMEOUT_MS = 2_500;
export const PARENT_WATCHDOG_MS = 3_000;
export const MAX_CODE_LENGTH = 20_000;
export const MAX_MESSAGES = 100;
export const SANDBOX_DOCUMENT_OPTIONS = {
  maxCodeLength: MAX_CODE_LENGTH,
  maxMessages: MAX_MESSAGES,
  version: SANDBOX_VERSION,
  workerTimeoutMs: WORKER_TIMEOUT_MS,
} as const;

export function isSandboxReady(value: unknown, nonce: string): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { version?: unknown; type?: unknown; nonce?: unknown };
  return candidate.version === SANDBOX_VERSION && candidate.type === "ready" && candidate.nonce === nonce;
}

export function isSandboxConnected(value: unknown, nonce: string, connectionId: string): boolean {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { version?: unknown; type?: unknown; nonce?: unknown; connectionId?: unknown };
  return candidate.version === SANDBOX_VERSION && candidate.type === "connected" && candidate.nonce === nonce && candidate.connectionId === connectionId;
}

export function isSandboxResult(value: unknown, nonce: string, runId: string): value is SandboxRunResult {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SandboxRunResult>;
  return candidate.version === SANDBOX_VERSION && candidate.type === "result" && candidate.nonce === nonce && candidate.runId === runId && Array.isArray(candidate.messages) && Array.isArray(candidate.tests) && typeof candidate.timedOut === "boolean";
}

export function normalizeOutput(messages: readonly ConsoleMessage[]): readonly string[] {
  return messages
    .filter((message) => message.kind === "log" || message.kind === "result")
    .map((message) => message.text.trim().replace(/\s+/g, " "));
}

export function runtimeValidation(validation: ExerciseValidation): RuntimeValidation | undefined {
  return validation.kind === "typescript" ? validation.runtime : validation;
}

export function validateExerciseResult(validation: ExerciseValidation, result: SandboxRunResult): boolean {
  if (result.timedOut || result.messages.some((message) => message.kind === "error")) return false;
  const runtime = runtimeValidation(validation);
  if (!runtime) return true;
  if (runtime.kind === "output") {
    const actual = normalizeOutput(result.messages);
    return actual.length === runtime.expected.length && actual.every((line, index) => line === runtime.expected[index].trim().replace(/\s+/g, " "));
  }
  return validateTestResults(runtime.tests, result.tests);
}

export function validateTestResults(expected: readonly { readonly id: string; readonly label: string }[], actual: readonly SandboxTestResult[]): boolean {
  if (actual.length !== expected.length) return false;
  const byId = new Map<string, SandboxTestResult>();
  for (const result of actual) {
    if (typeof result.id !== "string" || typeof result.label !== "string" || typeof result.passed !== "boolean" || (result.actual !== undefined && typeof result.actual !== "string") || byId.has(result.id)) return false;
    byId.set(result.id, result);
  }
  return expected.every((test) => {
    const result = byId.get(test.id);
    return result?.label === test.label && result.passed;
  });
}

export function scheduleWatchdog(callback: () => void, schedule: (handler: () => void, timeout: number) => ReturnType<typeof setTimeout> = setTimeout): ReturnType<typeof setTimeout> {
  return schedule(callback, PARENT_WATCHDOG_MS);
}
