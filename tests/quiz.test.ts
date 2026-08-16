import assert from "node:assert/strict";
import test from "node:test";
import { easyQuestions } from "../data/javascript/easy/questions.ts";
import { createQuizAttempt, evaluateQuiz } from "../lib/quiz.ts";

function deterministic(values: readonly number[]) { let index = 0; return () => values[index++ % values.length]; }

test("attempt selects ten unique IDs and preserves each correct answer", () => {
  const originalCorrect = new Map(easyQuestions.map((question) => [question.id, question.answers.find((answer) => answer.correct)?.id]));
  const attempt = createQuizAttempt(easyQuestions, 10, deterministic([0.1, 0.8, 0.3, 0.6]));
  assert.equal(attempt.length, 10);
  assert.equal(new Set(attempt.map((question) => question.id)).size, 10);
  for (const question of attempt) {
    assert.equal(question.answers.filter((answer) => answer.correct).length, 1);
    assert.equal(question.answers.find((answer) => answer.correct)?.id, originalCorrect.get(question.id));
  }
});

test("score and incorrect review use stable IDs", () => {
  const attempt = createQuizAttempt(easyQuestions, 10, () => 0.42);
  const correct = Object.fromEntries(attempt.map((question) => [question.id, question.answers.find((answer) => answer.correct)!.id]));
  assert.deepEqual(evaluateQuiz(attempt, correct), { score: 10, percentage: 100, incorrect: [] });
  const first = attempt[0];
  const wrong = first.answers.find((answer) => !answer.correct)!;
  const result = evaluateQuiz(attempt, { ...correct, [first.id]: wrong.id });
  assert.equal(result.score, 9);
  assert.deepEqual(result.incorrect, [{ questionId: first.id, selectedAnswerId: wrong.id, correctAnswerId: first.answers.find((answer) => answer.correct)!.id }]);
  assert.throws(() => evaluateQuiz(attempt, {}), /must be answered/);
  assert.throws(() => createQuizAttempt(attempt, 11), /sample size/);
});
