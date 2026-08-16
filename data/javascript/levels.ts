import { easyExercises } from "./easy/exercises";
import { easyLessons } from "./easy/lessons";
import { easyQuestions } from "./easy/questions";
import { mediumExercises } from "./medium/exercises";
import { mediumLessons } from "./medium/lessons";
import { mediumQuestions } from "./medium/questions";

export const levelSlugs = ["facil", "medio"] as const;
export type LevelSlug = (typeof levelSlugs)[number];

export const levels = {
  facil: { slug: "facil", name: "JavaScript Fácil", adjective: "fácil", description: "Conceptos fundamentales para empezar a leer, escribir y razonar código.", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  medio: { slug: "medio", name: "JavaScript Medio", adjective: "medio", description: "Funciones como valores, transformaciones, errores y asincronía.", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
} as const;

export function isLevelSlug(value: string): value is LevelSlug { return levelSlugs.includes(value as LevelSlug); }
