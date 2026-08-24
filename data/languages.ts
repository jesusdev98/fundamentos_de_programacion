import { curricula, curriculumStats } from "./curricula.ts";
import type { Language } from "../types/languages.ts";

export const languages: readonly Language[] = [
  {
    id: "javascript",
    slug: "javascript",
    name: "JavaScript",
    description: "Una ruta completa para comprender el lenguaje, practicar en el navegador y comprobar lo aprendido.",
    status: "available",
    sourceIds: curricula.javascript.sourceIds,
    accent: "#d97706",
    stats: curriculumStats(curricula.javascript),
    futureAreas: [],
  },
  {
    id: "typescript",
    slug: "typescript",
    name: "TypeScript",
    description: "Una ruta completa para modelar con tipos, comprender el checker y practicar con el compiler real sobre JavaScript.",
    status: "available",
    sourceIds: curricula.typescript.sourceIds,
    accent: "#2563eb",
    stats: curriculumStats(curricula.typescript),
    futureAreas: [],
  },
  {
    id: "python",
    slug: "python",
    name: "Python",
    description: "Una ruta completa de Python 3.14 para dominar el lenguaje, la biblioteca estándar y la programación asíncrona.",
    status: "available",
    sourceIds: curricula.python.sourceIds,
    accent: "#0f766e",
    stats: curriculumStats(curricula.python),
    futureAreas: [],
  },
];

export const languagesById = new Map(languages.map((language) => [language.id, language]));
