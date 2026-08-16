import type { Difficulty } from "@/types/learning";
import type { Answer, Question } from "@/types/quiz";

export function question(
  difficulty: Difficulty,
  id: string,
  lessonId: string,
  concept: string,
  prompt: string,
  options: readonly [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
): Question {
  const answers = options.map((text, index) => ({
    id: `${id}-${String.fromCharCode(97 + index)}`,
    text,
    correct: index === correctIndex,
  })) as [Answer, Answer, Answer, Answer];
  return { id, lessonId, concept, prompt, answers, explanation, difficulty, sourceIds: ["mdn-js", "ecma-262"] };
}
