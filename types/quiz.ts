import type { Difficulty } from "./learning";

export type Answer = {
  readonly id: string;
  readonly text: string;
  readonly correct: boolean;
};

export type Question = {
  readonly id: string;
  readonly prompt: string;
  readonly answers: readonly [Answer, Answer, Answer, Answer];
  readonly explanation: string;
  readonly concept: string;
  readonly lessonId: string;
  readonly sourceIds: readonly string[];
  readonly difficulty: Difficulty;
};

export type QuizAnswers = Readonly<Record<string, string>>;
export type QuizReviewItem = {
  readonly questionId: string;
  readonly selectedAnswerId: string;
  readonly correctAnswerId: string;
};
export type QuizResult = {
  readonly score: number;
  readonly percentage: number;
  readonly incorrect: readonly QuizReviewItem[];
};
