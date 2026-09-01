import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer border-t">
      <div className="page-container flex flex-col gap-4 py-8 text-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-bold text-[#18201d]">Fundamentos de la Programación</p>
          <p className="mt-1 text-[#626862]">210 lecciones · 114 ejercicios · 450 preguntas</p>
        </div>
        <nav aria-label="Información y transparencia">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link className="text-link inline-flex min-h-11 items-center" href="/fuentes">Fuentes y créditos</Link></li>
            <li><Link className="text-link inline-flex min-h-11 items-center" href="/aviso-legal">Aviso legal</Link></li>
            <li><Link className="text-link inline-flex min-h-11 items-center" href="/privacidad">Privacidad</Link></li>
            <li><Link className="text-link inline-flex min-h-11 items-center" href="/cookies">Cookies</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
