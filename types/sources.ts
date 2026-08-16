import type { LanguageId } from "./languages";

export type SourceReference = {
  readonly id: string;
  readonly name: string;
  readonly organization: string;
  readonly url: string;
  readonly type: "documentation" | "standard" | "guide" | "repository" | "license";
  readonly languageId: LanguageId;
  readonly note?: string;
  readonly licensingNote?: string;
};
