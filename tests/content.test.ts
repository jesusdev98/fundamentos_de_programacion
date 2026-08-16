import assert from "node:assert/strict";
import test from "node:test";
import { easyExercises } from "../data/javascript/easy/exercises.ts";
import { easyLessons } from "../data/javascript/easy/lessons.ts";
import { easyQuestions } from "../data/javascript/easy/questions.ts";
import { mediumExercises } from "../data/javascript/medium/exercises.ts";
import { mediumLessons } from "../data/javascript/medium/lessons.ts";
import { mediumQuestions } from "../data/javascript/medium/questions.ts";
import { difficultExercises } from "../data/javascript/difficult/exercises.ts";
import { difficultLessons } from "../data/javascript/difficult/lessons.ts";
import { difficultQuestions } from "../data/javascript/difficult/questions.ts";
import { sources } from "../data/sources.ts";
import { languages } from "../data/languages.ts";
import { languageIds } from "../types/languages.ts";

const levels = [
  { difficulty: "Fácil", lessons: easyLessons, exercises: easyExercises, questions: easyQuestions, counts: [24, 12, 50] },
  { difficulty: "Medio", lessons: mediumLessons, exercises: mediumExercises, questions: mediumQuestions, counts: [22, 12, 50] },
  { difficulty: "Difícil", lessons: difficultLessons, exercises: difficultExercises, questions: difficultQuestions, counts: [24, 14, 50] },
] as const;
const sourceIds = new Set(sources.map((source) => source.id));

test("curriculum counts and references are valid", () => {
  for (const level of levels) {
    assert.deepEqual([level.lessons.length, level.exercises.length, level.questions.length], level.counts);
    const lessonIds = new Set(level.lessons.map((lesson) => lesson.id));
    const exerciseIds = new Set(level.exercises.map((exercise) => exercise.id));
    assert.equal(lessonIds.size, level.lessons.length);
    assert.equal(exerciseIds.size, level.exercises.length);
    for (const lesson of level.lessons) {
      assert.equal(lesson.difficulty, level.difficulty);
      assert.ok(lesson.explanation.length > 0 && lesson.examples.length > 0 && lesson.keyPoints.length > 0);
      assert.ok(lesson.sourceIds.every((id) => sourceIds.has(id)));
      if (lesson.exerciseId) assert.ok(exerciseIds.has(lesson.exerciseId), `${lesson.id} links an unknown exercise`);
    }
    for (const exercise of level.exercises) {
      assert.equal(exercise.difficulty, level.difficulty);
      assert.ok(lessonIds.has(exercise.lessonId), `${exercise.id} links an unknown lesson`);
      assert.ok(exercise.sourceIds.every((id) => sourceIds.has(id)));
      assert.ok(exercise.hints.length >= 2 && exercise.solution.length > 0);
      assert.equal(exercise.number, level.exercises.indexOf(exercise) + 1);
      if (level.difficulty === "Difícil") {
        assert.equal(exercise.validation.kind, "tests", `${exercise.id} must use behavioral assertions`);
        if (exercise.validation.kind === "tests") assert.ok(exercise.validation.tests.length > 0);
      }
    }
    const questionIds = new Set(level.questions.map((question) => question.id));
    assert.equal(questionIds.size, 50);
    for (const question of level.questions) {
      assert.equal(question.difficulty, level.difficulty);
      assert.equal(question.answers.length, 4);
      assert.equal(question.answers.filter((answer) => answer.correct).length, 1);
      assert.equal(new Set(question.answers.map((answer) => answer.id)).size, 4);
      assert.ok(lessonIds.has(question.lessonId), `${question.id} links an unknown lesson`);
      assert.ok(question.sourceIds.every((id) => sourceIds.has(id)));
      assert.ok(question.explanation.length > 0 && question.concept.length > 0);
    }
    assert.equal(new Set(level.questions.map((question) => question.prompt)).size, 50);
  }
});

test("Difficult questions cover every lesson twice plus the two required extras", () => {
  const coverage = new Map(difficultLessons.map((lesson) => [lesson.id, 0]));
  for (const question of difficultQuestions) coverage.set(question.lessonId, (coverage.get(question.lessonId) ?? 0) + 1);
  for (const lesson of difficultLessons) {
    const expected = ["difficult-promise-combinators", "difficult-event-loop"].includes(lesson.id) ? 3 : 2;
    assert.equal(coverage.get(lesson.id), expected, lesson.id);
  }
});

test("global curriculum IDs, prefixes, links, and totals are stable", () => {
  const allLessons = levels.flatMap((level) => [...level.lessons]);
  const allExercises = levels.flatMap((level) => [...level.exercises]);
  const allQuestions = levels.flatMap((level) => [...level.questions]);
  assert.deepEqual([allLessons.length, allExercises.length, allQuestions.length], [70, 38, 150]);
  for (const collection of [allLessons, allExercises, allQuestions]) {
    assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  }
  for (const [prefix, level] of [["easy-", levels[0]], ["medium-", levels[1]], ["difficult-", levels[2]]] as const) {
    assert.ok([...level.lessons, ...level.exercises, ...level.questions].every((item) => item.id.startsWith(prefix)));
    const linkedExercises = new Set(level.exercises.map((exercise) => exercise.id));
    for (const lesson of level.lessons) {
      if (lesson.exerciseId) assert.ok(linkedExercises.has(lesson.exerciseId));
    }
  }
});

test("language catalog and source associations are valid", () => {
  assert.deepEqual(languages.map((language) => language.id), languageIds);
  assert.equal(new Set(languages.map((language) => language.slug)).size, languages.length);
  assert.equal(languages.length, 3);

  const catalogIds = new Set(languages.map((language) => language.id));
  for (const language of languages) {
    assert.ok(language.sourceIds.every((id) => sourceIds.has(id)), `${language.id} links an unknown source`);
  }
  for (const source of sources) {
    assert.ok(catalogIds.has(source.languageId), `${source.id} links an unknown language`);
  }

  const javascript = languages.find((language) => language.id === "javascript");
  assert.deepEqual(javascript?.stats, { levels: 3, lessons: 70, exercises: 38, questions: 150 });
  assert.equal(languages.find((language) => language.id === "typescript")?.status, "coming-soon");
  assert.equal(languages.find((language) => language.id === "python")?.status, "coming-soon");
});
