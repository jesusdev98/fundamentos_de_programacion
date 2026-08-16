export function RunButton({ ready, running, onRun }: { readonly ready: boolean; readonly running: boolean; readonly onRun: () => void }) {
  return <div className="flex flex-wrap items-center gap-3"><button type="button" className="primary-button" disabled={running || !ready} onClick={onRun}>{running ? "Ejecutando…" : "Ejecutar"}</button><span role="status" className="text-xs font-bold text-slate-600">{ready ? "Entorno listo" : "Preparando entorno…"}</span></div>;
}
