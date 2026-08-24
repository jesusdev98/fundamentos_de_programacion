import { expect, test } from "@playwright/test";
import { easyQuestions } from "../data/javascript/easy/questions";
import { mediumQuestions } from "../data/javascript/medium/questions";
import { difficultQuestions } from "../data/javascript/difficult/questions";
import { easyQuestions as pythonEasyQuestions } from "../data/python/easy/questions";
import { mediumQuestions as pythonMediumQuestions } from "../data/python/medium/questions";
import { difficultQuestions as pythonDifficultQuestions } from "../data/python/difficult/questions";
import { easyQuestions as typescriptEasyQuestions } from "../data/typescript/easy/questions";
import { mediumQuestions as typescriptMediumQuestions } from "../data/typescript/medium/questions";
import { difficultQuestions as typescriptDifficultQuestions } from "../data/typescript/difficult/questions";
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
  await expect(page.getByText("has dominado todos los temas")).toBeVisible();
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
  await expect(page.getByText("has dominado todos los temas")).toBeVisible();
});

for (const [level, questions] of [["facil", pythonEasyQuestions], ["medio", pythonMediumQuestions], ["dificil", pythonDifficultQuestions]] as const) {
  test(`Python ${level} quiz samples ten questions and provides scoring review`, async ({ page }) => {
    await page.goto(`/python/${level}/cuestionario`);
    await startQuiz(page);
    await expect(page.getByRole("radio")).toHaveCount(4);
    await answerQuiz(page, questions, false);
    await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
    await expect(page.getByRole("heading", { name: "0/10" })).toBeVisible();
    await expect(page.getByText("Respuesta correcta")).toHaveCount(10);
    await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(10);
    await expect(page.getByRole("link", { name: "Repasar este tema" }).first()).toHaveAttribute("href", new RegExp(`^/python/${level}/teoria#python-`));
  });
}

for (const [level, questions] of [["facil", typescriptEasyQuestions], ["medio", typescriptMediumQuestions], ["dificil", typescriptDifficultQuestions]] as const) {
  test(`TypeScript ${level} quiz samples ten questions and provides scoring review`, async ({ page }) => {
    await page.goto(`/typescript/${level}/cuestionario`);
    await startQuiz(page);
    await expect(page.getByRole("radio")).toHaveCount(4);
    await answerQuiz(page, questions, false);
    await page.getByRole("button", { name: "Finalizar cuestionario" }).click();
    await expect(page.getByRole("heading", { name: "0/10" })).toBeVisible();
    await expect(page.getByText("Respuesta correcta")).toHaveCount(10);
    await expect(page.getByRole("link", { name: "Repasar este tema" })).toHaveCount(10);
  });
}
