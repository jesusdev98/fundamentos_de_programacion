export const languageIds = ["javascript", "typescript", "python"] as const;

export type LanguageId = (typeof languageIds)[number];
export type LanguageStatus = "available" | "coming-soon";

export type LanguageStats = {
  readonly levels: number;
  readonly lessons: number;
  readonly exercises: number;
  readonly questions: number;
};

export type Language = {
  readonly id: LanguageId;
  readonly slug: LanguageId;
  readonly name: string;
  readonly description: string;
  readonly status: LanguageStatus;
  readonly sourceIds: readonly string[];
  readonly accent: string;
  readonly stats?: LanguageStats;
  readonly futureAreas: readonly string[];
};
