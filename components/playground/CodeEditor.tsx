import type { KeyboardEvent } from "react";

type Props = {
  readonly id: string;
  readonly value: string;
  readonly disabled: boolean;
  readonly onChange: (value: string) => void;
  readonly onRun: () => void;
};

export function CodeEditor({ id, value, disabled, onChange, onRun }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    onRun();
  }
  return (
    <div>
      <label className="block text-sm font-black text-slate-950" htmlFor={id}>Editor de JavaScript</label>
      <p id={`${id}-help`} className="mt-1 text-xs leading-5 text-slate-500">Enter ejecuta. Shift+Enter inserta una línea. Ctrl/Cmd+Enter también ejecuta todo el editor.</p>
      <textarea id={id} value={value} disabled={disabled} spellCheck={false} aria-describedby={`${id}-help`} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} className="mt-3 min-h-64 w-full resize-y rounded-lg border border-slate-700 bg-[#111827] p-4 font-mono text-sm leading-6 text-slate-100 shadow-inner" />
    </div>
  );
}
