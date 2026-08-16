type CodeBlockProps = { readonly code: string; readonly label?: string };

export function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-lg border border-slate-700 bg-[#172033]">
      {label && (
        <figcaption className="border-b border-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </figcaption>
      )}
      <pre
        className="overflow-x-auto p-5 text-sm leading-7 text-slate-100"
        tabIndex={0}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
