"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createSandboxDocument } from "@/lib/sandbox-document";
import { isSandboxConnected, isSandboxReady, isSandboxResult, MAX_CODE_LENGTH, PARENT_WATCHDOG_MS, runtimeValidation, SANDBOX_DOCUMENT_OPTIONS, SANDBOX_VERSION, scheduleWatchdog, validateExerciseResult } from "@/lib/sandbox";
import type { Exercise } from "@/types/learning";
import type { SandboxRunResult } from "@/types/sandbox";
import type { PreparedSandboxCode } from "@/types/typescript-runner";
import { CodeEditor } from "./CodeEditor";
import { ConsoleOutput } from "./ConsoleOutput";
import { ExerciseFeedback } from "./ExerciseFeedback";
import { RunButton } from "./RunButton";

type Props = {
  readonly exercise: Exercise;
  readonly onCorrect: () => void;
  readonly language: "JavaScript" | "TypeScript";
  readonly note: string;
  readonly prepareCode?: (runId: string, code: string, exercise: Exercise) => Promise<PreparedSandboxCode>;
};

export function SandboxPlayground({ exercise, onCorrect, language, note, prepareCode }: Props) {
  const editorId = useId();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const portRef = useRef<MessagePort | null>(null);
  const connectRef = useRef<() => void>(() => undefined);
  const pendingRef = useRef<{ runId: string; finish: (result: SandboxRunResult) => void } | null>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const [code, setCode] = useState(exercise.starterCode);
  const [result, setResult] = useState<SandboxRunResult | null>(null);
  const [phase, setPhase] = useState<"idle" | "compiling" | "executing">("idle");
  const [sandboxReady, setSandboxReady] = useState(false);
  const [revision, setRevision] = useState(0);
  const nonce = `${exercise.id}-${revision}-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
      pendingRef.current = null;
      connectRef.current = () => undefined;
      portRef.current?.close();
      portRef.current = null;
    };
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    let disposed = false;
    let candidatePort: MessagePort | null = null;
    let latestConnectionId = "";
    const connect = () => {
      if (disposed || !iframe.contentWindow) return;
      const channel = new MessageChannel();
      const connectionId = crypto.randomUUID();
      latestConnectionId = connectionId;
      candidatePort?.close();
      candidatePort = channel.port1;
      channel.port1.onmessage = (message) => {
        if (isSandboxConnected(message.data, nonce, connectionId) && connectionId === latestConnectionId) {
          portRef.current?.close();
          portRef.current = channel.port1;
          candidatePort = null;
          setSandboxReady(true);
          return;
        }
        const pending = pendingRef.current;
        if (pending && isSandboxResult(message.data, nonce, pending.runId)) pending.finish(message.data);
      };
      channel.port1.start();
      iframe.contentWindow.postMessage({ version: SANDBOX_VERSION, type: "connect", nonce, connectionId }, "*", [channel.port2]);
    };
    connectRef.current = connect;
    const receive = (event: MessageEvent<unknown>) => {
      if (event.source !== iframe.contentWindow || !event.data || typeof event.data !== "object") return;
      if (isSandboxReady(event.data, nonce)) connect();
    };
    window.addEventListener("message", receive);
    connect();
    return () => {
      disposed = true;
      setSandboxReady(false);
      window.removeEventListener("message", receive);
      connectRef.current = () => undefined;
      candidatePort?.close();
      portRef.current?.close();
      portRef.current = null;
    };
  }, [nonce]);

  function execute(runId: string, preparedCode: string) {
    const port = portRef.current;
    if (!port) {
      setResult({ version: SANDBOX_VERSION, type: "result", nonce, runId, messages: [{ kind: "error", text: "El entorno todavía se está preparando. Vuelve a intentarlo." }], tests: [], timedOut: false });
      setPhase("idle");
      return;
    }
    setPhase("executing");
    let settled = false;
    watchdogRef.current = scheduleWatchdog(() => {
      if (settled || !mountedRef.current) return;
      settled = true;
      watchdogRef.current = null;
      pendingRef.current = null;
      setResult({ version: SANDBOX_VERSION, type: "result", nonce, runId, messages: [{ kind: "error", text: `El sandbox no respondió y fue recreado (${PARENT_WATCHDOG_MS} ms).` }], tests: [], timedOut: true });
      setPhase("idle");
      setSandboxReady(false);
      setRevision((value) => value + 1);
    }, window.setTimeout.bind(window));
    pendingRef.current = { runId, finish: (nextResult) => {
      if (settled || !mountedRef.current) return;
      settled = true;
      if (watchdogRef.current !== null) window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
      pendingRef.current = null;
      setResult(nextResult);
      setPhase("idle");
      if (validateExerciseResult(exercise.validation, nextResult)) onCorrect();
    } };
    const validation = runtimeValidation(exercise.validation);
    port.postMessage({ version: SANDBOX_VERSION, type: "run", nonce, runId, code: preparedCode, tests: validation?.kind === "tests" ? validation.tests : [] });
  }

  async function run() {
    if (phase !== "idle" || !sandboxReady || pendingRef.current) return;
    const runId = crypto.randomUUID();
    if (code.length > MAX_CODE_LENGTH) {
      setResult({ version: SANDBOX_VERSION, type: "result", nonce, runId, messages: [{ kind: "error", text: `El código supera el límite de ${MAX_CODE_LENGTH} caracteres.` }], tests: [], timedOut: false });
      return;
    }
    setResult(null);
    if (!prepareCode) { execute(runId, code); return; }
    setPhase("compiling");
    try {
      const prepared = await prepareCode(runId, code, exercise);
      if (!mountedRef.current) return;
      if (prepared.messages?.some((message) => message.kind === "error") || prepared.skipExecution) {
        const nextResult: SandboxRunResult = { version: SANDBOX_VERSION, type: "result", nonce, runId, messages: prepared.messages ?? [], tests: [], timedOut: false };
        setResult(nextResult);
        setPhase("idle");
        if (prepared.skipExecution && validateExerciseResult(exercise.validation, nextResult)) onCorrect();
        return;
      }
      execute(runId, prepared.code);
    } catch (error) {
      if (!mountedRef.current) return;
      setResult({ version: SANDBOX_VERSION, type: "result", nonce, runId, messages: [{ kind: "error", text: error instanceof Error ? error.message : String(error) }], tests: [], timedOut: false });
      setPhase("idle");
    }
  }

  const correct = result ? validateExerciseResult(exercise.validation, result) : false;
  const status = result ? (correct ? "correct" : "incorrect") : "pending";
  const busy = phase !== "idle";
  return (
    <div className="mt-6 space-y-4">
      <iframe key={revision} ref={iframeRef} title={`Sandbox aislado de ${language}`} sandbox="allow-scripts" srcDoc={createSandboxDocument(nonce, SANDBOX_DOCUMENT_OPTIONS)} onLoad={() => connectRef.current()} className="hidden" />
      <CodeEditor id={editorId} value={code} disabled={busy} language={language} onChange={setCode} onRun={run} />
      <div className="flex flex-wrap items-center justify-between gap-3"><RunButton ready={sandboxReady && !busy} running={busy} runningLabel={phase === "compiling" ? "Comprobando tipos…" : "Ejecutando…"} statusLabel={language === "TypeScript" && phase === "idle" ? "TypeScript se carga al ejecutar" : undefined} onRun={run} /><ExerciseFeedback status={busy ? "executed" : status} /></div>
      <ConsoleOutput messages={result?.messages ?? []} tests={result?.tests ?? []} />
      <p className="max-w-[80ch] text-xs leading-5 text-[#626862]">{note}</p>
    </div>
  );
}
