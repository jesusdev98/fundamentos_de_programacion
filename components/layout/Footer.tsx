import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer border-t">
      <div className="page-container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-[#18201d]">Fundamentos de la Programación</p>
          <p className="mt-1 text-[#626862]">210 lecciones · 114 ejercicios · 450 preguntas</p>
        </div>
        <Link className="text-link inline-flex min-h-11 items-center" href="/fuentes">Fuentes y créditos</Link>
      </div>
    </footer>
  );
}
