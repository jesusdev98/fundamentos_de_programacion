import { expect, test } from "@playwright/test";

test("mobile smoke covers Home, navigation, one practice, and quiz", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Fundamentos de la Programación" })).toBeVisible();
  await page.goto("/javascript/facil");
  await page.getByRole("link", { name: "Abrir práctica" }).click();
  const exercise = page.locator("main article").first();
  await expect(exercise.getByText("Entorno listo", { exact: true })).toBeVisible();
  await exercise.getByRole("textbox", { name: "Editor de JavaScript" }).fill('console.log("móvil");');
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("móvil");
  await page.goto("/javascript/facil");
  await page.getByRole("link", { name: "Comenzar cuestionario" }).click();
  await page.getByRole("button", { name: "Comenzar intento" }).click();
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(page.getByText("Intento actual: 10")).toBeVisible();
  await page.goto("/javascript/dificil");
  await expect(page).toHaveURL(/\/javascript\/dificil$/);
  await expect(page.getByRole("heading", { level: 1, name: "JavaScript Difícil" })).toBeVisible();
  await page.goto("/python");
  await expect(page.getByRole("heading", { level: 1, name: "Elige tu nivel de Python" })).toBeVisible();
  await page.getByRole("link", { name: "Explorar nivel" }).first().click();
  await expect(page).toHaveURL(/\/python\/facil$/);
  await page.goto("/typescript");
  await expect(page.getByRole("heading", { level: 1, name: "Elige tu nivel de TypeScript" })).toBeVisible();
  await page.getByRole("link", { name: "Explorar nivel" }).first().click();
  await expect(page).toHaveURL(/\/typescript\/facil$/);
});

test("theory pages fit the mobile viewport", async ({ page }) => {
  for (const language of ["javascript", "python", "typescript"] as const) {
    const route = `/${language}/facil/teoria`;
    await page.goto(route);
    await expect(page.getByRole("navigation", { name: "Contenido de teoría" })).toBeVisible();
    await expect(page.locator("main article").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
  }
});
