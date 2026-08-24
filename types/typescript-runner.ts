import type { ConsoleMessage } from "./sandbox";

export type TypeScriptVirtualFile = { readonly name: string; readonly content: string };

export type TypeScriptCompileRequest = {
  readonly version: 1;
  readonly type: "compile";
  readonly runId: string;
  readonly code: string;
  readonly assertions: string;
  readonly files: readonly TypeScriptVirtualFile[];
  readonly emit: boolean;
};

export type TypeScriptDiagnostic = {
  readonly code: number;
  readonly category: "error" | "warning";
  readonly message: string;
  readonly file?: string;
  readonly line?: number;
  readonly character?: number;
};

export type TypeScriptCompileResult = {
  readonly version: 1;
  readonly type: "result";
  readonly runId: string;
  readonly compilerVersion: string;
  readonly diagnostics: readonly TypeScriptDiagnostic[];
  readonly emittedCode?: string;
};

export type PreparedSandboxCode = {
  readonly code: string;
  readonly messages?: readonly ConsoleMessage[];
  readonly skipExecution?: boolean;
};
