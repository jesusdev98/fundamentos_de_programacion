import { easyExercises } from "./easy/exercises";
import { easyLessons } from "./easy/lessons";
import { easyQuestions } from "./easy/questions";
import { mediumExercises } from "./medium/exercises";
import { mediumLessons } from "./medium/lessons";
import { mediumQuestions } from "./medium/questions";
import { difficultExercises } from "./difficult/exercises";
import { difficultLessons } from "./difficult/lessons";
import { difficultQuestions } from "./difficult/questions";

export const levelSlugs = ["facil", "medio", "dificil"] as const;
export type LevelSlug = (typeof levelSlugs)[number];

export const levels = {
  facil: { slug: "facil", name: "JavaScript Fácil", adjective: "fácil", description: "Conceptos fundamentales para empezar a leer, escribir y razonar código.", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  medio: { slug: "medio", name: "JavaScript Medio", adjective: "medio", description: "Funciones como valores, transformaciones, errores y asincronía.", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
  dificil: { slug: "dificil", name: "JavaScript Difícil", adjective: "difícil", description: "Modelo de ejecución, objetos avanzados, iteración y asincronía para razonar sobre comportamiento complejo.", lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions },
} as const;

export function isLevelSlug(value: string): value is LevelSlug { return levelSlugs.includes(value as LevelSlug); }
