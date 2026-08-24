import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { curricula } from "../data/curricula.ts";
import { difficultLessons } from "../data/javascript/difficult/lessons.ts";
import { difficultQuestions } from "../data/javascript/difficult/questions.ts";
import { languages } from "../data/languages.ts";
import { sources } from "../data/sources.ts";
import { languageIds } from "../types/languages.ts";
import type { Curriculum, CurriculumLevel } from "../types/curriculum.ts";

const expectedCounts = {
  javascript: { facil: [24, 12, 50], medio: [22, 12, 50], dificil: [24, 14, 50] },
  python: { facil: [24, 12, 50], medio: [22, 12, 50], dificil: [24, 14, 50] },
  typescript: { facil: [24, 12, 50], medio: [22, 12, 50], dificil: [24, 14, 50] },
} as const;
const difficulties = { facil: "Fácil", medio: "Medio", dificil: "Difícil" } as const;
const sourceIds = new Set(sources.map((source) => source.id));
const requiredPythonLessonIds = {
  facil: ["python-easy-execution", "python-easy-strings", "python-easy-builtins", "python-easy-for-range", "python-easy-functions", "python-easy-parameters", "python-easy-fstrings"],
  medio: ["python-medium-function-values", "python-medium-functional-tools", "python-medium-legb", "python-medium-modules", "python-medium-advanced-exceptions"],
  dificil: ["python-difficult-dunder", "python-difficult-generator-control", "python-difficult-contextlib", "python-difficult-cancellation", "python-difficult-imports", "python-difficult-pattern-matching", "python-difficult-functools", "python-difficult-caching"],
} as const;
const requiredTypeScriptLessonIds = {
  facil: ["typescript-easy-intro", "typescript-easy-tsc", "typescript-easy-inference", "typescript-easy-unions", "typescript-easy-interfaces", "typescript-easy-null", "typescript-easy-typeof", "typescript-easy-modules", "typescript-easy-tsconfig", "typescript-easy-strict"],
  medio: ["typescript-medium-generics", "typescript-medium-keyof", "typescript-medium-indexed", "typescript-medium-discriminated", "typescript-medium-never", "typescript-medium-predicates", "typescript-medium-conditional", "typescript-medium-satisfies", "typescript-medium-type-imports"],
  dificil: ["typescript-difficult-infer", "typescript-difficult-distributive", "typescript-difficult-key-remapping", "typescript-difficult-variance", "typescript-difficult-brands", "typescript-difficult-module-augmentation", "typescript-difficult-declarations", "typescript-difficult-resolution", "typescript-difficult-project-references", "typescript-difficult-decorators", "typescript-difficult-type-testing", "typescript-difficult-api-maintainability"],
} as const;

