import { expect, test, type Locator, type Page } from "@playwright/test";
import { easyExercises } from "../data/javascript/easy/exercises";
import { mediumExercises } from "../data/javascript/medium/exercises";

async function openExercise(page: Page, level: "facil" | "medio", index = 0) {
  await page.goto(`/javascript/${level}/practica`);
  const exercise = page.locator("main article").nth(index);
  await expect(exercise.getByText("Entorno listo", { exact: true })).toBeVisible();
  return exercise;
}

async function run(exercise: Locator, code: string) {
  await exercise.getByRole("textbox", { name: "Editor de JavaScript" }).fill(code);
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
}

test("playground executes logs, arithmetic, warnings, and errors", async ({ page }) => {
  const exercise = await openExercise(page, "facil");
  await run(exercise, 'console.log("Hola"); console.log(2 + 3); console.warn("cuidado"); console.error("fallo");');
  const consoleOutput = exercise.getByRole("region", { name: "Salida de consola" });
  await expect(consoleOutput).toContainText("[log] Hola");
  await expect(consoleOutput).toContainText("[log] 5");
  await expect(consoleOutput).toContainText("[warn] cuidado");
  await expect(consoleOutput).toContainText("[error] fallo");
});

test("playground reports a readable ReferenceError", async ({ page }) => {
  const exercise = await openExercise(page, "facil");
  await run(exercise, "console.log(variableInexistente);");
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText(/ReferenceError|variableInexistente/);
});

test("a runaway loop times out without blocking the UI and the sandbox recovers", async ({ page }) => {
  const exercise = await openExercise(page, "facil");
  await run(exercise, "while (true) {}");
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("Tiempo límite excedido");
  await expect(page.getByRole("link", { name: "Fuentes", exact: true })).toBeEnabled();
  await run(exercise, 'console.log("recuperado");');
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("recuperado");
});

test("a correct Easy exercise shows output, completion, and explanation", async ({ page }) => {
  const exercise = await openExercise(page, "facil");
  await run(exercise, easyExercises[0].solution);
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("[log] 8");
  await expect(exercise.getByText("Correcto", { exact: true })).toBeVisible();
  await expect(exercise.getByText("Explicación:")).toBeVisible();
});

test("an incorrect Easy exercise stays incomplete and reveals hints and solution only on request", async ({ page }) => {
  const exercise = await openExercise(page, "facil");
  await run(exercise, "console.log(7);");
  await expect(exercise.getByText("Incorrecto", { exact: true })).toBeVisible();
  await expect(exercise.getByText("Explicación:")).toHaveCount(0);
  await exercise.getByRole("button", { name: "Mostrar pista" }).click();
  await expect(exercise.getByText("Pista 1:")).toBeVisible();
  await exercise.getByRole("button", { name: "Ver solución" }).click();
  await expect(exercise.getByText("Explicación:")).toBeVisible();
  await expect(exercise.getByText("Correcto", { exact: true })).toHaveCount(0);
});

test("a stable Medium map exercise passes its authored browser tests", async ({ page }) => {
  const exercise = await openExercise(page, "medio", 2);
  await run(exercise, mediumExercises[2].solution);
  await expect(exercise.getByText("Correcto", { exact: true })).toBeVisible();
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("Transforma todos los temas");
});
