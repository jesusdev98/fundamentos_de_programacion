# Fundamentos de la Programación

[![CI](https://github.com/jesusdev98/fundamentos_de_programacion/actions/workflows/ci.yml/badge.svg)](https://github.com/jesusdev98/fundamentos_de_programacion/actions/workflows/ci.yml)

A public, multi-language catalog for learning programming fundamentals through original Spanish-language material and official references.

## Live Demo

[Open the production learning platform](https://aprendeconjesusdev.vercel.app).

## About

The catalog provides complete JavaScript, TypeScript, and Python curricula with shared learning routes, quizzes, and browser practice.

| Language | Status | Published learning content |
| --- | --- | --- |
| JavaScript | Available | 3 levels, 70 lessons, 38 exercises, 150 questions |
| TypeScript | Available | 3 levels, 70 lessons, 38 exercises, 150 questions |
| Python | Available | 3 levels, 70 lessons, 38 exercises, 150 questions |

## Features

- Original lessons, examples, exercises, questions, and explanations.
- Isolated browser playgrounds for JavaScript, TypeScript, and Python 3.14.
- Lazy Pyodide 314.0.4 module Worker with hard timeout and recovery.
- Lazy TypeScript 5.9.3 Compiler API Worker with in-memory files, diagnostics, emit, timeout, and recovery.
- Output-based and authored-test exercise validation.
- Hints, solutions, scoring, explanations, and incorrect-answer review.
- Stable content IDs and official reference links.
- Responsive App Router interface with Node and Chromium quality gates.

## Current Curricula

| Level | Lessons | Exercises | Question bank | Per quiz |
| --- | ---: | ---: | ---: | ---: |
| JavaScript Easy | 24 | 12 | 50 | 10 |
| JavaScript Medium | 22 | 12 | 50 | 10 |
| JavaScript Difficult | 24 | 14 | 50 | 10 |
| TypeScript Easy | 24 | 12 | 50 | 10 |
| TypeScript Medium | 22 | 12 | 50 | 10 |
| TypeScript Difficult | 24 | 14 | 50 | 10 |
| Python Easy | 24 | 12 | 50 | 10 |
| Python Medium | 22 | 12 | 50 | 10 |
| Python Difficult | 24 | 14 | 50 | 10 |
| **Total** | **210** | **114** | **450** | **10 per level** |

## Tech Stack

- Next.js 16.3.1 and React 19.2.8.
- TypeScript Compiler API 5.9.3 and Tailwind CSS 4. TypeScript 7.0.2 is the current stable compiler, but 7.0 does not expose a stable programmatic API, so the browser runner remains pinned to 5.9.3.
- Node.js 22, pnpm 11.1.2, and `node:test`.
- Playwright 1.61.0 with Chromium.
- Pyodide 314.0.4 with embedded CPython 3.14.2, loaded from a pinned CDN URL only for Python practice.

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
| `pnpm test:coverage` | Enforce 100% coverage for quiz, sandbox, and pure Python/TypeScript runner protocol logic. |
| `pnpm test:e2e` | Run Playwright on desktop and focused mobile Chromium projects against an existing `pnpm build`. |
| `pnpm test:e2e:ui` | Open Playwright UI mode. |
| `pnpm test:e2e:headed` | Run Playwright with a visible browser. |
| `pnpm verify:http` | Smoke-test production routes and redirects after a build. |
| `pnpm verify` | Run the complete local quality sequence. |

## Quality

GitHub Actions runs core tests, scoped coverage, lint, a production build, Chromium E2E, and production HTTP smoke checks. On pushes to `main`, a successful quality job is followed by a Vercel Production deployment and focused checks against the stable domain. Pull requests never deploy.

Status: `main` push → quality → Vercel Production.

## Project Structure

```text
app/                 Next.js routes and shared layout
components/          Learning, playground, quiz, source, and layout UI
data/                Curriculum banks and official reference catalog
lib/                 Quiz logic and JavaScript/Python/TypeScript runner protocols
e2e/                 Playwright desktop and focused mobile flows
tests/               Node tests and structural sandbox checks
scripts/             Production HTTP smoke test
docs/                Public technical and content documentation
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Security](docs/SECURITY.md)
- [Content and Sources](docs/CONTENT_AND_SOURCES.md)
- [Contributing](CONTRIBUTING.md)

## Official References

JavaScript concepts are checked against MDN, ECMAScript/TC39, and focused Node.js references. TypeScript concepts are checked against the official Handbook, TSConfig reference, versioned 5.9.3 compiler repository, and focused official pages. Python concepts are checked against the Python 3.14 tutorial, language reference, standard library, and focused official pages; Pyodide behavior is checked against its official documentation. The global catalog is available at `/fuentes`; source and licensing boundaries are documented in [Content and Sources](docs/CONTENT_AND_SOURCES.md).

## Contributing

Bug reports, educational corrections, and focused improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change.

## License Status

No redistribution license has been defined. Public repository access does not by itself grant permission to copy, modify, or redistribute the project.
