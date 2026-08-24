/* global ts */
importScripts("/typescript-compiler-5.9.3.js");

const VERSION = 1;
const MAIN_FILE = "/main.ts";
const LIB_FILE = "/playground.d.ts";
const MINIMAL_LIBRARY = `
interface Object {} interface Function { apply(thisArg: any, argArray?: any): any; readonly name: string; } interface CallableFunction extends Function {} interface NewableFunction extends Function {}
interface IArguments { readonly length: number; [index: number]: any; }
interface String { readonly length: number; toUpperCase(): string; toLowerCase(): string; trim(): string; includes(search: string): boolean; }
interface Number { toFixed(fractionDigits?: number): string; } interface Boolean {} interface RegExp {}
interface Array<T> { length: number; [index: number]: T; push(...items: T[]): number; pop(): T | undefined; map<U>(callback: (value: T, index: number, array: T[]) => U): U[]; filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S): S[]; filter(predicate: (value: T, index: number, array: T[]) => unknown): T[]; reduce(callback: (previous: T, current: T) => T): T; reduce<U>(callback: (previous: U, current: T) => U, initial: U): U; includes(value: T): boolean; }
interface ReadonlyArray<T> { readonly length: number; readonly [index: number]: T; map<U>(callback: (value: T, index: number, array: readonly T[]) => U): U[]; filter<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S): S[]; filter(predicate: (value: T, index: number, array: readonly T[]) => unknown): T[]; reduce(callback: (previous: T, current: T) => T): T; reduce<U>(callback: (previous: U, current: T) => U, initial: U): U; includes(value: T): boolean; }
interface StringConstructor { (value?: any): string; } interface NumberConstructor { (value?: any): number; } declare var String: StringConstructor; declare var Number: NumberConstructor;
interface Error { name: string; message: string; } interface ErrorConstructor { new(message?: string): Error; } declare var Error: ErrorConstructor;
interface Map<K, V> { set(key: K, value: V): this; get(key: K): V | undefined; readonly size: number; } interface MapConstructor { new<K, V>(): Map<K, V>; } declare var Map: MapConstructor;
interface ClassDecoratorContext { readonly kind: "class"; readonly name: string | undefined; addInitializer(initializer: () => void): void; }
interface ClassMethodDecoratorContext { readonly kind: "method"; readonly name: string | symbol; readonly static: boolean; readonly private: boolean; addInitializer(initializer: (this: unknown) => void): void; }
interface PromiseLike<T> { then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): PromiseLike<TResult1 | TResult2>; }
interface Promise<T> extends PromiseLike<T> {} interface PromiseConstructor { resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>; }
declare var Promise: PromiseConstructor; declare const console: { log(...values: unknown[]): void; warn(...values: unknown[]): void; error(...values: unknown[]): void };
type Partial<T> = { [P in keyof T]?: T[P] }; type Required<T> = { [P in keyof T]-?: T[P] }; type Readonly<T> = { readonly [P in keyof T]: T[P] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] }; type Record<K extends keyof any, T> = { [P in K]: T }; type Exclude<T, U> = T extends U ? never : T;
type Extract<T, U> = T extends U ? T : never; type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>; type NonNullable<T> = T & {};
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never; type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
type Awaited<T> = T extends null | undefined ? T : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ? F extends (value: infer V, ...args: infer _) => any ? Awaited<V> : never : T;
`;

function normalize(path) {
  const parts = [];
  for (const part of path.replace(/\\/g, "/").split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop(); else parts.push(part);
  }
  return `/${parts.join("/")}`;
}

function directory(path) { return path.slice(0, path.lastIndexOf("/") + 1); }

function compile(request) {
  const source = request.assertions ? `${request.code}\n\n${request.assertions}` : request.code;
  const files = new Map([[LIB_FILE, MINIMAL_LIBRARY], [MAIN_FILE, source]]);
  for (const file of request.files) files.set(normalize(file.name), file.content);
  const outputs = new Map();
  const options = { strict: true, noLib: true, noEmitOnError: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020, moduleResolution: ts.ModuleResolutionKind.Node10, useDefineForClassFields: true, skipLibCheck: false };
  const host = {
    getSourceFile: (fileName, languageVersion) => { const text = files.get(normalize(fileName)); return text === undefined ? undefined : ts.createSourceFile(normalize(fileName), text, languageVersion, true); },
    getDefaultLibFileName: () => LIB_FILE,
    writeFile: (fileName, text) => outputs.set(normalize(fileName), text),
    getCurrentDirectory: () => "/",
    getDirectories: () => [],
    fileExists: (fileName) => files.has(normalize(fileName)),
    readFile: (fileName) => files.get(normalize(fileName)),
    getCanonicalFileName: (fileName) => normalize(fileName),
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    directoryExists: () => true,
    resolveModuleNames: (moduleNames, containingFile) => moduleNames.map((moduleName) => {
      if (!moduleName.startsWith(".")) return undefined;
      const base = normalize(`${directory(normalize(containingFile))}${moduleName}`);
      const resolvedFileName = [base, `${base}.ts`, `${base}/index.ts`].find((candidate) => files.has(candidate));
      return resolvedFileName ? { resolvedFileName, extension: ts.Extension.Ts, isExternalLibraryImport: false } : undefined;
    }),
  };
  const roots = [LIB_FILE, MAIN_FILE, ...request.files.map((file) => normalize(file.name))];
  const program = ts.createProgram(roots, options, host);
  const diagnostics = [...ts.getPreEmitDiagnostics(program)];
  if (diagnostics.every((diagnostic) => diagnostic.category !== ts.DiagnosticCategory.Error)) diagnostics.push(...program.emit().diagnostics);
  const serialized = diagnostics.map((diagnostic) => {
    const position = diagnostic.file && diagnostic.start !== undefined ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start) : undefined;
    return { code: diagnostic.code, category: diagnostic.category === ts.DiagnosticCategory.Error ? "error" : "warning", message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), file: diagnostic.file?.fileName, line: position ? position.line + 1 : undefined, character: position ? position.character + 1 : undefined };
  });
  const emittedCode = request.emit && serialized.every((diagnostic) => diagnostic.category !== "error") ? outputs.get("/main.js") : undefined;
  return { version: VERSION, type: "result", runId: request.runId, compilerVersion: ts.version, diagnostics: serialized, emittedCode };
}

self.onmessage = (event) => {
  const request = event.data;
  if (!request || request.version !== VERSION || request.type !== "compile" || typeof request.runId !== "string" || typeof request.code !== "string" || typeof request.assertions !== "string" || !Array.isArray(request.files) || typeof request.emit !== "boolean") return;
  self.postMessage(compile(request));
};
