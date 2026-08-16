# Fundamentos de la Programación

[![CI](https://github.com/jesusdev98/fundamentos_de_programacion/actions/workflows/ci.yml/badge.svg)](https://github.com/jesusdev98/fundamentos_de_programacion/actions/workflows/ci.yml)

A public educational project for learning programming fundamentals through original Spanish-language lessons, browser practice, and reviewable quizzes.

## About

The current path teaches JavaScript in two progressive levels. Learners move from concise theory to executable exercises and ten-question quiz attempts, with feedback and links back to relevant lessons.

## Features

- Original lessons, examples, exercises, questions, and explanations.
- Isolated browser playground for synchronous and asynchronous core JavaScript.
- Output-based and authored-test exercise validation.
- Hints, solutions, scoring, explanations, and incorrect-answer review.
- Stable content IDs and official reference links.
- Responsive App Router interface with Node and Chromium quality gates.

## Current Content

| Level | Lessons | Exercises | Question bank | Per quiz |
| --- | ---: | ---: | ---: | ---: |
| JavaScript Easy | 24 | 12 | 50 | 10 |
| JavaScript Medium | 22 | 12 | 50 | 10 |

## Tech Stack

- Next.js 16.3.1 and React 19.2.8.
- TypeScript and Tailwind CSS 4.
- Node.js 22, pnpm 11.1.2, and `node:test`.
- Playwright 1.61.0 with Chromium.

## Quick Start

```bash
git clone https://github.com/jesusdev98/fundamentos_de_programacion.git
cd fundamentos_de_programacion
corepack pnpm@11.1.2 install
corepack pnpm@11.1.2 dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server. |
| `pnpm build` / `pnpm start` | Build and serve the production application. |
| `pnpm lint` | Run ESLint. |
| `pnpm test` | Run the Node test suite. |
| `pnpm test:coverage` | Enforce 100% coverage for `lib/quiz.ts` and `lib/sandbox.ts` only. |
| `pnpm test:e2e` | Run Playwright on desktop and focused mobile Chromium projects. |
| `pnpm test:e2e:ui` | Open Playwright UI mode. |
| `pnpm test:e2e:headed` | Run Playwright with a visible browser. |
| `pnpm verify:http` | Smoke-test production routes and redirects after a build. |
| `pnpm verify` | Run the complete local quality sequence. |

## Quality

GitHub Actions runs core tests, scoped coverage, lint, a production build, Chromium E2E, and production HTTP smoke checks. E2E flow coverage and Node code coverage are separate signals; see the testing guide for the exact boundary.

## Project Structure

```text
app/                 Next.js routes and shared layout
components/          Learning, playground, quiz, source, and layout UI
data/                Curriculum banks and official reference catalog
lib/                 Quiz logic and sandbox protocol/document generator
e2e/                 Playwright desktop and focused mobile flows
tests/               Node tests and structural sandbox checks
scripts/             Production HTTP smoke test
docs/                Public technical and content documentation
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Testing](docs/TESTING.md)
- [Security](docs/SECURITY.md)
- [Content and Sources](docs/CONTENT_AND_SOURCES.md)
- [Contributing](CONTRIBUTING.md)

## Official References

Concepts are checked against [MDN Web Docs](https://developer.mozilla.org/), the [ECMAScript specification](https://tc39.es/ecma262/), and [Node.js documentation](https://nodejs.org/docs/latest/api/). The in-application catalog is available at `/fuentes`; source and attribution rules are documented in [Content and Sources](docs/CONTENT_AND_SOURCES.md).

## Contributing

Bug reports, educational corrections, and focused improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change.

## License Status

No redistribution license has been defined. Public repository access does not by itself grant permission to copy, modify, or redistribute the project.
