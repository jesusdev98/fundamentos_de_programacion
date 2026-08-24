import Link from "next/link";
import { languages } from "@/data/languages";
import { resolveSources } from "@/data/sources";

const statusLabel = { available: "Disponible", "coming-soon": "Próximamente" } as const;

export default function Home() {
  return (
    <main>
      <section className="editorial-hero">
        <div className="page-container py-12 sm:py-16 lg:py-20">
          <p className="editorial-kicker">Workspace de estudio</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-[-0.05em] text-[#18201d] sm:text-5xl lg:text-6xl">Fundamentos de la Programación</h1>
              <p className="lede mt-6">Teoría, práctica ejecutable y cuestionarios para estudiar JavaScript, TypeScript y Python desde una misma base técnica.</p>
            </div>
            <div className="metric-grid grid grid-cols-3 gap-4" aria-label="Contenido disponible">
              <p className="metric"><strong className="metric-value">210</strong><span className="metric-label">lecciones</span></p>
              <p className="metric"><strong className="metric-value">114</strong><span className="metric-label">ejercicios</span></p>
              <p className="metric"><strong className="metric-value">450</strong><span className="metric-label">preguntas</span></p>
            </div>
          </div>
          <Link className="primary-button mt-8" href="#lenguajes">Explorar lenguajes</Link>
        </div>
      </section>

      <section className="page-container scroll-mt-8 py-12 sm:py-16" id="lenguajes">
        <p className="eyebrow">Tres rutas completas</p>
        <h2 className="section-title mt-3">Elige un lenguaje</h2>
        <p className="lede mt-5">Cada lenguaje incluye 70 lecciones, 38 ejercicios y 150 preguntas distribuidas en tres niveles.</p>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {languages.map((language) => (
            <article className="language-card flex min-h-80 flex-col p-6 pl-7" key={language.id} style={{ "--language-accent": language.accent } as React.CSSProperties}>
              <p className="language-status font-mono text-xs font-extrabold uppercase tracking-[0.1em]">{statusLabel[language.status]}</p>
              <h3 className="mt-5 text-3xl font-extrabold tracking-tight">{language.name}</h3>
              <p className="mt-4 flex-1 leading-7 text-[#626862]">{language.description}</p>
              {language.stats ? (
                <dl className="mt-6 grid grid-cols-3 border-y border-[#c9c7bc] py-3 font-mono text-xs text-[#626862]">
                  <div><dt className="sr-only">Lecciones</dt><dd><strong className="block text-base text-[#18201d]">{language.stats.lessons}</strong>lecciones</dd></div>
                  <div><dt className="sr-only">Ejercicios</dt><dd><strong className="block text-base text-[#18201d]">{language.stats.exercises}</strong>ejercicios</dd></div>
                  <div><dt className="sr-only">Preguntas</dt><dd><strong className="block text-base text-[#18201d]">{language.stats.questions}</strong>preguntas</dd></div>
                </dl>
              ) : <p className="mt-6 text-sm font-bold text-[#626862]">Ruta en preparación</p>}
              <Link className="language-link mt-6 inline-flex min-h-11 items-center" href={`/${language.slug}`}>{language.status === "available" ? "Explorar ruta" : "Ver avance"}</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#c9c7bc] bg-[#fffefa]" id="fuentes">
        <div className="page-container py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="eyebrow">Referencias primarias</p>
              <h2 className="section-title mt-3">Aprender con referencias confiables</h2>
              <p className="lede mt-5">El contenido es original y cada ruta enlaza documentación, estándares y repositorios oficiales para contrastar y profundizar.</p>
              <Link className="secondary-button mt-7" href="/fuentes">Ver fuentes y créditos</Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {languages.map((language) => (
                <article className="border-l-4 pl-4" style={{ borderColor: language.accent }} key={language.id}>
                  <h3 className="text-lg font-extrabold">{language.name}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[#626862]">
                    {resolveSources(language.sourceIds).map((source) => <li key={source.id}>{source.name}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
