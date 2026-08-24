"use client";

import type { Exercise } from "@/types/learning";
import { diagnosticMessages } from "@/lib/typescript-runner";
import { compileTypeScript } from "./typescript-compiler-client";
import { SandboxPlayground } from "./SandboxPlayground";

async function prepare(runId: string, code: string, exercise: Exercise) {
  if (exercise.validation.kind !== "typescript") throw new Error("La práctica TypeScript no define una validación del compilador.");
  const emit = Boolean(exercise.validation.runtime);
  const result = await compileTypeScript(runId, code, exercise.validation.assertions ?? "", exercise.validation.files ?? [], emit);
  const messages = diagnosticMessages(result.diagnostics);
  if (messages.some((message) => message.kind === "error")) return { code: "", messages };
  if (!emit) return { code: "", messages: [{ kind: "result" as const, text: "Comprobación de tipos superada con TypeScript 5.9.3." }], skipExecution: true };
  if (result.emittedCode === undefined) return { code: "", messages: [{ kind: "error" as const, text: "El compilador no produjo JavaScript ejecutable." }] };
  return { code: result.emittedCode, messages };
}

export function TypeScriptPlayground({ exercise, onCorrect }: { readonly exercise: Exercise; readonly onCorrect: () => void }) {
  return <SandboxPlayground exercise={exercise} onCorrect={onCorrect} language="TypeScript" prepareCode={prepare} note="Comprueba con TypeScript 5.9.3 en un único Worker lazy y ejecuta sólo el JavaScript emitido dentro del sandbox existente. No ofrece Language Service, paquetes npm ni imports de red; los módulos educativos usan un VFS acotado." />;
}
