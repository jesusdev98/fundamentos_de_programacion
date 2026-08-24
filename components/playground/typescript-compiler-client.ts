import { createTypeScriptCompileRequest, isTypeScriptCompileResult, TYPESCRIPT_COMPILER_TIMEOUT_MS } from "@/lib/typescript-runner";
import type { TypeScriptCompileResult, TypeScriptVirtualFile } from "@/types/typescript-runner";

type Pending = { readonly resolve: (result: TypeScriptCompileResult) => void; readonly reject: (error: Error) => void; readonly timer: number };
let worker: Worker | null = null;
let workerGeneration = 0;
const pending = new Map<string, Pending>();

function resetWorker(error: Error) {
  worker?.terminate();
  worker = null;
  for (const request of pending.values()) { window.clearTimeout(request.timer); request.reject(error); }
  pending.clear();
}

function compilerWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(`/typescript-compiler-worker.js?generation=${workerGeneration++}`, { name: "typescript-compiler-5.9.3" });
  worker.onmessage = (event: MessageEvent<unknown>) => {
    const runId = event.data && typeof event.data === "object" && "runId" in event.data ? String(event.data.runId) : "";
    const request = pending.get(runId);
    if (!request || !isTypeScriptCompileResult(event.data, runId)) return;
    window.clearTimeout(request.timer);
    pending.delete(runId);
    request.resolve(event.data);
  };
  worker.onerror = (event) => resetWorker(new Error(event.message || "El compiler Worker ha fallado."));
  return worker;
}

export function compileTypeScript(runId: string, code: string, assertions: string, files: readonly TypeScriptVirtualFile[], emit: boolean): Promise<TypeScriptCompileResult> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resetWorker(new Error(`El compilador no respondió en ${TYPESCRIPT_COMPILER_TIMEOUT_MS} ms y se ha reiniciado.`)), TYPESCRIPT_COMPILER_TIMEOUT_MS);
    pending.set(runId, { resolve, reject, timer });
    compilerWorker().postMessage(createTypeScriptCompileRequest(runId, code, assertions, files, emit));
  });
}
