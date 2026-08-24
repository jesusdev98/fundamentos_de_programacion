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
  facil: { slug: "facil", name: "Python Fácil", adjective: "fácil", description: "Fundamentos, colecciones, control de flujo, funciones y excepciones.", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  medio: { slug: "medio", name: "Python Medio", adjective: "medio", description: "Expresiones idiomáticas, módulos, orientación a objetos, recursos, JSON y tipado.", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
  dificil: { slug: "dificil", name: "Python Difícil", adjective: "difícil", description: "Modelo de datos, tipado avanzado, generadores, concurrencia estructurada y metaprotocolos.", lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions },
} as const satisfies Readonly<Record<"facil" | "medio" | "dificil", CurriculumLevel>>;
