import { easyExercises } from "./easy/exercises.ts";
import { easyLessons } from "./easy/lessons.ts";
import { easyQuestions } from "./easy/questions.ts";
import { mediumExercises } from "./medium/exercises.ts";
import { mediumLessons } from "./medium/lessons.ts";
import { mediumQuestions } from "./medium/questions.ts";
import { difficultExercises } from "./difficult/exercises.ts";
import { difficultLessons } from "./difficult/lessons.ts";
import { difficultQuestions } from "./difficult/questions.ts";
import type { CurriculumLevel } from "../../types/curriculum.ts";
export { isLevelSlug, levelSlugs, type LevelSlug } from "../../types/curriculum.ts";

export const levels = {
  facil: { slug: "facil", name: "JavaScript Fácil", adjective: "fácil", description: "Conceptos fundamentales para empezar a leer, escribir y razonar código.", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  medio: { slug: "medio", name: "JavaScript Medio", adjective: "medio", description: "Funciones como valores, transformaciones, errores y asincronía.", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
  dificil: { slug: "dificil", name: "JavaScript Difícil", adjective: "difícil", description: "Modelo de ejecución, objetos avanzados, iteración y asincronía para razonar sobre comportamiento complejo.", lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions },
} as const satisfies Readonly<Record<"facil" | "medio" | "dificil", CurriculumLevel>>;
