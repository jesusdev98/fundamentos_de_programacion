import { expect, test } from "@playwright/test";

const routes = [
  ["/", "Fundamentos de la Programación", "Explorar lenguajes"],
  ["/javascript", "Elige tu nivel de JavaScript", "JavaScript Fácil"],
  ["/typescript", "Elige tu nivel de TypeScript", "TypeScript Fácil"],
  ["/python", "Elige tu nivel de Python", "Python Fácil"],
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
  ["/python/facil", "Python Fácil", "Estudiar teoría"],
  ["/python/facil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/python/facil/practica", "Convierte ideas en código", "Actualizar una puntuación"],
  ["/python/facil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/python/medio", "Python Medio", "Abrir práctica"],
  ["/python/medio/teoria", "Comprende antes de memorizar", "22 lecciones originales"],
  ["/python/medio/practica", "Convierte ideas en código", "Normalizar etiquetas"],
  ["/python/medio/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/python/dificil", "Python Difícil", "24 lecciones"],
  ["/python/dificil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/python/dificil/practica", "Convierte ideas en código", "Iterable con recorridos independientes"],
  ["/python/dificil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/typescript/facil", "TypeScript Fácil", "Estudiar teoría"],
  ["/typescript/facil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/typescript/facil/practica", "Convierte ideas en código", "Saludo tipado"],
  ["/typescript/facil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/typescript/medio", "TypeScript Medio", "Abrir práctica"],
  ["/typescript/medio/teoria", "Comprende antes de memorizar", "22 lecciones originales"],
  ["/typescript/medio/practica", "Convierte ideas en código", "Primer elemento genérico"],
  ["/typescript/medio/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/typescript/dificil", "TypeScript Difícil", "24 lecciones"],
  ["/typescript/dificil/teoria", "Comprende antes de memorizar", "24 lecciones originales"],
  ["/typescript/dificil/practica", "Convierte ideas en código", "Extraer el retorno"],
  ["/typescript/dificil/cuestionario", "Comprueba y repasa", "Banco: 50"],
  ["/fuentes", "Fuentes y créditos", "Mozilla Contributors"],
  ["/aviso-legal", "Aviso legal", "Jesús Martínez Escobar"],
  ["/privacidad", "Privacidad", "Alojamiento en Vercel"],
  ["/cookies", "Cookies", "Uso actual de cookies"],
] as const;

test("all canonical routes return HTML with their H1 and expected content", async ({ page }) => {
  expect(routes).toHaveLength(44);
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

test("landing presents the catalog and navigates to every language and sources", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Fundamentos de la Programación");
  const catalog = page.locator("#lenguajes");
  const languageCard = (name: string) => catalog.getByRole("article").filter({ has: page.getByRole("heading", { level: 3, name, exact: true }) });
  await expect(page.getByRole("heading", { level: 2, name: "Elige un lenguaje" })).toBeVisible();
  for (const name of ["JavaScript", "TypeScript", "Python"]) await expect(catalog.getByRole("heading", { level: 3, name })).toBeVisible();
  for (const name of ["JavaScript", "Python", "TypeScript"]) await expect(languageCard(name).getByText("Disponible", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Aprender con referencias confiables" })).toBeVisible();

  await page.getByRole("link", { name: "Explorar lenguajes" }).click();
  await expect(page).toHaveURL(/\/#lenguajes$/);

  await languageCard("JavaScript").getByRole("link", { name: "Explorar ruta" }).click();
  await expect(page).toHaveURL(/\/javascript$/);
  await page.goto("/");
  await languageCard("Python").getByRole("link", { name: "Explorar ruta" }).click();
  await expect(page).toHaveURL(/\/python$/);
  await page.goto("/");
  await languageCard("TypeScript").getByRole("link", { name: "Explorar ruta" }).click();
  await expect(page).toHaveURL(/\/typescript$/);
  await page.getByRole("link", { name: "Fuentes", exact: true }).click();
  await expect(page).toHaveURL(/\/fuentes$/);
});

test("global header exposes only global navigation", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  await expect(header.getByRole("link", { name: "Lenguajes" })).toBeVisible();
  await expect(header.getByRole("link", { name: "Fuentes" })).toBeVisible();
  for (const level of ["Fácil", "Medio", "Difícil"]) await expect(header.getByRole("link", { name: level, exact: true })).toHaveCount(0);
});

test("footer exposes transparency routes and the skip link reaches main", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  for (const [name, route] of [["Fuentes y créditos", "/fuentes"], ["Aviso legal", "/aviso-legal"], ["Privacidad", "/privacidad"], ["Cookies", "/cookies"]] as const) {
    const link = footer.getByRole("link", { name });
    await expect(link).toHaveAttribute("href", route);
    const box = await link.boundingBox();
    expect(box?.height, name).toBeGreaterThanOrEqual(44);
  }
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido principal" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#contenido-principal$/);
  const main = page.locator("main#contenido-principal");
  await expect(main).toBeVisible();
  expect(await main.evaluate((element) => document.activeElement === element)).toBe(true);
});

test("metadata provides a working icon without a favicon fallback request", async ({ page }) => {
  const faviconRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/favicon.ico") faviconRequests.push(request.url());
  });

  await page.goto("/");
  const icon = page.locator('link[rel~="icon"]');
  await expect(icon).toHaveAttribute("href", /\/icon\.svg/);
  const iconUrl = new URL(await icon.getAttribute("href") ?? "", page.url());
  const response = await page.request.get(iconUrl.toString());
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  expect(faviconRequests).toEqual([]);
});

