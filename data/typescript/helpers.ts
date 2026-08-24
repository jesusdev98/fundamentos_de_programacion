import type { Difficulty, Exercise, Lesson, RuntimeValidation, TypeScriptValidation } from "@/types/learning";
import type { Question } from "@/types/quiz";

export type TypeScriptQuestionSpec = readonly [lessonId: string, concept: string, prompt: string, options: readonly [string, string, string, string], correctIndex: 0 | 1 | 2 | 3, explanation: string, sourceIds?: readonly string[]];
export const typeAssertions = "type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false; type Expect<T extends true> = T;";
const primarySources = ["typescript-handbook", "typescript-docs", "typescript-repo"] as const;

export function typescriptLesson(difficulty: Difficulty, id: string, title: string, concept: string, explanation: string, code: string, keyPoints: readonly [string, string], sourceIds: readonly string[] = primarySources, exerciseId?: string): Lesson {
  return { id, slug: id, title, concept, difficulty, explanation: [explanation], examples: [{ label: "Ejemplo", code }], keyPoints, sourceIds, exerciseId };
}

export function typescriptValidation(assertions: string, runtime?: RuntimeValidation, files?: TypeScriptValidation["files"]): TypeScriptValidation {
  return { kind: "typescript", assertions: assertions ? `${typeAssertions}\n${assertions}` : "", runtime, files };
}

export function typescriptExercise(number: number, difficulty: Difficulty, id: string, title: string, concept: string, lessonId: string, prompt: string, starterCode: string, hints: readonly [string, string], solution: string, explanation: string, validation: TypeScriptValidation, sourceIds: readonly string[] = primarySources): Exercise {
  return { number, difficulty, id, title, concept, lessonId, prompt, starterCode, hints, solution, explanation, validation, sourceIds };
}

export function typescriptQuestionBank(difficulty: Difficulty, prefix: string, specs: readonly TypeScriptQuestionSpec[]): readonly Question[] {
  return specs.map(([lessonId, concept, prompt, options, correctIndex, explanation, sourceIds], index) => {
    const id = `${prefix}-q${String(index + 1).padStart(2, "0")}`;
    const answers = options.map((text, answerIndex) => ({ id: `${id}-${String.fromCharCode(97 + answerIndex)}`, text, correct: answerIndex === correctIndex })) as [Question["answers"][0], Question["answers"][1], Question["answers"][2], Question["answers"][3]];
    return { id, lessonId, concept, prompt, explanation, difficulty, sourceIds: sourceIds ?? primarySources, answers };
  });
}
