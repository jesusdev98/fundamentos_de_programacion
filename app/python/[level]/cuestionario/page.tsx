import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizContent } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Cuestionario de ${curricula.python.levels[level].name}` : "Cuestionario" }; }
export default async function PythonQuizPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!isLevelSlug(level)) notFound();
  return <QuizContent curriculum={curricula.python} level={curricula.python.levels[level]} levelSlug={level} />;
}
