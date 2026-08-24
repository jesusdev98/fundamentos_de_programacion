import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelOverview } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? curricula.javascript.levels[level].name : "Nivel" }; }
export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  return <LevelOverview curriculum={curricula.javascript} level={curricula.javascript.levels[slug]} />;
}
