import type { Metadata } from "next";
import { PageIntro } from "@/components/learning/PageIntro";
import { languages } from "@/data/languages";
import { resolveSources, sources } from "@/data/sources";

const sourceTypeLabels = {
  documentation: "Documentación",
  standard: "Estándar",
  guide: "Guía",
  repository: "Repositorio",
  license: "Licencia",
} as const;

export const metadata: Metadata = { title: "Fuentes y créditos" };

export default function SourcesPage() {
  return (
    <main>
      <PageIntro eyebrow="Transparencia" title="Fuentes y créditos" description="Todo el contenido educativo y sus ejemplos fueron redactados para este proyecto. Las referencias oficiales se usan para contrastar conceptos, no para reproducir sus textos o diseños." />
       <div className="page-container space-y-14 py-10 sm:py-14">
        {languages.map((language) => {
          const primaryIds = new Set<string>(language.sourceIds);
          const primarySources = resolveSources(language.sourceIds);
          const supportingSources = sources.filter((source) => source.languageId === language.id && !primaryIds.has(source.id));
          return (
            <section aria-labelledby={`sources-${language.id}`} key={language.id}>
               <div className="border-l-4 pl-5" style={{ borderColor: language.accent }}>
                <p className="eyebrow">{language.status === "available" ? "Ruta disponible" : "Ruta próxima"}</p>
                 <h2 className="mt-2 text-3xl font-extrabold tracking-tight" id={`sources-${language.id}`}>{language.name}</h2>
              </div>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {primarySources.map((source) => <SourceCard key={source.id} source={source} />)}
              </div>
               {supportingSources.length > 0 ? <details className="mt-6 border-y border-[#c9c7bc] py-2"><summary className="cursor-pointer font-extrabold">Referencias técnicas adicionales ({supportingSources.length})</summary><div className="mt-4 grid gap-4 md:grid-cols-2">{supportingSources.map((source) => <SourceCard key={source.id} source={source} />)}</div></details> : null}
            </section>
          );
        })}
         <p className="border border-[#c9c7bc] border-l-4 border-l-[#7c827b] bg-[#ece9df] p-5 text-sm leading-7 text-[#626862]">Este proyecto no está afiliado, patrocinado ni aprobado por Mozilla, TC39, Ecma International, Microsoft, TypeScript, Python Software Foundation, Node.js ni OpenJS Foundation. Enlazar una obra no traslada su licencia al contenido original de esta plataforma.</p>
      </div>
    </main>
  );
}

function SourceCard({ source }: { source: (typeof sources)[number] }) {
  return <article className="source-card p-5"><p className="eyebrow">{sourceTypeLabels[source.type]}</p><h3 className="mt-3 text-lg font-extrabold">{source.name}</h3><p className="mt-1 text-sm text-[#626862]">{source.organization}</p>{source.note ? <p className="mt-3 text-sm leading-6 text-[#626862]">{source.note}</p> : null}{source.licensingNote ? <p className="mt-3 text-xs leading-5 text-[#626862]">{source.licensingNote}</p> : null}<a className="text-link mt-4 inline-flex min-h-11 items-center" href={source.url} target="_blank" rel="noopener noreferrer">Abrir fuente</a></article>;
}
