import type { Metadata } from "next";
import Link from "next/link";
import { levels } from "@/data/javascript/levels";

export const metadata: Metadata = { title: "Aprender JavaScript" };
export default function JavaScriptPage() {
  return <main><section className="hero-grid border-b border-slate-200"><div className="page-container py-16 sm:py-20"><p className="eyebrow">Ruta de aprendizaje</p><h1 className="section-title mt-3">Elige tu nivel de JavaScript</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Avanza desde el núcleo del lenguaje hasta funciones, colecciones y asincronía. Cada nivel combina teoría, práctica ejecutable y cuestionario.</p></div></section><section className="page-container grid gap-6 py-12 md:grid-cols-2">{Object.values(levels).map((level) => <article key={level.slug} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><p className="eyebrow">{level.lessons.length} lecciones · {level.exercises.length} ejercicios</p><h2 className="mt-4 text-3xl font-black text-slate-950">{level.name}</h2><p className="mt-4 leading-7 text-slate-600">{level.description}</p><Link className="primary-button mt-7" href={`/javascript/${level.slug}`}>Explorar nivel</Link></article>)}</section></main>;
}
