import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/learning/PageIntro";
import { Quiz } from "@/components/quiz/Quiz";
import { isLevelSlug, levels, levelSlugs } from "@/data/javascript/levels";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Cuestionario de ${levels[level].name}` : "Cuestionario" }; }
export default async function QuizPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  const level = levels[slug];
  return <main><PageIntro eyebrow={`${level.name} · Cuestionario`} title="Comprueba y repasa" description="Cada intento elige diez preguntas únicas del banco de cincuenta y mezcla sus cuatro respuestas." /><div className="page-container max-w-4xl py-10 sm:py-14"><Quiz bank={level.questions} level={slug} /></div></main>;
}
