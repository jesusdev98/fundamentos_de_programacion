import { spawn } from "node:child_process";

const port = 3100;
const canonicalRoutes = ["/", "/javascript", "/javascript/facil", "/javascript/facil/teoria", "/javascript/facil/practica", "/javascript/facil/cuestionario", "/javascript/medio", "/javascript/medio/teoria", "/javascript/medio/practica", "/javascript/medio/cuestionario", "/fuentes"];
const redirects = new Map([["/javascript/basico", "/javascript/facil"], ["/javascript/basico/teoria", "/javascript/facil/teoria"], ["/javascript/basico/practica", "/javascript/facil/practica"], ["/javascript/basico/cuestionario", "/javascript/facil/cuestionario"]]);
const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: new URL("..", import.meta.url), stdio: ["ignore", "pipe", "pipe"] });

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

try {
  await waitUntilReady();
  for (const route of canonicalRoutes) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { redirect: "manual" });
    if (response.status !== 200) throw new Error(`${route} returned ${response.status}.`);
    console.log(`200 ${route}`);
  }
  for (const [route, target] of redirects) {
    const response = await fetch(`http://127.0.0.1:${port}${route}`, { redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status !== 308 || location !== target) throw new Error(`${route} returned ${response.status} -> ${location}.`);
    console.log(`308 ${route} -> ${target}`);
  }
} finally {
  next.kill("SIGTERM");
}
