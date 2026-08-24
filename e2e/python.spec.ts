import { expect, test, type Locator, type Page } from "@playwright/test";
import { easyExercises } from "../data/python/easy/exercises";
import { mediumExercises } from "../data/python/medium/exercises";
import { difficultExercises } from "../data/python/difficult/exercises";

const allPythonExercises = [...easyExercises, ...mediumExercises, ...difficultExercises];

async function openExercise(page: Page, level: "facil" | "medio" | "dificil", index = 0) {
  await page.goto(`/python/${level}/practica`);
  const exercise = page.locator("main article").nth(index);
  await expect(exercise.getByText("Python se carga al ejecutar", { exact: true })).toBeVisible();
  return exercise;
}

async function run(exercise: Locator, code: string) {
  await exercise.getByRole("textbox", { name: "Editor de Python" }).fill(code);
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
}

test("Pyodide loads only after Run and executes stdout and arithmetic", async ({ page }) => {
  test.setTimeout(90_000);
  const pyodideRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/pyodide/")) pyodideRequests.push(request.url()); });
  for (const route of ["/", "/javascript/facil", "/python", "/python/facil/teoria", "/python/facil/cuestionario"]) {
    await page.goto(route);
    expect(pyodideRequests, route).toHaveLength(0);
  }
  const exercise = await openExercise(page, "facil");
  expect(pyodideRequests).toHaveLength(0);
  await run(exercise, 'print("Hola desde Python")\nprint(2 + 3)');
  await expect(exercise.getByText("Cargando Python", { exact: true })).toBeVisible();
  await expect.poll(() => pyodideRequests.some((url) => url.includes("v314.0.4")), { timeout: 30_000 }).toBe(true);
  const output = exercise.getByRole("region", { name: "Salida de consola" });
  await expect(output).toContainText("Hola desde Python", { timeout: 30_000 });
  await expect(output).toContainText("5");
  await expect(exercise.getByText("Entorno listo", { exact: true })).toBeVisible();
});

test("Python reports NameError and unsupported input, then recovers", async ({ page }) => {
  test.setTimeout(90_000);
  const exercise = await openExercise(page, "facil");
  await run(exercise, "print(variable_inexistente)");
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText(/NameError[\s\S]*variable_inexistente/, { timeout: 30_000 });
  await run(exercise, 'input("Nombre: ")');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("input() no está disponible");
  await run(exercise, 'print("recuperado")');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("recuperado");
});

test("Python terminates an infinite loop and recreates a usable Worker", async ({ page }) => {
  test.setTimeout(120_000);
  const exercise = await openExercise(page, "facil");
  await run(exercise, "while True:\n    pass");
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("Tiempo límite excedido", { timeout: 40_000 });
  await expect(page.getByRole("link", { name: "Fuentes", exact: true })).toBeEnabled();
  await run(exercise, 'print("recuperado")');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("recuperado", { timeout: 40_000 });
});

for (const [level, exercises] of [["facil", easyExercises], ["medio", mediumExercises], ["dificil", difficultExercises]] as const) {
  test(`a behavioral ${level} Python exercise passes in Pyodide`, async ({ page }) => {
    test.setTimeout(90_000);
    const exercise = await openExercise(page, level);
    await run(exercise, exercises[0].solution);
    await expect(exercise.getByText("Correcto", { exact: true })).toBeVisible({ timeout: 40_000 });
    await expect(exercise.getByText("Explicación:")).toBeVisible();
  });
}

test("all authored Python solutions pass their runtime validation", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/python/facil/practica");
  const cases = allPythonExercises.map((exercise) => ({ id: exercise.id, code: exercise.solution, validation: exercise.validation }));
  const results = await page.evaluate(async (authoredCases) => {
    const worker = new Worker("/python-worker.mjs", { type: "module" });
    await new Promise<void>((resolve, reject) => {
      worker.onmessage = (event) => event.data?.type === "ready" ? resolve() : event.data?.type === "initialization-error" ? reject(new Error(event.data.message)) : undefined;
      worker.onerror = (event) => reject(new Error(event.message));
    });
    const outcomes = [];
    for (const authored of authoredCases) {
      const outcome = await new Promise<{ messages: { kind: string; text: string }[]; tests: { passed: boolean }[] }>((resolve, reject) => {
        const timeout = window.setTimeout(() => reject(new Error(`Timeout validating ${authored.id}`)), 10_000);
        worker.onmessage = (event) => {
          if (event.data?.type !== "result" || event.data.runId !== authored.id) return;
          window.clearTimeout(timeout);
          resolve(event.data);
        };
        worker.postMessage({ version: 1, type: "run", runId: authored.id, code: authored.code, tests: authored.validation.kind === "tests" ? authored.validation.tests : [] });
      });
      outcomes.push({ id: authored.id, validation: authored.validation, ...outcome });
    }
    worker.terminate();
    return outcomes;
  }, cases);
  for (const outcome of results) {
    expect(outcome.messages.filter((message) => message.kind === "error"), outcome.id).toEqual([]);
    if (outcome.validation.kind === "output") {
      expect(outcome.messages.filter((message) => message.kind === "log").map((message) => message.text.trim()), outcome.id).toEqual(outcome.validation.expected);
    } else if (outcome.validation.kind === "tests") {
      expect(outcome.tests, outcome.id).toHaveLength(outcome.validation.tests.length);
      expect(outcome.tests.every((result) => result.passed), outcome.id).toBe(true);
    } else {
      throw new Error(`${outcome.id} has an unexpected TypeScript validation`);
    }
  }
});
