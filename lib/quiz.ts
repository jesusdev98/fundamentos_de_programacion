import type { Answer, Question, QuizAnswers, QuizResult } from "@/types/quiz";

export type RandomSource = () => number;

export function shuffle<T>(values: readonly T[], random: RandomSource = Math.random): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

export function createQuizAttempt(
  bank: readonly Question[],
  size = 10,
  random: RandomSource = Math.random,
): readonly Question[] {
  if (size < 1 || size > bank.length) throw new Error("Invalid quiz sample size.");
  return shuffle(bank, random).slice(0, size).map((question) => ({
    ...question,
    answers: shuffle(question.answers, random) as [Answer, Answer, Answer, Answer],
  }));
}

export function evaluateQuiz(
  questions: readonly Question[],
  answers: QuizAnswers,
): QuizResult {
  if (questions.some((question) => !answers[question.id])) {
    throw new Error("All quiz questions must be answered before evaluation.");
  }
  const incorrect = questions.flatMap((question) => {
    const selectedAnswerId = answers[question.id];
    const correctAnswer = question.answers.find((answer) => answer.correct);
    if (!correctAnswer) throw new Error(`Question ${question.id} has no correct answer.`);
    return selectedAnswerId === correctAnswer.id
      ? []
      : [{ questionId: question.id, selectedAnswerId, correctAnswerId: correctAnswer.id }];
  });
  const score = questions.length - incorrect.length;
  return { score, percentage: Math.round((score / questions.length) * 100), incorrect };
}
