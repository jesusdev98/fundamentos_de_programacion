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
];

export const sourcesById = new Map(sources.map((source) => [source.id, source]));

export function resolveSources(ids: readonly string[]): readonly SourceReference[] {
  return ids.map((id) => {
    const source = sourcesById.get(id);
    if (!source) throw new Error(`Unknown source reference: ${id}`);
    return source;
  });
}
