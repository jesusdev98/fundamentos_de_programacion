import assert from "node:assert/strict";
import test from "node:test";
import { easyQuestions } from "../data/javascript/easy/questions.ts";
import { difficultQuestions } from "../data/javascript/difficult/questions.ts";
import { mediumQuestions } from "../data/javascript/medium/questions.ts";
import { createQuizAttempt, evaluateQuiz, shuffle } from "../lib/quiz.ts";

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

test("every level bank produces a deterministic ten-question attempt", () => {
  for (const bank of [easyQuestions, mediumQuestions, difficultQuestions]) {
    const attempt = createQuizAttempt(bank, 10, deterministic([0.05, 0.25, 0.5, 0.75]));
    assert.equal(attempt.length, 10);
    assert.equal(new Set(attempt.map((question) => question.id)).size, 10);
    assert.ok(attempt.every((question) => question.answers.length === 4));
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

test("sampling validates every size boundary and does not mutate the bank", () => {
  const snapshot = structuredClone(easyQuestions);
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    assert.equal(createQuizAttempt(easyQuestions).length, 10);
  } finally {
    Math.random = originalRandom;
  }
  assert.throws(() => createQuizAttempt(easyQuestions, 0), /sample size/);
  assert.throws(() => createQuizAttempt([], 1), /sample size/);
  const wholeBank = createQuizAttempt(easyQuestions, easyQuestions.length, () => 0);
  assert.equal(wholeBank.length, easyQuestions.length);
  assert.deepEqual(easyQuestions, snapshot);
});

test("shuffle supports defaults, empty arrays and singleton arrays without mutation", () => {
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    assert.deepEqual(shuffle([1, 2, 3]), [2, 3, 1]);
  } finally {
    Math.random = originalRandom;
  }
  const singleton = [1] as const;
  assert.deepEqual(shuffle([]), []);
  assert.deepEqual(shuffle(singleton), [1]);
  assert.deepEqual(singleton, [1]);
});

test("evaluation handles empty attempts and rejects malformed questions", () => {
  assert.deepEqual(evaluateQuiz([], {}), { score: 0, percentage: Number.NaN, incorrect: [] });
  const question = easyQuestions[0];
  const incorrect = (answer: (typeof question.answers)[number]) => ({ ...answer, correct: false });
  const malformed = { ...question, answers: [incorrect(question.answers[0]), incorrect(question.answers[1]), incorrect(question.answers[2]), incorrect(question.answers[3])] } as const;
  assert.throws(() => evaluateQuiz([malformed], { [malformed.id]: malformed.answers[0].id }), /has no correct answer/);
});
