import type { Difficulty, Exercise, ExerciseTest, Lesson } from "@/types/learning";
import type { Question } from "@/types/quiz";

export type PythonQuestionSpec = readonly [
  lessonId: string,
  concept: string,
  prompt: string,
  options: readonly [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
  sourceIds?: readonly string[],
];

export function pythonLesson(difficulty: Difficulty, id: string, title: string, concept: string, explanation: readonly string[], code: string, keyPoints: readonly string[], sourceIds: readonly string[], exerciseId?: string): Lesson {
  return { id, slug: id, title, concept, difficulty, explanation, examples: [{ label: "Ejemplo", code }], keyPoints, sourceIds, exerciseId };
}

export function pythonTest(id: string, label: string, expression: string, expected: unknown, assertion: ExerciseTest["assertion"] = "equal"): ExerciseTest {
  return { id, label, expression, expected, assertion };
}

export function pythonExercise(number: number, difficulty: Difficulty, id: string, title: string, concept: string, lessonId: string, prompt: string, starterCode: string, hints: readonly string[], solution: string, explanation: string, validation: Exercise["validation"], sourceIds: readonly string[]): Exercise {
  return { number, difficulty, id, title, concept, lessonId, prompt, starterCode, hints, solution, explanation, validation, sourceIds };
}

export function pythonQuestionBank(difficulty: Difficulty, idPrefix: string, specs: readonly PythonQuestionSpec[]): readonly Question[] {
  return specs.map(([lessonId, concept, prompt, options, correctIndex, explanation, sourceIds], index) => {
    const id = `${idPrefix}-q${String(index + 1).padStart(2, "0")}`;
    const answers = options.map((text, answerIndex) => ({ id: `${id}-${String.fromCharCode(97 + answerIndex)}`, text, correct: answerIndex === correctIndex })) as [Question["answers"][0], Question["answers"][1], Question["answers"][2], Question["answers"][3]];
    return { id, lessonId, concept, prompt, answers, explanation, difficulty, sourceIds: sourceIds ?? ["python-tutorial", "python-reference"] };
  });
}
