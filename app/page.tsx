import Link from "next/link";
import { languages } from "@/data/languages";
import { resolveSources } from "@/data/sources";

const statusLabel = { available: "Disponible", "coming-soon": "Próximamente" } as const;

export default function Home() {
  return (
    <main>
      <section className="hero-grid border-b border-slate-200">
        <div className="page-container py-20 sm:py-24 lg:py-28">
          <p className="eyebrow">Aprende razonando</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">Fundamentos de la Programación</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Construye una base que puedas trasladar entre lenguajes: conceptos claros, práctica deliberada y referencias oficiales.</p>
          <Link className="primary-button mt-9" href="#lenguajes">Explorar lenguajes</Link>
        </div>
      </section>

      <section className="page-container scroll-mt-8 py-16 lg:py-20" id="lenguajes">
        <p className="eyebrow">Catálogo</p>
        <h2 className="section-title mt-3">Elige un lenguaje</h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Una entrada clara para cada ruta. JavaScript, Python y TypeScript ya están disponibles con teoría, práctica y cuestionarios.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {languages.map((language) => (
            <article className="language-card flex min-h-80 flex-col border border-slate-200 bg-white p-7" key={language.id} style={{ "--language-accent": language.accent } as React.CSSProperties}>
              <p className="language-status text-xs font-black uppercase tracking-[0.14em]">{statusLabel[language.status]}</p>
              <h3 className="mt-5 text-3xl font-black tracking-tight text-slate-950">{language.name}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-600">{language.description}</p>
              {language.stats ? <p className="mt-6 text-sm font-bold leading-6 text-slate-600">{language.stats.levels} niveles · {language.stats.lessons} lecciones<br />{language.stats.exercises} ejercicios · {language.stats.questions} preguntas</p> : <p className="mt-6 text-sm font-bold text-slate-500">Ruta en preparación</p>}
              <Link className="mt-6 font-extrabold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-700" href={`/${language.slug}`}>{language.status === "available" ? "Explorar ruta" : "Ver avance"}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white" id="fuentes">
        <div className="page-container py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div><p className="eyebrow">Fuentes</p><h2 className="section-title mt-3">Aprender con referencias confiables</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">El contenido de la plataforma es original. La documentación oficial se usa para verificar conceptos y abrir caminos de profundización.</p><Link className="secondary-button mt-7" href="/fuentes">Ver fuentes y créditos</Link></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {languages.map((language) => <article className="border-t-2 pt-4" style={{ borderColor: language.accent }} key={language.id}><h3 className="text-lg font-black text-slate-950">{language.name}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{resolveSources(language.sourceIds).map((source) => <li key={source.id}>{source.name}</li>)}</ul></article>)}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
