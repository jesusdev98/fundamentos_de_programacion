import Link from "next/link";
import { Quiz } from "@/components/quiz/Quiz";
import type { Curriculum, CurriculumLevel, LevelSlug } from "@/types/curriculum";
import { ExerciseCard } from "./ExerciseCard";
import { LearningPathCard } from "./LearningPathCard";
import { LessonCard } from "./LessonCard";
import { PageIntro } from "./PageIntro";

export function CurriculumOverview({ curriculum }: { readonly curriculum: Curriculum }) {
  return (
    <main id="contenido-principal" tabIndex={-1} className="language-scope" data-language={curriculum.languageId}>
      <section className="editorial-hero">
        <div className="language-strip page-container py-12 pl-5 sm:py-16 sm:pl-7">
          <p className="eyebrow">Ruta de aprendizaje</p>
          <h1 className="section-title mt-3">Elige tu nivel de {curriculum.languageName}</h1>
          <p className="lede mt-5">Avanza desde los fundamentos hasta los mecanismos avanzados del lenguaje. Cada nivel combina teoría, práctica ejecutable y cuestionario.</p>
        </div>
      </section>
      <section className="page-container grid gap-4 py-10 sm:py-12 md:grid-cols-3">
        {Object.values(curriculum.levels).map((level, index) => (
          <article key={level.slug} className="workspace-card flex min-h-72 flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow">{level.lessons.length} lecciones · {level.exercises.length} ejercicios</p>
              <span className="font-mono text-sm text-[#7c827b]" aria-hidden="true">0{index + 1}</span>
            </div>
            <h2 className="mt-7 text-3xl font-extrabold tracking-tight">{level.name}</h2>
            <p className="mt-4 flex-1 leading-7 text-[#626862]">{level.description}</p>
            <Link className="primary-button mt-7 self-start" href={`/${curriculum.languageId}/${level.slug}`}>Explorar nivel</Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export function LevelOverview({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  const basePath = `/${curriculum.languageId}/${level.slug}`;
  const paths = [
    { eyebrow: `${level.lessons.length} lecciones`, title: "Teoría", description: "Explicaciones breves, ejemplos y referencias primarias.", href: `${basePath}/teoria`, linkLabel: "Estudiar teoría" },
    { eyebrow: `${level.exercises.length} ejercicios`, title: "Práctica", description: `Escribe y ejecuta ${curriculum.languageName} en un entorno aislado.`, href: `${basePath}/practica`, linkLabel: "Abrir práctica" },
    { eyebrow: "Banco de 50", title: "Cuestionario", description: "Resuelve una muestra aleatoria de diez preguntas y revisa errores.", href: `${basePath}/cuestionario`, linkLabel: "Comenzar cuestionario" },
  ];
  return (
    <main id="contenido-principal" tabIndex={-1} className="language-scope" data-language={curriculum.languageId}>
      <header className="editorial-hero">
        <div className="language-strip page-container py-12 pl-5 sm:py-16 sm:pl-7">
          <p className="eyebrow">Nivel {level.adjective}</p>
          <h1 className="section-title mt-3">{level.name}</h1>
          <p className="lede mt-5">{level.description}</p>
        </div>
      </header>
      <section className="page-container grid gap-4 py-10 sm:py-12 md:grid-cols-3">
        {paths.map((path, index) => <LearningPathCard key={path.title} index={index + 1} {...path} />)}
      </section>
    </main>
  );
}

export function TheoryContent({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  return (
    <main id="contenido-principal" tabIndex={-1} className="language-scope" data-language={curriculum.languageId}>
      <PageIntro eyebrow={`${level.name} · Teoría`} title="Comprende antes de memorizar" description={`${level.lessons.length} lecciones originales con ejemplos breves, puntos clave y referencias para profundizar.`} />
      <div className="page-container grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6 py-8 sm:py-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
        <nav className="contents-nav max-h-[70vh] overflow-y-auto p-5 lg:sticky lg:top-6" aria-label="Contenido de teoría">
          <p className="font-mono text-xs font-extrabold uppercase tracking-[0.1em]">En esta sección</p>
          <ol className="mt-4 space-y-3 text-sm text-[#626862]">
            {level.lessons.map((lesson, index) => <li key={lesson.id}><a className="hover:text-[#963622] hover:underline" href={`#${lesson.id}`}>{index + 1}. {lesson.title}</a></li>)}
          </ol>
        </nav>
        <div className="theory-copy min-w-0 space-y-5">
          {level.lessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} number={index + 1} basePath={`/${curriculum.languageId}/${level.slug}`} />)}
        </div>
      </div>
    </main>
  );
}

export function PracticeContent({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  return <main id="contenido-principal" tabIndex={-1} className="language-scope" data-language={curriculum.languageId}><PageIntro eyebrow={`${level.name} · Práctica`} title="Convierte ideas en código" description="Ejecuta cada solución en un entorno aislado. Los ejercicios simples validan la salida y los complejos usan pruebas educativas." /><div className="page-container max-w-5xl space-y-5 py-8 sm:py-12">{level.exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} runner={curriculum.runner} />)}</div></main>;
}

export function QuizContent({ curriculum, level, levelSlug }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel; readonly levelSlug: LevelSlug }) {
  return <main id="contenido-principal" tabIndex={-1} className="language-scope" data-language={curriculum.languageId}><PageIntro eyebrow={`${level.name} · Cuestionario`} title="Comprueba y repasa" description="Cada intento elige diez preguntas únicas del banco de cincuenta y baraja sus cuatro respuestas." /><div className="page-container max-w-4xl py-8 sm:py-12"><Quiz bank={level.questions} languageName={curriculum.languageName} theoryBasePath={`/${curriculum.languageId}/${levelSlug}/teoria`} /></div></main>;
}
