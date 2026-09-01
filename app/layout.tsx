import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aprendeconjesusdev.vercel.app"),
  title: {
    default: "Fundamentos de la Programación",
    template: "%s | Fundamentos de la Programación",
  },
  description:
    "Aprende fundamentos de programación con rutas por lenguaje, contenido original y fuentes oficiales.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Fundamentos de la Programación",
    title: "Fundamentos de la Programación",
    description: "Aprende fundamentos de programación con rutas por lenguaje, contenido original y fuentes oficiales.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-ES">
      <body className="flex min-h-screen flex-col antialiased">
        <a className="skip-link" href="#contenido-principal">Saltar al contenido principal</a>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
