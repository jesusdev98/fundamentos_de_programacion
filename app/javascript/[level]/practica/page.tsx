import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExerciseCard } from "@/components/learning/ExerciseCard";
import { PageIntro } from "@/components/learning/PageIntro";
import { isLevelSlug, levels, levelSlugs } from "@/data/javascript/levels";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Práctica de ${levels[level].name}` : "Práctica" }; }
export default async function PracticePage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  const level = levels[slug];
  return <main><PageIntro eyebrow={`${level.name} · Práctica`} title="Convierte ideas en código" description="Ejecuta cada solución en un entorno aislado. Los ejercicios simples validan salida y los complejos usan pruebas educativas." /><div className="page-container max-w-5xl space-y-7 py-10 sm:py-14">{level.exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}</div></main>;
}
