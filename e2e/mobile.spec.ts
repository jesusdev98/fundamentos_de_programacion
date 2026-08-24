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

test("core learning surfaces fit 360, 375, 390, and 430 pixels", async ({ page }) => {
  const routes = [
    "/",
    "/javascript",
    "/javascript/facil",
    "/javascript/facil/teoria",
    "/javascript/facil/practica",
    "/javascript/facil/cuestionario",
    "/fuentes",
  ];

  for (const width of [360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of routes) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBe(true);
    }

    await page.goto("/javascript/facil/cuestionario");
    await page.getByRole("button", { name: "Comenzar intento" }).click();
    for (let question = 0; question < 10; question += 1) {
      await page.getByRole("radio").first().check();
      if (question < 9) await page.getByRole("button", { name: "Siguiente" }).click();
    }
    await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
    await expect(page.locator("#quiz-result-title")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `quiz results at ${width}px`).toBe(true);
  }
});

test("Python and TypeScript practice and quiz surfaces fit mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  for (const language of ["python", "typescript"] as const) {
    for (const section of ["practica", "cuestionario"] as const) {
      const route = `/${language}/facil/${section}`;
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
    }
  }
});
