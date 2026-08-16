import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonCard } from "@/components/learning/LessonCard";
import { PageIntro } from "@/components/learning/PageIntro";
import { isLevelSlug, levels, levelSlugs } from "@/data/javascript/levels";

export const dynamicParams = false;
export function generateStaticParams() { return levelSlugs.map((level) => ({ level })); }
export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> { const { level } = await params; return { title: isLevelSlug(level) ? `Teoría de ${levels[level].name}` : "Teoría" }; }
export default async function TheoryPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: slug } = await params;
  if (!isLevelSlug(slug)) notFound();
  const level = levels[slug];
  return <main><PageIntro eyebrow={`${level.name} · Teoría`} title="Comprende antes de memorizar" description={`${level.lessons.length} lecciones originales con ejemplos breves, puntos clave y referencias para profundizar.`} /><div className="page-container grid gap-6 py-10 lg:grid-cols-[17rem_1fr] lg:items-start"><nav className="max-h-[80vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 lg:sticky lg:top-6" aria-label="Contenido de teoría"><p className="text-sm font-black text-slate-950">En esta sección</p><ol className="mt-4 space-y-3 text-sm text-slate-600">{level.lessons.map((lesson, index) => <li key={lesson.id}><a className="hover:text-[#bd3f1d] hover:underline" href={`#${lesson.id}`}>{index + 1}. {lesson.title}</a></li>)}</ol></nav><div className="space-y-7">{level.lessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} number={index + 1} level={slug} />)}</div></div></main>;
}
