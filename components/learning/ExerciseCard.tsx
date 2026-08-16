"use client";

import { useId, useState } from "react";
import type { Exercise } from "@/types/learning";
import { JavaScriptPlayground } from "@/components/playground/JavaScriptPlayground";
import { CodeBlock } from "./CodeBlock";

export function ExerciseCard({ exercise }: { readonly exercise: Exercise }) {
  const [hintCount, setHintCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completed, setCompleted] = useState(false);
  const detailsId = useId();
  return (
    <article id={exercise.id} className="scroll-mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4"><span className="font-mono text-sm font-black text-[#bd3f1d]">{String(exercise.number).padStart(2, "0")}</span><h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">{exercise.title}</h2></div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">{exercise.difficulty}</span>
      </div>
      <p className="mt-5 leading-7 text-slate-700">{exercise.prompt}</p>
      <JavaScriptPlayground exercise={exercise} onCorrect={() => setCompleted(true)} />
      <div className="mt-5 flex flex-wrap gap-3">
        {hintCount < exercise.hints.length ? <button type="button" className="secondary-button" onClick={() => setHintCount((count) => count + 1)}>Mostrar pista</button> : null}
        <button type="button" className="secondary-button" aria-expanded={showSolution} aria-controls={detailsId} onClick={() => setShowSolution((visible) => !visible)}>Ver solución</button>
      </div>
      {hintCount > 0 ? <ol className="mt-4 space-y-2 rounded-lg bg-amber-50 p-4 text-sm text-amber-950">{exercise.hints.slice(0, hintCount).map((hint, index) => <li key={hint}><strong>Pista {index + 1}:</strong> {hint}</li>)}</ol> : null}
      {(showSolution || completed) ? <div id={detailsId} className="mt-5 space-y-4"><CodeBlock code={exercise.solution} label="Solución" /><div className="rounded-lg bg-slate-100 p-4 text-sm leading-7 text-slate-700"><strong className="text-slate-950">Explicación: </strong>{exercise.explanation}</div></div> : null}
    </article>
  );
}
