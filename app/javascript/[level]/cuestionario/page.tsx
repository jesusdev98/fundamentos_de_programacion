import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizContent } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Cuestionario de ${curricula.javascript.levels[level].name}` : "Cuestionario" }; }
export default async function QuizPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  return <QuizContent curriculum={curricula.javascript} level={curricula.javascript.levels[slug]} levelSlug={slug} />;
}