test("unknown routes render the not-found page", async ({ page }) => {
  const response = await page.goto("/ruta-que-no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Página no encontrada" })).toBeVisible();
  await expect(page.locator("main#contenido-principal")).toBeVisible();
});

test("JavaScript overview navigates to Easy, Medium, and Difficult", async ({ page }) => {
  await page.goto("/javascript");
  await page.getByRole("link", { name: "Explorar nivel" }).first().click();
  await expect(page).toHaveURL(/\/javascript\/facil$/);
  await page.goto("/javascript");
  await page.getByRole("link", { name: "Explorar nivel" }).nth(1).click();
  await expect(page).toHaveURL(/\/javascript\/medio$/);
  await page.goto("/javascript");
  await page.getByRole("link", { name: "Explorar nivel" }).nth(2).click();
  await expect(page).toHaveURL(/\/javascript\/dificil$/);
});

test("Python overview navigates to Easy, Medium, and Difficult", async ({ page }) => {
  await page.goto("/python");
  for (const [index, level] of ["facil", "medio", "dificil"].entries()) {
    await page.getByRole("link", { name: "Explorar nivel" }).nth(index).click();
    await expect(page).toHaveURL(new RegExp(`/python/${level}$`));
    await page.goto("/python");
  }
});

test("TypeScript overview navigates to Easy, Medium, and Difficult", async ({ page }) => {
  await page.goto("/typescript");
  for (const [index, level] of ["facil", "medio", "dificil"].entries()) {
    await page.getByRole("link", { name: "Explorar nivel" }).nth(index).click();
    await expect(page).toHaveURL(new RegExp(`/typescript/${level}$`));
    await page.goto("/typescript");
  }
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

for (const level of ["facil", "medio", "dificil"] as const) {
  test(`TypeScript ${level} navigates to theory, practice, and quiz`, async ({ page }) => {
    await page.goto(`/typescript/${level}`);
    for (const [name, suffix] of [["Estudiar teoría", "teoria"], ["Abrir práctica", "practica"], ["Comenzar cuestionario", "cuestionario"]] as const) {
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`/typescript/${level}/${suffix}$`));
      await page.goto(`/typescript/${level}`);
    }
  });
}

for (const level of ["facil", "medio", "dificil"] as const) {
  test(`Python ${level} navigates to theory, practice, and quiz`, async ({ page }) => {
    await page.goto(`/python/${level}`);
    for (const [name, suffix] of [["Estudiar teoría", "teoria"], ["Abrir práctica", "practica"], ["Comenzar cuestionario", "cuestionario"]] as const) {
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`/python/${level}/${suffix}$`));
      await page.goto(`/python/${level}`);
    }
  });
}

test("primary navigation opens Sources without following external links", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Fuentes", exact: true }).click();
  await expect(page).toHaveURL(/\/fuentes$/);
  await expect(page.getByRole("heading", { level: 1, name: "Fuentes y créditos" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "JavaScript" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "TypeScript" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Python" })).toBeVisible();
});
