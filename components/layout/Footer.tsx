import Link from "next/link";
export function Footer() { return <footer className="border-t border-slate-200 bg-white"><div className="page-container flex flex-col gap-3 py-7 text-sm text-slate-600 sm:flex-row sm:justify-between"><span>Aprende JavaScript paso a paso · Fácil, Medio y Difícil</span><Link className="font-bold underline" href="/fuentes">Fuentes y créditos</Link></div></footer>; }
