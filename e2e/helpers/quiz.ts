import { expect, type Page } from "@playwright/test";
import type { Question } from "../../types/quiz";

export async function startQuiz(page: Page) {
  await page.getByRole("button", { name: "Comenzar intento" }).click();
  await expect(page.getByText("Intento actual: 10")).toBeVisible();
}

export async function answerQuiz(page: Page, bank: readonly Question[], correct: boolean) {
  const answerByPrompt = new Map(bank.map((question) => {
    const answer = question.answers.find((candidate) => candidate.correct === correct);
    if (!answer) throw new Error(`No ${correct ? "correct" : "incorrect"} answer for ${question.id}`);
    return [question.prompt, answer.text];
  }));
  const prompts = new Set<string>();
  for (let index = 0; index < 10; index += 1) {
    const card = page.getByRole("group", { name: `Pregunta ${index + 1}` });
    const prompt = (await card.getByRole("heading", { level: 2 }).textContent())?.trim() ?? "";
    prompts.add(prompt);
    await expect(card.getByRole("radio")).toHaveCount(4);
    const answer = answerByPrompt.get(prompt);
    if (!answer) throw new Error(`Question prompt is not in the bank: ${prompt}`);
    await card.getByRole("radio", { name: answer, exact: true }).check();
    if (index < 9) await page.getByRole("button", { name: "Siguiente" }).click();
  }
  expect(prompts.size).toBe(10);
}
