import { resolveSources } from "@/data/sources";

export function SourceLinks({ sourceIds }: { readonly sourceIds: readonly string[] }) {
  return (
    <aside className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500" aria-label="Fuentes y referencias">
      <strong className="text-slate-700">Fuentes y referencias: </strong>
      {resolveSources(sourceIds).map((source, index) => <span key={source.id}>{index > 0 ? ", " : ""}<a className="underline hover:text-slate-900" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></span>)}
    </aside>
  );
}
