# Contributing

Contributions should be focused, original, evidence-based, and easy to review. Keep implementation, tests, and relevant documentation together as one behavioral work unit.

## Setup

```bash
corepack pnpm@11.1.2 install
corepack pnpm@11.1.2 exec playwright install chromium
corepack pnpm@11.1.2 dev
```

Use a short-lived branch from current `main`. Keep each change scoped; do not mix curriculum rewrites, platform behavior, dependency upgrades, and formatting cleanup without a concrete reason.

## Curriculum Changes

- Write lessons, examples, exercises, questions, and explanations in original language.
- Keep Easy, Medium, and Difficult difficulty consistent with neighboring content.
- Give every lesson, exercise, question, answer, and source a unique stable ID.
- Do not rename published IDs merely for style; links, quiz review, and tests depend on them.
- Questions must have exactly four options and exactly one correct answer.
- Exercises need a focused prompt, starter code, useful hints, a solution, an explanation, and output or authored-test validation.
- Link concepts to verified MDN, TC39/ECMAScript, or Node.js sources when applicable.
- Add source metadata once in `data/sources.ts`; do not invent attribution or license claims.

See [Content and Sources](docs/CONTENT_AND_SOURCES.md) before authoring educational material.

## Code Changes

Preserve the separation between typed curriculum data, reusable components, quiz logic, and the sandbox protocol. Avoid exposing correct answers or test capabilities through production-only debugging hooks. Changes to the sandbox require focused Node tests plus Chromium coverage for the affected runtime behavior.

Prefer accessible labels and roles. Playwright tests should use web-first assertions, avoid sleeps, avoid external navigation, and remain independent of test order or shared state.

## Quality Gates

Run the gates relevant to the change, then run the complete sequence before requesting review:

```bash
corepack pnpm@11.1.2 test
corepack pnpm@11.1.2 test:coverage
corepack pnpm@11.1.2 lint
corepack pnpm@11.1.2 build
corepack pnpm@11.1.2 test:e2e
corepack pnpm@11.1.2 verify:http
```

`verify:http` requires a successful production build. Coverage thresholds apply only to `lib/quiz.ts` and `lib/sandbox.ts`; do not describe them as whole-project coverage. Add or update Playwright flows when user-visible behavior changes.

## Review Notes

Describe the user-visible or architectural outcome, the focused verification performed, and the exact rollback boundary. Call out content-source changes and sandbox assumptions explicitly.

## License Status

No contribution or redistribution license has been defined. Before submitting material, confirm that you have the right to provide it and understand that repository access alone does not establish terms for reuse. If formal contribution terms are introduced later, they must be documented explicitly rather than assumed.
