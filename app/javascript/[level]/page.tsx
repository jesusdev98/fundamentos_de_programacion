import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { isLevelSlug, levels, levelSlugs } from "@/data/javascript/levels";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? levels[level].name : "Nivel" }; }
export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  const level = levels[slug];
  const paths = [
    { eyebrow: `${level.lessons.length} lecciones`, title: "Teoría", description: "Explicaciones breves, ejemplos y referencias primarias.", href: `/javascript/${slug}/teoria`, linkLabel: "Estudiar teoría" },
    { eyebrow: `${level.exercises.length} ejercicios`, title: "Práctica", description: "Escribe y ejecuta core JavaScript en un sandbox aislado.", href: `/javascript/${slug}/practica`, linkLabel: "Abrir práctica" },
    { eyebrow: "Banco de 50", title: "Cuestionario", description: "Resuelve una muestra aleatoria de diez preguntas y revisa errores.", href: `/javascript/${slug}/cuestionario`, linkLabel: "Comenzar cuestionario" },
  ];
  return <main><header className="hero-grid border-b border-slate-200"><div className="page-container py-16"><p className="eyebrow">Nivel {level.adjective}</p><h1 className="section-title mt-3">{level.name}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{level.description}</p></div></header><section className="page-container grid gap-5 py-12 md:grid-cols-3">{paths.map((path, index) => <LearningPathCard key={path.title} index={index + 1} {...path} />)}</section></main>;
}
