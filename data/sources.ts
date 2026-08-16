import type { SourceReference } from "@/types/sources";

const javascriptSources = [
  {
    id: "mdn-js",
    name: "JavaScript",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/es/docs/Web/JavaScript",
    type: "documentation",
    licensingNote: "Salvo indicación de la página, la documentación MDN usa CC BY-SA 2.5 o posterior. Las muestras de código tienen términos propios según su fecha; este proyecto no las copia.",
  },
  {
    id: "mdn-guide",
    name: "JavaScript Guide",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    type: "guide",
    licensingNote: "Salvo indicación de la página, la documentación MDN usa CC BY-SA 2.5 o posterior. Aquí sólo se enlaza y se consulta.",
  },
  {
    id: "mdn-reference",
    name: "JavaScript Reference",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
    type: "documentation",
    licensingNote: "Salvo indicación de la página, la documentación MDN usa CC BY-SA 2.5 o posterior. Aquí sólo se enlaza y se consulta.",
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
  {
    id: "mdn-closures",
    name: "Closures",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
    type: "guide",
  },
  {
    id: "mdn-this",
    name: "this",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this",
    type: "documentation",
  },
  {
    id: "mdn-prototype-chain",
    name: "Inheritance and the prototype chain",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain",
    type: "guide",
  },
  {
    id: "mdn-descriptors",
    name: "Property descriptors",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty",
    type: "documentation",
  },
  {
    id: "mdn-classes",
    name: "Classes",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
    type: "documentation",
  },
  {
    id: "mdn-private-elements",
    name: "Private elements",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements",
    type: "documentation",
  },
  {
    id: "mdn-symbol",
    name: "Symbol",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",
    type: "documentation",
  },
  {
    id: "mdn-iteration",
    name: "Iterators and generators",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators",
    type: "guide",
  },
  {
    id: "mdn-keyed-collections",
    name: "Keyed collections",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections",
    type: "guide",
  },
  {
    id: "mdn-promise-combinators",
    name: "Promise concurrency",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency",
    type: "documentation",
  },
  {
    id: "mdn-execution-model",
    name: "JavaScript execution model",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model",
    type: "documentation",
  },
  {
    id: "mdn-async-function",
    name: "async function",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
    type: "documentation",
  },
  {
    id: "mdn-modules",
    name: "JavaScript modules",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
    type: "guide",
  },
  {
    id: "mdn-object-freeze",
    name: "Object.freeze",
    organization: "Mozilla Contributors",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze",
    type: "documentation",
  },
  {
    id: "node-event-loop",
    name: "The Node.js event loop",
    organization: "Node.js Contributors / OpenJS Foundation",
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    type: "guide",
    note: "Referencia para distinguir fases y colas específicas del host Node.js del modelo ECMAScript.",
  },
] as const satisfies readonly Omit<SourceReference, "languageId">[];

const typescriptSources = [
  {
    id: "typescript-handbook",
    name: "TypeScript Handbook",
    organization: "Microsoft / TypeScript Contributors",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    type: "guide",
    note: "Guía oficial de aprendizaje. No se atribuye al sitio la licencia del repositorio del compilador.",
  },
  {
    id: "typescript-docs",
    name: "TypeScript Documentation",
    organization: "Microsoft / TypeScript Contributors",
    url: "https://www.typescriptlang.org/docs/",
    type: "documentation",
    note: "Índice oficial de documentación y referencias.",
  },
  {
    id: "typescript-repo",
    name: "TypeScript official repository",
    organization: "Microsoft",
    url: "https://github.com/microsoft/TypeScript",
    type: "repository",
    licensingNote: "El repositorio del compilador publica una licencia Apache License 2.0. Esa licencia no se traslada automáticamente al Handbook ni al sitio web.",
  },
] as const satisfies readonly Omit<SourceReference, "languageId">[];

const pythonSources = [
  {
    id: "python-tutorial",
    name: "The Python Tutorial",
    organization: "Python Software Foundation",
    url: "https://docs.python.org/3/tutorial/",
    type: "guide",
  },
  {
    id: "python-reference",
    name: "The Python Language Reference",
    organization: "Python Software Foundation",
    url: "https://docs.python.org/3/reference/",
    type: "documentation",
  },
  {
    id: "python-docs",
    name: "Python Documentation",
    organization: "Python Software Foundation",
    url: "https://docs.python.org/3/",
    type: "documentation",
  },
  {
    id: "python-license",
    name: "Python history and license",
    organization: "Python Software Foundation",
    url: "https://docs.python.org/3/license.html",
    type: "license",
    note: "Licencia y metadatos; no cuenta como una cuarta fuente pedagógica.",
    licensingNote: "El software y la documentación usan PSF License v2. Desde Python 3.8.6, ejemplos, recetas y otro código documental también usan Zero-Clause BSD.",
  },
] as const satisfies readonly Omit<SourceReference, "languageId">[];

export const sources: readonly SourceReference[] = [
  ...javascriptSources.map((source) => ({ ...source, languageId: "javascript" as const })),
  ...typescriptSources.map((source) => ({ ...source, languageId: "typescript" as const })),
  ...pythonSources.map((source) => ({ ...source, languageId: "python" as const })),
];

export const sourcesById = new Map(sources.map((source) => [source.id, source]));

export function resolveSources(ids: readonly string[]): readonly SourceReference[] {
  return ids.map((id) => {
    const source = sourcesById.get(id);
    if (!source) throw new Error(`Unknown source reference: ${id}`);
    return source;
  });
}
