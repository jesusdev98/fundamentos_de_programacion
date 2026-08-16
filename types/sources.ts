export type SourceReference = {
  readonly id: string;
  readonly name: string;
  readonly organization: string;
  readonly url: string;
  readonly type: "documentation" | "standard" | "guide";
  readonly note?: string;
  readonly licensingNote?: string;
};
