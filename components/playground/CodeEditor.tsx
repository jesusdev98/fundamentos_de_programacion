import type { KeyboardEvent } from "react";

type Props = {
  readonly id: string;
  readonly value: string;
  readonly disabled: boolean;
  readonly language?: string;
  readonly onChange: (value: string) => void;
  readonly onRun: () => void;
};

export function CodeEditor({ id, value, disabled, language = "JavaScript", onChange, onRun }: Props) {
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    onRun();
  }
  return (
    <div>
      <label className="block font-mono text-xs font-extrabold uppercase tracking-[0.1em]" htmlFor={id}>Editor de {language}</label>
      <p id={`${id}-help`} className="mt-2 text-xs leading-5 text-[#626862]">Enter ejecuta. Shift+Enter inserta una línea. Ctrl/Cmd+Enter también ejecuta todo el editor.</p>
      <textarea id={id} value={value} disabled={disabled} spellCheck={false} aria-describedby={`${id}-help`} onChange={(event) => onChange(event.target.value)} onKeyDown={handleKeyDown} className="code-editor mt-3 p-4" />
    </div>
  );
}
