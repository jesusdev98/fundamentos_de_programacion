import type { LanguageId } from "./languages";
import type { Exercise, Lesson } from "./learning";
import type { Question } from "./quiz";

export const levelSlugs = ["facil", "medio", "dificil"] as const;
export type LevelSlug = (typeof levelSlugs)[number];
export type RunnerId = "javascript" | "python" | "typescript";

export type CurriculumLevel = {
  readonly slug: LevelSlug;
  readonly name: string;
  readonly adjective: string;
  readonly description: string;
  readonly lessons: readonly Lesson[];
  readonly exercises: readonly Exercise[];
  readonly questions: readonly Question[];
};

export type Curriculum = {
  readonly languageId: LanguageId;
  readonly languageName: string;
  readonly runner: RunnerId;
  readonly sourceIds: readonly string[];
  readonly levels: Readonly<Record<LevelSlug, CurriculumLevel>>;
};

export function isLevelSlug(value: string): value is LevelSlug {
  return levelSlugs.includes(value as LevelSlug);
}
