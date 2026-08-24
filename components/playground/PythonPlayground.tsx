"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MAX_CODE_LENGTH, validateExerciseResult } from "@/lib/sandbox";
import { createPythonRunRequest, isPythonInitializationError, isPythonReadyMessage, isPythonResultMessage, PYTHON_EXECUTION_TIMEOUT_MS, PYTHON_INITIALIZATION_TIMEOUT_MS, pythonFailureResult, pythonSandboxResult } from "@/lib/python-runner";
import type { Exercise } from "@/types/learning";
import type { PythonRunRequest } from "@/types/python-runner";
import type { SandboxRunResult } from "@/types/sandbox";
import { CodeEditor } from "./CodeEditor";
import { ConsoleOutput } from "./ConsoleOutput";
import { ExerciseFeedback } from "./ExerciseFeedback";
import { RunButton } from "./RunButton";

type Phase = "idle" | "loading" | "ready" | "running";

export function PythonPlayground({ exercise, onCorrect }: { readonly exercise: Exercise; readonly onCorrect: () => void }) {
  const editorId = useId();
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<PythonRunRequest | null>(null);
  const activeRef = useRef<PythonRunRequest | null>(null);
  const initializationTimerRef = useRef<number | null>(null);
  const executionTimerRef = useRef<number | null>(null);
  const [code, setCode] = useState(exercise.starterCode);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<SandboxRunResult | null>(null);

  function clearTimers() {
    if (initializationTimerRef.current !== null) window.clearTimeout(initializationTimerRef.current);
    if (executionTimerRef.current !== null) window.clearTimeout(executionTimerRef.current);
    initializationTimerRef.current = null;
    executionTimerRef.current = null;
  }

  function terminateWorker() {
    clearTimers();
    workerRef.current?.terminate();
    workerRef.current = null;
    pendingRef.current = null;
    activeRef.current = null;
  }

  useEffect(() => () => {
    if (initializationTimerRef.current !== null) window.clearTimeout(initializationTimerRef.current);
    if (executionTimerRef.current !== null) window.clearTimeout(executionTimerRef.current);
    workerRef.current?.terminate();
  }, []);

  function execute(worker: Worker, request: PythonRunRequest) {
    activeRef.current = request;
    setPhase("running");
    executionTimerRef.current = window.setTimeout(() => {
      terminateWorker();
      setResult(pythonFailureResult(request.runId, `Tiempo límite excedido (${PYTHON_EXECUTION_TIMEOUT_MS} ms). El entorno se ha reiniciado.`, true));
      setPhase("idle");
    }, PYTHON_EXECUTION_TIMEOUT_MS);
    worker.postMessage(request);
  }

  function createWorker(request: PythonRunRequest) {
    setPhase("loading");
    const worker = new Worker("/python-worker.mjs", { type: "module", name: "python-practice" });
    workerRef.current = worker;
    pendingRef.current = request;
    initializationTimerRef.current = window.setTimeout(() => {
      terminateWorker();
      setResult(pythonFailureResult(request.runId, "Python no pudo cargarse dentro del tiempo previsto. Vuelve a intentarlo.", false));
      setPhase("idle");
    }, PYTHON_INITIALIZATION_TIMEOUT_MS);
    worker.onmessage = (event: MessageEvent<unknown>) => {
      if (isPythonReadyMessage(event.data)) {
        if (initializationTimerRef.current !== null) window.clearTimeout(initializationTimerRef.current);
        initializationTimerRef.current = null;
        setPhase("ready");
        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending) execute(worker, pending);
        return;
      }
      if (isPythonInitializationError(event.data)) {
        terminateWorker();
        setResult(pythonFailureResult(request.runId, `No se pudo iniciar Python: ${event.data.message}`, false));
        setPhase("idle");
        return;
      }
      const current = activeRef.current;
      if (!current) return;
      if (isPythonResultMessage(event.data, current.runId)) {
        if (executionTimerRef.current !== null) window.clearTimeout(executionTimerRef.current);
        executionTimerRef.current = null;
        activeRef.current = null;
        const nextResult = pythonSandboxResult(event.data);
        setResult(nextResult);
        setPhase("ready");
        if (validateExerciseResult(exercise.validation, nextResult)) onCorrect();
        return;
      }
    };
    worker.onerror = (event) => {
      terminateWorker();
      setResult(pythonFailureResult(request.runId, `Error del Worker de Python: ${event.message}`, false));
      setPhase("idle");
    };
  }

  function run() {
    if (phase === "loading" || phase === "running") return;
    const runId = crypto.randomUUID();
    if (code.length > MAX_CODE_LENGTH) {
      setResult(pythonFailureResult(runId, `El código supera el límite de ${MAX_CODE_LENGTH} caracteres.`, false));
      return;
    }
    setResult(null);
    const request = createPythonRunRequest(runId, code, exercise.validation.kind === "tests" ? exercise.validation.tests : []);
    if (workerRef.current) execute(workerRef.current, request);
    else createWorker(request);
  }

  const correct = result ? validateExerciseResult(exercise.validation, result) : false;
  const status = result ? (correct ? "correct" : "incorrect") : "pending";
  const statusLabel = phase === "idle" ? "Python se carga al ejecutar" : phase === "loading" ? "Cargando Python" : phase === "running" ? "Ejecutando código" : "Entorno listo";
  return (
    <div className="mt-6 space-y-4">
      <CodeEditor id={editorId} value={code} disabled={phase === "loading" || phase === "running"} language="Python" onChange={setCode} onRun={run} />
      <div className="flex flex-wrap items-center justify-between gap-3"><RunButton ready={phase !== "loading" && phase !== "running"} running={phase === "loading" || phase === "running"} runningLabel={phase === "loading" ? "Cargando Python…" : "Ejecutando…"} statusLabel={statusLabel} onRun={run} /><ExerciseFeedback status={phase === "running" ? "executed" : status} /></div>
      <ConsoleOutput messages={result?.messages ?? []} tests={result?.tests ?? []} />
      <p className="text-xs leading-5 text-slate-500">Ejecuta CPython 3.14.2 con Pyodide 314.0.4 en un Worker dedicado. input() no está disponible; la red y las APIs del navegador se bloquean después de cargar el runtime. No es una frontera de seguridad perfecta: un bucle puede consumir CPU hasta que el Worker se termina.</p>
    </div>
  );
}
