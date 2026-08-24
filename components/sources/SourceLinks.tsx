import { resolveSources } from "@/data/sources";

export function SourceLinks({ sourceIds }: { readonly sourceIds: readonly string[] }) {
  return (
    <aside className="source-list mt-6 border-t border-[#c9c7bc] pt-4 text-xs leading-6 text-[#626862]" aria-label="Fuentes y referencias">
      <strong className="text-[#343b37]">Fuentes y referencias: </strong>
      {resolveSources(sourceIds).map((source, index) => <span key={source.id}>{index > 0 ? ", " : ""}<a className="underline underline-offset-2 hover:text-[#18201d]" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></span>)}
    </aside>
  );
}
