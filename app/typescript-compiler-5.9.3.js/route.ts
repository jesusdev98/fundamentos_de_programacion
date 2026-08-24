import { readFile } from "node:fs/promises";
import { join } from "node:path";

const compilerPath = join(process.cwd(), "node_modules", "typescript", "lib", "typescript.js");

export async function GET() {
  const compiler = await readFile(compilerPath);
  return new Response(compiler, { headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable" } });
}
