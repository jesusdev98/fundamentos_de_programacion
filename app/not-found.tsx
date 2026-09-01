import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página solicitada no existe en Fundamentos de la Programación.",
};

export default function NotFound() {
  return (
    <main id="contenido-principal" tabIndex={-1} className="page-container flex min-h-[55vh] max-w-3xl flex-col items-start justify-center py-16">
      <p className="eyebrow">Error 404</p>
      <h1 className="section-title mt-3">Página no encontrada</h1>
      <p className="lede mt-5">La ruta que has solicitado no existe o ha cambiado.</p>
      <Link className="primary-button mt-8" href="/">Volver al inicio</Link>
    </main>
  );
}
