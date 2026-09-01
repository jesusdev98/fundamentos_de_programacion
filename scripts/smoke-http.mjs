import { spawn } from "node:child_process";

const port = 3100;
const curriculumLanguages = ["javascript", "python", "typescript"];
const levelSlugs = ["facil", "medio", "dificil"];
const levelSections = ["", "/teoria", "/practica", "/cuestionario"];
const curriculumRoutes = curriculumLanguages.flatMap((language) => [
  `/${language}`,
  ...levelSlugs.flatMap((level) => levelSections.map((section) => `/${language}/${level}${section}`)),
]);
const canonicalRoutes = ["/", ...curriculumRoutes, "/fuentes", "/aviso-legal", "/privacidad", "/cookies"];
if (canonicalRoutes.length !== 44) throw new Error(`Expected 44 canonical routes, found ${canonicalRoutes.length}.`);
const redirects = new Map([["/javascript/basico", "/javascript/facil"], ["/javascript/basico/teoria", "/javascript/facil/teoria"], ["/javascript/basico/practica", "/javascript/facil/practica"], ["/javascript/basico/cuestionario", "/javascript/facil/cuestionario"]]);
const externalBaseURL = process.env.SMOKE_BASE_URL;
let baseURL = `http://127.0.0.1:${port}`;
let next;

if (externalBaseURL) {
  const parsed = new URL(externalBaseURL);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error("SMOKE_BASE_URL must be an HTTP(S) URL without credentials.");
  }
  baseURL = parsed.origin;
} else {
  next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: new URL("..", import.meta.url), stdio: ["ignore", "pipe", "pipe"] });
}

function waitUntilReady() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Production server did not start in 10 seconds.")), 10_000);
    const inspect = (chunk) => {
      const text = chunk.toString();
      if (text.includes("Ready")) { clearTimeout(timeout); resolve(); }
    };
    next.stdout.on("data", inspect);
    next.stderr.on("data", inspect);
    next.once("exit", (code) => reject(new Error(`Production server exited early with ${code}.`)));
  });
}

async function waitUntilExternalReady() {
  let lastError;
  // A production alias can take a few seconds to converge after deployment.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(baseURL, { redirect: "manual" });
      if (response.status === 200) return;
      lastError = new Error(`/ returned ${response.status} while waiting for production.`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (2 ** attempt)));
  }
  throw lastError;
}

try {
  if (next) await waitUntilReady();
  else await waitUntilExternalReady();
  for (const route of canonicalRoutes) {
    const response = await fetch(`${baseURL}${route}`, { redirect: "manual" });
    if (response.status !== 200) throw new Error(`${route} returned ${response.status}.`);
    console.log(`200 ${route}`);
  }
  for (const [route, target] of redirects) {
    const response = await fetch(`${baseURL}${route}`, { redirect: "manual" });
    const location = response.headers.get("location");
    let validTarget = location === target;
    if (externalBaseURL && location) {
      const redirectURL = new URL(location, baseURL);
      validTarget = redirectURL.origin === new URL(baseURL).origin && redirectURL.pathname === target;
    }
    if (response.status !== 308 || !validTarget) throw new Error(`${route} returned an unexpected redirect.`);
    console.log(`308 ${route} -> ${target}`);
  }
} finally {
  next?.kill("SIGTERM");
}
