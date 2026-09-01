import type { MetadataRoute } from "next";

const baseUrl = "https://aprendeconjesusdev.vercel.app";
const languages = ["javascript", "python", "typescript"] as const;
const levels = ["facil", "medio", "dificil"] as const;
const sections = ["", "/teoria", "/practica", "/cuestionario"] as const;

export const canonicalPaths = [
  "/",
  ...languages.flatMap((language) => [
    `/${language}`,
    ...levels.flatMap((level) => sections.map((section) => `/${language}/${level}${section}`)),
  ]),
  "/fuentes",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return canonicalPaths.map((path) => ({ url: new URL(path, baseUrl).href }));
}
