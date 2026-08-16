import { expect, test } from "@playwright/test";

const routes = [
  ["/", "Fundamentos de la Programación", "Elegir nivel"],
  ["/javascript", "Elige tu nivel de JavaScript", "JavaScript Fácil"],
  ["/javascript/facil", "JavaScript Fácil", "Estudiar teoría"],
  ["/javascript/facil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/javascript/facil/practica", "Convierte ideas en código", "Actualizar una puntuación"],
  ["/javascript/facil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/javascript/medio", "JavaScript Medio", "Abrir práctica"],
  ["/javascript/medio/teoria", "Comprende antes de memorizar", "22 lecciones originales"],
  ["/javascript/medio/practica", "Convierte ideas en código", "Conversión con arrow"],
  ["/javascript/medio/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/javascript/dificil", "JavaScript Difícil", "24 lecciones"],
  ["/javascript/dificil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/javascript/dificil/practica", "Convierte ideas en código", "Contador mediante closure"],
  ["/javascript/dificil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/fuentes", "Fuentes y créditos", "Mozilla Contributors"],
] as const;

test("all canonical routes return HTML with their H1 and expected content", async ({ page }) => {
  for (const [route, heading, content] of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.getByText(content, { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/Application error|Internal Server Error|Unhandled Runtime Error/i)).toHaveCount(0);
  }
});

test("legacy routes return permanent redirects to the easy level", async ({ request }) => {
  const redirects = new Map([
    ["/javascript/basico", "/javascript/facil"],
    ["/javascript/basico/teoria", "/javascript/facil/teoria"],
    ["/javascript/basico/practica", "/javascript/facil/practica"],
    ["/javascript/basico/cuestionario", "/javascript/facil/cuestionario"],
  ]);
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location).toBe(to);
  }
});

test("home navigates through JavaScript to Easy, Medium, and Difficult", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Elegir nivel" }).click();
  await expect(page).toHaveURL(/\/javascript$/);
  await page.getByRole("link", { name: "Explorar nivel" }).first().click();
  await expect(page).toHaveURL(/\/javascript\/facil$/);
  await page.getByRole("link", { name: "Medio", exact: true }).click();
  await expect(page).toHaveURL(/\/javascript\/medio$/);
  await page.getByRole("link", { name: "Difícil", exact: true }).click();
  await expect(page).toHaveURL(/\/javascript\/dificil$/);
});

for (const level of ["facil", "medio", "dificil"] as const) {
  test(`${level} level navigates to theory, practice, and quiz`, async ({ page }) => {
    await page.goto(`/javascript/${level}`);
    for (const [name, suffix] of [["Estudiar teoría", "teoria"], ["Abrir práctica", "practica"], ["Comenzar cuestionario", "cuestionario"]] as const) {
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`/javascript/${level}/${suffix}$`));
      await page.goto(`/javascript/${level}`);
    }
  });
}

test("primary navigation opens Sources without following external links", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Fuentes", exact: true }).click();
  await expect(page).toHaveURL(/\/fuentes$/);
  await expect(page.getByRole("heading", { level: 1, name: "Fuentes y créditos" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Abrir fuente" })).toHaveCount(23);
});