function userFacingFiles(path: string): readonly string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory()) return userFacingFiles(entryPath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

test("user-facing copy excludes prohibited voseo forms", () => {
  const prohibitedForms = /(?<!\p{L})(?:elegí|construí|probá|hacé|mirá|usá|ingresá|completá)(?!\p{L})/giu;
  const files = [...userFacingFiles("app"), ...userFacingFiles("components"), ...userFacingFiles("data/javascript"), ...userFacingFiles("data/python"), ...userFacingFiles("data/typescript"), "data/languages.ts", "data/sources.ts"];
  const violations = files.flatMap((file) => [...readFileSync(file, "utf8").matchAll(prohibitedForms)].map((match) => `${file}: ${match[0]}`));
  assert.deepEqual(violations, []);
});

test("every registered curriculum has exact counts and valid relationships", () => {
  for (const curriculum of Object.values(curricula) as readonly Curriculum[]) {
    const languageId = curriculum.languageId;
    assert.equal(curriculum.languageId, languageId);
    assert.ok(curriculum.sourceIds.every((id) => sourceIds.has(id)));
    for (const level of Object.values(curriculum.levels) as readonly CurriculumLevel[]) {
      const levelSlug = level.slug;
      const typedLanguage = languageId as keyof typeof expectedCounts;
      const typedLevel = levelSlug as keyof typeof difficulties;
      assert.deepEqual([level.lessons.length, level.exercises.length, level.questions.length], expectedCounts[typedLanguage][typedLevel]);
      assert.equal(level.slug, levelSlug);
      const difficulty = difficulties[typedLevel];
      const lessonIds = new Set(level.lessons.map((lesson) => lesson.id));
      const exerciseIds = new Set(level.exercises.map((exercise) => exercise.id));
      assert.equal(lessonIds.size, level.lessons.length);
      assert.equal(exerciseIds.size, level.exercises.length);
      assert.equal(new Set(level.lessons.map((lesson) => lesson.title)).size, level.lessons.length);
      if (languageId === "python") {
        assert.ok(requiredPythonLessonIds[typedLevel].every((id) => lessonIds.has(id)), `${levelSlug} omits a required Python topic`);
      }
      if (languageId === "typescript") assert.ok(requiredTypeScriptLessonIds[typedLevel].every((id) => lessonIds.has(id)), `${levelSlug} omits a required TypeScript topic`);
      for (const lesson of level.lessons) {
        assert.equal(lesson.difficulty, difficulty);
        assert.ok(lesson.explanation.length > 0 && lesson.examples.length > 0 && lesson.keyPoints.length >= 2);
        assert.ok(lesson.sourceIds.every((id) => sourceIds.has(id)), `${lesson.id} links an unknown source`);
        if (lesson.exerciseId) assert.ok(exerciseIds.has(lesson.exerciseId), `${lesson.id} links an unknown exercise`);
      }
      for (const [index, exercise] of level.exercises.entries()) {
        assert.equal(exercise.number, index + 1);
        assert.equal(exercise.difficulty, difficulty);
        assert.ok(lessonIds.has(exercise.lessonId), `${exercise.id} links an unknown lesson`);
        assert.ok(exercise.sourceIds.every((id) => sourceIds.has(id)));
        assert.ok(exercise.prompt.length > 0 && exercise.starterCode.length > 0 && exercise.hints.length >= 2 && exercise.solution.length > 0 && exercise.explanation.length > 0);
        if (languageId !== "javascript") assert.equal(level.lessons.find((lesson) => lesson.id === exercise.lessonId)?.exerciseId, exercise.id, `${exercise.id} is not linked back from its lesson`);
        if (languageId === "typescript") assert.equal(exercise.validation.kind, "typescript", `${exercise.id} must use the compiler`);
        if (difficulty === "Difícil" && languageId !== "typescript") assert.equal(exercise.validation.kind, "tests", `${exercise.id} must use behavioral assertions`);
        if (exercise.validation.kind === "tests") {
          assert.ok(exercise.validation.tests.length > 0);
          if (languageId === "javascript") assert.ok(exercise.validation.tests.every((authoredTest) => authoredTest.assertion !== "raises"));
        }
      }
      assert.equal(new Set(level.questions.map((question) => question.id)).size, 50);
      assert.equal(new Set(level.questions.map((question) => question.prompt)).size, 50);
      for (const question of level.questions) {
        assert.equal(question.difficulty, difficulty);
        assert.equal(question.answers.length, 4);
        assert.equal(question.answers.filter((answer) => answer.correct).length, 1);
        assert.equal(new Set(question.answers.map((answer) => answer.id)).size, 4);
        assert.equal(new Set(question.answers.map((answer) => answer.text.trim())).size, 4, `${question.id} repeats an answer`);
        assert.ok(lessonIds.has(question.lessonId), `${question.id} links an unknown lesson`);
        assert.ok(question.sourceIds.every((id) => sourceIds.has(id)));
        assert.ok(question.explanation.length > 0 && question.concept.length > 0);
      }
      if (languageId !== "javascript") {
        const coveredLessons = new Set(level.questions.map((question) => question.lessonId));
        assert.ok(level.lessons.every((lesson) => coveredLessons.has(lesson.id)), `${levelSlug} has a Python lesson without quiz coverage`);
      }
    }
  }
});

test("Difficult JavaScript question coverage remains stable", () => {
  const coverage = new Map(difficultLessons.map((lesson) => [lesson.id, 0]));
  for (const question of difficultQuestions) coverage.set(question.lessonId, (coverage.get(question.lessonId) ?? 0) + 1);
  for (const lesson of difficultLessons) {
    const expected = ["difficult-promise-combinators", "difficult-event-loop"].includes(lesson.id) ? 3 : 2;
    assert.equal(coverage.get(lesson.id), expected, lesson.id);
  }
});

test("JavaScript, Python, and TypeScript IDs and final totals are exact", () => {
  const levels = (Object.values(curricula) as readonly Curriculum[]).flatMap((curriculum) => Object.values(curriculum.levels));
  const allLessons = levels.flatMap((level) => [...level.lessons]);
  const allExercises = levels.flatMap((level) => [...level.exercises]);
  const allQuestions = levels.flatMap((level) => [...level.questions]);
  assert.deepEqual([levels.length, allLessons.length, allExercises.length, allQuestions.length], [9, 210, 114, 450]);
  for (const collection of [allLessons, allExercises, allQuestions]) assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  const typescriptExercises = Object.values(curricula.typescript.levels).flatMap((level) => [...level.exercises]);
  assert.equal(new Set(typescriptExercises.map((exercise) => exercise.title)).size, 38);
  assert.equal(new Set(typescriptExercises.map((exercise) => exercise.prompt)).size, 38);
  const promptCounts = new Map<string, number>();
  for (const question of allQuestions) promptCounts.set(question.prompt, (promptCounts.get(question.prompt) ?? 0) + 1);
  const repeatedPrompts = [...promptCounts].filter(([, count]) => count > 1).map(([prompt]) => prompt);
  assert.deepEqual(repeatedPrompts, []);
  for (const curriculum of Object.values(curricula) as readonly Curriculum[]) {
    const languageId = curriculum.languageId;
    for (const level of Object.values(curriculum.levels)) {
      const levelSlug = level.slug;
      const levelPrefix = levelSlug === "facil" ? "easy" : levelSlug === "medio" ? "medium" : "difficult";
      const prefix = languageId === "javascript" ? `${levelPrefix}-` : `${languageId}-${levelPrefix}-`;
      assert.ok([...level.lessons, ...level.exercises, ...level.questions].every((item) => item.id.startsWith(prefix)));
    }
  }
});

test("language catalog derives available curriculum statistics", () => {
  assert.deepEqual(languages.map((language) => language.id), languageIds);
  assert.equal(new Set(languages.map((language) => language.slug)).size, languages.length);
  const catalogIds = new Set(languages.map((language) => language.id));
  for (const language of languages) assert.ok(language.sourceIds.every((id) => sourceIds.has(id)));
  for (const source of sources) assert.ok(catalogIds.has(source.languageId));
  for (const languageId of ["javascript", "python", "typescript"] as const) {
    const language = languages.find((candidate) => candidate.id === languageId);
    assert.equal(language?.status, "available");
    assert.deepEqual(language?.stats, { levels: 3, lessons: 70, exercises: 38, questions: 150 });
  }
});
