export function ExerciseFeedback({ status }: { readonly status: "pending" | "executed" | "correct" | "incorrect" }) {
  const labels = { pending: "Pendiente", executed: "Ejecutado", correct: "Correcto", incorrect: "Incorrecto" } as const;
  return <span role="status" className="status-indicator" data-status={status}>{labels[status]}</span>;
}
