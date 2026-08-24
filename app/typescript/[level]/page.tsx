import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LevelOverview } from "@/components/learning/CurriculumPages";
import { curricula } from "@/data/curricula";
import { isLevelSlug, levelSlugs } from "@/types/curriculum";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? curricula.typescript.levels[level].name : "Nivel" }; }
export default async function TypeScriptLevelPage({ params }: { params: Promise<{ level: string }> }) { const { level } = await params; if (!isLevelSlug(level)) notFound(); return <LevelOverview curriculum={curricula.typescript} level={curricula.typescript.levels[level]} />; }
