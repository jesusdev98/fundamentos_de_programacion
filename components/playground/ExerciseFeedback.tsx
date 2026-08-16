export function ExerciseFeedback({ status }: { readonly status: "pending" | "executed" | "correct" | "incorrect" }) {
  const labels = { pending: "Pendiente", executed: "Ejecutado", correct: "Correcto", incorrect: "Incorrecto" } as const;
  const colors = { pending: "bg-slate-100 text-slate-700", executed: "bg-sky-100 text-sky-800", correct: "bg-emerald-100 text-emerald-800", incorrect: "bg-rose-100 text-rose-800" } as const;
  return <span role="status" className={`rounded-full px-3 py-1 text-xs font-black ${colors[status]}`}>{labels[status]}</span>;
}
