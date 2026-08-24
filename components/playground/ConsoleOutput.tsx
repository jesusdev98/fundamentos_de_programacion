import type { ConsoleMessage, SandboxTestResult } from "@/types/sandbox";

const styles = { log: "text-slate-200", warn: "text-amber-300", error: "text-rose-300", result: "text-sky-300", test: "text-emerald-300" } as const;

export function ConsoleOutput({ messages, tests }: { readonly messages: readonly ConsoleMessage[]; readonly tests: readonly SandboxTestResult[] }) {
  return (
    <section aria-label="Salida de consola" aria-live="polite" className="console-output p-4">
      <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#8f9893]">Consola / output</p>
      {messages.length === 0 && tests.length === 0 ? <p className="text-[#8f9893]">La salida aparecerá aquí.</p> : null}
      <ol className="space-y-2">
        {messages.map((message, index) => <li className={styles[message.kind]} key={`${message.kind}-${index}`}>[{message.kind}] {message.text}</li>)}
        {tests.map((test) => <li className={test.passed ? "text-emerald-300" : "text-rose-300"} key={test.id}>{test.passed ? "✓" : "✗"} {test.label}{!test.passed && test.actual ? `: ${test.actual}` : ""}</li>)}
      </ol>
    </section>
  );
}
