import type { ExerciseTest } from "./learning";

export type ConsoleMessageKind =
  | "log"
  | "warn"
  | "error"
  | "result"
  | "test";

export type ConsoleMessage = {
  readonly kind: ConsoleMessageKind;
  readonly text: string;
};

export type SandboxTestResult = {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
  readonly actual?: string;
};

export type SandboxRunRequest = {
  readonly version: 1;
  readonly type: "run";
  readonly nonce: string;
  readonly runId: string;
  readonly code: string;
  readonly tests: readonly ExerciseTest[];
};

export type SandboxRunResult = {
  readonly version: 1;
  readonly type: "result";
  readonly nonce: string;
  readonly runId: string;
  readonly messages: readonly ConsoleMessage[];
  readonly tests: readonly SandboxTestResult[];
  readonly timedOut: boolean;
};

export type SandboxReadyMessage = {
  readonly version: 1;
  readonly type: "ready";
  readonly nonce: string;
};

export type SandboxConnectedMessage = {
  readonly version: 1;
  readonly type: "connected";
  readonly nonce: string;
  readonly connectionId: string;
};

export type SandboxPortMessage = SandboxRunRequest | SandboxRunResult;
