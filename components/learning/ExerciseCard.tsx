"use client";

import { useId, useState } from "react";
import type { Exercise } from "@/types/learning";
import type { RunnerId } from "@/types/curriculum";
import { JavaScriptPlayground } from "@/components/playground/JavaScriptPlayground";
import { PythonPlayground } from "@/components/playground/PythonPlayground";
import { TypeScriptPlayground } from "@/components/playground/TypeScriptPlayground";
import { CodeBlock } from "./CodeBlock";

const playgrounds = { javascript: JavaScriptPlayground, python: PythonPlayground, typescript: TypeScriptPlayground } as const;

export function ExerciseCard({ exercise, runner }: { readonly exercise: Exercise; readonly runner: RunnerId }) {
  const [hintCount, setHintCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);
  const detailsId = useId();
  const Playground = playgrounds[runner];
  return (
    <article id={exercise.id} className="exercise-card scroll-mt-6 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4"><span className="font-mono text-sm font-black text-[#963622]">{String(exercise.number).padStart(2, "0")}</span><h2 className="min-w-0 text-xl font-extrabold tracking-tight sm:text-2xl">{exercise.title}</h2></div>
        <span className="exercise-difficulty">{exercise.difficulty}</span>
      </div>
      <p className="mt-5 max-w-[72ch] leading-7 text-[#343b37]">{exercise.prompt}</p>
      <Playground exercise={exercise} onCorrect={() => setCompleted(true)} />
      <div className="mt-5 flex flex-wrap gap-3">
        {hintCount < exercise.hints.length ? <button type="button" className="secondary-button" onClick={() => setHintCount((count) => count + 1)}>Mostrar pista</button> : null}
        <button type="button" className="secondary-button" aria-expanded={showSolution} aria-controls={detailsId} onClick={() => setShowSolution((visible) => !visible)}>Ver solución</button>
      </div>
      {hintCount > 0 ? <ol className="callout mt-4 space-y-2 p-4 text-sm text-[#4b3b1d]">{exercise.hints.slice(0, hintCount).map((hint, index) => <li key={hint}><strong>Pista {index + 1}:</strong> {hint}</li>)}</ol> : null}
      {(showSolution || completed) ? <div id={detailsId} className="mt-5 min-w-0 space-y-4"><CodeBlock code={exercise.solution} label="Solución" /><div className="rounded border border-[#c9c7bc] bg-[#ece9df] p-4 text-sm leading-7 text-[#343b37]"><strong>Explicación: </strong>{exercise.explanation}</div></div> : null}
    </article>
  );
}
