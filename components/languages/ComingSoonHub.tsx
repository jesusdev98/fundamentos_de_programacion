import Link from "next/link";
import { languagesById } from "@/data/languages";
import { resolveSources } from "@/data/sources";
import type { LanguageId } from "@/types/languages";

export function ComingSoonHub({ languageId }: { languageId: Exclude<LanguageId, "javascript"> }) {
  const language = languagesById.get(languageId);
  if (!language) throw new Error(`Unknown language: ${languageId}`);

  return (
    <main>
      <section className="language-hero border-b border-slate-200" style={{ "--language-accent": language.accent } as React.CSSProperties}>
        <div className="page-container py-16 sm:py-20">
          <p className="eyebrow">Próximamente</p>
          <h1 className="section-title mt-3">{language.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{language.description}</p>
          <Link className="secondary-button mt-7" href="/#lenguajes">Volver a lenguajes</Link>
        </div>
      </section>
      <section className="page-container grid gap-10 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <p className="eyebrow">Áreas futuras</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Qué podrá cubrir esta ruta</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {language.futureAreas.map((area) => <li className="border-l-2 border-slate-300 py-2 pl-4 font-bold text-slate-700" key={area}>{area}</li>)}
          </ul>
          <p className="mt-6 text-sm leading-6 text-slate-500">Todavía no hay niveles, lecciones, ejercicios ni cuestionarios publicados.</p>
        </div>
        <div>
          <p className="eyebrow">Documentación oficial</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Fuentes de referencia</h2>
          <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
            {resolveSources(language.sourceIds).map((source) => (
              <li className="py-4" key={source.id}>
                <a className="font-extrabold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>
                <p className="mt-1 text-sm text-slate-500">{source.organization}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
