import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TheoryContent } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Teoría de ${curricula.typescript.levels[level].name}` : "Teoría" }; }
export default async function TypeScriptTheoryPage({ params }: { params: Promise<{ level: string }> }) { const { level } = await params; if (!isLevelSlug(level)) notFound(); return <TheoryContent curriculum={curricula.typescript} level={curricula.typescript.levels[level]} />; }
