import { easyLessons } from "./easy/lessons.ts";
import { easyExercises } from "./easy/exercises.ts";
import { easyQuestions } from "./easy/questions.ts";
import { mediumLessons } from "./medium/lessons.ts";
import { mediumExercises } from "./medium/exercises.ts";
import { mediumQuestions } from "./medium/questions.ts";
import { difficultLessons } from "./difficult/lessons.ts";
import { difficultExercises } from "./difficult/exercises.ts";
import { difficultQuestions } from "./difficult/questions.ts";
import type { CurriculumLevel } from "../../types/curriculum.ts";

export const levels = {
  facil: { slug: "facil", name: "TypeScript Fácil", adjective: "fácil", description: "Tipos cotidianos, narrowing, funciones, objetos, clases, módulos y configuración strict.", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  medio: { slug: "medio", name: "TypeScript Medio", adjective: "medio", description: "Genéricos, transformaciones de tipos, contratos estructurales y diseño de APIs tipadas.", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
  dificil: { slug: "dificil", name: "TypeScript Difícil", adjective: "difícil", description: "Tipos avanzados, declarations, resolución, decorators modernos, pruebas y rendimiento del checker.", lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions },
} as const satisfies Readonly<Record<"facil" | "medio" | "dificil", CurriculumLevel>>;
