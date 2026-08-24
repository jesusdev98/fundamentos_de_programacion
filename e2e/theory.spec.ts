import { expect, test } from "@playwright/test";

for (const language of ["javascript", "python", "typescript"] as const) {
  for (const level of [{ slug: "facil", lessons: 24 }, { slug: "medio", lessons: 22 }, { slug: "dificil", lessons: 24 }] as const) {
    test(`${language} ${level.slug} theory preserves lesson, example, and reference invariants`, async ({ page }) => {
      await page.goto(`/${language}/${level.slug}/teoria`);
      const lessons = page.locator("main article");
      await expect(lessons).toHaveCount(level.lessons);
      await expect(page.getByRole("navigation", { name: "Contenido de teoría" }).getByRole("link")).toHaveCount(level.lessons);
      await expect(lessons.locator("pre")).toHaveCount(level.lessons);
      await expect(lessons.getByRole("complementary", { name: "Fuentes y referencias" })).toHaveCount(level.lessons);
      await expect(lessons.first().getByRole("heading", { level: 2 })).not.toBeEmpty();
      await expect(lessons.first().getByText("Puntos importantes")).toBeVisible();
    });
  }
}
