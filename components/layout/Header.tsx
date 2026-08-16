import Link from "next/link";

const navigation = [{ label: "Lenguajes", href: "/#lenguajes" }, { label: "Fuentes", href: "/fuentes" }] as const;

export function Header() {
  return <header className="border-b border-slate-200 bg-white"><div className="page-container flex items-center justify-between gap-4 py-4"><Link href="/" className="max-w-64 text-sm font-black leading-tight tracking-[-0.02em] text-slate-950 sm:max-w-none sm:text-lg"><span className="mr-2 inline-block h-3 w-3 bg-[#e85d34]" aria-hidden="true" />Fundamentos de la Programación</Link><nav aria-label="Navegación principal"><ul className="flex gap-1">{navigation.map((item) => <li key={item.href}><Link href={item.href} className="block rounded-md px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950 sm:px-3">{item.label}</Link></li>)}</ul></nav></div></header>;
}
