import { expect, test, type Locator, type Page } from "@playwright/test";
import { easyExercises } from "../data/typescript/easy/exercises";
import { mediumExercises } from "../data/typescript/medium/exercises";
import { difficultExercises } from "../data/typescript/difficult/exercises";

const levels = [["facil", easyExercises], ["medio", mediumExercises], ["dificil", difficultExercises]] as const;

async function openExercise(page: Page, level: "facil" | "medio" | "dificil", index = 0) {
  await page.goto(`/typescript/${level}/practica`);
  const exercise = page.locator("main article").nth(index);
  await expect(exercise.getByText("TypeScript se carga al ejecutar", { exact: true })).toBeVisible();
  return exercise;
}

async function run(exercise: Locator, code: string) {
  await exercise.getByRole("textbox", { name: "Editor de TypeScript" }).fill(code);
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
}

test("TypeScript compiler is lazy, pinned, and executes only emitted JavaScript", async ({ page }) => {
  test.setTimeout(90_000);
  const compilerRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("typescript-compiler")) compilerRequests.push(request.url()); });
  for (const route of ["/", "/javascript/facil", "/python/facil/practica", "/typescript", "/typescript/facil/teoria", "/typescript/facil/cuestionario", "/typescript/facil/practica"]) {
    await page.goto(route);
    expect(compilerRequests, route).toHaveLength(0);
  }
  const exercise = page.locator("main article").first();
  await run(exercise, 'const mensaje: string = "Hola desde TypeScript";\nconsole.log(mensaje);');
  await expect(exercise.getByText("Comprobando tipos…", { exact: true })).toBeVisible();
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("Hola desde TypeScript", { timeout: 30_000 });
  expect(compilerRequests.some((url) => url.includes("typescript-compiler-worker.js"))).toBe(true);
  expect(compilerRequests.some((url) => url.endsWith("/typescript-compiler-5.9.3.js"))).toBe(true);
  const compilerResponse = await page.request.get("/typescript-compiler-5.9.3.js");
  expect(compilerResponse.status()).toBe(200);
  expect(await compilerResponse.text()).toContain('version = "5.9.3"');
});

test("TypeScript reports TS2322 without execution and recovers with valid code", async ({ page }) => {
  test.setTimeout(90_000);
  const exercise = await openExercise(page, "facil");
  await run(exercise, 'const edad: number = "veinte";\nconsole.log("NO_DEBE_EJECUTARSE");');
  const output = exercise.getByRole("region", { name: "Salida de consola" });
  await expect(output).toContainText("TS2322", { timeout: 30_000 });
  await expect(output).not.toContainText("NO_DEBE_EJECUTARSE");
  await run(exercise, 'const mensaje: string = "Hola desde TypeScript";\nconsole.log(mensaje);');
  await expect(output).toContainText("Hola desde TypeScript", { timeout: 30_000 });
});

test("one shared compiler Worker validates multiple exercises on the same page", async ({ page }) => {
  test.setTimeout(90_000);
  const workerRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("typescript-compiler-worker.js")) workerRequests.push(request.url()); });
  await page.goto("/typescript/facil/practica");
  for (const [index, exerciseData] of easyExercises.slice(0, 2).entries()) {
    const exercise = page.locator("main article").nth(index);
    await run(exercise, exerciseData.solution);
    await expect(exercise.getByText("Correcto", { exact: true })).toBeVisible({ timeout: 30_000 });
  }
  expect(workerRequests).toHaveLength(1);
});

test("compiler timeout terminates the Worker and the next run recovers", async ({ page }) => {
  test.setTimeout(120_000);
  const pattern = "**/typescript-compiler-worker.js*";
  await page.route(pattern, (route) => route.fulfill({ contentType: "text/javascript", body: "while (true) {}" }));
  const exercise = await openExercise(page, "facil");
  await run(exercise, 'const mensaje: string = "Hola desde TypeScript";\nconsole.log(mensaje);');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("no respondió en 10000 ms", { timeout: 20_000 });
  await page.unroute(pattern);
  await run(exercise, 'const mensaje: string = "Hola desde TypeScript";\nconsole.log(mensaje);');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("Hola desde TypeScript", { timeout: 30_000 });
});

for (const [level, exercises] of levels) {
  test(`a ${level} TypeScript solution passes compiler and runtime validation`, async ({ page }) => {
    test.setTimeout(90_000);
    const exercise = await openExercise(page, level);
    await run(exercise, exercises[0].solution);
    await expect(exercise.getByText("Correcto", { exact: true })).toBeVisible({ timeout: 30_000 });
  });
}

test("all 38 authored TypeScript solutions pass their compiler contracts", async ({ page }) => {
  test.setTimeout(240_000);
  for (const [level, exercises] of levels) {
    await page.goto(`/typescript/${level}/practica`);
    for (const [index, exerciseData] of exercises.entries()) {
      const exercise = page.locator("main article").nth(index);
      await run(exercise, exerciseData.solution);
      await expect(exercise.getByText("Correcto", { exact: true }), exerciseData.id).toBeVisible({ timeout: 30_000 });
    }
  }
});
