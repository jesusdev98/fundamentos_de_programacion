import { difficultExercises } from "./javascript/difficult/exercises.ts";
import { difficultLessons } from "./javascript/difficult/lessons.ts";
import { difficultQuestions } from "./javascript/difficult/questions.ts";
import { easyExercises } from "./javascript/easy/exercises.ts";
import { easyLessons } from "./javascript/easy/lessons.ts";
import { easyQuestions } from "./javascript/easy/questions.ts";
import { mediumExercises } from "./javascript/medium/exercises.ts";
import { mediumLessons } from "./javascript/medium/lessons.ts";
import { mediumQuestions } from "./javascript/medium/questions.ts";
import type { Language } from "../types/languages.ts";

const javascriptLevels = [
  { lessons: easyLessons, exercises: easyExercises, questions: easyQuestions },
  { lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions },
  { lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions },
] as const;

export const languages: readonly Language[] = [
  {
    id: "javascript",
    slug: "javascript",
    name: "JavaScript",
    description: "Una ruta completa para comprender el lenguaje, practicar en el navegador y comprobar lo aprendido.",
    status: "available",
    sourceIds: ["mdn-guide", "mdn-reference", "ecma-262"],
    accent: "#d97706",
    stats: {
      levels: javascriptLevels.length,
      lessons: javascriptLevels.reduce((total, level) => total + level.lessons.length, 0),
      exercises: javascriptLevels.reduce((total, level) => total + level.exercises.length, 0),
      questions: javascriptLevels.reduce((total, level) => total + level.questions.length, 0),
    },
    futureAreas: [],
  },
  {
    id: "typescript",
    slug: "typescript",
    name: "TypeScript",
    description: "Próxima ruta para razonar sobre tipos, modelado de datos y herramientas sobre JavaScript.",
    status: "coming-soon",
    sourceIds: ["typescript-handbook", "typescript-docs", "typescript-repo"],
    accent: "#2563eb",
    futureAreas: ["Tipos cotidianos", "Funciones y objetos", "Narrowing", "Genéricos y configuración"],
  },
  {
    id: "python",
    slug: "python",
    name: "Python",
    description: "Próxima ruta para aprender sintaxis expresiva, estructuras de datos y organización de programas.",
    status: "coming-soon",
    sourceIds: ["python-tutorial", "python-reference", "python-docs"],
    accent: "#0f766e",
    futureAreas: ["Sintaxis y control de flujo", "Colecciones", "Funciones y módulos", "Objetos y errores"],
  },
];

export const languagesById = new Map(languages.map((language) => [language.id, language]));
