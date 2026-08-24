import Link from "next/link";
import { LearningPathCard } from "./LearningPathCard";
import { LessonCard } from "./LessonCard";
import { ExerciseCard } from "./ExerciseCard";
import { PageIntro } from "./PageIntro";
import { Quiz } from "@/components/quiz/Quiz";
import type { Curriculum, CurriculumLevel, LevelSlug } from "@/types/curriculum";

export function CurriculumOverview({ curriculum }: { readonly curriculum: Curriculum }) {
  return <main><section className="hero-grid border-b border-slate-200"><div className="page-container py-16 sm:py-20"><p className="eyebrow">Ruta de aprendizaje</p><h1 className="section-title mt-3">Elige tu nivel de {curriculum.languageName}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Avanza desde los fundamentos hasta los mecanismos avanzados del lenguaje. Cada nivel combina teoría, práctica ejecutable y cuestionario.</p></div></section><section className="page-container grid gap-6 py-12 md:grid-cols-3">{Object.values(curriculum.levels).map((level) => <article key={level.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="eyebrow">{level.lessons.length} lecciones · {level.exercises.length} ejercicios</p><h2 className="mt-4 text-3xl font-black text-slate-950">{level.name}</h2><p className="mt-4 leading-7 text-slate-600">{level.description}</p><Link className="primary-button mt-7" href={`/${curriculum.languageId}/${level.slug}`}>Explorar nivel</Link></article>)}</section></main>;
}

export function LevelOverview({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  const basePath = `/${curriculum.languageId}/${level.slug}`;
  const paths = [
    { eyebrow: `${level.lessons.length} lecciones`, title: "Teoría", description: "Explicaciones breves, ejemplos y referencias primarias.", href: `${basePath}/teoria`, linkLabel: "Estudiar teoría" },
    { eyebrow: `${level.exercises.length} ejercicios`, title: "Práctica", description: `Escribe y ejecuta ${curriculum.languageName} en un entorno aislado.`, href: `${basePath}/practica`, linkLabel: "Abrir práctica" },
    { eyebrow: "Banco de 50", title: "Cuestionario", description: "Resuelve una muestra aleatoria de diez preguntas y revisa errores.", href: `${basePath}/cuestionario`, linkLabel: "Comenzar cuestionario" },
  ];
  return <main><header className="hero-grid border-b border-slate-200"><div className="page-container py-16"><p className="eyebrow">Nivel {level.adjective}</p><h1 className="section-title mt-3">{level.name}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{level.description}</p></div></header><section className="page-container grid gap-5 py-12 md:grid-cols-3">{paths.map((path, index) => <LearningPathCard key={path.title} index={index + 1} {...path} />)}</section></main>;
}

export function TheoryContent({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  return <main><PageIntro eyebrow={`${level.name} · Teoría`} title="Comprende antes de memorizar" description={`${level.lessons.length} lecciones originales con ejemplos breves, puntos clave y referencias para profundizar.`} /><div className="page-container grid gap-6 py-10 lg:grid-cols-[17rem_1fr] lg:items-start"><nav className="max-h-[80vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-6" aria-label="Contenido de teoría"><p className="text-sm font-black text-slate-950">En esta sección</p><ol className="mt-4 space-y-3 text-sm text-slate-600">{level.lessons.map((lesson, index) => <li key={lesson.id}><a className="hover:text-[#bd3f1d] hover:underline" href={`#${lesson.id}`}>{index + 1}. {lesson.title}</a></li>)}</ol></nav><div className="space-y-7">{level.lessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} number={index + 1} basePath={`/${curriculum.languageId}/${level.slug}`} />)}</div></div></main>;
}

export function PracticeContent({ curriculum, level }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel }) {
  return <main><PageIntro eyebrow={`${level.name} · Práctica`} title="Convierte ideas en código" description="Ejecuta cada solución en un entorno aislado. Los ejercicios simples validan la salida y los complejos usan pruebas educativas." /><div className="page-container max-w-5xl space-y-7 py-10 sm:py-14">{level.exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} runner={curriculum.runner} />)}</div></main>;
}

export function QuizContent({ curriculum, level, levelSlug }: { readonly curriculum: Curriculum; readonly level: CurriculumLevel; readonly levelSlug: LevelSlug }) {
  return <main><PageIntro eyebrow={`${level.name} · Cuestionario`} title="Comprueba y repasa" description="Cada intento elige diez preguntas únicas del banco de cincuenta y baraja sus cuatro respuestas." /><div className="page-container max-w-4xl py-10 sm:py-14"><Quiz bank={level.questions} languageName={curriculum.languageName} theoryBasePath={`/${curriculum.languageId}/${levelSlug}/teoria`} /></div></main>;
}
