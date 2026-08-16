export type Level = "easy" | "medium";
export type Difficulty = "Fácil" | "Medio";

export type CodeExample = {
  readonly code: string;
  readonly label?: string;
};

export type Lesson = {
  readonly id: string;
  readonly slug: string;
  readonly concept: string;
  readonly title: string;
  readonly difficulty: Difficulty;
  readonly explanation: readonly string[];
  readonly examples: readonly CodeExample[];
  readonly keyPoints: readonly string[];
  readonly sourceIds: readonly string[];
  readonly exerciseId?: string;
};

export type OutputValidation = {
  readonly kind: "output";
  readonly expected: readonly string[];
};

export type ExerciseTest = {
  readonly id: string;
  readonly label: string;
  readonly expression: string;
  readonly assertion: "equal" | "deepEqual" | "truthy";
  readonly expected?: unknown;
};

export type TestValidation = {
  readonly kind: "tests";
  readonly tests: readonly ExerciseTest[];
};

export type ExerciseValidation = OutputValidation | TestValidation;

export type Exercise = {
  readonly id: string;
  readonly number: number;
  readonly title: string;
  readonly concept: string;
  readonly lessonId: string;
  readonly difficulty: Difficulty;
  readonly prompt: string;
  readonly starterCode: string;
  readonly hints: readonly string[];
  readonly solution: string;
  readonly explanation: string;
  readonly sourceIds: readonly string[];
  readonly validation: ExerciseValidation;
};
