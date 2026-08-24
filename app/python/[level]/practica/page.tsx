import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeContent } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Práctica de ${curricula.python.levels[level].name}` : "Práctica" }; }
export default async function PythonPracticePage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!isLevelSlug(level)) notFound();
  return <PracticeContent curriculum={curricula.python} level={curricula.python.levels[level]} />;
}
