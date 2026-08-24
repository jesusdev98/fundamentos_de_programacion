import { levels as javascriptLevels } from "./javascript/levels.ts";
import { levels as pythonLevels } from "./python/levels.ts";
import { levels as typescriptLevels } from "./typescript/levels.ts";
import type { Curriculum } from "@/types/curriculum";

export const curricula = {
  javascript: {
    languageId: "javascript",
    languageName: "JavaScript",
    runner: "javascript",
    sourceIds: ["mdn-guide", "mdn-reference", "ecma-262"],
    levels: javascriptLevels,
  },
  python: {
    languageId: "python",
    languageName: "Python",
    runner: "python",
    sourceIds: ["python-tutorial", "python-reference", "python-library"],
    levels: pythonLevels,
  },
  typescript: {
    languageId: "typescript",
    languageName: "TypeScript",
    runner: "typescript",
    sourceIds: ["typescript-handbook", "typescript-docs", "typescript-repo"],
    levels: typescriptLevels,
  },
} as const satisfies Readonly<Record<"javascript" | "python" | "typescript", Curriculum>>;

export function curriculumStats(curriculum: Curriculum) {
  const levels = Object.values(curriculum.levels);
  return {
    levels: levels.length,
    lessons: levels.reduce((total, level) => total + level.lessons.length, 0),
    exercises: levels.reduce((total, level) => total + level.exercises.length, 0),
    questions: levels.reduce((total, level) => total + level.questions.length, 0),
  };
}
