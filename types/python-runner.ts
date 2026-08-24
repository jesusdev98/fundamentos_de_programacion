import type { ExerciseTest } from "./learning";
import type { ConsoleMessage, SandboxTestResult } from "./sandbox";

export type PythonRunRequest = {
  readonly version: 1;
  readonly type: "run";
  readonly runId: string;
  readonly code: string;
  readonly tests: readonly ExerciseTest[];
};

export type PythonReadyMessage = {
  readonly version: 1;
  readonly type: "ready";
  readonly pythonVersion: string;
};

export type PythonResultMessage = {
  readonly version: 1;
  readonly type: "result";
  readonly runId: string;
  readonly messages: readonly ConsoleMessage[];
  readonly tests: readonly SandboxTestResult[];
};

export type PythonInitializationError = {
  readonly version: 1;
  readonly type: "initialization-error";
  readonly message: string;
};

export type PythonWorkerMessage = PythonReadyMessage | PythonResultMessage | PythonInitializationError;
