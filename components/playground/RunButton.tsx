export function RunButton({ running, onRun }: { readonly running: boolean; readonly onRun: () => void }) {
  return <button type="button" className="primary-button" disabled={running} onClick={onRun}>{running ? "Ejecutando…" : "Ejecutar"}</button>;
}
