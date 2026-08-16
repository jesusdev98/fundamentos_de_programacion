import { expect, test } from "@playwright/test";
import { easyQuestions } from "../data/javascript/easy/questions";
import { mediumQuestions } from "../data/javascript/medium/questions";
import { difficultQuestions } from "../data/javascript/difficult/questions";
import { answerQuiz, startQuiz } from "./helpers/quiz";

test("Easy quiz protects incomplete attempts, reviews errors, and resets cleanly", async ({ page }) => {
  await page.goto("/javascript/facil/cuestionario");
  await startQuiz(page);
  await expect(page.getByRole("button", { name: "Finalizar cuestionario" })).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Faltan 10 respuestas");
  await answerQuiz(page, easyQuestions, false);
  await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
  await expect(page.getByRole("heading", { name: "0/10" })).toBeVisible();
  await expect(page.getByText("0% de aciertos")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Revisión de errores" })).toBeVisible();
  await expect(page.getByText("Respuesta correcta")).toHaveCount(10);
  await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(10);
  await page.getByRole("button", { name: "Generar otro intento" }).click();
  await expect(page.getByRole("status")).toContainText("Faltan 10 respuestas");
  await expect(page.getByRole("heading", { name: "0/10" })).toHaveCount(0);
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
});

test("Medium quiz contains ten unique four-option questions and completes with review", async ({ page }) => {
  await page.goto("/javascript/medio/cuestionario");
  await startQuiz(page);
  await answerQuiz(page, mediumQuestions, false);
  await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
  await expect(page.getByRole("heading", { name: "0/10" })).toBeVisible();
  await expect(page.getByText("0% de aciertos")).toBeVisible();
  await expect(page.getByText("Respuesta correcta")).toHaveCount(10);
  await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(10);
});

test("answering from the real Easy bank yields 10/10, 100%, and no pending review", async ({ page }) => {
  await page.goto("/javascript/facil/cuestionario");
  await startQuiz(page);
  await answerQuiz(page, easyQuestions, true);
  await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
  await expect(page.getByRole("heading", { name: "10/10" })).toBeVisible();
  await expect(page.getByText("100% de aciertos")).toBeVisible();
  await expect(page.getByText("dominaste todos los temas")).toBeVisible();
  await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(0);
});

test("Difficult quiz verifies ten four-option questions, review, reset, and a perfect attempt", async ({ page }) => {
  await page.goto("/javascript/dificil/cuestionario");
  await startQuiz(page);
  await answerQuiz(page, difficultQuestions, false);
  await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
  await expect(page.getByRole("heading", { name: "0/10" })).toBeVisible();
  await expect(page.getByText("Respuesta correcta")).toHaveCount(10);
  await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(10);
  await page.getByRole("button", { name: "Generar otro intento" }).click();
  await answerQuiz(page, difficultQuestions, true);
  await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
  await expect(page.getByRole("heading", { name: "10/10" })).toBeVisible();
  await expect(page.getByText("100% de aciertos")).toBeVisible();
  await expect(page.getByText("dominaste todos los temas")).toBeVisible();
});
