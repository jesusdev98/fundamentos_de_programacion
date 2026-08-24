type CodeBlockProps = { readonly code: string; readonly label?: string };

export function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <figure className="code-window">
      {label && (
        <figcaption className="border-b border-[#434b47] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#aab1ad]">
          {label}
        </figcaption>
      )}
      <pre
        className="overflow-x-auto p-4 font-mono text-sm leading-7 text-[#eef1ed] sm:p-5"
        tabIndex={0}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}
