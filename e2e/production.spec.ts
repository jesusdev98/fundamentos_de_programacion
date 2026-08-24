import { expect, test } from "@playwright/test";

test("production learning routes and playground are operational", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Fundamentos de la Programación" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Elige un lenguaje" })).toBeVisible();
  await page.getByRole("article").filter({ hasText: "JavaScript" }).getByRole("link", { name: "Explorar ruta" }).click();
  await expect(page).toHaveURL(/\/javascript$/);
  await expect(page.getByRole("heading", { level: 1, name: "Elige tu nivel de JavaScript" })).toBeVisible();
  await page.goto("/typescript");
  await expect(page.getByText("Próximamente", { exact: true }).first()).toBeVisible();
  await page.goto("/python");
  await expect(page.getByRole("heading", { level: 1, name: "Elige tu nivel de Python" })).toBeVisible();

  for (const language of ["javascript", "python"] as const) {
    for (const level of ["facil", "medio", "dificil"] as const) {
      await page.goto(`/${language}/${level}`);
      await expect(page.getByRole("link", { name: "Estudiar teoría" })).toBeVisible();
      await page.goto(`/${language}/${level}/teoria`);
      await expect(page.getByRole("heading", { level: 1, name: "Comprende antes de memorizar" })).toBeVisible();
      await page.goto(`/${language}/${level}/practica`);
      await expect(page.getByRole("heading", { level: 1, name: "Convierte ideas en código" })).toBeVisible();
      await page.goto(`/${language}/${level}/cuestionario`);
      await expect(page.getByRole("button", { name: "Comenzar intento" })).toBeVisible();
    }
  }

  await page.goto("/javascript/facil/practica");
  const exercise = page.locator("main article").first();
  await expect(exercise.getByText("Entorno listo", { exact: true })).toBeVisible();
  await exercise.getByRole("textbox", { name: "Editor de JavaScript" }).fill('console.log("production-ok")');
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("production-ok");
});

test("production quiz creates one ten-question attempt", async ({ page }) => {
  await page.goto("/javascript/facil/cuestionario");
  await page.getByRole("button", { name: "Comenzar intento" }).click();
  await expect(page.getByText("Intento actual: 10")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Faltan 10 respuestas");

  const prompts = new Set<string>();
  for (let index = 0; index < 10; index += 1) {
    const question = page.getByRole("group", { name: `Pregunta ${index + 1}` });
    await expect(question).toBeVisible();
    await expect(question.getByRole("radio")).toHaveCount(4);
    prompts.add((await question.getByRole("heading", { level: 2 }).innerText()).trim());
    if (index < 9) await page.getByRole("button", { name: "Siguiente" }).click();
  }
  expect(prompts.size).toBe(10);
});
