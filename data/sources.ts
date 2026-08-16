import type { SourceReference } from "@/types/sources";

export const sources: readonly SourceReference[] = [
  {
    id: "mdn-js",
    name: "JavaScript",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/es/docs/Web/JavaScript",
    type: "documentation",
    licensingNote: "El contenido de MDN se publica principalmente bajo CC BY-SA 2.5; los ejemplos de código se publican bajo CC0. Consulta cada página para confirmar sus avisos.",
  },
  {
    id: "mdn-guide",
    name: "JavaScript Guide",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "guide",
    licensingNote: "Referencia consultada para contraste; esta plataforma no reproduce su texto ni sus ejemplos.",
  },
  {
    id: "mdn-learn",
    name: "Dynamic scripting with JavaScript",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
    type: "guide",
  },
  {
    id: "ecma-262",
    name: "ECMAScript Language Specification",
    organization: "Ecma International / TC39",
    url: "https://tc39.es/ecma262/",
    type: "standard",
    licensingNote: "La especificación tiene sus propios términos de copyright y licencia; se enlaza como fuente normativa.",
  },
  {
    id: "node-console",
    name: "Console",
    organization: "Node.js Contributors / OpenJS Foundation",
    url: "https://nodejs.org/api/console.html",
    type: "documentation",
  },
  {
    id: "node-output",
    name: "Output to the command line using Node.js",
    organization: "Node.js Contributors / OpenJS Foundation",
    url: "https://nodejs.org/en/learn/command-line/output-to-the-command-line-using-nodejs",
    type: "guide",
  },
  {
    id: "mdn-sandbox",
    name: "iframe sandbox",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#sandbox",
    type: "documentation",
    note: "Referencia técnica de la frontera de ejecución; no es material evaluado.",
  },
  {
    id: "mdn-workers",
    name: "Web Workers API",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API",
    type: "documentation",
    note: "Referencia técnica del playground.",
  },
];

export const sourcesById = new Map(sources.map((source) => [source.id, source]));

export function resolveSources(ids: readonly string[]): readonly SourceReference[] {
  return ids.map((id) => {
    const source = sourcesById.get(id);
    if (!source) throw new Error(`Unknown source reference: ${id}`);
    return source;
  });
}
