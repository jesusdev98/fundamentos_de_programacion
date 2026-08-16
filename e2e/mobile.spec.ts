import { expect, test } from "@playwright/test";

test("mobile smoke covers Home, navigation, one practice, and quiz", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Fundamentos de la Programación" })).toBeVisible();
  await page.getByRole("link", { name: "Fácil", exact: true }).click();
  await page.getByRole("link", { name: "Abrir práctica" }).click();
  const exercise = page.locator("main article").first();
  await expect(exercise.getByText("Entorno listo", { exact: true })).toBeVisible();
  await exercise.getByRole("textbox", { name: "Editor de JavaScript" }).fill('console.log("móvil");');
  await exercise.getByRole("button", { name: "Ejecutar" }).click();
  await expect(exercise.getByRole("region", { name: "Salida de consola" })).toContainText("móvil");
  await page.getByRole("link", { name: "Fácil", exact: true }).click();
  await page.getByRole("link", { name: "Comenzar cuestionario" }).click();
  await page.getByRole("button", { name: "Comenzar intento" }).click();
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(page.getByText("Intento actual: 10")).toBeVisible();
});
